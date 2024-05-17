const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
require('dotenv').config(); // Ensure dotenv is configured to load env variables
const Post = require('../models/Post');
const express = require('express');
const { route } = require('../routes/adminRoutes');
const router = express.Router();


// Register admin
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, email, password: hashedPassword });
    await admin.save();

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: `${username} registered successfully`, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ token });
  }
};

// Login admin
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

 // Get all posts
exports.get('/get-all', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create post
exports.createPost('/create-post', async (req, res) => {
  try {
    const { title, summary, category, content, location, startDate, endDate, image } = req.body;
    const post = new Post({ title, summary, category, content, location, startDate, endDate, image });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update post
exports.updatePost('/update-post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete post
exports.deletePost('/removePost/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Remove comment
exports.removeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    comment.remove();
    await post.save();
    res.status(200).json({ message: 'Comment removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

