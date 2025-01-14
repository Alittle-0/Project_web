var express = require("express");
var router = express.Router();

var artistController = require("../../app/controllers/ArtistController");

router.get("/:title", artistController.show);

router.get("/", artistController.artist);

module.exports = router;
