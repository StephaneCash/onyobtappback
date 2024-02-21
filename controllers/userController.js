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
        if (req.file) {
            try {
                await UserModel.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $set: {
                            bio: req.body.bio,
                            pseudo: req.body.pseudo,
                            url: `api/${req.file.path}`,
                            statusLive: req.body.statusLive,
                            idLiveChannel: req.body.idLiveChannel,
                            callVoice: req.body.callVoice
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
                            statusLive: req.body.statusLive,
                            idLiveChannel: req.body.idLiveChannel,
                            callVoice: req.body.callVoice
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

module.exports.addContact = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            return UserModel.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        numsRep: {
                            contactId: req.body.contactId,
                            contactNom: req.body.contactNom,
                            contactEmail: req.body.contactEmail,
                            url: req.body.url,
                            num: req.body.num,
                        }
                    }
                },
                { new: true }
            )
                .then(async (docs) => {
                    const sortNumsRep = docs && docs.numsRep;
                    const size = sortNumsRep && sortNumsRep.length;
                    res.status(200).json(sortNumsRep[size - 1])
                })
                .catch((err) => { return res.status(400).send({ message: err }) })
        } catch (err) {
            return res.status(400).send({ message: err })
        }
    }
}

module.exports.editContact = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            return UserModel.findById(
                req.params.id,
                (err, docs) => {
                    const rep = docs.numsRep.find((num) =>
                        num._id.equals(req.body.numRepId)
                    );
                    if (rep) {
                        rep.contactNom = req.body.contactNom;
                        rep.contactEmail = req.body.contactEmail;
                        rep.num = req.body.num;
                        rep.username = req.body.username;
                    } else {
                        return res.status(404).send('Contact not found ' + req.body.numRepId);
                    }

                    return docs.save((err) => {
                        const data = docs && docs.numsRep && docs.numsRep.filter(val => {
                            if (val._id.toString() === req.body.numRepId) {
                                return val
                            }
                        })
                        if (!err) return res.status(200).send(data);
                        return res.status(500).send(err);
                    })
                }
            )
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

module.exports.deleteContact = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            return UserModel.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: {
                        numsRep: {
                            _id: req.body.numRepId
                        }
                    }
                },
                { new: true },
                (err, docs) => {
                    if (!err) return res.send(docs);
                    else return res.status(500).send(err);
                }
            )
        } catch (error) {
            return res.status(400).send(error);
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
                console.log(response)
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

module.exports.addUserLive = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            return UserModel.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        liveUser: {
                            idUser: req.body.idUser,
                            liveUserNom: req.body.liveUserNom,
                            username: req.body.username,
                            url: req.body.url,
                        }
                    }
                },
                { new: true }
            )
                .then(async (docs) => {
                    const livesUsers = docs && docs.liveUser;
                    const size = livesUsers && livesUsers.length;
                    res.status(200).json(docs)
                })
                .catch((err) => { return res.status(400).send({ message: err }) })
        } catch (err) {
            return res.status(400).send({ message: err })
        }
    }
}

module.exports.addFavoris = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            UserModel.findByIdAndUpdate(req.params.id,
                { $addToSet: { favoris: req.body.id } },
                { new: true }
            ).then((docs) => { res.status(200).send(docs) })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            console.log(err)
            return res.status(400).send({ message: err })
        }
    }
}

module.exports.removeFavoris = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            UserModel.findByIdAndUpdate(req.params.id,
                { $pull: { favoris: req.body.id } },
                { new: true }
            ).then((docs) => {
                res.status(200).json(docs)
            })
                .catch((err) => { return res.status(400).send({ message: err }) })
        } catch (err) {
            console.log(err)
            return res.status(400).send({ message: err })
        }
    }
}