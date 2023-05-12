const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true
        },
        descriprion: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        image: {
            type: String,
        },
        video: {
            type: String,
        },
        likers: {
            type: [String],
            required: true
        },
        comments: {
            type: [
                {
                    commenterId: String,
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