//Imports necessary modules
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { redirectLogin } = require("../utils/middleWare");
const { check, validationResult } = require("express-validator");

// Render register  page
router.get("/", (req, res, next) => {
  res.render("register.ejs", { alert: [] });
});
//Renders login page
router.get("/login", (req, res, next) => {
  res.render("login.ejs", { alert: [] });
});

// Handles registration form submission input validation
router.post(
  "/registered",
  [
    check("email")
      .isEmail()
      .normalizeEmail()
      .trim()
      .escape()
      .withMessage("Provide a valid email"),
    check("plainPassword")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/
      )
      .withMessage(
        "Password must contain atleat one uppercase and lowercase and one special charater and be 8-15 characters"
      ),
    check("first")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("First name cannot be empty"),
    check("last")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("last name cannot be empty"),
  ],
  //checks validation
  function (req, res) {
    const errors = validationResult(req);
    //If validation fails re-renders page with errors
    if (!errors.isEmpty()) {
      return res.render("register", { alert: errors.array() });
    }

    const plainPassword = req.body.plainPassword;
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;

    //check if email if already have an account
    let emailCheckQuery = "SELECT * FROM users WHERE email = ?";
    db.query(emailCheckQuery, [email], (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.length > 0) {
        return res.render("register", {
          alert: [{ msg: " email is already in use" }],
        });
      }
      //hashes users password saves to database
      bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        if (err) {
          return next(err);
        }
        // Inserts new users info into database
        let sqlquery =
          "INSERT INTO users (first_name, last_name, email, hashedPassword) VALUES (?,?,?,?)";
        let newRecord = [firstName, lastName, email, hashedPassword];

        db.query(sqlquery, newRecord, (err, result) => {
          if (err) {
            return next(err);
          }
          //Redirectes users to login page
          return res.redirect("/login");
        });
      });
    });
  }
);
//Login handles login form submission input validation
router.post(
  "/loggedin",
  [
    // Validates email format and normalises it
    check("email")
      .isEmail()
      .normalizeEmail()
      .trim()
      .escape()
      .withMessage("Provide a valid email adress"),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Shows errors on login page
      return res.render("login", { alert: errors.array() });
    }
    // Gets passwords and email form request
    const plainPassword = req.body.plainPassword;
    const email = req.body.email;

    //Finds the users email
    let sqlquery = "SELECT * FROM users WHERE email = ?";
    db.query(sqlquery, [email], (err, result) => {
      if (err) {
        return next(err);
      }
      //Shows allert if email is not found
      if (result.length === 0) {
        return res.render("login", {
          alert: [{ msg: "Email not found. Please register" }],
        });
      }
      //Compares password to passwords stored in database
      const hashedPassword = result[0].hashedPassword;
      bcrypt.compare(plainPassword, hashedPassword, function (err, isMatch) {
        if (err) {
          return next(err);
        }
        //Checks if password is correct compares redirect to pages
        if (isMatch) {
          req.session.userId = result[0].id;
          return res.redirect("/journal");
        } else {
          return res.render("login", {
            alert: [{ msg: "Login failed. Incorrect Password" }],
          });
        }
      });
    });
  }
);

//Logout route (so users can logout)
router.post("/logout", redirectLogin, (req, res) => {
  //session is destroyed when logged out
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./");
    }
    //When logged out redirects to login page
     return res.redirect("/login");
  });
});

module.exports = router;
