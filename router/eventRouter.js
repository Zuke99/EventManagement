const express = require("express");
const router = new express.Router();
const Auth = require("../middleware/auth");
const controller = require("../controllers/controller")
const Events = require("../models/eventModel");
const uploadImage = require("../controllers/uploadImage");

router.get(
  "/events/testing/admin",
  [Auth.verifyToken, Auth.adminCheck],
  (req, res) => {
    res.send({ status: true });
  }
);

//ADD Event
router.post("/event", [Auth.verifyToken], async (req, res) => {
  try {
    const addEvent = new Events(req.body);
    const token  = req.headers["authorization"];
    const userInfo = controller.decodeToken(token);
    addEvent.owner=userInfo._id;
    const createEve = await addEvent.save();
    res.send({status : true , data : createEve, message : "Events Created Successfully"});
    console.log(`Event Id: ${createEve._id}`);
  } catch (e) {
    res.send({status : false , data : e});
  }
});

//GET All Events
router.get("/event", async (req, res) => {
  try {
    const getEvent = await Events.find({});
    res.send({status : true , data :getEvent});
  } catch (e) {
    res.send({status : false , data : e});
  }
});

//get particular event using id
// router.get("/event/:id", async(req, res) => {
//     try {
//         const _id = req.params.id;
//         const getEve = await Events.findById(_id);
//         res.send(getEve);
//     } catch(e) {
//         res.status(400).send(e);
//     }
// });

//get particular event using name
// router.get("/event/:name", async(req, res) => {
//     try {
//         const name = req.params.name;
//         const getEve = await Events.find({name : name});
//         res.send(getEve);
//     } catch(e) {
//         res.status(400).send(e);
//     }
// });

//FILTER event using category_id
router.get("/event/:category", async (req, res) => {
  try {
    const category_id = req.params.category_id;
    const getEve = await Events.find({ category_id: category_id });
    res.send({status : true , data : getEve});
  } catch (e) {
    res.send({status : false , data : e});
  }
});

//UPDATE Event using id
router.patch("/event/:id", Auth.verifyToken, async (req, res) => {
  try {
    const _id = req.params.id;
    const updateEve = await Events.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.send({status : true , result : updateEve});
    console.log("Success");
  } catch (e) {
    res.send({status : false , data : e});
  }
});

//DELETE Event using id
router.delete("/event/:category", Auth.verifyToken, async (req, res) => {
  try {
    const category = req.params.category;
    const delEvent = await Events.findOneAndDelete({category:category});
    if(delEvent.length>0){
    res.send({status:true, data: delEvent});
    }
    //console.log("Success");
    else{
      res.send({status:false, message:"No event exist"});
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.put("/event/approval/approveevent",Auth.verifyToken, async(req,res) => {
  try{
    console.log("Approve Inside", req.body.eventId);
    const eventId = req.body.eventId;
    const approveEvent = await Events.findByIdAndUpdate(
      eventId,
      {approval : true},
      {new : true}
      );
      if(!approveEvent){
        return res.send({status : false , message : "Event not Found"});
      } 
      res.send({status : true , message : "Event Approved Successfully"});
    
  } catch (e) {
    res.send({status : false, message : e});
  }
})

router.post("/uploadImage", (req,res) => {
  console.log("here upload")
  uploadImage(req.body.image)
  .then((url) => res.send(url))
  .catch((err) => res.status(500).send(err));
})

module.exports = router;
