const mongoose = require('mongoose');

const eventSchema=new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "Event already exist"]
    },
    description:String,
    seats:Number,
    category_id:Number,
    posterImage:String
});

module.exports = mongoose.model('Events',eventSchema);