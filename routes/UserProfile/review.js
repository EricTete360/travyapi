// userid,5star,packageid 
// admin side tracking

const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const keys = require('../../config/keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const verifyToken = require('../../middleware/verifyJWT');


router.get('/reviewView',verifyToken,async (req,res)=>{
    const revPackage = await prisma.reviewPackage.findUnique({
        where:{ userId : Number(req.user.id) },
        select:{
            starpoint:true,
            user:true,
            package:true
        }
    });
    res.json(revPackage);
})

router.post('/addReview',verifyToken,(req,res)=>{

    const {starpoint} = req.body ;

    if (!starpoint) {
      return res.status(422).json({ error:"starpoint Field Required" });
    }
  
    const revPackage = {
        userId:Number(req.user.id),
        pkgId:Number(req.body.pkgId),
        starpoint:req.body.starpoint,
     
    };
    prisma.reviewPackage.create({
        data:revPackage
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});

router.get('/reviewDestinationView',verifyToken,async (req,res)=>{
    const revDestinaion = await prisma.reviewDestination.findUnique({
        where:{ userId : Number(req.user.id) },
        select:{
            starpoint:true,
            user:true,
            aduser:true,
            destination:true
        }
    });
    res.json(revDestinaion);
})

router.post('/addReviewDestination',verifyToken,(req,res)=>{

    const {starpoint} = req.body ;

    if (!starpoint) {
      return res.status(422).json({ error:"starpoint Field Required" });
    }
  
    const revDestinaion = {
        userId:Number(req.user.id),
        desId:Number(req.body.desId),
        starpoint:req.body.starpoint,
    };
    prisma.reviewDestination.create({
        data:revDestinaion
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});





module.exports = router;