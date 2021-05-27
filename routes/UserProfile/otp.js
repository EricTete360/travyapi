const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const keys = require('../../config/keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('189400A4pwNR6b9IHJ609b9b4cP1');
const verifyToken = require('../../middleware/verifyJWT');



router.post('/otp/login',(req,res)=>{

    const mobile = req.body.mobile;
    if(!mobile){
        return res.status(402).json({
            err:"Mobile Number Required"
        });
    }
    var digits = '0123456789';
    let otp = '';
    for (let i=0; i<4;i++) {
        otp+= digits[Math.floor(Math.random()*10)];
    }
    console.log(otp);
    prisma.user.findUnique({where:{ mobile:mobile }})
                .then((obj)=>{
                    if(!obj){
                        return res.status(404).send({msg:"Mobile Number not registered"});        

                    }
                    else{
                        const otpdata = {
                            userId:obj.id,
                            otp:otp
                        }
                        prisma.otpProfile.create({
                            data:otpdata
                        }).then((obj)=>{
                            if(obj){
                                sendOtp.send(mobile,"BASTAR",otp,function (error,data){
                                    console.log(data);
                                });
                                res.status(200).json({obj,code:otp});
                            }
                            else{
                                res.status(404).json({msg:"Invalid Details"})
                            }
                        })
                        
                    }
                }).catch((er)=>{console.log(er)})
});

// Package and Destination
// No Token Required

router.post('/otp/verify/:mobile',async (req,res)=>{
   const otp = req.body.otp;
   if(!otp){
       res.status(400).json({msg:"Otp Required"})
   }
   prisma.otpProfile.findUnique({where:{otp:otp}}).then(motp=>{
       if(!motp){
           return res.status(404).send({msg:"OTP Invalid"});
       }
       else{
           if(motp.otp==otp){
               prisma.user.findUnique({where:{mobile:req.params.mobile}})
                          .then((user)=>{
                            const payload = { id: user.id, username: user.username,email:user.email,mobile:user.mobile }; // Create JWT Payload
  
                            // Sign Token
                            jwt.sign(
                                payload,
                                keys.usecret,
                            
                                (err, token) => {
                                 
                                res.json({
                                    success: true,
                                    message: 'OTP Correct',
                                    username: user.username,
                                    mobile: user.mobile,
                                    token: 'Bearer ' + token
                                });
                                }
                            );
                          });
                          console.log(motp.otp)
                          prisma.otpProfile.deleteMany({where:{
                              otp:motp.otp
                          }})
           }
       }
   })
});




module.exports = router;