var express = require("express");
var router = express.Router();

var sitesController = require("../../app/controllers/SitesController");


router.post('/userlogin', sitesController.userLogin);

router.post('/userstore', sitesController.userStore);

router.post('/request', sitesController.requestRToken);

//-------------------------------------------------------//

router.get("/login", sitesController.login);

router.get("/register", sitesController.register);

router.get("/", sitesController.home);

module.exports = router;
