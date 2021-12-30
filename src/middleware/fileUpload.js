const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png']
const multer = require('multer')
const path = require('path')

const uploadImage = () => {
    return multer({
        limits: {
            fileSize: 1000000,
        },
        fileFilter(req, file, callback) {
            const fileExtension = path.extname(file.originalname)
            if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
                return callback(new Error('Please upload an image document.'))
            }
            callback(null, true)
        },
    })
}

module.exports = {
    uploadImage,
}
