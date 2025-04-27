//Import modules
var express = require("express");
var ejs = require("ejs");
var session = require("express-session");
var mysql = require("mysql2");
const crypto = require("crypto");
require("dotenv").config();

//Import utils files
require("./utils/middleWare");
require("./utils/encrypt");

//Port and initialise
const app = express();
const port = 8007;

//Set up view engine to ejs
app.set("view engine", "ejs");
//Process json data URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//Session set up 
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

//MySQL set uo using .env
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});
//Connects Mysql database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("connected to database");
});
global.db = db;

//Define and set up routes for diffrent pages
const usersRoutes = require("./routes/users");
app.use("/", usersRoutes);
const journalMood = require("./routes/journalMood");
app.use("/journal", journalMood);
const settingsRoutes = require("./routes/settingsRoutes");
app.use("/settings", settingsRoutes);
const exerciseRoutes = require("./routes/exercise");
app.use("/exercise", exerciseRoutes);

//Erorr handling middleware for catching erros 
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("something broke");
});

//starts Server
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
