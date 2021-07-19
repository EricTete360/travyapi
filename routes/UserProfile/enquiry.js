// userId adminId message smsgateway send 
// status t/f
// usertracking adminside detail tracking

// POST info to be sent to admin via sms
// GET Both admin and user
// PUT Only for Admin Update

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


router.get('/enquiryView',verifyToken,async (req,res)=>{
    const enqPackage = await prisma.enquiryPackage.findMany({
        where:{ userId  : Number(req.user.id) },
        select:{
            message:true,
        
            user:true,
            aduser:true,
            package:true
        }
    });
    res.json(enqPackage);
})

router.post('/addEnquiry',verifyToken,(req,res)=>{

    const {message} = req.body ;

    if (!message) {
      return res.status(422).json({ error:"All Field Required" });
    }
  
    const enqPackage = {
        userId:Number(req.user.id),
        adminuserId:Number(req.body.adminuserId),
        pkgId:Number(req.body.pkgId),
        message:req.body.message,
     
    };
    prisma.enquiryPackage.create({
        data:enqPackage
    }).then((msg)=>{
        console.log(msg.phonetour)
        res.status(200).json({msg,mes:"Data Entered Successfully"})
    })
    .catch((e)=>{ res.status(406).json(e); });

});

router.get('/enquiryDestinationView',verifyToken,async (req,res)=>{
    const enqDestinaion = await prisma.enquiryDestination.findUnique({
        where:{ userId : Number(req.user.id) },
        select:{
            message:true,
           
            user:true,
            aduser:true,
            destination:true
        }
    });
    res.json(enqDestinaion);
})

router.post('/addEnquiryDestination',verifyToken,(req,res)=>{

    const {message} = req.body ;

    if (!message) {
      return res.status(422).json({ error:"All Fields Required" });
    }
  
    const enqDestination = {
        userId:Number(req.user.id),
        adminuserId:Number(req.body.adminuserId),
        desId:Number(req.body.desId),
        message:req.body.message,
    
     
    };
    prisma.enquiryDestination.create({
        data:enqDestination
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});





module.exports = router;
