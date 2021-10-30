import config from "config";
import express, { Router } from "express";
import HttpStatusCode from "../Enums/HttpStatusCodes";
import checkAuthenticated from "../Helpers/middlewares/checkAuthenticated";
import uploadImage from "../Helpers/middlewares/uploadImage";
import { throwError } from "../Helpers/utilities/error";
import { deleteImage } from "../Services/imageService";

const router: Router = express.Router();

router.get("/", checkAuthenticated, async (req, res) => {
  res.json({
    message: `Hello Image CDN`,
  });
});

router.post(
  "/upload",
  checkAuthenticated,
  uploadImage.single("image"),
  async (req, res, next) => {
    if (req.file) {
      const folderName = config.get("storage.folderName");
      const imageName = req.file?.filename;
      const staticPath = `${folderName}/${imageName}`;
      const fullUrl = req.protocol + "://" + req.get("host") + "/" + staticPath;

      return res.json({
        filename: req.file?.filename,
        path: staticPath,
        url: fullUrl,
      });
    }
    next(throwError("Image not selected", HttpStatusCode.NOT_FOUND));
  }
);

router.post("/delete", checkAuthenticated, async (req, res, next) => {
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
