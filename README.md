# images-cdn-service

Self hosted Node.js CDN for uploading and processing images for your web applications.

## docker example

```
sudo docker run -d -e HOST="your-host.com" -v ~/Desktop/images:/app/public/images -p 6060:6060 images-cdn
```
