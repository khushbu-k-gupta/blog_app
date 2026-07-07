import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

const findComment = (id) => Comment.findById(id);

const isCommentOwner = (comment, user) => {
  return comment.author.toString() === user._id.toString();
};

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: post._id,
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const editComment = async (req, res) => {
  try {
    const comment = await findComment(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (!isCommentOwner(comment, req.user)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (req.body.content) {
      comment.content = req.body.content;
    }

    await comment.save();

    return res.json(comment);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await findComment(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (!isCommentOwner(comment, req.user)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await comment.deleteOne();

    return res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comments = await Comment.find({
      post: post._id,
      status: "approved",
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
