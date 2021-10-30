import config from "config";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = config.get("storage.path");
    const folderName = config.get("storage.folderName");

    const uploadPath = `${path}/${folderName}`;
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = new Date().getTime();
    const extArray = file.mimetype.split("/");
    const extension = extArray[extArray.length - 1];
    const uniqueId = uuidv4();

    cb(null, `${uniqueId}_${timestamp}.${extension}`);
  },
});

const uploadImage = multer({ storage: storage });

export default uploadImage;
