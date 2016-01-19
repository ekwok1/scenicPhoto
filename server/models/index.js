var mongoose = require("mongoose");
var databaseName = "scenic-photo";
mongoose.connect("mongodb://localhost/" + databaseName);
mongoose.set("debug", true);

var user = require("./user");

module.exports.User = user;