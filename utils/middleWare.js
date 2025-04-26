const express = require("express");
const router = express.Router();
//middleware function to check if user is logged in 
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirct("/login");//If not logged in shows login page 
    } else {
      next();
    }
  };

  module.exports = {redirectLogin};