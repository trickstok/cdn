import sharp from "sharp";
import fs from "fs";
import path from "path";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ProcessMediaOptions } from "../Interfaces/ProcessMedia";
import config from "config";

const storagePath = config.get("storage.path");
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

  const uploadPath = `${storagePath}/${folderName}/${publicId}`;
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

async function deleteMedia(public_id: string, nestedFolder: string) {
  const filePath = `${storagePath}/${folderName}${nestedFolder}/${public_id}`;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  throw new Error(`Media with public id ${public_id} not found`);
}

function getAllMedia(): string[] {
  const filesFolder = `${storagePath}/${folderName}/`;
  let allMedia: string[] = [];

  fs.readdirSync(filesFolder).forEach((file) => {
    allMedia.push(file);
  });

  return allMedia;
}

async function downloadMedia(url: string, nestedFolder: string) {
  const timestamp = new Date().getTime();
  const extension = path.extname(url);
  const uniqueId = uuidv4();
  const originalFileName = `${uniqueId}_${timestamp}${extension}`;
  const fileName = originalFileName.replace(/\.[^/.]+$/, "");
  const savePath = path.resolve(
    __dirname,
    `../../${storagePath}/${folderName}${nestedFolder}`,
    originalFileName
  );
  const staticPath = `${folderName}${nestedFolder}/${originalFileName}`;
  const publicId = originalFileName;
  const fullUrl = `${
    config.get("server.https") ? "https" : "http"
  }://${config.get("server.host")}:${config.get("server.port")}/${staticPath}`;

  if(nestedFolder) {
    if (!fs.existsSync(`${storagePath}/${folderName}${nestedFolder}`)) {
      fs.mkdirSync(`${storagePath}/${folderName}${nestedFolder}`);
    }
  }

  const writer = fs.createWriteStream(savePath);

  const response = await axios({
    url: url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  const promise = new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  return {
    filename: fileName,
    original_filename: originalFileName,
    extension: extension,
    public_id: publicId,
    path: staticPath,
    url: fullUrl,
    original_url: url,
  };
}

export { uploadProcessedMedia, deleteMedia, getAllMedia, downloadMedia };
