const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const keys = require('../../config/keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const verifyAdminToken = require('../../middleware/verifyJWTadmin');

router.post('/register',(req,res)=>{
    const {email,name,mobile,password} = req.body ;

    if (!email||!name||!mobile||!password) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    validator.isEmail(email);
    const userdata = {
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:bcrypt.hashSync(req.body.password,10)
    };
    prisma.adminUser.findUnique({ where: { email: req.body.email } })
          .then((val)=>{
              if(val){
                  res.status(400).json({msg:"Email Or Mobile Number Already Exists"})
              }
              else{
                    prisma.adminUser.create({
                        data:userdata
                    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                       .catch((e)=>{ res.status(406).json(e); });
              }
          })
});

router.post('/login',(req,res)=>{
    prisma.adminUser.findUnique({ where: { email: req.body.email } })
    .then((user)=>{
        if(!user){
            return res.status(404).json({message:"User not found"});

        }
        else{
            bcrypt.compare(req.body.password,user.password).then((isValid)=>{
               if(isValid){
                   const payload = {
                       id: user.id,
                       name: user.name,
                       email: user.email,
                       mobile: user.mobile,
                   };
                   jwt.sign(payload,keys.adminsecret,(err,token)=>{
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

router.get('/getInfo',verifyAdminToken,(req,res)=>{
    res.json({
        id:req.user.id,
        username:req.user.username,
        mobile:req.user.mobile,
        email:req.user.email,
    }); 
});

module.exports = router;