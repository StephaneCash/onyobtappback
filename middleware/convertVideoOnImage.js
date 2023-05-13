const ffmpeg = require('fluent-ffmpeg');

ffmpeg({ source: './uploads/video.mp4' })
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
        timemarks: [1, 2]
    }, 'images')