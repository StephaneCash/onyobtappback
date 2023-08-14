const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true,
            trim: true,
        },
        numTel: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate: [isEmail],
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minlength: 6
        },
        url: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
        },
        bio: {
            type: String,
            max: 1024
        },
        likes: {
            type: [String]
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        statusLive: {
            type: Boolean,
        },
        idLiveChannel: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;