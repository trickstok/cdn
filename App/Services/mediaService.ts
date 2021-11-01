import sharp from "sharp";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { ProcessMediaOptions } from "../Interfaces/ProcessMedia";
import config from "config";

const path = config.get("storage.path");
const folderName = config.get("storage.folderName");

function processMedia(
  imgPath: string,
  newPath: string,
  options?: ProcessMediaOptions
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

async function uploadProcessedMedia(
  tempPath: string,
  options?: ProcessMediaOptions,
  name?: string
) {
  const publicId = name || uuidv4();

  const uploadPath = `${path}/${folderName}/${publicId}`;
  const url = `${folderName}/${publicId}`;

  await processMedia(tempPath, uploadPath, options);

  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }

  return {
    url: url,
    public_id: publicId,
  };
}

async function deleteMedia(fileName: string) {
  const filePath = `${path}/${folderName}/${fileName}`;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  throw new Error(`Media "${fileName}" not found`);
}

function getAllMedia(): string[] {
  const filesFolder = `${path}/${folderName}/`;
  let allMedia: string[] = [];

  fs.readdirSync(filesFolder).forEach((file) => {
    allMedia.push(file);
  });

  return allMedia;
}

export { uploadProcessedMedia, deleteMedia, getAllMedia };
