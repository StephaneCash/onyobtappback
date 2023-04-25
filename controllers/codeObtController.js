const codeObtModel = require('../models/codeObtModel');
const codeObtCopieModel = require("../models/codeObtCopieModel");
const ObjectID = require('mongoose').Types.ObjectId;

const create = async (req, res) => {
    try {
        const montant = req.body.montant;

        if (montant === "") {
            return res.status(400).json('Veuillez fournir un montant svp');
        } else {

            let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let codeLength = 16;
            let password = "";

            for (let i = 0; i <= codeLength; i++) {
                let randomNumber = Math.floor(Math.random() * chars.length);
                password += chars.substring(randomNumber, randomNumber + 1);
            }

            let tab = password.split('');
            tab[4] = '-';
            tab[9] = '-';
            tab[14] = '-';

            let codeGenere = tab.join().replace(/[,]/g, '');

            let dataGenerate = {};
            dataGenerate.montant = montant;
            dataGenerate.statut = 0;

            if (montant) {
                dataGenerate.content = montant + '.' + codeGenere;
            }

            let data = await codeObtModel.create(dataGenerate);
            await codeObtCopieModel.create(dataGenerate);

            res.status(201).json(data);

        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getAllCodes = async (req, res) => {
    try {
        let data = await codeObtModel.find();
        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getAllCodesCopies = async (req, res) => {
    try {
        let data = await codeObtCopieModel.find();
        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateCode = async (req, res) => {
    let montant = req.body.montant;
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let codeLength = 16;
    let password = "";

    for (let i = 0; i <= codeLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }

    let tab = password.split('');
    tab[4] = '-';
    tab[9] = '-';
    tab[14] = '-';

    let codeGenere = tab.join().replace(/[,]/g, '');

    let dataGenerate = {};
    dataGenerate.montant = montant;
    dataGenerate.statut = 0;

    if (montant) {
        dataGenerate.content = montant + '.' + codeGenere;
    }
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await codeObtModel.findByIdAndUpdate(
                { _id: req.params.id },
                dataGenerate,
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
};

const deleteCodeObt = async (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + id)
    } else {
        try {
            let data = await codeObtModel.findByIdAndDelete({ _id: id });
            console.log(data, " RETOUR")
            if (data)
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            else
                res.status(404).json({ message: "Aucun contenu trouvé avec " + id })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}

const deleManyCode = async (req, res) => {
    try {
        await codeObtModel.deleteMany();
        res.status(200).json({ message: 'Suppression effectuée avec succès' });
    } catch (err) {
        return res.status(500).json({ message: err })
    }
}

module.exports = {
    create,
    getAllCodesCopies,
    getAllCodes,
    deleteCodeObt,
    updateCode,
    deleManyCode
}