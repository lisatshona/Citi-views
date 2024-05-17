const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token); // Debugging line
    res.status(201).json({ message: `${username} registered successfully`, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find user by username
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token); // Debugging line
    res.status(200).json({ message: + username + 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Comment on a post
exports.comment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    post.comments.push({ user: user._id, text });
    await post.save();
    res.status(200).json({ message: 'Comment added successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like a post
exports.like = async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (!post.likes.includes(req.user.id)) {
        post.likes.push(req.user.id);
        await post.save();
        res.status(200).json({ message: 'Post liked successfully', post });
      } else {
        res.status(400).json({ message: 'Post already liked' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
// Dislike a post
exports.dislike = async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (!post.dislikes.includes(req.user.id)) {
        post.dislikes.push(req.user.id);
        await post.save();
        res.status(200).json({ message: 'Post disliked successfully', post });
      } else {
        res.status(400).json({ message: 'Post already disliked' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  