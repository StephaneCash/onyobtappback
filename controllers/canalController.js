const canalModel = require('../models/canalModel');
const ObjectID = require('mongoose').Types.ObjectId;

const create = async (req, res) => {
    try {
        let canal = await canalModel.create(req.body);
        res.send(canal);
    } catch (error) {
        console.log(error)
    }
};

const getAll = async (req, res) => {
    try {
        let data = await canalModel.find();
        res.send(data);
    } catch (error) {
        console.log(error)
    }
};

const addNum = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            canalModel.findByIdAndUpdate(req.params.id,
                { $addToSet: { nums: req.body.id } },
                { new: true }
            )
                .then((docs) => { res.status(200).send(docs) })
                .catch((err) => { return res.status(500).send({ message: err }) })

        } catch (err) {
            return res.status(400).send({ message: err })
        }
    }
}

const removeNum = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            canalModel.findByIdAndUpdate(req.params.id,
                { $pull: { nums: req.body.id } },
                { new: true }
            )
                .then((docs) => { res.status(200).send(docs) })
                .catch((err) => { return res.status(400).send({ message: err }) })

        } catch (err) {
            return res.status(400).send({ message: err })
        }
    }
};

const deleteCanal = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send('ID inconnu : ' + req.params.id)
        } else {
            try {
                await canalModel.remove({ _id: req.params.id }).exec();
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } catch (err) {
                return res.status(500).json({ message: err })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    create,
    getAll,
    addNum,
    removeNum,
    deleteCanal
}