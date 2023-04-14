const UserModel = require('../models/userModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password')
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getOneUser = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        UserModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('ID inconnu : ' + err);
            }
        }).select('-password');
    }
};

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        console.log(req.body)
        if (req.file) {
            try {
                await UserModel.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $set: {
                            bio: req.body.bio,
                            pseudo: req.body.pseudo,
                            url: `api/${req.file.path}`
                        }
                    },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                )
                    .then((docs) => {
                        res.status(200).json(docs)
                    })
                    .catch((err) => { return res.status(500).send({ message: err }) })
            } catch (err) {
                return res.status(500).json({ message: err })
            }
        } else {
            try {
                await UserModel.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $set: {
                            bio: req.body.bio,
                            pseudo: req.body.pseudo,
                        }
                    },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                )
                    .then((docs) => {
                        res.status(200).json(docs)
                    })
                    .catch((err) => { return res.status(500).send({ message: err }) })
            } catch (err) {
                return res.status(500).json({ message: err })
            }
        }
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await UserModel.remove({ _id: req.params.id }).exec();
            res.status(200).json({ message: 'Suppression effectuée avec succès' });
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}

module.exports.followUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await UserModel.findByIdAndUpdate(
                req.params.id,
                { $addToSet: { following: req.body.idToFollow } },
                { new: true, upsert: true },
            ).then(response => {
                res.status(201).json(response)
            }).catch(error => {
                return res.status(400).json({ err: error });
            })

            await UserModel.findByIdAndUpdate(
                req.body.idToFollow,
                { $addToSet: { followers: req.params.id } },
                { new: true, upsert: true },
            ).catch(errors => {
                return res.status(400).json({ err: errors })
            })
        } catch (err) {
            return res.status(400).json({ err: err })
        }
    }
}

module.exports.unFollowUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await UserModel.findByIdAndUpdate(
                req.params.id,
                { $pull: { following: req.body.idToUnfollow } },
                { new: true, upsert: true },
            ).then(response => {
                res.status(201).json(response)
            }).catch(error => {
                return res.status(400).json({ err: error });
            })

            await UserModel.findByIdAndUpdate(
                req.body.idToUnfollow,
                { $pull: { followers: req.params.id } },
                { new: true, upsert: true },
            ).catch(errors => {
                return res.status(400).json({ err: errors })
            })
        } catch (err) {
            return res.status(400).json({ err: err })
        }
    }
}


