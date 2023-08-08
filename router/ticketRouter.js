const express = require("express");
const router=express.Router();
const Ticket=require("../models/ticketModel")
const Auth= require("../middleware/auth");
const controller=require("../controllers/controller")
//User Register Event


router.post("/user/registerevent",Auth,controller.event_registration);


module.exports = router;