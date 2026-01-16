const fs = require("fs");
const path = require("path");

const deleteImage = async (pathImg) => {
  try {
    if (!pathImg) return;

    const fullPath = path.join(process.cwd(),"uploads", pathImg);

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      console.log("Image deleted:", fullPath);
    }
  } catch (err) {
    console.error("Error deleting image:", err.message);
  }
};

module.exports = deleteImage;
