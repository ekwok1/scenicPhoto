var express = require("express");
var router = express.Router();
var db = require("../models");
var auth = require("../middleware/auth.js");

router.use(auth.checkHeaders);

// API routes for comments:
// GET all comments for specific photo...(/api/photos/:id/comments)
// POST comment for specific photo...(/api/photos/:id/comments)
// PUT comment...(/api/photos/:id/comments)
// DELETE comment...(/api/photos/:pId/comments/:cId)

router.route('/:id/comments')
  .get(function(req, res){
    db.Comment.find({'photo': req.params.id}).then(function(err, comments){
      if (err) return res.status(500).send(err);
      if (!comments) return res.status(401).send(err);
      return res.json(comments);
    });
  });

module.exports = router;