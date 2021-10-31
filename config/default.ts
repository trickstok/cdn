export default {
  server: {
    port: process.env.PORT || 6060,
    host: process.env.HOST || "localhost",
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:6060",
    apiKey: process.env.API_KEY || "qQ5rVNU5eIo/DgEU8N1SRqvtc5fE2saSu+5DhzAQwXsmAC+xcTfI/YMe2wFSulCFPHqCiiQhVpg424IcQyEy9p62GpiAQp54udCGsSTF3mGatcj/AB59tF1Bf7N3pftSHm0XWVwWY/P/wpkOeeVL5fsKbWhFBvUqCjysnkb+fCFB8kLDZ/5xxzeQ1OkgTK5efNt4hC7VjKuoDTnF5Lx52GdbGEaHdbz4nMAXIN9s1Uu2GRIEn3EId58Jo9VLq1ZmouuGvZch4CXHdXcFIauLC8p0CSDPMzBWptTx05sUg6wWQXqE7UF8J4oCKiDXHF+QcDsYQVYjgzcpIY7wwFne1Q==",
  },
  storage : {
      staticFolder: process.env.STATIC_FOLDER || 'public',
      path: process.env.STORAGE_PATH || 'public',
      folderName: process.env.FOLDER_NAME || 'images',
  }
};
