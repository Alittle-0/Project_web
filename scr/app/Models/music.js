const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Music = new Schema(
  {
    artist: { type: String, required: true },
    genre: { type: [String], required: true },
    song: { type: String, required: true },
  },
);

module.exports = mongoose.model("Music", Music);
