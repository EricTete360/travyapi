const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const keys = require('../../config/keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const verifyAdminToken = require('../../middleware/verifyJWTadmin');

// Package
router.get('/package',verifyAdminToken,async (req,res)=>{
    const pkg = await prisma.package.findMany({
        where:{adminuserId:req.user.id},
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

router.get('/package/:id',verifyAdminToken,async (req,res)=>{
    const spkg = await prisma.package.findUnique({
        where:{id:Number(req.params.id)},
        select:{pc:true}
    });
    if(spkg!=0){
        res.status(200).json(spkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
});

router.post('/addpackage',verifyAdminToken,(req,res)=>{

    const {title,subtitle,description,images,videoURL,inclusion,exclusion,price,location,longitude,latitude,type,status} = req.body ;

    if (!title||!subtitle||!description||!price||!location||!inclusion||!exclusion||!status||!longitude||!latitude||!type) {
      return res.status(422).json({ error:"All Fields Required" });
    }
  
    const pkg = {
        title:req.body.title,
        subtitle:req.body.subtitle,
        description:req.body.description,
        images:req.body.images,
        videoURL:req.body.videoURL,
        price:req.body.price,
        location:req.body.location,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        inclusion:req.body.inclusion,
        exclusion:req.body.exclusion,
        adminuserId:Number(req.user.id),
        status:req.body.status,
        type:req.body.type,
    };
    prisma.package.create({
        data:pkg
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});

router.put('/editpackage/:id',verifyAdminToken,(req,res)=>{


     const {title,subtitle,description,images,videoURL,inclusion,exclusion,price,location,longitude,latitude,type,status} = req.body ;

    if (!title||!subtitle||!description||!price||!location||!inclusion||!exclusion||!status||!longitude||!latitude||!type) {
      return res.status(422).json({ error:"All Fields Required" });
    }
  
    const pkg = {
        title:req.body.title,
        subtitle:req.body.subtitle,
        description:req.body.description,
        images:req.body.images,
        videoURL:req.body.videoURL,
        price:req.body.price,
        location:req.body.location,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        inclusion:req.body.inclusion,
        exclusion:req.body.exclusion,
        adminuserId:Number(req.user.id),
        status:req.body.status,
        type:req.body.type,
    };

    prisma.package.update({where:{ id : Number(req.params.id) },data:pkg})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
});

router.delete('/deletepackage/:id',verifyAdminToken, async (req,res)=>{

    const pack= await prisma.package.delete({
        where:{
            id:Number(req.params.id)
        }
    });

    res.status(200).json({post,msg:"Pacakge Deleted"})
    
});

// Destination

router.post('/adddestination',verifyAdminToken,(req,res)=>{

    const {title,subtitle,description,images,videoURL,price,location,longitude,latitude,type,status} = req.body ;

    if (!title||!subtitle||!description||!price||!location||!status||!longitude||!latitude||!type) {
      return res.status(422).json({ error:"All Fields Required" });
    }
  
    const dest = {
        title:req.body.title,
        subtitle:req.body.subtitle,
        description:req.body.description,
        images:req.body.images,
        videoURL:req.body.videoURL,
        price:req.body.price,
        location:req.body.location,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        adminuserId:Number(req.user.id),
        status:req.body.status,
        type:req.body.type,
    };
    prisma.destination.create({
        data:dest
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});

router.put('/editdestination/:id',verifyAdminToken,(req,res)=>{


     const {title,subtitle,description,images,videoURL,price,location,longitude,latitude,type,status} = req.body ;

    if (!title||!subtitle||!description||!price||!location||!status||!longitude||!latitude||!type) {
      return res.status(422).json({ error:"All Fields Required" });
    }
  
    const pkg = {
        title:req.body.title,
        subtitle:req.body.subtitle,
        description:req.body.description,
        images:req.body.images,
        videoURL:req.body.videoURL,
        price:req.body.price,
        location:req.body.location,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        adminuserId:Number(req.user.id),
        status:req.body.status,
        type:req.body.type,
    };

    prisma.destination.update({where:{ id : Number(req.params.id) },data:pkg})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
}); 

router.get('/destination',verifyAdminToken,async (req,res)=>{
    const dest = await prisma.destination.findMany({
        where:{adminuserId:req.user.id},
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

router.get('/destination/:id',verifyAdminToken,async (req,res)=>{
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
router.delete('/deletedestination/:id',verifyAdminToken, async (req,res)=>{

    const pack= await prisma.destination.delete({
        where:{
            id:Number(req.params.id)
        }
    });

    res.status(200).json({post,msg:"Pacakge Deleted"})
    
});

// Package Category
router.get('/packageCategoryList',verifyAdminToken,async (req,res)=>{
    const pkg = await prisma.package.findMany({
        where:{adminuserId:req.user.id},
        select:{
            id:true,
            title:true,                     
            description:true,             
            status :true,
            aduser:true, 
        }
    });
    if(pkg!=0){
        res.status(200).json(pkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
  
});

router.post('/addPackageCategory',verifyAdminToken,async (req,res)=>{
    const {title,description,status} = req.body ;

    if (!title||!description||!status) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    const cat = {
        title:req.body.title,
        description:req.body.description,
        status:Boolean(req.body.status),
        adminuserId:req.user.id,
        pkId:Number(req.body.pkId)
    };
    prisma.packageCategory.create({
        data:cat
    }).then((obj)=>{
        res.status(200).json({obj,mes:"Data Entered Successfully"})
    }).catch((err)=>{ res.status(406).json(err); })
}); 

router.put('/editPackageCategory/:id',verifyAdminToken,async (req,res)=>{
    const {title,description,status} = req.body ;

    if (!title||!description||!status) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    const cat = {
        title:req.body.title,
        description:req.body.description,
        status:Boolean(req.body.status),
        adminuserId:Number(req.user.id),
        pkId:Number(req.body.pkId)
    };
    prisma.packageCategory.update({where:{
        id:Number(req.params.id)
    },data:cat
    }).then((obj)=>{
        res.status(200).json({obj,mes:"Data Entered Successfully"})
    }).catch((err)=>{ res.status(406).json(err); })
}); 


router.delete('/deletePackageCategory/:id',verifyAdminToken, async (req,res)=>{

    const pack= await prisma.packageCategory.delete({
        where:{
            id:Number(req.params.id)
        }
    });

    res.status(200).json({post,msg:"Pacakge Deleted"})
    
});


// Destination Category
router.get('/categorylistdestination',verifyAdminToken,async (req,res)=>{
    const pkg = await prisma.destinationCategory.findMany({
        where:{adminuserId:req.user.id},
        select:{
            id:true,
            title:true,                     
            description:true,             
            status :true,
            aduser:true, 
          
        }
    });
    if(pkg!=0){
        res.status(200).json(pkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
  
});
router.post('/addDestinationCategory',verifyAdminToken,async (req,res)=>{
    const {title,description,status} = req.body ;

    if (!title||!description||!status) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    const cat = {
        title:req.body.title,
        description:req.body.description,
        status:Boolean(req.body.status),
        adminuserId:req.user.id,
        desId:Number(req.body.desId)
    };
    prisma.destinationCategory.create({
        data:cat
    }).then((obj)=>{
        res.status(200).json({obj,mes:"Data Entered Successfully"})
    }).catch((err)=>{ res.status(406).json(err); })
}); 

router.put('/editDestinationCategory/:id',verifyAdminToken,async (req,res)=>{
    const {title,description,status} = req.body ;

    if (!title||!description||!status) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    const cat = {
        title:req.body.title,
        description:req.body.description,
        status:Boolean(req.body.status),
        adminuserId:Number(req.user.id),
        desId:Number(req.body.desId)
    };
    prisma.destinationCategory.update({
        where:{ id : Number(req.params.id) },
        data:cat
    }).then((obj)=>{
        res.status(200).json({obj,mes:"Data Entered Successfully"})
    }).catch((err)=>{ res.status(406).json(err); })
}); 

router.delete('/deleteDestinationCategory/:id',verifyAdminToken, async (req,res)=>{

    const pack= await prisma.destinationCategory.delete({
        where:{
            id:Number(req.params.id)
        }
    });

    res.status(200).json({post,msg:"Pacakge Deleted"})
    
});

// admin Profile

router.get('/adprofileView',verifyAdminToken,async (req,res)=>{
    const profile = await prisma.adminUserProfile.findUnique({
        where:{ id : Number(req.user.id) },
        select:{
            username:true,
            email:true,
            mobile:true,
            profile:true
        }
    });
    res.json(profile);
});

router.post('/adprofile',verifyAdminToken,(req,res)=>{

    const {chname,photo,address,city,state,pincode} = req.body ;

    if (!chname||!photo||!address||!city||!state||!pincode) {
      return res.status(422).json({ error:"All Fields Required" });
    }
  
    const profile = {
        adminuserId:req.user.id,
        chname:req.body.chname,
        photo:req.body.photo,
        address:req.body.address,
        city:req.body.city,
        state:req.body.state,
        pincode:req.body.pincode,
    };
    prisma.adminUserProfile.create({
        data:profile
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});

router.put('/editadprofile/:id',verifyAdminToken,(req,res)=>{


    const {chname,photo,address,city,state,pincode} = req.body ;

    if (!chname||!photo||!address||!city||!state||!pincode) {
      return res.status(422).json({ error:"All Fields Required" });
    }

    const profile = {
        adminuserId:req.user.id,
        chname:req.body.chname,
        photo:req.body.photo,
        address:req.body.address,
        city:req.body.city,
        state:req.body.state,
        pincode:req.body.pincode,
    };

    prisma.adminUserProfile.update({where:{ id : Number(req.params.id) },data:profile})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
});

// router.get("/")
module.exports = router;