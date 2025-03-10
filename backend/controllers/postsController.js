// const mongoose = require('mongoose');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const { cloudinary } = require('../utils/cloudinary');

exports.userPosts = async (req, res) => {
    // populate the user::: Get their first name, store in a variable
    // and pass variable to the save method
    const { email } = req.user;

    const { _id } = await User.findOne({ email });
    const { post, fileURL } = req.body;

    let imageUrl; let publicId; let
signature;
    if (fileURL) {
        await cloudinary.uploader.upload(fileURL, { upload_preset: 'user_posts' })
            .then((response) => {
                imageUrl = response.url;
                publicId = response.public_id;
                signature = response.signature;
            })
            .catch((error) => res.status(500).json({ error }));
    }

    const userPost = new Post({
            author: _id,
            post,
            image: {
                url: imageUrl,
                publicId,
                signature
            },
        });

    // save post on the database
    await userPost.save()
        .then(() => res.status(200).json({ success: true, message: 'Successfully posted' }))
        .catch((err) => res.status(500).json({ success: false, message: err.message }));
};

exports.incrimementLikes = async (req, res) => {
    const { _id } = await User.findOne({ email: req.user.email });

    // check if the user id already exist in array if it does, return...
    // otherwise, proceed.
    const hasStarred = await Post.findById(req.params.id);
    if (hasStarred.stars.includes(_id)) {
        res.status(200).json({ message: 'You have already starred the post.' });
        return;
    }
    await Post.findByIdAndUpdate(req.params.id, { $push: { stars: [_id] } })
        .then(() => res.status(200).json({ message: 'You have starred this post.' }))
        .catch((error) => res.status(500).json({ message: 'There was a problem.', error: error.message }));
};

exports.getSpecificUserPost = async (req, res) => {
    const { email } = req.user;

    // get all the posts from the database
    await Post
        .find({ email })
        .sort({ createdAt: -1 })
        .then((posts) => {
            if (!posts) {
                res.status(200).json({ message: 'Posts not found.' });
            }
             res.status(200).json({ posts });
        })
        .catch((err) => res.status(500).json({ error: err, message: 'There was an error getting posts.' }));
};

exports.getUserPost = async (req, res) => {
    await Post
        .find()
        .sort({ createdAt: -1 })
        .populate('author', 'name company _id isVerified occupation avatar')
        .then((posts) => {
            if (!posts) res.status(200).json({ message: 'No posts found yet. Be the first to post!' });
            res.status(200).json({ success: true, posts });
        })
        .catch((error) => res.status(500).json({ message: 'Error getting the posts for now.', error }));
};

exports.getAllUserPosts = async (req, res) => {
    const { email } = req.user;
    const { _id } = await User.findOne({ email });

    await Post.find({ author: _id })
        .populate('author', 'name company school occupation avatar')
        .then((posts) => {
            if (!posts) return res.status(404).json('No posts yet. You posts will apppear here.');
            return res.json({ posts });
        })
        .catch((error) => res.json({ message: 'Error getting the posts.', error }));
};
