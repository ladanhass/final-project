const express = require("express");
const router = express.Router();
// const {redirectLogin} = require('./users');
const{ encrypt, decrypt} = require('../utils/encrypt');
const { check, validationResult } = require("express-validator");
//middleware function 
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.render("./login");
    } else {
      next();
    }
  };
//gets and displays journal page with entries
router.get("/", redirectLogin,function(req, res,next){
    let sqlqueryMoods = "SELECT * FROM moods WHERE user_id = ?";
    db.query(sqlqueryMoods, [req.session.userId], (err, moodResults) => {
        if(err){
            return next(err);
        }
        let sqlqueryJournal = "SELECT * FROM journal WHERE user_id = ?";
        db.query(sqlqueryJournal, [req.session.userId], (err, journalResults) => {
            if(err){
                return next(err);
            }
            console.log("Journal: ", journalResults);
            const decryptedEntries = journalResults.length > 0 ? journalResults.map(entry => {
                console.log("encrpted", entry.entry);

                const decryptedText= decrypt(entry.entry);
                console.log("decrypted text", decryptedText);
                return{
                    ...entry,
                    entry:decryptedText
                };
            }) : [];
            console.log("decentries: ", decryptedEntries);
           

        res.render("journal", {
            moods: moodResults,
             journal: decryptedEntries,
             userId: req.session.userId,
             alert:[]
            });
            });
        });
    });


//saves mood entries 
router.post("/save-mood", redirectLogin, function(req, res, next){
    const{day, mood} = req.body;
    let  sqlquery = "INSERT INTO moods (user_id, day, mood) VALUES (?,?,?) ";
    db.query(sqlquery, [req.session.userId, day, mood ], (err, results) =>{
        if(err){
            return next(err);
        }else{
            res.redirect("/journal");
        }
    });
});
//route to delete mood entry
router.post("/delete-mood", redirectLogin, function(req, res, next){
    const{day, mood} = req.body;
    let  sqlquery = "DELETE FROM moods WHERE user_id = ? AND day= ? ";
    db.query(sqlquery, [req.session.userId, day], (err, results) =>{
        if(err){
            return next(err);
        }else{
            res.redirect("/journal");
        }
    });
});
//renders graph page
router.get("/graph", redirectLogin, function(req, res, next){
    res.render("graph");
});

//api route to fetch latest moods for each day
router.get("/api/moods", (req, res, next) => {
let sqlquery = `SELECT day, mood FROM moods m  WHERE user_id = ? AND id = (
    SELECT MAX(id) FROM moods WHERE user_id = m.user_id
    AND day = m.day )
    ORDER BY day ASC `;
    db.query(sqlquery, [req.session.userId], (err, results) =>{
        if(err){
            return next(err);
        }else{
            res.json(results);
        }
    });
  });


  router.post(
    "/save-entry", 
    redirectLogin,[
        check("entry")
        .trim()
        .escape()
        .notEmpty().withMessage("please add entry to save"),
    ],
    function(req, res,next){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.render("journal", { alert: errors.array(), userId: req.session.userId });
        }
    const { day, entry} = req.body;
    const sanitizedEntry= entry.trim();
    const encryptedEntry = encrypt(sanitizedEntry);
    let sqlquery= "INSERT INTO journal(user_id, day, entry) VALUES (?,?,?) ";
    db.query(sqlquery, [req.session.userId , day, encryptedEntry], (err, results) =>{
        if(err){
            return next(err);
        }
        res.redirect("/journal");
    });
  });
module.exports = router;