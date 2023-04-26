const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const fs = require("fs");
const path = require("path");

module.exports.getAllPosts = async (req, res) => {
  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(200).json({
        success: true,
        message: "You have been logged out, please login to continue!",
      });
    }
    const allPosts = await Post.find({})
      .sort("-createdAt")
      .populate("user", "_id username firstName lastName");
    return res.status(200).json({
      success: true,
      data: allPosts,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(200).json({
        success: true,
        message: "You have been logged out, please login to continue!",
      });
    }
    await Post.create({
      image: req.body.image,
      user: userId,
    });
    return res.status(200).json({
      success: true,
      message: "Post created successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(200).json({
        success: true,
        message: "You have been logged out, please login to continue!",
      });
    }
    const post = await Post.findById(req.query.postId);
    if (!post) {
      return res.status(200).json({
        success: false,
        message: "Post does not exist!",
      });
    }
    if (post.user != userId) {
      return res.status(200).json({
        success: true,
        message: "You are not authorized to delete this post!",
      });
    }
    fs.unlinkSync(
      path.join(__dirname, `../../client/public/uploads/${post.image}`)
    );
    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(post._id);
    return res.status(200).json({
      success: true,
      message: "Post and corresponding comments deleted successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
