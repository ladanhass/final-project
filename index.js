//import modules
var express = require("express");
var ejs = require("ejs");
var session = require("express-session");
var mysql = require("mysql2");
const crypto = require('crypto');
require("dotenv").config();


//port and initialise
const app = express();
const port = 8021;

//Used to get iv and key
require("./utils/encrypt");
//  const key = crypto.randomBytes(16).toString('hex');
//  const iv = crypto.randomBytes(16).toString('hex');
// console.log("generate key:" , key);
// console.log("generate iv:", iv);


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
//creates session
app.use(
  session({
    secret: "somerandomstuff",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

//database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("connected to database");
});
global.db = db;

//define routes

//routes for register and login
const usersRoutes = require("./routes/users");
app.use("/", usersRoutes);
const journalMood = require("./routes/journalMood");
app.use("/journal", journalMood);
const settingsRoutes = require("./routes/settingsRoutes");
app.use("/settings", settingsRoutes);
const exerciseRoutes = require("./routes/exercise");
app.use("/exercise", exerciseRoutes);


//starts server
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
