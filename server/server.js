var express = require("express");
var app = express();
var path = require("path");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var routes = require("./routes/users.js");

// app.use
app.use("/css", express.static(path.join(__dirname, '../client/css')));
app.use("/js", express.static(path.join(__dirname, '../client/js')));
app.use("/templates", express.static(path.join(__dirname, '../client/js/templates')));

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/users", routes);

// catch all
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// serving localhost
app.listen(3000, function(){
  console.log("localhost3000 ready");
});