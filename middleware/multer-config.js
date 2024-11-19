const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//Définir où on enregistre les images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
     //Remove the spaces from the original file and replace them with _
    const name = file.originalname.split(' ').join('_');
    //browsers use the MIME type to determine how they will process or display the document
    const extension = MIME_TYPES[file.mimetype];
    //Using Date.now() and extension makes the filename unique
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage}).single("image");