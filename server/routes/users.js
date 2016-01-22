var express = require("express");
var router = express.Router();
var db = require("../models");
var auth = require("../middleware/auth.js");
var tokenLib = require("../lib/token.js");
var token;

router.use(auth.checkHeaders);

// API routes for auth
router.post("/signup", function(req, res){
  db.User.create(req.body, function(err, user){
    if (err) return res.status(500).send("Username/Password can't be blank OR Username is taken");
    var listedItems = {id: user._id, username: user.username};
    token = tokenLib.sign(user._id);
    return res.status(200).json({token: token, user: listedItems});
  });
});

router.post("/login", function(req, res){
  db.User.authenticate(req.body, function(err, user){
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send("Username or Password is invalid");
    var listedItems = {id: user._id, username: user.username};
    token = tokenLib.sign(user._id);
    return res.status(200).json({token: token, user: listedItems});
  });
});

// API route for GET and PUT user
router.route("/:id")
  .get(function(req, res){
    db.User.findById(req.params.id, function(err, user){
      if (err) return res.status(500).send(err);
      if (!user) return res.status(401).send(err);
      return res.status(200).json(user);
    });
  })
  .put(function(req, res){
    db.User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
      if (err) return res.status(500).send(err);
      if (!user) return res.status(401).send(err);
      return res.status(200).json(user);
    });
  });

// API route for new photo
router.post("/:id/photos", function(req, res){
  db.User.findById(req.params.id, function(err, user){
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send(err);
    db.Photo.create(req.body, function(err, photo){
      if (err) return res.status(500).send(err);
      photo.user = user;
      user.photos.push(photo);
      photo.save();
      user.save();
      return res.status(200).json(photo);
    });
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
  db.User.findById(req.params.id, function(err, user){
    if (err) return res.status(500).send(err);
    if (!user) return res.status(401).send(err);
    user.remove();
    return res.status(200).json(user);
  });
});

module.exports = router;