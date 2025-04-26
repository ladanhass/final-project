const express = require("express");
const router = express.Router();
const { redirectLogin } = require("../utils/middleWare");

router.get("/", redirectLogin, function (req, res, next) {
  res.render("exercise");
});

module.exports = router;
