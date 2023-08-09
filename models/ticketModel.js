const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    eventId:String,
    userId:String,
    eventName:String

})

module.exports= mongoose.model('Ticket',ticketSchema);