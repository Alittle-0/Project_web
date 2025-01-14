const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Artist = new Schema(
  {
    artist: { type: String, required: true  },
    title: { type: String, required: true  },
    genre: {type: [String], required: true },
  },
);

module.exports = mongoose.model("Artist", Artist);
