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

// Package
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
        adminuserId:Number(req.body.adminuserId),
        status:req.body.status,
        type:req.body.type,
        packId:Number(req.body.packId)
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
        adminuserId:Number(req.body.adminuserId),
        status:req.body.status,
        type:req.body.type,
        packId:Number(req.body.packId)
    };

    prisma.package.update({where:{ id : Number(req.params.id) },data:pkg})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
});

router.delete('/deletepackage/:id', async (req,res)=>{

    const pack= await prisma.package.delete({
        where:{
            id:Number(req.params.id)
        }
    });

    res.status(200).json({pack,msg:"Pacakge Deleted"})
    
});

router.get('/listPackageCategory',async (req,res)=>{

    prisma.packageCategory.findMany().then((obj)=>{
        res.status(200).json({obj})
    }).catch((err)=>{ res.status(406).json(err); })

}); 


router.post('/addPackageCategory',async (req,res)=>{
    const {title,description,status} = req.body ;

    if (!title||!description||!status) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    const cat = {
        title:req.body.title,
        description:req.body.description,
        status:Boolean(req.body.status),
        adminuserId:Number(req.body.adminuserId),
        // pkId:Number(req.body.pkId)
    };
    prisma.packageCategory.create({
        data:cat
    }).then((obj)=>{
        res.status(200).json({obj,mes:"Data Entered Successfully"})
    }).catch((err)=>{ res.status(406).json(err); })
}); 

router.put('/editPackageCategory/:id',async (req,res)=>{
    const {title,description,status} = req.body ;

    if (!title||!description||!status) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    const cat = {
        title:req.body.title,
        description:req.body.description,
        status:Boolean(req.body.status),
        adminuserId:Number(req.body.adminuserId),
        // pkId:Number(req.body.pkId)
    };
    prisma.packageCategory.update({where:{
        id:Number(req.params.id)
    },data:cat
    }).then((obj)=>{
        res.status(200).json({obj,mes:"Data Entered Successfully"})
    }).catch((err)=>{ res.status(406).json(err); })
}); 


router.delete('/deletePackageCategory/:id', async (req,res)=>{

    const pack= await prisma.packageCategory.delete({
        where:{
            id:Number(req.params.id)
        }
    });

    res.status(200).json({pack,msg:"Pacakge Deleted"})
    
});

// Destination
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
        adminuserId:Number(req.body.adminuserId),
        status:req.body.status,
        type:req.body.type,
        destId:Number(req.body.destId)
    };
    prisma.destination.create({
        data:dest
    }).then((msg)=>{res.status(200).json({msg,mes:"Data Entered Successfully"})})
    .catch((e)=>{ res.status(406).json(e); });

});

router.put('/editdestination/:id',(req,res)=>{


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
        adminuserId:Number(req.body.adminuserId),
        status:req.body.status,
        type:req.body.type,
        destId:Number(req.body.destId)
    };

    prisma.destination.update({where:{ id : Number(req.params.id) },data:pkg})
                      .then((msg)=>{res.status(200).json({msg,mes:"Data Updated Successfully"})})
                      .catch((e)=>{ res.status(406).json(e); });
}); 

router.delete('/deletedestination/:id', async (req,res)=>{

    const pack= await prisma.destination.delete({
        where:{
            id:Number(req.params.id)
        }
    });

    res.status(200).json({pack,msg:"Pacakge Deleted"})
    
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
            destId:true
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
    const dest = await prisma.destination.findUnique({where:{id:Number(req.params.id)}});
    if(dest!=0){
        res.status(200).json(dest);
    }
    else{
        res.status(404).json({msg:"No Destination Packages Available"})
    }
});

router.get('/listDestinationCategory',async (req,res)=>{

    prisma.destinationCategory.findMany().then((obj)=>{
        res.status(200).json({obj})
    }).catch((err)=>{ res.status(406).json(err); })

}); 

router.post('/addDestinationCategory',async (req,res)=>{
    const {title,description,status} = req.body ;

    if (!title||!description||!status) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    const cat = {
        title:req.body.title,
        description:req.body.description,
        status:Boolean(req.body.status),
        adminuserId:Number(req.body.adminuserId),
        // desId:Number(req.body.desId)
    };
    prisma.destinationCategory.create({
        data:cat
    }).then((obj)=>{
        res.status(200).json({obj,mes:"Data Entered Successfully"})
    }).catch((err)=>{ res.status(406).json(err); })
}); 
router.put('/editDestinationCategory/:id',async (req,res)=>{
    const {title,description,status} = req.body ;

    if (!title||!description||!status) {
      return res.status(422).json({ error:"All Fields Required" });
    }
    const cat = {
        title:req.body.title,
        description:req.body.description,
        status:Boolean(req.body.status),
        adminuserId:Number(req.body.adminuserId),
        desId:Number(req.body.desId)
    };
    prisma.destinationCategory.update({
        where:{ id : Number(req.params.id) },
        data:cat
    }).then((obj)=>{
        res.status(200).json({obj,mes:"Data Entered Successfully"})
    }).catch((err)=>{ res.status(406).json(err); })
}); 

router.delete('/deleteDestinationCategory/:id', async (req,res)=>{

    const pack= await prisma.destinationCategory.delete({
        where:{
            id:Number(req.params.id)
        }
    });

    res.status(200).json({pack,msg:"Pacakge Deleted"})
    
});
// Tour Operator
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
                        console.log(msg)
                        transporter.sendMail({
                        to:msg.email,
                        from:'noreply@knowbastar.com',
                        subject:'User Access Credentials',
                        html:`
                            <h1>Your Access Credentials</h1><br/>
                            <h2>Email : ${email}</h2><br/>
                            <h2>Password : ${password} </h2><br/>
                        `
                    });
                        res.status(200).json({msg,mes:"Data Entered Successfully"})})
                    //    .catch((e)=>{ res.status(406).json(e); });
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
    const dest = await prisma.adminUser.findUnique({where:{id:Number(req.params.id)},select:{
        name:true,
        email:true,
        mobile:true, 
        admuser:true}});
    if(dest!=0){
        res.status(200).json(dest);
    }
    else{
        res.status(404).json({msg:"No Tour Operator Available"})
    }
});

module.exports = router;