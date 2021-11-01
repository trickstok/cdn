import config from "config";
import express, { Router } from "express";
import path from "path";
import HttpStatusCode from "../Enums/HttpStatusCodes";
import uploadFile from "../Helpers/middlewares/uploadFile";
import { throwError } from "../Helpers/utilities/error";
import logger from "../Helpers/utilities/logger";
import { deleteMedia, getAllMedia } from "../Services/mediaService";

const router: Router = express.Router();

router.get("/get/all", async (req, res) => {
  const media = getAllMedia();
  res.json({
    count: media?.length,
    media: media,
  });
});

router.post("/upload", uploadFile.single("media"), async (req, res, next) => {
  if (req.file) {
    const folderName = config.get("storage.folderName");
    const originalFileName = req.file?.filename;
    const fileName = originalFileName.replace(/\.[^/.]+$/, "");
    const publicId = originalFileName;
    const extension = path.extname(originalFileName);
    const staticPath = `${folderName}/${originalFileName}`;
    const fullUrl = `${req.protocol}://${config.get(
      "server.host"
    )}:${config.get("server.port")}/${staticPath}`;

    return res.json({
      filename: fileName,
      original_filename: originalFileName,
      extension: extension,
      public_id: publicId,
      path: staticPath,
      url: fullUrl,
    });
  }
  next(throwError("Media not selected", HttpStatusCode.NOT_FOUND));
});

router.post("/delete", async (req, res, next) => {
  const publicId = req.body.public_id;
  try {
    const isDeleted = await deleteMedia(publicId);
    res.json({
      message: isDeleted && `Media "${publicId}" successfully deleted`,
    });
  } catch (error: any) {
    next(throwError(error.message, HttpStatusCode.NOT_FOUND));
  }
});

export default router;
