var express = require("express");
var router = express.Router();

var genreController = require("../../app/controllers/GenreController.js");

router.get("/:title", genreController.show);

router.get("/", genreController.genre);

module.exports = router;
