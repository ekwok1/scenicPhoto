var express = require("express");
var router = express.Router();
var db = require("../models");

router.post("/signup", function(req, res){
  db.User.create(req.body, function(err, user){
    if (err) return res.status(400).send("Username/Password can't be blank AND Username must be unique.");
    var listedItems = {id: user._id, username: user.username};
    return res.json({user: listedItems});
  });
});

router.post("/login", function(req, res){
  db.User.authenticate(req.body, function(err, user){
    if (err) return res.status(400).send(err);
    if (!user) return res.status(400).send("Username or Password is invalid");
    var listedItems = {id: user._id, username: user.username};
    return res.json({user: listedItems});
  });
});