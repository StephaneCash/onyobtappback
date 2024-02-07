const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const ObjectID = require('mongoose').Types.ObjectId;

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath)

const readPost = (req, res) => {
    postModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Erreur to get data : ', +err)
    }).sort({ createdAt: -1 }).populate('posterId', "pseudo url statusLive idLiveChannel");
};

const createPost = async (req, res) => {
    const { description, posterId } = req.body;
    if (req.file) {
        const nameFile = req.file.originalname;
        const pathFile = req.file.path.split('\\').join("/");
        const fileString = req.file.path.split("\\")[1];
        let arr = [];

        let type = req.file.mimetype && req.file.mimetype.split('/')[0];
        
        if (req.file.size < 100000000) {
            try {
                if (type === "video") {
                    ffmpeg({ source: `./${pathFile}` })
                        .on('filenames', (filenames) => {
                            console.log("Created file names ", filenames)
                            arr = [...filenames];
                        })
                        .on('end', () => {
                            console.log("finished process")
                        })
                        .on('error', (err) => {
                            console.log("Erreur :: ", err)
                        })
                        .takeScreenshots({
                            filename: fileString + '.png',
                            timemarks: [1, 2, 3, 4, 5]
                        }, 'images');
                }

                const newPost = await new postModel({
                    posterId: posterId,
                    title: nameFile,
                    description: description,
                    image: type === "video" ? `api/${req.file.path}` : null,
                    video: `api/${req.file.path}`,
                    likers: [],
                    comments: [],
                    type: req.body.type,
                    images: type === "video" && [...arr]
                }).populate('posterId', "pseudo url statusLive idLiveChannel");
                const post = await newPost.save();
                res.status(201).json(post);

            } catch (err) {
                return res.status(500).json({ err })
            }
        } else {
            return res.status(400).json({ message: "Votre fichier ne peut dépasser 12Mo" })
        }
    } else {
        try {
            const newPost = await new postModel({
                posterId: req.body.posterId,
                description: req.body.description,
                likers: [],
                comments: [],
            });
            const post = await newPost.save();
            return res.status(201).json(post)
        } catch (err) {
            return res.status(500).json({ err })
        }
    }
}

const updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        const updatePosted = {
            message: req.body.message,
            image: req.body.image
        }
        postModel.findByIdAndUpdate(
            req.params.id,
            { $set: updatePosted },
            { new: true },
        ).populate('posterId', "pseudo url statusLive idLiveChannel")
            .then((docs) => { return res.status(200).send(docs) })
            .catch((err) => { return res.status(500).send({ message: err }) })
    }
}

const deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        postModel.findByIdAndRemove(req.params.id,)
            .then((docs) => {
                return res.status(200).send(docs)
            })
            .catch((err) => { return res.status(500).send({ message: err }) })
    }
}

const likePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            postModel.findByIdAndUpdate(req.params.id,
                { $addToSet: { likers: req.body.id } },
                { new: true }
            ).populate('posterId', "pseudo url statusLive idLiveChannel")
                .then((docs) => { res.status(200).send(docs) })
                .catch((err) => { return res.status(500).send({ message: err }) })

            userModel.findByIdAndUpdate(req.body.id,
                { $addToSet: { likes: req.params.id } },
                { new: true }
            )
        } catch (err) {
            return res.status(400).send({ message: err })
        }
    }
}

const unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            postModel.findByIdAndUpdate(req.params.id,
                { $pull: { likers: req.body.id } },
                { new: true }
            ).populate('posterId', "pseudo url statusLive idLiveChannel")
                .then((docs) => { res.status(200).send(docs) })
                .catch((err) => { return res.status(400).send({ message: err }) })

            userModel.findByIdAndUpdate(req.body.id,
                { $pull: { likes: req.params.id } },
                { new: true }
            )
        } catch (err) {
            return res.status(400).send({ message: err })
        }
    }
}

const commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            return postModel.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        comments: {
                            commenterId: req.body.commenterId,
                            commenterPseudo: req.body.commenterPseudo,
                            text: req.body.text,
                            timestamp: new Date().getTime()
                        }
                    }
                },
                { new: true }
            ).populate('posterId', "pseudo url statusLive idLiveChannel")
                .then((docs) => {
                    res.status(200).send(docs)
                })
                .catch((err) => { return res.status(400).send({ message: err }) })
        } catch (err) {
            return res.status(400).send({ message: err })
        }
    }
}

const editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            return postModel.findById(
                req.params.id,
                (err, docs) => {
                    const repComment = docs.comments.find((comment) =>
                        comment._id.equals(req.body.commentId)
                    );
                    if (repComment) {
                        repComment.text = req.body.text;
                    } else {
                        return res.status(404).send('Comment not found ' + req.body.commentId);
                    }

                    return docs.save((err) => {
                        if (!err) return res.status(200).send(docs);
                        return res.status(500).send(err);
                    })
                }
            )

        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

const deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            return postModel.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: {
                        comments: {
                            _id: req.body.commentId
                        }
                    }
                },
                { new: true },
                (err, docs) => {
                    if (!err) return res.send(docs);
                    else return res.status(500).send(err);
                }
            ).populate('posterId', "pseudo url statusLive idLiveChannel");
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

const getAllPostsByUserId = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let findPostsByUserId = await postModel.find({ posterId: id });
            if (findPostsByUserId) {
                res.status(200).json(findPostsByUserId);
            } else {
                return res.status(404).json({ message: "Aucun post trouvé avec cet id", id })
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

const viewAdd = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            const data = await postModel.findByIdAndUpdate(req.params.id,
                { $addToSet: { views: req.body.id } },
                { new: true }
            ).populate('posterId', "pseudo url statusLive idLiveChannel");

            res.status(200).json(data);

            await userModel.findByIdAndUpdate(req.body.id,
                { $addToSet: { likes: req.params.id } },
                { new: true }
            )
        } catch (err) {
            return res.status(400).send({ message: err })
        }
    }
}

module.exports = {
    readPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    commentPost,
    editCommentPost,
    deleteCommentPost,
    getAllPostsByUserId,
    viewAdd
}