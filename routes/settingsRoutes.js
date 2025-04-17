const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { check, validationResult} = require("express-validator");
const saltRounds = 10;


const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.render("./login");
    } else {
      next();
    }
  };

router.get("/", redirectLogin, function(req, res, next){
    res.render("settings", {alert: []});
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
router.post("/change-password", redirectLogin,
[
  check("newPassword")
  .trim()
  .escape()
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/)
  .withMessage("Password must contain atleat one uppercase and lowercase and one special charater and be 8-15 characters"),
  check("currentPassword")
  .trim()
  .escape(),
  check("confirmPassword")
  .trim()
  .escape()
],
async function(req, res, next){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render("settings", {alert: errors.array()});
  }
  const{currentPassword, newPassword, confirmPassword} = req.body;
  const userId = req.session.userId;
  
  
  if(newPassword !== confirmPassword){
    console.log(errors.array());
    return res.render("settings",{alert: [{msg: "Password do not match enter correct password"}]});

  }
  let sqlquery = "SELECT hashedPassword FROM users WHERE id= ?";
  db.query(sqlquery, [userId], async (err, results) =>{
    if(err){
        return next(err);
    }
    if(results.length === 0){
      return res.render("settings", {alert: [{msg:"User not found"}]});
    }
    const isMatch = await bcrypt.compare(currentPassword, results[0].hashedPassword);
    if(!isMatch){
      return res.render("settings", {alert: [{msg:"Incorect password please enter correct password."}]});
    }
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    let updateQuery = "UPDATE users SET hashedPassword = ? WHERE id= ?";
    db.query(updateQuery, [hashedPassword, userId], (err, results) =>{
      if(err) return next(err);
      return res.render("settings", {alert: [{msg:"Password has successfully been changed"}]});
      });
    });
  });









module.exports = router;