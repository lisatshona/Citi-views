
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const Post = require('../models/Post');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const config = require('../config/db');

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.get('/get-all', authenticateToken, isAdmin, adminController.getPosts);
router.post('/create-post', authenticateToken, isAdmin, adminController.createPost);
router.put('/update-posts/:postId', authenticateToken, isAdmin, adminController.updatePost);
router.delete('/delete-post', authenticateToken, isAdmin, adminController.deletePost);
router.delete('/posts/:postId/comments/:commentId', authenticateToken, isAdmin, adminController.removeComment);


module.exports = router;
