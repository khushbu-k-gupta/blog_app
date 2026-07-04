import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Tag from "../models/Tag.js";

export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne(); 
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blocked = !user.blocked;
    await user.save();

    res.json({
      message: user.blocked ? "User blocked" : "User unblocked",
      blocked: user.blocked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

export const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();
    res.json({ message: `User role updated to ${user.role}`, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user role" });
  }
};

export const promoteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.role = "admin";
  await user.save();
  res.json({ message: "User promoted to admin" });
};

export const getAllPosts = async (req, res) => {
  const posts = await Post.find().populate("author", "name").sort("-createdAt");
  res.json(posts);
};

export const editAnyPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  const { title, content, tags } = req.body;
  post.title = title || post.title;
  post.content = content || post.content;
  post.tags = tags || post.tags;
  await post.save();
  res.json(post);
};

export const deleteAnyPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await Post.deleteOne({ _id: req.params.id });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const moderateReportedPosts = async (req, res) => {
  const posts = await Post.find({ reported: true }).populate("author", "name");
  res.json(posts);
};

export const deleteInappropriateComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  await comment.remove();
  res.json({ message: "Comment deleted" });
};

export const moderateFlaggedComments = async (req, res) => {
  const comments = await Comment.find({ reported: true }).populate(
    "author",
    "name"
  );
  res.json(comments);
};

export const createTag = async (req, res) => {
  const { name } = req.body;
  const tagExists = await Tag.findOne({ name });
  if (tagExists) return res.status(400).json({ message: "Tag already exists" });
  const tag = await Tag.create({ name });
  res.status(201).json(tag);
};

export const editTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    tag.name = req.body.name || tag.name;
    await tag.save();
    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update tag" });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    await Tag.deleteOne({ _id: req.params.id }); 
    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete tag" });
  }
};

export const getTags = async (req, res) => {
  const tags = await Tag.find();
  res.json(tags);
};


export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments(); 

    const totalLikes = await Post.aggregate([
      { $project: { likesCount: { $size: "$likes" } } },
      { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } },
    ]);

    res.json({
      totalUsers,
      totalPosts,
      totalComments, 
      totalLikes: totalLikes[0] ? totalLikes[0].totalLikes : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

export const getAllComments = async (req, res) => {
  try {
    let comments;

    if (req.user.role === "admin") {
      comments = await Comment.find()
        .populate("author", "name email")
        .populate("post", "title");
    } else {
      comments = await Comment.find({ author: req.user._id }).populate(
        "post",
        "title"
      );
    }

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const updateCommentStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.status = status;
    await comment.save();

    res.json({ message: `Comment ${status}`, comment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update comment status" });
  }
};
