const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const keys = require('../../config/keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const verifyToken = require('../../middleware/verifyJWT');


router.get('/profileView',verifyToken,async (req,res)=>{
    const profile = await prisma.user.findUnique({
        where:{ id : Number(req.user.id) },
        select:{
            username:true,
            email:true,
            mobile:true,
            profile:true
        }
    });
    res.json(profile);
})

router.post('/profile',verifyToken,(req,res)=>{

    const {name,photo,address,city,state,pincode} = req.body ;

    if (!name||!photo||!address||!city||!state||!pincode) {
      return res.status(422).json({ error:"All Fields Required" });
    }
  
    const profile = {
        userId:req.user.id,
        name:req.body.name,
        photo:req.body.photo,
        address:req.body.address,
        city:req.body.city,
        state:req.body.state,
        pincode:req.body.pincode,
    };
    prisma.userProfile.create({
        data:profile
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});


router.put('/editprofile/:id',verifyToken,(req,res)=>{


    const {name,photo,address,city,state,pincode} = req.body ;

    if (!name||!photo||!address||!city||!state||!pincode) {
      return res.status(422).json({ error:"All Fields Required" });
    }

    const profile = {
        userId:req.user.id,
        name:req.body.name,
        photo:req.body.photo,
        address:req.body.address,
        city:req.body.city,
        state:req.body.state,
        pincode:req.body.pincode,
    };

    prisma.userProfile.update({where:{ id : Number(req.params.id) },data:profile})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
});


// Package and Destination
// No Token Required


router.get('/package',async (req,res)=>{
    const pkg = await prisma.package.findMany({
        
        select:{
            id:true,
            title:true,
            subtitle:true,
            videoURL:true,
            images:true,
            description:true,
            inclusion:true,
            exclusion:true,
            price:true,
            location:true,
            latitude:true, 
            longitude:true, 
            type:true,
            status:true,
            aduser:true, 
            packcat:true
        }
    });
    if(pkg!=0){
        res.status(200).json(pkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
  
});

router.get('/package/:id',async (req,res)=>{
    const spkg = await prisma.package.findUnique({
        where:{id:Number(req.params.id)},
        select:{
            id:true,
            title:true,
            subtitle:true,
            videoURL:true,
            images:true,
            description:true,
            inclusion:true,
            exclusion:true,
            price:true,
            location:true,
            latitude:true, 
            longitude:true, 
            type:true,
            status:true,
            aduser:true, 
            packcat:true
        }
    });
    if(spkg!=0){
        res.status(200).json(spkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
});

router.get('/destination',async (req,res)=>{
    const dest = await prisma.destination.findMany({
    
        select:{
            id:true,
            title:true,
            subtitle:true,
            videoURL:true,
            images:true,
            description:true,
            price:true,
            location:true,
            latitude:true, 
            longitude:true, 
            type:true,
            status:true,
            aduser:true, 
            destcat:true
        }
    });
    if(dest!=0){
        res.status(200).json(dest);
    }
    else{
        res.status(404).json({msg:"No Destination Packages Available"})
    }
  
});

router.get('/destination/:id',async (req,res)=>{
    const dest = await prisma.destination.findUnique({
        where:{id:Number(req.params.id)},
        select:{
            id:true,
            title:true,
            subtitle:true,
            videoURL:true,
            images:true,
            description:true,
            price:true,
            location:true,
            latitude:true, 
            longitude:true, 
            type:true,
            status:true,
            aduser:true, 
            destcat:true
        }
    });
    if(dest!=0){
        res.status(200).json(dest);
    }
    else{
        res.status(404).json({msg:"No Destination Packages Available"})
    }
});

module.exports = router;