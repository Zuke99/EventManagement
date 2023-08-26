const jwt=require("jsonwebtoken");
const secretkey='eventmgmtK';

const verifyToken = async(req,res,next)=>{
   
    let token = req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        res.send({status:false,message:"A token is required for authentication"});
    } else {
    try {
       const decode= jwt.verify(token,secretkey);
       req.user=decode;
       return next();
    } catch (error) {
        res.send({status : false , message : "Invalid token"});
    }
}
   
}

const adminCheck = async(req,res,next) => {
    const token= req.body.token || req.query.token || req.headers["authorization"];
    const decode= jwt.verify(token,secretkey);
       const {role} = decode;
       if(role){
       return next();
       } else {
        res.send({status : false , message : "Admin Role Required"});
       }
       
}
module.exports = {verifyToken, adminCheck};