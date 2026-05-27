import CommentModel from "../models/Comment.js";

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      post: req.body.postId,
      user: req.userId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to create comment",
    });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const comments = await CommentModel.find({
      post: req.params.id,
    }).populate("user");

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get comments",
    });
  }
};