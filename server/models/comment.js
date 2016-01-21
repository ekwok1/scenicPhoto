var mongoose = require("mongoose");
var db = require("./index.js");

var commentSchema = new mongoose.Schema({
  username: {
    type: String
  },
  comment: {
    type: String,
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo"
  }
});

commentSchema.pre('remove', function(next){
  var comment = this;
  var commentId = comment._id;
  var photoId = comment.photo;
  db.Photo.findOne({ '_id': photoId }, function(err, photo){
    if (!photo) return next();
    var index = photo.comments.indexOf(commentId);
    photo.comments.splice(index, 1);
    photo.save();
    next();
  });
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;