const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const keys = require('../../config/keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const verifyToken = require('../../middleware/verifyJWT');

// Package and Destination
// No Token Required

router.get('/search-package',async (req,res)=>{
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
            pc:true
        }
    });
    if(pkg!=0){
        res.status(200).json(pkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
  
});

router.get('/search-package/:id',async (req,res)=>{
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
            pc:true
        }
    });
    if(spkg!=0){
        res.status(200).json(spkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
});

router.get('/search-destination',async (req,res)=>{
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
            des:true
        }
    });
    if(dest!=0){
        res.status(200).json(dest);
    }
    else{
        res.status(404).json({msg:"No Destination Packages Available"})
    }
  
});

router.get('/search-destination/:id',async (req,res)=>{
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
            des:true
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