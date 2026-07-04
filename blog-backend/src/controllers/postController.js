import Post from "../models/Post.js";
import User from "../models/User.js";

const findPost = async (id) => {
  return await Post.findById(id);
};

const isAuthorized = (post, user) => {
  return (
    post.author.toString() === user._id.toString() || user.role === "admin"
  );
};

export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const coverImage = req.file?.path || null;

    const post = await Post.create({
      title,
      content,
      tags,
      coverImage,
      author: req.user._id,
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await findPost(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (!isAuthorized(post, req.user)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const { title, content, tags, status } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (status) post.status = status;

    if (req.file?.path) {
      post.coverImage = req.file.path;
    }

    await post.save();

    return res.json(post);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePostStatus = async (req, res) => {
  try {
    const post = await findPost(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (!isAuthorized(post, req.user)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    post.status = req.body.status;

    await post.save();

    return res.json({
      message: "Status updated successfully",
      status: post.status,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  const posts = await Post.find().populate("author", "name").sort("-createdAt");
  res.json(posts);
};

export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name");
  post ? res.json(post) : res.status(404).json({ message: "Post not found" });
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  )
    return res.status(403).json({ message: "Not authorized" });

  await post.deleteOne();
  res.json({ message: "Post removed" });
};

export const toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const idx = post.likes.indexOf(req.user._id);
  if (idx === -1) post.likes.push(req.user._id);
  else post.likes.splice(idx, 1);

  await post.save();
  res.json(post);
};

export const getLikes = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ count: post.likes.length, users: post.likes });
};

export const searchPosts = async (req, res) => {
  const { query, tags } = req.query;
  const filter = {};

  if (query)
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];

  if (tags?.trim()) filter.tags = { $in: tags.split(",") };

  const posts = await Post.find(filter)
    .populate("author", "name")
    .sort("-createdAt");
  res.json(posts);
};

export const updatePostTags = async (req, res) => {
  try {
    const { postId } = req.params;
    const { tags } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.tags = tags;
    await post.save();

    res.json({ message: "Tags updated successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update tags" });
  }
};

export const toggleSavePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.postId;

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.savedPosts.includes(postId)) {
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId,
      );
      await user.save();
      return res.json({ message: "Post removed from saved posts" });
    } else {
      user.savedPosts.push(postId);
      await user.save();
      return res.json({ message: "Post saved successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save post" });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedPosts");
    res.json(user.savedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch saved posts" });
  }
};
