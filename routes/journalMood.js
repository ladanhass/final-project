const express = require("express");
const router = express.Router();
// const {redirectLogin} = require('./users');
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.render("./login");
    } else {
      next();
    }
  };

router.get("/", redirectLogin,function(req, res){
    let sqlquery = "SELECT * FROM moods WHERE user_id = ?";
    db.query(sqlquery, [req.session.userId], (err, results) =>{
        if(err){
            return next(err);
        }
        res.render("journal", {moods: results, userId: req.session.userId});
    });

   
});
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

router.get("/graph", redirectLogin, function(req, res, next){
    res.render("graph");
});


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
module.exports = router;