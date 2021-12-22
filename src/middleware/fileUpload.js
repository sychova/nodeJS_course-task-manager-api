const multer = require("multer");
const path = require("path");

const uploadImage = () => {
  return multer({
    limits: {
      fileSize: 1000000,
    },
    fileFilter(req, file, callback) {
      const allowedExtensions = [".jpg", ".jpeg", ".png"];
      const fileExtension = path.extname(file.originalname);
      if (!allowedExtensions.includes(fileExtension)) {
        return callback(new Error("Please upload an image document."));
      }
      callback(null, true);
    },
  });
};

module.exports = {
  uploadImage,
};
