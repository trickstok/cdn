import config from "config";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = config.get("storage.path");
    const folderName = config.get("storage.folderName");

    const uploadPath = `${path}/${folderName}`;
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = new Date().getTime();
    const extension = path.extname(file.originalname);
    const uniqueId = uuidv4();

    cb(null, `${uniqueId}_${timestamp}${extension}`);
  },
});

const uploadImage = multer({ storage: storage });

export default uploadImage;
