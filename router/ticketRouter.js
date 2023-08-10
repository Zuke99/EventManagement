const express = require("express");
const router=express.Router();
const Ticket=require("../models/ticketModel")
const Auth= require("../middleware/auth");
const controller=require("../controllers/controller")
//User Register Event


router.post("/event/registerevent",Auth,controller.event_registration);
router.post("/event/deregisterevent",Auth,controller.event_deregistration);
router.get("/viewticket",controller.view_ticket);

module.exports = router;