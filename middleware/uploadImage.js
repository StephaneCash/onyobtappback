const path = require('path')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
        console.log(file)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /png|jpeg|jpg|gif|PNG|JPG|JPEG/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimeType && extname) {
            return cb(null, true)
        }
        return cb(new Error("Veuillez fournir un bon format de fichiers à télécharger"), false);
    }
}).single('image');

module.exports = upload