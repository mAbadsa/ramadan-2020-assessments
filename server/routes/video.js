const express = require("express");
const multer = require("multer");
const upload = multer();

const router = express.Router();
const {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  updateVote,
} = require("../controllers/video");

router
  .route("/")
  .get((req, res) =>
    res.send(
      "Welcome to semicolon academy APIs, use /video-request to get data"
    )
  );

router
  .route("/video-request")
  .get(getVideos)
  .post(upload.none(), createVideo)
  .put(updateVideo)
  .delete(deleteVideo);

router.route("/video-request/vote").put(updateVote);

module.exports = router;
