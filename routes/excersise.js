const express = require("express");
const router = express.Router();

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.render("./login");
    } else {
      next();
    }
  };

router.get("/", redirectLogin, function(req, res, next){
    res.render("excersise");
  });









module.exports = router;