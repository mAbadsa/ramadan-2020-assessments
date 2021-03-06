const VideoRequestData = require("../data/video-requests.data");

const getVideos = async (req, res, next) => {
  const { sortBy, searchTerm, filterBy } = req.query;
  let data;
  if (searchTerm) {
    data = await VideoRequestData.searchRequests(searchTerm, filterBy);
  } else {
    data = await VideoRequestData.getAllVideoRequests(filterBy);
  }

  if (sortBy === "topVotedFirst") {
    data = data.sort((prev, next) => {
      if (
        prev.votes.ups.length - prev.votes.downs.length >
        next.votes.ups.length - next.votes.downs.length
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
  const { id, status, resVideo } = req.body;
  const response = await VideoRequestData.updateRequest(id, status, resVideo);
  res.send(response);
  next();
};

const deleteVideo = async (req, res, next) => {
  const response = await VideoRequestData.deleteRequest(req.body.id);
  res.send(response);
  next();
};

const updateVote = async (req, res, next) => {
  const { id, votes_type, user_id } = req.body;
  const response = await VideoRequestData.updateVoteForRequest(
    id,
    votes_type,
    user_id
  );
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
