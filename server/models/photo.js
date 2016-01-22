var mongoose = require("mongoose");
var db = require("./index.js");

var photoSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  numComments: {
    type: Number,
    default: 0
  },
  numLikes: {
    type: Number,
    default: 0
  },
  numFavorites: {
    type: Number,
    default: 0
  }
});

var Photo = mongoose.model("Photo", photoSchema);

photoSchema.pre('save', function(next){
  var photo = this;
  var now = Date.now();
  photo.updated_at = now;
  if (!photo.created_at){
    photo.created_at = now;
  }
  next();
});

photoSchema.pre('remove', function(next){
  var photo = this;
  var photoId = photo._id;
  var userId = photo.user;
  db.User.findOne({ '_id': userId }, function(err, user){
    if (!user) return next();
    var index = user.photos.indexOf(photoId);
    user.photos.splice(index, 1);
    user.save();
  });

  var comments = photo.comments;
  comments.forEach(function(commentId){
    db.Comment.findOne({ '_id': commentId }, function(err, comment){
      comment.remove();
    });
  });

  next();

});

module.exports = Photo;









