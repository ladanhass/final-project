const express = require("express");
const router = express.Router();
//middleware function to check if user is logged in
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    //If user not logged in redirects to login 
    res.redirect("/login"); 
  } else {
    next();
  }
};
//Exports middleware to be using in other parts
module.exports = { redirectLogin };
