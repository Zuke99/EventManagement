const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  seats: Number,
  category: String,
  posterImage: String,
  owner: String,
  date: Date,
  start_time: String,
  end_time: String,
  venue: String,
  about:String,
  tags: [String],
  approval: {
    type:Boolean,
    default : false
  },
  organisation: String,
});
module.exports = mongoose.model("Events", eventSchema);
