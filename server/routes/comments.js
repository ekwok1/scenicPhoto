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