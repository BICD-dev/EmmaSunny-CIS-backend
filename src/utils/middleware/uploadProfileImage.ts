import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../../uploads/profile-images");

    // Create directory if it does not exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const unique = Date.now();
    cb(null, `IMG_${unique}${path.extname(file.originalname)}`);
  }
});

export const uploadProfileImage = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpe?g|png)$/)) {
      return cb(new Error("Only JPG/PNG images allowed"));
    }
    cb(null, true);
  }
});
