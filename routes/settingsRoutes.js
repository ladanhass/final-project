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
    res.render("settings");
  });

  router.post("/delete", redirectLogin, function(req,res,next){
    const userId = req.session.userId;
    let sqlquery = "DELETE FROM users WHERE id =?";
    db.query(sqlquery, [userId], (err, results) =>{
      if(err){
          return next(err);
      }else{
          req.session.destroy((err) =>{
            if(err){
              return res.redirect("settings")
            }
            res.redirect("./")
          })
      }
  });

  });








module.exports = router;