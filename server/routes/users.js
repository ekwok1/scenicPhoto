var express = require("express");
var router = express.Router();
var db = require("../models");
var auth = require("../middleware/auth.js");
var tokenLib = require("../lib/token.js");
var token;

router.use(auth.checkHeaders);

// API routes for app
router.post("/signup", function(req, res){
  db.User.create(req.body, function(err, user){
    if (err) return res.status(400).send("Username/Password can't be blank AND Username must be unique.");
    var listedItems = {id: user._id, username: user.username};
    token = tokenLib.sign(user._id);
    return res.json({token: token, user: listedItems});
  });
});

router.post("/login", function(req, res){
  db.User.authenticate(req.body, function(err, user){
    if (err) return res.status(400).send(err);
    if (!user) return res.status(400).send("Username or Password is invalid");
    var listedItems = {id: user._id, username: user.username};
    token = tokenLib.sign(user._id);
    return res.json({token: token, user: listedItems});
  });
});

// API routes for development
router.get("/", function(req, res){
  db.User.find({}, function(err, user){
    if (err) return res.status(500).send(err);
    return res.status(200).json(user);
  });
});

router.delete("/:id", function(req, res){
  db.User.findByIdAndRemove(req.params.id, function(err, user){
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send(err);
    return res.status(200).json(user);
  });
});

module.exports = router;