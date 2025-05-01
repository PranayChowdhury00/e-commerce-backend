# 🛠️ E-Commerce Backend

This is the backend of a full-featured E-Commerce web application built using **MongoDB**, **Express**, and **Node.js**. It handles API routes for products, users, authentication, and orders, and serves as the backbone for the MERN stack project.

---

## ✨ Features

- RESTful API for:
  - Products (CRUD)
  - Users (Register/Login with JWT)
  - Cart & Orders
- Password hashing using `bcrypt`
- JSON Web Token (JWT) authentication
- MongoDB for data persistence
- Admin routes and role-based access control
- Error handling middleware
- CORS & security middlewares
- Organized folder structure

---

## ⚙️ Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT, bcrypt
- **Environment Variables**: dotenv
- **HTTP Server**: Node.js
- **Others**: Morgan (for logging), CORS, Helmet

---

## 📁 Project Structure


---

## 🔐 API Endpoints

Here’s a brief overview of the available routes:

### 🔑 Auth Routes

| Method | Endpoint       | Description         |
|--------|----------------|---------------------|
| POST   | /api/register  | Register a new user |

### 👤 User Routes

| Method | Endpoint       | Description         |
|--------|----------------|---------------------|
| GET    | /api/users     | Get all users (admin) |
| GET    | /api/users/:id | Get user profile    |

### 📦 Product Routes

| Method | Endpoint       | Description            |
|--------|----------------|------------------------|
| GET    | /api/products  | Get all products       |
| POST   | /api/products  | Create new product     |
| GET    | /api/products/:id | Get product details |
| PUT    | /api/products/:id | Update product       |
| DELETE | /api/products/:id | Delete product       |


---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend
npm install
Create a .env file in the root folder:
🌐 Deployment
To deploy on Render:

Push code to GitHub

Go to Render → Create a new Web Service

Connect your GitHub repo

Set environment variables (MONGODB_URI, JWT_SECRET)

Select Node.js and use npm start as build/run command
📄 License
This project is licensed under the Pranay Chowdhury License.
