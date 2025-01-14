var express = require("express");
var router = express.Router();

var userController = require("../../app/controllers/UserController");
var middleWareController = require("../../app/controllers/MiddleWareController");

//----------------------------------------------------------//

//------------------------JUST ADMIN------------------------//

router.post("/storeArtist", userController.storeArtist);

router.get("/createArtist", userController.createArtist);

router.post("/storeGenre", userController.storeGenre);

router.get("/createGenre", userController.createGenre);

router.post("/store", userController.store);

router.get("/create", userController.create);

//----------------------------------------------------------//

router.get("/favorites", userController.favorite);

router.delete(
  "/:id",
  middleWareController.verifyAuth,
  userController.deleteUser
);

router.post(
  "/userlogout",
  middleWareController.verifyToken,
  userController.userLogout
);

router.get("/:slug", userController.userActive);

router.get("/", middleWareController.verifyToken, userController.user);

module.exports = router;
