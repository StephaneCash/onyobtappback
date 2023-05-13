const path = require('path')
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

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
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /mp4|mkv|avi/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        console.log(ffmpeg)
        ffmpeg({ source: file.originalname })
            .on('filenames', (filenames) => {
                console.log('created files', filenames)
            })
            .on('end', () => {
                console.log("Finish prossess")
            })
            .on("error", (err) => {
                console.log("Erreurs", err)
            })
            .takeScreenshots({
                filename: "image.jpg",
                timemarks: [1]
            }, 'uploads')

        if (mimeType && extname) {
            return cb(null, true)
        }
        return cb(new Error("Veuillez fournir un bon format de fichiers à télécharger"), false);
    }
}).single('file');

module.exports = upload