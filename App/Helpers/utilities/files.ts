import fs from "fs";
import path from "path";

function cleanEmptyFoldersRecursively(folder: string) {
  const isDir = fs.statSync(folder).isDirectory();

  if (!isDir) {
    return;
  }

  let files = fs.readdirSync(folder);

  if (files.length > 0) {
    files.forEach(function (file) {
      const fullPath = path.join(folder, file);
      cleanEmptyFoldersRecursively(fullPath);
    });
    files = fs.readdirSync(folder);
  }

  if (files.length == 0) {
    console.log("removing: ", folder);
    fs.rmdirSync(folder);
    return;
  }
}

export { cleanEmptyFoldersRecursively };
