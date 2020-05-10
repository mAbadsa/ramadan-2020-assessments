const VideoRequestData = require("../data/video-requests.data");

const getVideos = async (req, res, next) => {
  const { sortBy, searchTerm } = req.query;
  let data;
  if (searchTerm) {
    data = await VideoRequestData.searchRequests(searchTerm);
  } else {
    data = await VideoRequestData.getAllVideoRequests();
  }

  if (sortBy === "topVotedFirst") {
    data = data.sort((prev, next) => {
      if (
        prev.votes.ups - prev.votes.downs >
        next.votes.ups - next.votes.downs
      ) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  res.status(200).json({
    success: true,
    data: data,
    errors: [],
  });
  next();
};

const createVideo = async (req, res, next) => {
  const response = await VideoRequestData.createRequest(req.body);
  res.send(response);
  next();
};

const updateVideo = async (req, res, next) => {
  const response = await VideoRequestData.updateRequest(req.body.id, req.body);
  res.send(response);
  next();
};

const deleteVideo = async (req, res, next) => {
  const response = await VideoRequestData.deleteRequest(req.body.id);
  res.send(response);
  next();
};

const updateVote = async (req, res, next) => {
  const { id, vote_type } = req.body;
  const response = await VideoRequestData.updateVoteForRequest(id, vote_type);
  res.send(response);
  next();
};

module.exports = {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  updateVote,
};
