var mongoose = require("mongoose");
var databaseName = "scenic-photo";
mongoose.connect("mongodb://localhost/" + databaseName);
mongoose.set("debug", true);

var user = require("./user");
var photo = require("./photo");

module.exports.User = user;
module.exports.Photo = photo;