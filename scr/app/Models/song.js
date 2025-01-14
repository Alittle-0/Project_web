const mongoose = require("mongoose");
const { artist } = require("../controllers/ArtistController");

const Schema = mongoose.Schema;

const Song = new Schema(
  {
    title: { type: String, required: true  },
    song: { type: String, required: true  },
    genre: { type: [String], required: true  },
  },
);

module.exports = mongoose.model("Song", Song);
