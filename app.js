const express = require("express");
const app=express();
app.use(express.json());
var cors=require('cors');
app.use(cors());

require("./db/conn");  //to create connection

let port = 8084;
const EventRouter = require("./router/eventRouter");
const UserRouter=require("./router/userRouter");
const TicketRouter=require("./router/ticketRouter");
const CategoryRouter=require("./router/categoryRouter");

app.use(EventRouter);
app.use(UserRouter);
app.use(TicketRouter);
app.use(CategoryRouter);

//Port
app.listen(port,function(){
    console.log("I am Listening to port",port);
})


