let multer = require('multer');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('destination', file);
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    console.log('filename', file);
    cb(null, Date.now() + '_' + file.originalname)
  }
});

let uploadHelper = multer({storage: storage});

module.exports = uploadHelper;