const mongoose = require('mongoose');

const sousCommentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        commentaireId: {
            type: String,
            required: true
        },
        text: {
            type: String,
            trim: true,
            required: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('sousComment', sousCommentSchema);