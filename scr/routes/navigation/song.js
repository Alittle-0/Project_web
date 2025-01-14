var express = require("express");
var router = express.Router();

var songController = require("../../app/controllers/SongController.js");

router.get("/:title", songController.show);

router.get("/", songController.song);

module.exports = router;
