@echo off
title Product Catalogue Setup
color 0B

echo ╔══════════════════════════════════════════════════════════╗
echo ║     🛍️  Product Catalogue - Full Stack MERN Setup        ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo [1/5] Setting up backend...
cd server
call npm install
echo ✅ Backend dependencies installed
echo.

echo [2/5] Seeding database...
call node seed.js
call node seedUsers.js
echo ✅ Database seeded
echo.

echo [3/5] Setting up frontend...
cd ..\client
call npm install
echo ✅ Frontend dependencies installed
echo.

echo [4/5] Creating .env files...
cd ..
copy server\.env.example server\.env
copy client\.env.example client\.env
echo ✅ Environment files created
echo.

echo [5/5] Setup complete!
echo.
echo To start the application:
echo   Terminal 1: cd server ^&^& npm run dev
echo   Terminal 2: cd client ^&^& npm start
echo.
echo 📋 Demo Credentials:
echo    👑 Admin:  admin@example.com / admin123
echo    👤 User:   john@example.com / user123
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║   🚀  Frontend: http://localhost:3000                   ║
echo ║   🖥️  Backend API: http://localhost:5000/api           ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
pause
