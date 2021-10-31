import config from "config";
import express, { Router } from "express";
import HttpStatusCode from "../Enums/HttpStatusCodes";
import uploadImage from "../Helpers/middlewares/uploadImage";
import { throwError } from "../Helpers/utilities/error";
import logger from "../Helpers/utilities/logger";
import { deleteImage, getAllImages } from "../Services/imageService";

const router: Router = express.Router();

router.get("/get/all", async (req, res) => {
  const images = getAllImages();
  res.json({
    count: images?.length,
    images: images,
  });
});

router.post("/upload", uploadImage.single("image"), async (req, res, next) => {
  if (req.file) {
    const folderName = config.get("storage.folderName");
    const imageName = req.file?.filename;
    const staticPath = `${folderName}/${imageName}`;
    const fullUrl = `${req.protocol}://${config.get("server.host")}:${config.get("server.port")}/${staticPath}`;

    return res.json({
      filename: req.file?.filename,
      public_id: req.file?.filename,
      path: staticPath,
      url: fullUrl,
    });
  }
  next(throwError("Image not selected", HttpStatusCode.NOT_FOUND));
});

router.post("/delete", async (req, res, next) => {
  const imageName = req.body.image;
  try {
    const isDeleted = await deleteImage(imageName);
    res.json({
      message: isDeleted && `Image "${imageName}" successfully deleted`,
    });
  } catch (error: any) {
    next(throwError(error.message, HttpStatusCode.NOT_FOUND));
  }
});

export default router;
