const VideoRequest = require("../models/video-requests.model");
const User = require("../models/user.model");

module.exports = {
  createRequest: async (vidRequestData) => {
    const userId = vidRequestData.author_id;

    if (userId) {
      const userObj = await User.findOne({ _id: userId });
      vidRequestData.author_name = userObj.author_name;
      vidRequestData.author_email = userObj.author_email;
    }

    let newRequest = new VideoRequest(vidRequestData);
    return newRequest.save();
    // let newRequest = await VideoRequest.create(vidRequestData);
    // try {
    //   res.status(200).json({
    //     success: true,
    //     data: newRequest,
    //     errors: [],
    //   });
    // } catch (error) {
    //   console.log(err);
    // }
  },

  getAllVideoRequests: (top) => {
    return VideoRequest.find({}).sort({ submit_date: "-1" }).limit(top);
  },

  searchRequests: (topic) => {
    return VideoRequest.find({
      topic_title: { $regex: topic, $options: "i" },
    }).sort({ addedAt: "-1" });
    // .limit(top);
  },

  getRequestById: (id) => {
    return VideoRequest.findById({ _id: id });
  },

  updateRequest: (id, newVidDetails) => {
    return VideoRequest.findByIdAndUpdate(id, newVidDetails);
  },

  updateVoteForRequest: async (id, votes_type, user_id) => {
    const oldRequest = await VideoRequest.findById({ _id: id });
    const other_type = votes_type === "ups" ? "downs" : "ups";

    const oldVoteList = oldRequest.votes[votes_type];
    const oldOtherList = oldRequest.votes[other_type];

    if (!oldVoteList.find((user) => user === user_id)) {
      oldVoteList.push(user_id);
    } else {
      oldVoteList.splice(user_id);
    }

    if (oldOtherList.find((user) => user === user_id)) {
      oldOtherList.splice(user_id);
    }

    return VideoRequest.findByIdAndUpdate(
      { _id: id },
      {
        votes: {
          [votes_type]: oldVoteList,
          [other_type]: oldOtherList,
        },
      },
      { new: true }
    );
  },

  deleteRequest: (id) => {
    return VideoRequest.deleteOne({ _id: id });
  },
};
