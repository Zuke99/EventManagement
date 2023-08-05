const express = require("express");
const app=express();
app.use(express.json());

require("./db/conn");  //to create connection

let port = 3001;
const EventRouter = require("./router/eventRouter");
const UserRouter=require("./router/userRouter");

app.use(EventRouter);
app.use(UserRouter);

//Port
app.listen(port,function(){
    console.log("I am Listening to port",port);
})
