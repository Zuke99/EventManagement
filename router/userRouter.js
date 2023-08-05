const express = require("express");
const router = new express.Router();
const jwt= require("jsonwebtoken");
const secretKey='eventmgmtK';
const bcrypt=require('bcrypt');

const Users = require("../models/userModel");

router.post("/user/register", async (req, res) => {
  try {
    //Check For Existing username
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const existUsername = async () => {
      const result = await Users.findOne({ username });
      if (result) {
        return result;
      }
    };

    const existEmail = async () => {
      try {
        const result = await Users.findOne({ email });
        if (result) {
          return result;
        }
      } catch (err) {
        throw new Error(err);
      }
    };
    try {
      const [existingEmail, existingUsername] = await Promise.all([
        existEmail(),
        existUsername(),
      ]);
      if (existingEmail) {
        res.send({ message: "Email Exists" });
      } else if (existingUsername) {
        res.send({ message: "Username Exists" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const addUser = new Users({
          name: req.body.name,
          username: username,
          password: hashedPassword,
          email: email,
          role: req.body.role,
        });
        const createUser = await addUser.save();
        console.log(`User Registration Successful, User Id: ${createUser._id}`);
        res.status(201).send(createUser);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error occurred during registration" });
    }
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});


//Login API
router.post("/user/login",async(req,res) =>{
try{
   
    const username=req.body.username;
    const password=req.body.password;
    const existUsername= async() => {
       
        try{
        const result=Users.findOne({username});
        return result;
        } catch(e){
            throw new Error(e);
        }
    }
    try{
        const existingUser=await Promise.all([
            existUsername()
        ]);
        if(existingUser){
            bcrypt.compare(password,existingUser[0].password).then(passwordCheck =>{
                if(!passwordCheck) return res.status(400).send({error:"Username or Passwords do not match"});
                //JWT 
                const payload ={
                    _id:existingUser[0]._id,
                    role:existingUser[0].role,
                    name:existingUser[0].name,
                }
                const options={
                    expiresIn:"5h",
                };
                const token=jwt.sign(payload, secretKey, options);
                res.json({token : token});
            })
            .catch(error=>{
                return res.status(400).send({error:"Username or Passwords do not match"});
            })
        } else {
            res.send({status: false, message:"Username not found"});
        }
    } catch(e){
        res.status(400).send(e);
    }


} catch(e){
    res.status(400).send(e);
}
})


module.exports = router;
