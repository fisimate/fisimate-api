import multer from "multer";
import path from "path";
import randomString from "../lib/crypto.js";

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(20) + path.extname(file.originalname));
  },
});

export default diskStorage;
