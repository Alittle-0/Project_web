const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Genre = new Schema(
  {
    title: { type: String, required: true  },
    desc: { type: String, required: true  },
    genre: { type: [String], required: true  },
  },
);

module.exports = mongoose.model("Genre", Genre);
