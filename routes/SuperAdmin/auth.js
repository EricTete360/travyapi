const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const keys = require('../../config/keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const verifySuperToken = require('../../middleware/verifyJWTsuperadmin');

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
    prisma.superAdminUser.findUnique({ where: { email: req.body.email } })
          .then((val)=>{
              if(val){
                  res.status(400).json({msg:"Email Or Mobile Number Already Exists"})
              }
              else{
                    prisma.superAdminUser.create({
                        data:userdata
                    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                       .catch((e)=>{ res.status(406).json(e); });
              }
          })
});


router.post('/login',(req,res)=>{
    prisma.superAdminUser.findUnique({ where: { email: req.body.email } })
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
                   jwt.sign(payload,keys.superadminsecret,(err,token)=>{
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

router.get('/getInfo',verifySuperToken,(req,res)=>{
    res.json({
        id:req.user.id,
        username:req.user.username,
        mobile:req.user.mobile,
        email:req.user.email,
    }); 
})

module.exports = router;