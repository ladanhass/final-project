//Imports necessary modules
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { redirectLogin } = require("../utils/middleWare");
const { check, validationResult } = require("express-validator");
const saltRounds = 10;

//Route to reder settings 
router.get("/", redirectLogin, function (req, res) {
  res.render("settings", { alert: [] });
});
//Route for delete acount will be able to delete all data (DELETE CASCADE)
router.post("/delete", redirectLogin, function (req, res, next) {
  const userId = req.session.userId; // Gets user ID from session
  let sqlquery = "DELETE FROM users WHERE id =?"; //SQL query to delete user 
  db.query(sqlquery, [userId], (err, results) => {
    if (err) {
      return next(err);
    } else {
      req.session.destroy((err) => { //Destroys session after deleting user
        if (err) {
          return res.redirect("settings");
        }
        return res.redirect("/");// Redirect back to register page after deletion
      });
    }
  });
});
// Route to handle password change
router.post(
  "/change-password",
  redirectLogin,
  [
    //Input validation for new password
    check("newPassword")
      .trim()
      .escape()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/
      )
      .withMessage(
        "Password must contain atleat one uppercase and lowercase and one special charater and be 8-15 characters"
      ),
      //Sanitises current password inputs
    check("currentPassword").trim().escape(), 
    check("confirmPassword").trim().escape(),
  ],
  async function (req, res, next) {
    //check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Renders setting page with errors
      return res.render("settings", { alert: errors.array() }); 
    }
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.userId;
    //Rendered alert if password dont match
    if (newPassword !== confirmPassword) {
      console.log(errors.array());
      return res.render("settings", {
        alert: [{ msg: "Password do not match enter correct password" }], //displays error message
      });
    }
    //Query to get hashed password from databse and render alerts
    let sqlquery = "SELECT hashedPassword FROM users WHERE id= ?";
    db.query(sqlquery, [userId], async (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.length === 0) {
        return res.render("settings", { alert: [{ msg: "User not found" }] });
      }
      //compares enterd password to user stored hashed password
      const isMatch = await bcrypt.compare(
        currentPassword,
        results[0].hashedPassword
      );
      //If passwords do not match shows error message
      if (!isMatch) {
        return res.render("settings", {
          alert: [{ msg: "Incorect password please enter correct password." }],
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds); //Hash new password using bycrpt
      let updateQuery = "UPDATE users SET hashedPassword = ? WHERE id= ?"; //Query to update users password in database
      db.query(updateQuery, [hashedPassword, userId], (err, results) => {
        if (err) return next(err);
        return res.render("settings", {
          alert: [{ msg: "Password has successfully been changed" }],//displays success message
        });
      });
    });
  }
);

module.exports = router;
