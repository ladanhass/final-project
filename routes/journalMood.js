//Imports necessary modules
const express = require("express");
const router = express.Router();
const { encrypt, decrypt } = require("../utils/encrypt"); //Imports encryption and decryption
const { redirectLogin } = require("../utils/middleWare");
const { check, validationResult } = require("express-validator");

//Gets and displays journal page
router.get("/", redirectLogin, function (req, res, next) {
  //Query to get the latest journal entry for each day
  let sqlqueryJournal = `SELECT day, entry FROM journal j  WHERE user_id = ? AND id = (
            SELECT MAX(id) FROM journal WHERE user_id = j.user_id
            AND day = j.day )
            ORDER BY day ASC `;

  db.query(sqlqueryJournal, [req.session.userId], (err, journalResults) => {
    if (err) return next(err); // Handles if query fails
    //Maps to hold decrypted journal entries by day
    const journalMap = {};
    //loop through each entries and decrypt text
    journalResults.forEach((entry) => {
      const decryptedText = decrypt(entry.entry); //Decrypts entry
      journalMap[entry.day] = decryptedText; // Stores decrypted entries by day
    });
    //Renders journal page moods and decrypted journal entry
    return res.render("journal", {
      journal: journalMap, //Pass decrypted data
    });
  });
});

//Route to saves mood entry
router.post("/save-mood", redirectLogin, function (req, res, next) {
  const { day, mood } = req.body; // Gets day and mood from form
  let sqlquery = "INSERT INTO moods (user_id, day, mood) VALUES (?,?,?) ";
  db.query(sqlquery, [req.session.userId, day, mood], (err) => {
    if (err) {
      return next(err);
    } else {
      return res.redirect("/journal"); // Redirects to journal page after saving
    }
  });
});

//Route to delete mood entry
router.post("/delete-mood", redirectLogin, function (req, res, next) {
  const { day } = req.body;
  //SQL to delete mood for specific user and day
  let sqlquery = "DELETE FROM moods WHERE user_id = ? AND day= ? ";
  db.query(sqlquery, [req.session.userId, day], (err) => {
    if (err) {
      return next(err);
    } else {
      return res.redirect("/journal");
    }
  });
});

//Renders graph page
router.get("/graph", redirectLogin, function (req, res) {
  res.render("graph");
});

//API route to fetch latest moods for each day
router.get("/api/moods", (req, res, next) => {
  //Query to get the latest mood for each day
  let sqlquery = `SELECT day, mood FROM moods m  WHERE user_id = ? AND id = (
    SELECT MAX(id) FROM moods WHERE user_id = m.user_id
    AND day = m.day )
    ORDER BY day ASC `;
  db.query(sqlquery, [req.session.userId], (err, results) => {
    if (err) {
      return next(err);
    } else {
      return res.json(results); // Returns mood data as Json
    }
  });
});

//Route to save journal
router.post(
  "/save-entry",
  redirectLogin,
  [
    check("entry") // Validation for entry input
      .trim() // Removes leading and trailing spaces
      .escape(), // Escapes any html special charaters
  ],
  function (req, res, next) {
    const errors = validationResult(req); //Check for validation errors
    if (!errors.isEmpty()) {
      return res.render("journal", { alert: errors.array() });
    }
    const { day, entry } = req.body;
    const encryptedEntry = encrypt(entry); //Encrypt journal entry
    //SQL to save encrypted entry to database
    let sqlquery = "INSERT INTO journal(user_id, day, entry) VALUES (?,?,?) ";
    db.query(sqlquery, [req.session.userId, day, encryptedEntry], (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/journal");
    });
  }
);

//Route to delete journal entry
router.post("/delete-entry", redirectLogin, function (req, res, next) {
  const { day } = req.body;
  //SQL to delete journal entry for specific user and day
  let sqlquery = "DELETE FROM journal WHERE user_id = ? AND day= ? ";
  db.query(sqlquery, [req.session.userId, day], (err) => {
    if (err) {
      return next(err);
    } else {
      return res.redirect("/journal");
    }
  });
});
module.exports = router;
