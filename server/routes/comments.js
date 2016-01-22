var express = require("express");
var router = express.Router();
var db = require("../models");
var auth = require("../middleware/auth.js");

router.use(auth.checkHeaders);

// API routes for comments:
// GET all comments for specific photo...(/api/photos/:id/comments)
// POST comment for specific photo...(/api/photos/:id/comments)
// DELETE comment...(/api/photos/:pId/comments/:cId)

router.route('/:id/comments')
  .get(function(req, res){
    db.Comment.find({'photo': req.params.id}, function(err, comments){
      if (err) return res.status(500).send(err);
      if (!comments) return res.status(401).send(err);
      return res.json(comments);
    });
  })
  .post(function(req, res){
    db.Photo.findById(req.params.id, function(err, photo){
      if (err) return res.status(500).send(err);
      if (!photo) return res.status(401).send(err);
      db.Comment.create(req.body, function(err, comment){
        if (err) return res.status(500).send(err);
        comment.photo = photo;
        photo.comments.push(comment);
        photo.numComments++;
        comment.save();
        photo.save();
        return res.status(200).json(comment);
      });
    });
  });

router.route('/:pId/comments/:cId')
  .delete(function(req, res){
    db.Comment.findById(req.params.cId, function(err, comment){
      if (err) return res.status(500).send(err);
      if (!comment) return res.status(401).send(err);
      comment.remove();
      return res.json(comment);
    });
  });

module.exports = router;












