const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true,
            ref: "user"
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        video: {
            type: String,
        },
        type: {
            type: String,
        },
        likers: {
            type: [String],
            required: true
        },

        views: {
            type: [String],
            required: true
        },
        comments: {
            type: [
                {
                    commenterId: {
                        type: String,
                        ref: "user"
                    },
                    commenterPseudo: String,
                    text: String,
                    timestamp: Number,
                }
            ],
            required: true,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('post', PostSchema);