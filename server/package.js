{
  "name": "product-catalogue-server",
  "version": "1.0.0",
  "description": "Backend API for Product Catalogue",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js",
    "test": "echo \"No tests specified\" && exit 0"
  },
  "keywords": [
    "node",
    "express",
    "mongodb",
    "rest-api"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^7.0.0",
    "stripe": "^20.3.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
