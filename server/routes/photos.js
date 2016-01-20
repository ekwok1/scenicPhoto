var express = require("express");
var router = express.Router();
var db = require("../models");
var auth = require("../middleware/auth.js");

router.use(auth.checkHeaders);

// API routes for photos: 
// GET all photos FOR photofeed (/api/photos)
// GET one photo FOR comment page (/api/photos/:id)
// DELETE one photo (/api/photos/:id)

router.route("/")
  .get(function(req, res){
    db.Photo.find({}, function(err, photo){
      if (err) return res.status(500).send(err);
      return res.json(photo);
    });
  });

router.route("/:id")
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

module.exports = router;









