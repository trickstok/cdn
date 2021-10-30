import sharp from "sharp";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { ProcessImageOptions } from "../Interfaces/ProcessImage";
import config from "config";

const path = config.get("storage.path");
const folderName = config.get("storage.folderName");

function processImage(
  imgPath: string,
  newPath: string,
  options?: ProcessImageOptions
) {
  if (options) {
    return sharp(imgPath)
      .resize({
        height: options?.height,
        width: options?.width,
      })
      .jpeg({
        quality: options?.quality,
      })
      .toFile(newPath);
  }
  return sharp(imgPath).toFile(newPath);
}

async function uploadProcessedImage(
  tempPath: string,
  options?: ProcessImageOptions,
  name?: string
) {
  const imgName = name || uuidv4();

  const uploadPath = `${path}/${folderName}/${imgName}`;
  const url = `${folderName}/${imgName}`;

  await processImage(tempPath, uploadPath, options);

  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }

  return {
    url: url,
    imageName: imgName,
  };
}

async function deleteImage(imgName: string) {
  const filePath = `${path}/${folderName}/${imgName}`;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  throw new Error(`Image "${imgName}" not found`);
}

function getAllImages(): string[] {
  const filesFolder = `${path}/${folderName}/`;
  let images: string[] = [];

  fs.readdirSync(filesFolder).forEach((file) => {
    images.push(file);
  });

  return images;
}

export { uploadProcessedImage, deleteImage, getAllImages };
