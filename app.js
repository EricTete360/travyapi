const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan'); 
const serveStatic = require('serve-static');
const path = require('path');

const app = express();
const port = process.env.PORT || 8180;

app.use(cors());

// Routes Directory
const userEnquiry = require("./routes/UserProfile/enquiry");
const userReview = require("./routes/UserProfile/review");
const userAuth = require("./routes/UserProfile/users");
const userProfileAuth = require("./routes/UserProfile/profile");
const userOtpAuth = require("./routes/UserProfile/otp");
const userSearch = require("./routes/UserProfile/search");
const superAdminUserauth = require("./routes/SuperAdmin/auth");
const superAdminPackage = require("./routes/SuperAdmin/package");
const adminUserauth = require("./routes/Admin/auth");
const adminPackage = require("./routes/Admin/package");




// Body Parser
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
// app.use(cors());



// Using Routes
app.use("/api/user",userAuth);
app.use("/api/user/review",userReview);
app.use("/api/user/enquiry",userEnquiry);
app.use("/api/user/inside",userProfileAuth);
app.use("/api/user/mobile",userOtpAuth);
app.use("/api/user/navigation",userSearch);
app.use("/api/admin",adminUserauth);
app.use("/api/admin/package",adminPackage);
app.use("/api/superAdmin",superAdminUserauth);
app.use("/api/superAdmin/package",superAdminPackage);


app.use('/',express.static(path.join(__dirname,'./build')))
// app.use(express.static(path.join(__dirname,'./build-flutter')))

app.get(/.*/,function(req,res){
    res.sendFile(path.join(__dirname,'./build/index.html'))
})

// app.get('/admin/.*',function(req,res){
//     res.sendFile(path.join(__dirname,'./build-flutter/index.html'))
// })


app.listen(port,()=>{
    console.log(`Listening to ${port}`);
});