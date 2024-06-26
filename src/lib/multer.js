import multer from "multer";
import diskStorage from "../utils/diskStorage.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3000000,
  },
});

export default upload;
