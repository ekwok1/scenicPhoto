var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
  photoUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

var Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;