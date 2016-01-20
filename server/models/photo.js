var mongoose = require("mongoose");
var db = require("./index.js");

var photoSchema = new mongoose.Schema({
  photoUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

var Photo = mongoose.model("Photo", photoSchema);

photoSchema.pre('remove', function(next){
  var photo = this;
  var photoId = photo._id;
  var userId = photo.user;
  db.User.findOne({ '_id': userId }, function(err, user){
    if (!user) return next();
    var index = user.photos.indexOf(photoId);
    user.photos.splice(index, 1);
    user.save();
    next();
  });
});

module.exports = Photo;