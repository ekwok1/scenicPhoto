var mongoose = require("mongoose");

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

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;