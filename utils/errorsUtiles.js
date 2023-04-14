module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' };

    if (err.message.includes('pseudo')) {
        errors.pseudo = "Pseudo incorrect ou déjà pris";
    } else {
        errors.pseudo = "";
    }

    if (err.message.includes('email')) {
        errors.email = "Email incorrect"
    } else {
        errors.email = ""
    }

    if (err.message.includes('password')) {
        errors.password = "Le mot de passe doit faire minimum 6 caractères";
    } else {
        errors.password = "";
    }

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
        errors.pseudo = "Ce pseudo est déjà pris";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = "Cet email est déjà pris";

    return errors;
}

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: '' };

    if (err.message.includes('email'))
        errors.email = 'Email inconnu';

    if (err.message.includes('password'))
        errors.password = 'Le mot de passe est incorrect';

    return err.message;
}

module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxSize: '' };

    if (err.message.includes('invalid file')) {
        errors.format = "Format non pris en charge";
    }

    if (err.message.includes('max size')) {
        errors.maxSize = "Fichier trop volumineux, taille limite est de 1Mo";
    }

    return errors;
}