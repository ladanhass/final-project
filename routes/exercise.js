//Imports necessary modules
const express = require("express");
const router = express.Router();
const { redirectLogin } = require("../utils/middleWare");
//Route to render excercise page
router.get("/", redirectLogin, function (req, res) {
  res.render("exercise");
});

module.exports = router;
