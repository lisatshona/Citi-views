const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const config = require('../config/db');
// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/posts/:postId/comments', authenticateToken, userController.comment);
router.post('/posts/:postId/like', authenticateToken, userController.like);
router.post('/posts/:postId/dislike', authenticateToken, userController.dislike);

module.exports = router;
