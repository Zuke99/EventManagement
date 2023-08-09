const express = require("express");
const app=express();
app.use(express.json());

require("./db/conn");  //to create connection

let port = 3000;
const EventRouter = require("./router/eventRouter");
const UserRouter=require("./router/userRouter");
const TicketRouter=require("./router/ticketRouter");

app.use(EventRouter);
app.use(UserRouter);
app.use(TicketRouter);

//Port
app.listen(port,function(){
    console.log("I am Listening to port",port);
})

