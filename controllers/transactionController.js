const transactionModel = require("../models/transactionsModel");
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionModel.find();
        res.status(200).json(transactions);
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getOneTransaction = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send('ID inconnu : ' + req.params.id)
        } else {
            const userId = req.params.id;
            const findUserById = await transactionModel.findOne({ userId: userId });
            if (findUserById) {
                res.status(200).json(findUserById)
            } else {
                return res.status(404).json({ message: "Aucun compte trouvé." })
            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.createTransaction = async (req, res) => {
    try {
        let newTransaction = await transactionModel.create(req.body)
        res.status(201).json(newTransaction)
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.updateTransaction = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let compteUpdate = await transactionModel.findByIdAndUpdate(
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
