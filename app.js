const express = require("express");
const app=express();
app.use(express.json());
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://eventmgmt:eventmgmt@eventmanagementcluster.b1x94pb.mongodb.net/?retryWrites=true&w=majority')
const Events = require('./models/eventModel.js');
let port = 3000;

//Port
app.listen(port,function(){
    console.log("I am Listening to port",port);
})

//Testing API Function
function testingApi(req,res){
    res.send({message:"Api Testing Successful"});
}

//Sample API request
app.get("/test",testingApi)

//MongoDB Sample Data Insert
async function insert(){
    await Events.create({
        name: "Movie Show",
        description:"Oppenheimer",
        seats:72,
        category_id:1,
        posterImage:"oppenheimer.img"
    })
}
insert();