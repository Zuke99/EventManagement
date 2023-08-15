const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "Event already exists"],
  },
  description: String,
  seats: Number,
  category_id: Number,
  posterImage: String,
  owner: String,
  date: Date,
  time: Date,
  duration: Number,
  venue: String,
  tags: [String],
  approval: Boolean,
  organisation: String,
});

module.exports = mongoose.model("Events", eventSchema);
