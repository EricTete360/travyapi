const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const keys = require('../../config/keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const verifyAdminToken = require('../../middleware/verifyJWTadmin');


router.get('/package',verifyAdminToken,async (req,res)=>{
    const pkg = await prisma.package.findMany({where:{adminId:req.user.id}});
    if(pkg!=0){
        res.status(200).json(pkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
  
})

router.get('/package/:id',verifyAdminToken,async (req,res)=>{
    const spkg = await prisma.package.findUnique({where:{id:Number(req.params.id)}});
    if(spkg!=0){
        res.status(200).json(spkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
})


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
        adminId:req.user.id,
        status:req.body.status,
        categoryId:req.body.categoryId,
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
        adminId:req.body.adminId,
        status:req.body.status,
        categoryId:req.body.categoryId,
        type:req.body.type,
    };

    prisma.package.update({where:{ id : Number(req.params.id) },data:pkg})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
});


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
        adminId:req.body.adminId,
        status:req.body.status,
        categoryId:req.body.categoryId,
        type:req.body.type,
    };
    prisma.destination.create({
        data:dest
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});


router.put('/editdestination/:id',verifyAdminToken,(req,res)=>{


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
        adminId:req.user.id,
        status:req.body.status,
        categoryId:req.body.categoryId,
        type:req.body.type,
    };

    prisma.destination.update({where:{ id : Number(req.params.id) },data:pkg})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
}); 

router.get('/destination',verifyAdminToken,async (req,res)=>{
    const dest = await prisma.destination.findMany({where:{adminId:req.user.id}});
    if(dest!=0){
        res.status(200).json(dest);
    }
    else{
        res.status(404).json({msg:"No Destination Packages Available"})
    }
  
})

router.get('/destination/:id',verifyAdminToken,async (req,res)=>{
    const dest = await prisma.destination.findUnique({where:{id:Number(req.params.id)}});
    if(dest!=0){
        res.status(200).json(dest);
    }
    else{
        res.status(404).json({msg:"No Destination Packages Available"})
    }
})

router.post('/addCategory',verifyAdminToken,async (req,res)=>{
    const {title,description,status} = req.body ;

    if (!title||!description||!status) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    const cat = {
        title:req.body.title,
        
        description:req.body.description,
      
        status:req.body.status,
    };
    prisma.category.create({
        data:cat
    }).then((obj)=>{
        res.status(200).json({obj,mes:"Data Entered Successfully"})
    }).catch((err)=>{ res.status(406).json(err); })
}); 

router.get('/category',verifyAdminToken,async (req,res)=>{
    const cate = await prisma.category.findMany();
    if (cate!=0) {
        res.status(200).json(cate);
    }
    else{
        res.status(404).json({msg:"No Categories Available"});
    }
});

router.put('/updatecategory/:id',verifyAdminToken,async (res,req)=>{
    const {title,description,status} = req.body ;

    if (!title||!description||!status) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    const ucat = {
        title:req.body.title,
        
        description:req.body.description,
      
        status:req.body.status,
    };

    prisma.category.update({where:{ id : Number(req.params.id) },data:ucat})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
});


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
})

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