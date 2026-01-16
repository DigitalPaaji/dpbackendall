const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); 
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName =
      Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext;

    cb(null, uniqueName);
  },
});

module.exports = multer({ storage });
