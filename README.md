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

## start

```
npm i
npm run dev
```

## docker example

```
sudo docker build -t images-cdn .
sudo docker run -d -e HOST="your-host.com" -e STATIC_FOLDER="../public" --name images-cdn -v ~/Desktop/images:/app/public/images -p 6060:6060 images-cdn
```
