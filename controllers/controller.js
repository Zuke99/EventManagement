//login Method
const User=require("../models/userModel");
const bcrypt=require("bcrypt");
const jwt= require("jsonwebtoken");
const secretKey='eventmgmtK';


const create_token = async(id)=>{
    try {
     const token = await jwt.sign({_id:id },secretKey);
     return token;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const user_login=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        const userData=await User.findOne({email:email});

        if (userData) {
            
           const matchPassword = await bcrypt.compare(password,userData.password);
           if (matchPassword) {
                const token= await create_token(userData._id);
                const userDetails={
                   _id:userData._id,
                   name:userData.name,
                   username:userData.username,
                   email:userData.email,
                   password:userData.password,
                   role:userData.role,
                   token:token
                }
                const response={
                    success:true,
                    msg:"User details",
                    data:userDetails
                }
                res.status(200).send(response)
           } 
           else {
                res.status(200).send({success:false,msg:"Login details are incorrect"});
           }
        } 
        else {
              res.status(200).send({success:false,msg:"Login details are incorrect"});
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports ={
    user_login
}