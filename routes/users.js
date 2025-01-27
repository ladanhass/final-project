const express = require("express");
const router = express.Router();

// register is home page
router.get("/", (req, res) => {
  res.render("register.ejs");
});
module.exports = router;
