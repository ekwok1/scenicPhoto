var mongoose = require("mongoose");
var db = require("./index.js");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    type: String,
    default: ""
  },
  photos:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo"
  }],
  likedPhotos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo"
  }],
  favoritePhotos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo"
  }],
  favoritePhotosPop: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo"
  }],
  pendingFollowing: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  pendingFollowRequest: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  pendingFollowRequestPop: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

});

userSchema.pre('save', function(next) {

  var user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.pre('remove', function(next){
  var user = this;
  var photos = user.photos;
  // in postman
  photos.forEach(function(photoId){
    db.Photo.findOne({ '_id': photoId }, function(err, photo){
      photo.remove();
    });
  });
  // in app
  // photos.forEach(function(photo){
  //   db.Photo.findOne({ '_id': photo._id }, function(err, photo){
  //     photo.remove();
  //   });
  // });
  next();
});

userSchema.statics.authenticate = function (formData, callback) {
  this.findOne({
    username: formData.username
  },
  function (err, user) {
    if (user === null){
      callback("Invalid username or password",null);
    }
    else {
      user.checkPassword(formData.password, callback);
    }
  });
};

userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
};

var User = mongoose.model("User", userSchema);

module.exports = User;
