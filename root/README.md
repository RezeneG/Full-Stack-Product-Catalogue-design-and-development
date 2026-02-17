# Product Catalogue - Full Stack MERN Application

## 📋 Project Overview
A responsive product catalogue website with complete CRUD operations, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone/Download the project**

2. **Backend Setup:**
```bash
cd server
npm install
npm run seed  # Add sample data
npm run dev   # Starts on http://localhost:5000

3. Frontend Setup

bash

cd client
npm install
npm start     # Starts on http://localhost:3000

Project Structure

product-catalogue/
├── server/           # Node.js/Express backend
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── .env         # Environment variables
│   └── server.js    # Main server file
└── client/          # React frontend
    ├── src/
    │   ├── pages/   # React pages
    │   ├── services/# API services
    │   └── App.js   # Main React component
    └── package.json

API Endpoints

API Endpoints
Method	Endpoint	Description
GET	/api/products	Get all products
GET	/api/products/:id	Get single product
POST	/api/products	Create new product
PUT	/api/products/:id	Update product
DELETE	/api/products/:id	Delete product

🎯 FEATURES:

Complete CRUD operations

Responsive design

Client & server validation

Error handling

Search & filter products

MongoDB integration

📞 Support:


### **2. `.gitignore` in both folders**
**server/.gitignore:**
```gitignore
node_modules/
.env
*.log
.DS_Store

client/.gitignore:

node_modules/
.env
build/
.DS_Store

3. Postman Collection Export

Final Submission checklist

Files to ZIP

product-catalogue.zip
├── server/
│   ├── models/
│   │   └── Product.js          ✅
│   ├── routes/
│   │   └── products.js         ✅
│   ├── .env                    ✅
│   ├── .gitignore              ✅
│   ├── package.json            ✅
│   ├── seed.js                 ✅
│   └── server.js               ✅
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.js     ✅
│   │   │   ├── AddProductPage.js ✅
│   │   │   └── ViewProductsPage.js ✅
│   │   ├── services/
│   │   │   └── api.js          ✅
│   │   ├── App.css             ✅
│   │   ├── App.js              ✅
│   │   └── index.js            ✅
│   ├── .gitignore              ✅
│   └── package.json            ✅
└── README.md                   ✅

