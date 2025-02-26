//import modules
var express = require("express");
var ejs = require("ejs");
var session = require("express-session");
var mysql = require("mysql2");
require("dotenv").config();

//port and initialise
const app = express();
const port = 8053;

app.set("view engine", "ejs");
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
//starts server
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
