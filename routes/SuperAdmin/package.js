const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const validator = require('validator');
const keys = require('../../config/keys');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
    host: "smtp.googlemail.com",
    port:465,
    secure: true,
    auth: {
      user: keys.user,
      pass: keys.pass
    }
  });
const verifyAdminToken = require('../../middleware/verifyJWTsuperadmin');


router.get('/package',async (req,res)=>{
    const pkg = await prisma.package.findMany({where:{adminId:req.user.id}});
    if(pkg!=0){
        res.status(200).json(pkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
  
})

router.get('/package/:id',async (req,res)=>{
    const spkg = await prisma.package.findUnique({where:{id:Number(req.params.id)}});
    if(spkg!=0){
        res.status(200).json(spkg);
    }
    else{
        res.status(404).json({msg:"No Packages Available"})
    }
})

router.post('/addpackage',(req,res)=>{

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
    prisma.package.create({
        data:pkg
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});


router.put('/editpackage/:id',(req,res)=>{


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

    prisma.package.update({where:{ id : Number(req.params.id) },data:profile})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
});


router.post('/adddestination',(req,res)=>{

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
        data:pkg
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});


router.put('/editdestination/:id',(req,res)=>{


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
        adminId:req.body.adminId,
        status:req.body.status,
        categoryId:req.body.categoryId,
        type:req.body.type,
    };

    prisma.destination.update({where:{ id : Number(req.params.id) },data:profile})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
}); 

router.get('/destination',async (req,res)=>{
    const dest = await prisma.destination.findMany({where:{adminId:req.user.id}});
    if(dest!=0){
        res.status(200).json(dest);
    }
    else{
        res.status(404).json({msg:"No Destination Packages Available"})
    }
  
});

router.get('/destination/:id',async (req,res)=>{
    const dest = await prisma.destination.findUnique({where:{id:Number(req.params.id)}});
    if(dest!=0){
        res.status(200).json(dest);
    }
    else{
        res.status(404).json({msg:"No Destination Packages Available"})
    }
});

router.post('/addCategory',async (req,res)=>{
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

router.get('/category',async (req,res)=>{
    const cate = await prisma.category.findMany();
    if (cate!=0) {
        res.status(200).json(cate);
    }
    else{
        res.status(404).json({msg:"No Categories Available"});
    }
});

router.put('/updatecategory/:id',async (res,req)=>{
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

router.post("/addTourOperator",async (req,res)=>{
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
                    }).then((msg)=>{
                        transporter.sendMail({
                        to:data.email,
                        from:'noreply@knowbastar.com',
                        subject:'User Access Credentials',
                        html:`
                            <h1>Your Access Credentials</h1><br/>
                            <h2>Email : ${usemail}</h2><br/>
                            <h2>Password : ${usepass} </h2><br/>
                        `
                    });
                        res.status(200).json({msg,mes:"Data Entered Successfully"})})
                       .catch((e)=>{ res.status(406).json(e); });
            }
        })
});

router.get("/TourOperatorList",async (req,res)=>{
    const cate = await prisma.adminUser.findMany();
    if (cate!=0) {
        res.status(200).json(cate);
    }
    else{
        res.status(404).json({msg:"No Tour Operator Available"});
    }
});

router.get("/TourOperatorList/:id",async (req,res)=>{
    const dest = await prisma.destination.findUnique({where:{id:Number(req.params.id)}});
    if(dest!=0){
        res.status(200).json(dest);
    }
    else{
        res.status(404).json({msg:"No Tour Operator Available"})
    }
});

// router.get("/")
module.exports = router;