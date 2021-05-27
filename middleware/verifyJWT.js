const jwt = require('jsonwebtoken')
const keys = require('../config/keys');



module.exports = (req,res,next)=>{
    var headerToken = req.headers;
    console.log(headerToken)
    try{
      var token = req.headers['access-control-request-headers'].split(" ")[1];
      var decode = jwt.verify(token,keys.usecret);
      req.user = decode;
      next();
    }
    catch(error){
      res.status(400).json({
        error:"Invalid Token"
      });
    }

}

