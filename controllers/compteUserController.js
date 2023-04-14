const compteModel = require("../models/compteModel");
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getUserById = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send('ID inconnu : ' + req.params.id)
        } else {
            const userId = req.params.id;
            const findUserById = await compteModel.findOne({ userId: userId });
            if (findUserById) {
                res.status(200).json(findUserById)
            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.updateCompte = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let compteUpdate = await compteModel.findByIdAndUpdate(
                { _id: id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            if (compteUpdate) {
                res.status(200).json(compteUpdate)
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};