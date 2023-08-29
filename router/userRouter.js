const express = require("express");
const router = new express.Router();
const jwt= require("jsonwebtoken");
const secretKey='eventmgmtK';
const bcrypt=require('bcrypt');
const controller=require("../controllers/controller")
const Users = require("../models/userModel");
const Auth= require("../middleware/auth");

//register user
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
        res.send({ status : false ,message: "Email Exists" });
      } else if (existingUsername) {
        res.send({ status : false, message: "Username Exists" });
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
      return res
        .status(500)
        .send({ error: "Error occurred during registration" });
    }
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

//Login API
router.post("/user/login",controller.user_login); 
router.get("/user/role",[Auth.verifyToken, Auth.adminCheck], controller.checkAdminRole)
router.get("/user/loggedin",[Auth.verifyToken], controller.checkLogin);

router.get('/user/test',Auth.verifyToken, function (req,res){
     res.status(200).send({status:true,message:"Authenticated"})
});

module.exports = router;

