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
    const {
      title,
      content,
      status = "draft",
      category,
      tags,
      excerpt,
    } = req.body;

    if (!title.trim() || !content.trim() || !excerpt.trim() || !category) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const coverImage = req.file?.path || null;

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

    if (!parsedTags.length) {
      return res.status(400).json({
        message: "Select at least one tag",
      });
    }
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const post = await Post.create({
      title,
      content,
      category,
      tags: parsedTags,
      status,
      excerpt,
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

    const { title, content, category, excerpt, status } = req.body;

    if (title) post.title = title;

    if (content) post.content = content;

    if (category) post.category = category;

    if (excerpt) post.excerpt = excerpt;

    if (status) post.status = status;

    if (req.body.tags) {
      post.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : [req.body.tags];
    }

    if (req.file?.path) {
      post.coverImage = req.file.path;
    }

    await post.save();

    return res.json({
      message: "Post updated successfully",
      post,
    });
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
  try {
    const {
      search = "",
      category,
      sort = "latest",
      page = 1,
      limit = 9,
    } = req.query;

    const query = {
      status: "published",
    };

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          content: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    // if (tag) {
    //   query.tags = {
    //     $in: [tag],
    //   };
    // }
    if (category && category !== "All") {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "latest":
        sortOption = { createdAt: -1 };
        break;

      case "likes":
        sortOption = {
          likes: -1,
        };

      default:
        sortOption = { createdAt: -1 };
    }

    const totalPosts = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate("author", "name")
      .populate("tags")
      .populate("category", "name slug")
      .sort(sortOption)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    return res.json({
      posts,
      totalPosts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user._id,
    })
      .populate("tags")
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name")
      .populate("category", "name")
      .populate("tags", "name");
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.json(post);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deletePost = async (req, res) => {
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

    await post.deleteOne();

    return res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await findPost(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const likedIndex = post.likes.findIndex(
      (id) => id.toString() === req.user._id.toString(),
    );

    if (likedIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(likedIndex, 1);
    }

    await post.save();

    return res.json(post);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getLikes = async (req, res) => {
  try {
    const post = await findPost(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.json({
      count: post.likes.length,
      users: post.likes,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePostTags = async (req, res) => {
  try {
    const { postId } = req.params;
    const { tags } = req.body;

    const post = await findPost(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (!Array.isArray(tags)) {
      return res.status(400).json({
        message: "Tags must be an array",
      });
    }

    post.tags = tags;

    await post.save();

    return res.json({
      message: "Tags updated successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleSavePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadySaved = user.savedPosts.findIndex(
      (id) => id.toString() === postId,
    );

    if (alreadySaved === -1) {
      user.savedPosts.push(postId);

      await user.save();

      return res.json({
        message: "Post saved successfully",
      });
    }

    user.savedPosts.splice(alreadySaved, 1);

    await user.save();

    return res.json({
      message: "Post removed from saved posts",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedPosts",
      populate: [
        {
          path: "author",
          select: "name",
        },
        {
          path: "tags",
          select: "name",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user.savedPosts);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
