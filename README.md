# Product Catalogue - Full Stack MERN E-commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)](https://stripe.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready, full-featured e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring **secure guest checkout**, Stripe payment processing, and a complete order management system. This application demonstrates modern e-commerce patterns with a focus on user experience and conversion optimization[citation:3][citation:7].

## Key Features

- **Flexible Shopping Experience**
  - Guest checkout with no account required[citation:6][citation:9]
  - Registered user accounts with saved details
  - Cart persistence across browser sessions
  - Post-purchase account conversion

- **Secure Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (Admin/User)
  - Secure guest session management[citation:9]
  - Password protection with hashing

- **Payment Processing**
  - Stripe integration for secure payments[citation:5][citation:8]
  - Test mode with sample credit cards
  - Webhook handling for payment confirmation
  - Order confirmation emails via SMTP[citation:7]

- **Product & Order Management**
  - Full CRUD operations for products (Admin)
  - Advanced filtering and search
  - Real-time order tracking
  - Guest order lookup via email[citation:7]

- **Security & Best Practices**
  - PCI-compliant payment flow (Stripe Elements)[citation:8]
  - Environment variable configuration
  - Input validation and sanitization
  - CORS protection

## Why This Architecture?

This application implements industry best practices for e-commerce conversion optimization:

- **Reduced Abandonment**: Guest checkout can reduce cart abandonment by up to 23% by removing registration barriers[citation:6].
- **Mobile Optimization**: Simplified checkout flows work seamlessly across devices.
- **Progressive Engagement**: Users can shop first, create accounts later with their purchase history preserved.
- **Secure Foundation**: Identity resolution happens before payment, preventing cart mismatches and security issues[citation:9].

## Quick Start Guide

### Prerequisites
- Node.js 18.x or higher
- MongoDB Atlas account (free tier available)
- Stripe account (test mode available)
- SMTP service (Gmail or similar)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/product-catalogue.git
   cd product-catalogue

2.Install dependencies

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

3.Environment Configuration
Server (.env):

NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

Client (.env):

REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
REACT_APP_SITE_URL=http://localhost:3000

4.Get Stripe Keys

Sign up at stripe.com

Go to Developers → API keys

Copy Publishable key to REACT_APP_STRIPE_PUBLISHABLE_KEY

Copy Secret key to STRIPE_SECRET_KEY

Set up webhooks for local development:

bash

# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:5000/api/stripe/webhook
Run the Application

bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start frontend development server
cd client
npm start
Access the Application

Frontend: http://localhost:3000

API Server: http://localhost:5000

Demo Admin: admin@example.com / admin123

Demo User: john@example.com / user123

Project Structure

text
product-catalogue/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context (Cart, Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── styles/        # CSS modules
│   ├── package.json
│   └── .env
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   └── utils/         # Helper functions
│   ├── package.json
│   └── .env
│
├── .gitignore
├── LICENSE
└── README.md

Technical Implementation

Guest Checkout Flow

The application implements a secure guest checkout system that:

Generates unique guest IDs for anonymous users

Persists cart data in localStorage with guest ID as key

Resolves identity before payment to prevent security issues

Allows post-purchase account creation with cart history migration

Uses middleware protection for all critical routes

Payment Integration

Stripe Elements for PCI-compliant card collection

PaymentIntent API for flexible payment flows

Webhook handling for reliable order confirmation

Test mode support with sample credit cards

Security Features

JWT authentication with refresh token rotation

Role-based middleware for admin protection

Input sanitization against XSS attacks

Environment variable for sensitive data

CORS configuration for API security

Testing

Test Credit Cards (Stripe Test Mode)

Use these cards in test mode:

Card Number			Description		Expected Result
4242 4242 4242 4242		Visa (success)		Payment succeeds
4000 0000 0000 9995		Visa (failure)		Payment declined
4000 0025 0000 3155		Visa (requires auth)	3D Secure flow

Test Details: Any future expiry date, any 3-digit CVC, any 5-digit ZIP.

Running Tests

bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

Deployment

Backend Deployment (Heroku/Railway)

Push to your Git repository

Set environment variables in deployment platform

Configure MongoDB Atlas connection

Set up Stripe webhook endpoint

Frontend Deployment (Netlify/Vercel)

Build the React application

Configure environment variables

Set up redirects for client-side routing

Production Checklist

Update all .env variables with production values

Switch Stripe to live mode

Configure custom domain

Set up SSL certificates

Configure email service

Implement monitoring and logging

API Documentation

Authentication

Method	Endpoint			Description		Auth Required
POST	/api/auth/register		User registration	No
POST	/api/auth/login			User login		No
POST	/api/auth/logout		User logout		Yes
POST	/api/auth/refresh		Refresh token		Yes (Refresh)
POST	/api/auth/convert-guest		Convert guest to user	No

Products

Method	Endpoint			Description		Auth Required
GET	/api/products			Get all products	No
GET	/api/products/:id		Get single product	No
POST	/api/products			Create product	Admin
PUT	/api/products/:id		Update product	Admin
DELETE	/api/products/:id		Delete product	Admin

Orders

Method	Endpoint			Description		Auth Required
POST	/api/orders			Create order		Yes/Guest
GET	/api/orders			Get user orders		Yes
GET	/api/orders/guest		Get guest orders	No (Email)
GET	/api/orders/:id			Get order details	Yes
POST	/api/orders/:id/retry		Retry payment		Yes

Payments

Method	Endpoint			Description		Auth Required
POST	/api/payments/create-intent	Create payment intent	Yes/Guest
POST	/api/stripe/webhook		Stripe webhook handler	No

Contributing

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

License

This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments

Stripe for payment processing

MongoDB for database

React for frontend framework

Express.js for backend framework

📞 Support

For support, please:

Check the GitHub Issues

Review the Stripe Documentation

Email: 2415644@live.stmarys.ac.uk



Last Updated: February 2026
