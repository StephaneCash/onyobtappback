const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const compteModel = require('../models/compteModel');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge })
}

const signUp = async (req, res) => {

    let chars = "0123456789";
    let codeLength = 10;
    let codeSplit = "";

    for (let i = 0; i <= codeLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        codeSplit += chars.substring(randomNumber, randomNumber + 1);
    }

    let tab = codeSplit.split('');

    tab[7] = '-';

    let codeGenere = tab.join().replace(/[,]/g, '');
    const num = "ON" + codeGenere;

    const { pseudo, email, password } = req.body;

    if (password) {
        try {
            let salt = await bcrypt.genSalt();
            let passwordHash = await bcrypt.hash(password, salt);

            const user = await userModel.create({ pseudo, email, password: passwordHash });
            if (user) {
                compteModel.create({
                    userId: user._id,
                    numero: num,
                    isActive: false,
                    solde: 0
                })
                    .then(async () => {
                        await passUserTransacModel.create({ idUser: user._id, password: passHash, isChange: false });
                        res.status(201).json({ message: "User créé avec succès" });
                    })
                    .catch(error => {
                        return res.status(500).json(error)
                    })
                res.status(201).json({ message: 'User créé avec succès' });
            }
        }
        catch (err) {
            if (err && err.code === 11000 && err.keyValue.pseudo) {
                return res.status(400).json({ message: "Ce pseudo est déjà pris" });
            } else if (err && err.code === 11000 && err.keyValue.email) {
                return res.status(400).json({ message: "Cette adresse email est déjà prise" });
            } else {
                return res.status(500).json(err)
            }
        }
    } else {
        return res.status(400).json({ message: "Veuillez entrer un mot de passe" })
    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (password) {
            userModel.findOne({ email: email })
                .then(async resp => {
                    if (resp) {
                        bcrypt.compare(password, resp.password)
                            .then(isValid => {
                                if (!isValid) {
                                    res.status(401).json({ message: "Le mot de passe est incorrect" });
                                } else {
                                    const token = createToken(resp._id);
                                    if (token) {
                                        res.status(200).send({ "message ": 'Utilisateur connecté avec succès', user: resp._id, token, pseudo: resp.pseudo })
                                    };
                                }
                            })
                            .catch(err => {
                                return res.status(500).json({ err })
                            })
                    } else {
                        return res.status(400).json({ message: "L'utilisateur n'existe pas", })
                    }
                })
                .catch(err => {
                    return res.status(500).json({ err })
                })
        } else {
            return res.status(400).json({ message: "Veuillez entrer votre mot passe" })
        }
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const uploadImage = (req, res) => {

};

module.exports = {
    signUp,
    signIn,
}    