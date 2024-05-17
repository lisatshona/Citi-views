// postController.js

const Post = require('../models/Post'); // Assuming you have a Post model

const likePost = async (req, res) => {
    try {
        const postId = req.params.id;

        // Find post by id and update likes
        const post = await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post liked successfully", likes: post.likes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const dislikePost = async (req, res) => {
    try {
        const postId = req.params.id;

        // Find post by id and update dislikes
        const post = await Post.findByIdAndUpdate(postId, { $inc: { dislikes: 1 } }, { new: true });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post disliked successfully", dislikes: post.dislikes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { userId, comment } = req.body;

        // Find post by id and add comment
        const post = await Post.findByIdAndUpdate(postId, { $push: { comments: { userId, comment } } }, { new: true });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Comment added successfully", comments: post.comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    likePost,
    dislikePost,
    commentOnPost
};
