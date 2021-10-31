# images-cdn-service

Self hosted Node.js CDN for uploading and processing images for your web applications.

## example config

```
export default {
  server: {
    port: process.env.PORT || 6060,
    host: process.env.HOST || "localhost",
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:6060",
    apiKey: process.env.API_KEY || "your-custom-api-key",
  },
  storage : {
      staticFolder: process.env.STATIC_FOLDER || 'public',
      path: process.env.STORAGE_PATH || 'public',
      folderName: process.env.FOLDER_NAME || 'images',
  }
};

```

## generate api key

```
npm run generate-secret
```

## start

```
npm i
npm run dev
```

## example usage in express app

```
import fs from "fs";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";

// Temp upload middleware config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const extArray = file.mimetype.split("/");
    const extension = extArray[extArray.length - 1];

    cb(null, `${file.filename}.${extension}`);
  },
});

// Temp upload middleware
const upload = multer({ storage: storage });

// Upload Image wrapper function
async function uploadImage(tempPath) {
  const imageCdnUrl = `${process.env.IMAGES_CDN_API_URL}/image/upload`;
  const imageCdnApiKey = process.env.IMAGES_CDN_API_KEY;

  let form = new FormData();
  form.append("image", fs.createReadStream(tempPath));

  const options = {
    headers: {
      "api-key": imageCdnApiKey,
      ...form.getHeaders(),
    },
  };

  try {
    const resp = await axios.post(imageCdnUrl, form, options);
    console.log(resp.data);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    return {
      url: resp.data.url,
      public_id: resp.data.filename,
    };
  } catch (err) {
    console.error(err);
  }
}

// Delete Image wrapper function
async function deleteImage(public_id) {
  const imageCdnUrl = `${process.env.IMAGES_CDN_API_URL}/image/delete`;
  const imageCdnApiKey = process.env.IMAGES_CDN_API_KEY;

  const form = {
    image: public_id,
  };

  const options = {
    headers: {
      "api-key": imageCdnApiKey,
    },
  };

  try {
    const resp = await axios.post(imageCdnUrl, form, options);
    return resp.data;
  } catch (err) {
    console.error(err);
  }
}

// Express routes

// Create post with image
router.post("/post/create", upload.single("postImage"), async (req, res) => {
  const user = await req.user;
  let image;

  if (!req.file || !req.file.path) {
    if (req.body.imageUrl) {
      try {
        image = await uploadImage(req.body.imageUrl);
      } catch (error) {
        if (error) {
          console.log(error);
          image = { url: "" };
        }
      }
    } else {
      image = { url: "" };
    }
  } else {
    image = await uploadImage(req.file.path);
  }
  const post = await addPost(
    req.body.body,
    user,
    req.body.comments,
    req.body.likes,
    image
  );
  res.redirect(`/profile`);
});

// Delete post and image on the CDN
router.post("/post/delete/:id", async (req, res) => {
  let resultDeleteImage = "There is not image to delete";

  if (req.body.image_public_id) {
    resultDeleteImage = await deleteImage(req.body.image_public_id);
  }

  const resultDelete = await deletePostById(req.params.id);

  res.json({
    _id: req.params.id,
    resultDeleteImage: resultDeleteImage,
    resultDelete: resultDelete,
  });
});
```

## docker example

```
sudo docker build -t images-cdn .
sudo docker run -d -e HOST="your-host.com" -e STATIC_FOLDER="../public" --name images-cdn -v ~/Desktop/images:/app/public/images -p 6060:6060 images-cdn
```
