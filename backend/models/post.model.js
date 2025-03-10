const mongoose = require('mongoose');
const commentSchema = require('./comment.model');

const userPost = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        post: String,
        comments: [commentSchema],
        image: {
            url: String,
            publicId: String,
            signature: String
        },
        reports: {
            count: Number,
            users: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
        },
        stars: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User'
        },
    },
{ timestamps: true }
);

const Post = mongoose.model('Post', userPost);

module.exports = Post;
