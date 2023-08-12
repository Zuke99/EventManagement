//login Method
const User=require("../models/userModel");
const bcrypt=require("bcrypt");
const jwt= require("jsonwebtoken");
const Ticket = require("../models/ticketModel");
const Event=require("../models/eventModel");
const secretKey= process.env.SECRET_KEY;
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");



//Creating JWT Token
const create_token = async( payload)=>{
    try {
     const token = await jwt.sign(payload,secretKey);
     return token;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Decoding JWT Token from headers to get useful info
const decodeToken = (token) =>{
    try{
    const tokenValue=token;
    const decodedTokenValue=jwt.verify(tokenValue, secretKey);
    const{_id, name,email} = decodedTokenValue;
    return{
        _id, name,email
    }
} catch (error) {
    console.log("Invalid Token");
        res.status(400).send(error.message);
    }
}

//Send Mail
const sendMail = (email,eventExist) =>{
    let config = {
        service : 'gmail',
        auth : {
            user :'backupzuke2@gmail.com',
            pass :'bnujeebefgekmbnz'
        }
    }
    let transporter = nodemailer.createTransport(config);
    let mailGenerator= new Mailgen({
        theme: "default",
        product :{
            name: "Event Management Team K",
            link: 'https://mailgen.js'
        }
    })

    let response= {
        body:{
            name:'',
            intro:"Your Ticket has been generated",
            table : {
                data: [
                    {
                        EventName:`${eventExist.name}`,
                        Description : `${eventExist.description}`,
                    }
                ]
            },
            outro:"Looking forward for more event registrations"
        }
    }
    let mail = mailGenerator.generate(response);
    let message = {
        from : "backupzuke2@gmail.com",
        to:`${email}`,
        subject: `Ticket For ${eventExist.name} Event `,
        html : mail
    }
    transporter.sendMail(message);
    
}

//User Login
const user_login=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const userData=await User.findOne({email:email});
        if (userData) {
            
           const matchPassword = await bcrypt.compare(password,userData.password);
           if (matchPassword) {
            const payload={
                _id : userData._id,
                name : userData.name,
                email : userData.email
            }
            const token= await create_token(payload);
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

//Register Event
const event_registration = async(req,res) =>{
    try{
        const token = req.headers["authorization"];
        const decodedToken=decodeToken(token);
        const ticketExist = await Ticket.findOne({
                userId:decodedToken._id,
                eventId:req.body.eventId
        })
        //Checking if the ticket is Already Booked
        if(ticketExist){
            res.status(400).send({message: "Ticket has been Booked Already"});
        } else {
            //Checking if the Event Exists
            const eventExists= await Event.findById(req.body.eventId);
            if(eventExists){
                const seats=eventExists.seats;
                if(seats>0){
                const addTicket=new Ticket({
                eventId:req.body.eventId,
                userId:decodedToken._id,
                eventName:eventExists.name
            })
            //Reduce Seat by 1
            let updatedSeats = seats - 1;
            const updateEvent= await Event.findByIdAndUpdate(
                {_id:req.body.eventId},
                {$set:{seats : updatedSeats}}
            ).then(updateEvent => {
                if(updateEvent){
                    console.log("Seats Updated");
                } else {
                    console.log("Error Updating Seats");
                }
            }).catch(error => {
                console.error('Error updating Ticket', error);
            })
            
            const createTicket = await addTicket.save();
            sendMail(decodedToken.email,eventExists);
            res.status(201).send({message : "Registered to the event Successfully" ,data : createTicket});
        } else {
            res.status(201).send({message: "There are no seats left"})
        }
        } else {
            res.status(400).send({message : "There is no such event"});
        }
        }


    }catch (error) {
        res.status(400).send(error.message)
    }
}
//DeRegistration
const event_deregistration= async(req,res) => {
    //res.send("hello");
    const token = req.headers["authorization"];
        const decodedToken=decodeToken(token);
        const ticketExist = await Ticket.findOne({
                userId:decodedToken._id,
                eventId:req.body.eventId
        })
        if(ticketExist){
            try{
            const deleteTciket= await Ticket.deleteOne({
                userId : decodedToken._id,
                eventId: req.body.eventId
            })
            //Reduce number of Seat
            const getEvent = await Event.findById(req.body.eventId);
            let getSeats = getEvent.seats;
            getSeats=getSeats+1;
            const updateSeats= await Event.findByIdAndUpdate(req.body.eventId,
                {
                seats : getSeats
            })
            res.status(201).send({message : "Event Deregistration Successful" , data : deleteTciket , seatsUpdate : updateSeats});
        } catch (error){
            res.status(400).send(error.message)
        }
           
        } else {
            res.status(400).send({message : "Ticket Not Found"});
        }
}

module.exports ={
    user_login,
    event_registration,
    event_deregistration
}