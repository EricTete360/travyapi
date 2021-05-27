const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const keys = require('../../config/keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("813545121860-3p28j8rhkbj7jit3vi0rc5pvi8uqa1t5.apps.googleusercontent.com");

const verifyToken = require('../../middleware/verifyJWT');

router.post('/register',(req,res)=>{
    const {email,username,mobile,password} = req.body ;

    if (!email||!username||!mobile||!password) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    validator.isEmail(email);
    const userdata = {
        username:req.body.username,
        email:req.body.email,
        mobile:req.body.mobile,
        password:bcrypt.hashSync(req.body.password,10)
    };
    prisma.user.findUnique({ where: { email: req.body.email } })
          .then((val)=>{
              if(val){
                  res.status(400).json({msg:"Email Or Mobile Number Already Exists"})
              }
              else{
                    prisma.user.create({
                        data:userdata
                    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                       .catch((e)=>{ res.status(406).json(e); });
              }
          })
});


router.post('/login',(req,res)=>{
    prisma.user.findUnique({ where: { email: req.body.email } })
    .then((user)=>{
        if(!user){
            return res.status(404).json({message:"User not found"});

        }
        else{
            bcrypt.compare(req.body.password,user.password).then((isValid)=>{
               if(isValid){
                   const payload = {
                       id: user.id,
                       username: user.username,
                       email: user.email,
                       mobile: user.mobile,
                   };
                   jwt.sign(payload,keys.usecret,(err,token)=>{
                       res.json({
                            success:true,
                            token : 'Bearer ' + token
                       });
                   })

               } else{
                   return res.status(400).send({ message:"Password Do not Match" })
               }
            })
        }
    })
});


router.post('/googlelogin',(req,res)=>{
    const {tokenId} = req.body;
    client.verifyIdToken({idToken:tokenId,audience:"813545121860-3p28j8rhkbj7jit3vi0rc5pvi8uqa1t5.apps.googleusercontent.com"})
          .then(response=>{
              const {email_verified,name,email} = response.payload;
              console.log(response.payload) 
              if(email_verified){
                prisma.user.findUnique({ where:{ email:email } }).then((err,user)=>{
                    if(err){
                        return res.status(400).json({ 
                            error:"Something went wrong"
                         })
                    }
                    else{
                        if(user){
                            const payload={
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                mobile: user.mobile,
                            };
                            const token = jwt.sign(payload,keys.usecret);
                            res.json({
                                success:true,
                                username:user.username,
                                token:'Bearer '+ token
                            })
                        }
                        else{
                            let password = bcrypt.hashSync(email+keys.usecret,10);
                            prisma.user.create({
                                data:{
                                    email:email,
                                    password:password
                                }
                            }).then((obj)=>{
                                if(obj){
                                const payload={
                                    id: data.id,
                                    username: data.username,
                                    email: data.email,
                                    mobile: data.mobile,
                                };
                                const token = jwt.sign(payload,keys.usecret);
                                res.json({
                                    success:true,
                                    username:data.username,
                                    token:'Bearer '+ token
                                })
                                }
                            });


                        }
                    }
                })

              }
          })
});

router.get('/getInfo',verifyToken,(req,res)=>{
    res.json({
        id:req.user.id,
        username:req.user.username,
        mobile:req.user.mobile,
        email:req.user.email,
    }); 
})

module.exports = router;