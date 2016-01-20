var express = require("express");
var router = express.Router();
var db = require("../models");
var auth = require("../middleware/auth.js");

router.use(auth.checkHeaders);

// API routes for photos: 
// GET all photos FOR photofeed (/api/photos)
// GET one photo FOR comment page (/api/photos/:id)
// DELETE one photo (/api/photos/:id)
// POST new photo (/api/users/:id/photos)

router.route("/photos")
  .get(function(req, res){
    db.Photo.find({}, function(err, photo){
      if (err) return res.status(500).send(err);
      return res.json(photo);
    });
  });

router.route("/photos/:id")
  .get(function(req, res){
    db.Photo.findById(req.params.id, function(err, photo){
      if (err) return res.status(500).send(err);
      if (!photo) return res.status(401).send(err);
      return res.json(photo);
    });
  })
  .delete(function(req, res){
    db.Photo.findByIdAndRemove(req.params.id, function(err, photo){
      if (err) return res.status(500).send(err);
      return res.json(photo);
    });
  });

router.route("/users/:id/photos")
  .post(function(req, res){
    db.User.findById(req.params.id, function(err, user){
      if (err) return res.status(500).send(err);
      if (!user) return res.status(401).send(err);
      db.Photo.create(req.body, function(err, photo){
        if (err) return res.status(500).send(err);
        user.photos.push(photo);
        photo.user = user;
        user.save();
        photo.save();
        return res.status(200).json(photo);
      });
    });
  });









