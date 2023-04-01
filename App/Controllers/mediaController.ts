import config from "config";
import express, { Router } from "express";
import path from "path";
import HttpStatusCode from "../Enums/HttpStatusCodes";
import uploadFile from "../Helpers/middlewares/uploadFile";
import { throwError } from "../Helpers/utilities/error";
import logger from "../Helpers/utilities/logger";
import {
  deleteMedia,
  downloadMedia,
  getAllMedia,
} from "../Services/mediaService";

const router: Router = express.Router();

router.get("/:media", async (req, res) => {
  const media = req.params['media']
  const localPath = `public/media/${media}`
  if (fs.existsSync(localPath)) {
    // res.setHeader("content-type", "")
    fs.createReadStream(localPath).pipe(res); 
  } else {
    next(throwError(error.message, HttpStatusCode.NOT_FOUND));
  }
})

router.get("/get/all", async (req, res) => {
  const media = getAllMedia();
  res.json({
    count: media?.length,
    media: media,
  });
});

router.post("/upload", uploadFile.single("media"), async (req, res, next) => {
  const albumFolder = req.body.folder ? req.body.folder : "";
  if (req.file) {
    const folderName = config.get<string>("storage.folderName");
    const originalFileName = req.file?.filename;
    const fileName = originalFileName.replace(/\.[^/.]+$/, "");
    const publicId = originalFileName;
    const extension = path.extname(originalFileName);
    const staticPath = path.join(folderName, albumFolder, originalFileName);
    const storagePath = config.get<string>("storage.path");
    const nestedFolder = req.body.folder ? req.body.folder : "";
    const mediaPath = path.join(storagePath, folderName);
    const albumPath = path.join(mediaPath, nestedFolder);
    const staticAlbumPath = path.join(folderName, nestedFolder);
    const savePath = path.join(albumPath, originalFileName);
    const fullUrl = `https://${config.get(
      "server.host"
    )}/${staticPath}`;

    return res.status(HttpStatusCode.CREATED).json({
      filename: fileName,
      original_filename: originalFileName,
      extension: extension,
      public_id: publicId,
      static_path: staticPath,
      full_path: savePath,
      album_path: albumPath,
      static_album_path: staticAlbumPath,
      url: fullUrl,
    });
  }
  if (req.body.url) {
    const url = req.body.url;
    const response = await downloadMedia(url, albumFolder);
    return res.status(HttpStatusCode.CREATED).json(response);
  }
  next(throwError("Media not selected", HttpStatusCode.NOT_FOUND));
});

router.post("/delete", async (req, res, next) => {
  const publicId = req.body.public_id || "";
  const albumFolder = req.body.folder || "";

  try {
    const isDeleted = await deleteMedia(publicId, albumFolder);
    let message = "Problem deleting";
    if (isDeleted) {
      message = publicId
        ? `Media with public id ${publicId} successfully deleted`
        : `Album ${albumFolder} successfully deleted`;
    }
    res.status(HttpStatusCode.OK).json({
      message: message,
    });
  } catch (error: any) {
    next(throwError(error.message, HttpStatusCode.NOT_FOUND));
  }
});

export default router;
