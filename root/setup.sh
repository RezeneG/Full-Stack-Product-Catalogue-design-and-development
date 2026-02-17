#!/bin/bash

# 🚀 Product Catalogue - Mac/Linux Setup Script

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🛍️  Product Catalogue - Full Stack MERN Setup        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[1/5]${NC} Setting up backend..."
cd server
npm install
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo -e "${BLUE}[2/5]${NC} Seeding database..."
node seed.js
node seedUsers.js
echo -e "${GREEN}✅ Database seeded${NC}"

echo -e "${BLUE}[3/5]${NC} Setting up frontend..."
cd ../client
npm install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

echo -e "${BLUE}[4/5]${NC} Creating .env files..."
cd ..
cp server/.env.example server/.env
cp client/.env.example client/.env
echo -e "${GREEN}✅ Environment files created${NC}"

echo -e "${BLUE}[5/5]${NC} Starting servers..."
echo ""
echo -e "${YELLOW}📋 To start the application manually:${NC}"
echo "   Terminal 1: cd server && npm run dev"
echo "   Terminal 2: cd client && npm start"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║   🚀  Frontend: http://localhost:3000                   ║"
echo "║   🖥️  Backend API: http://localhost:5000/api           ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Demo Credentials:"
echo "   👑 Admin:  admin@example.com / admin123"
echo "   👤 User:   john@example.com / user123"
