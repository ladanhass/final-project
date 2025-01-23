//import modules
var express = require("express");
var ejs = require("ejs");
//port and initialise
const app = express();
const port = 8000;

app.set("view engine", "ejs");

app.listen(port, () => console.log(`Node app listening on port ${port}!`));
