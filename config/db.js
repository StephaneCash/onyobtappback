const mongoose = require("mongoose");

mongoose
    .connect(
        `mongodb+srv://Stephane_Cash:${process.env.PASSWORD}@cluster0.hqeafnf.mongodb.net/onyobt`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log('Connexion successful à la DB')
    }).catch(err => {
        console.log('Connexion impossible à la DB', err)
    })