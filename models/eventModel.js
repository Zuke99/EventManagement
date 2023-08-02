const mongoose = require('mongoose');

const eventSchema=new mongoose.Schema({
    name: String,
    description:String,
    seats:Number,
    category_id:Number,
    posterImage:String

})

module.exports = mongoose.model('Events',eventSchema);