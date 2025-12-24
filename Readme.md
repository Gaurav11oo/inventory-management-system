# 📦 Inventory Management System


A **full-stack Inventory Management System** built using **Node.js, Express, MongoDB** for the backend and **React + Tailwind CSS** for the frontend.

The system helps manage **products, suppliers, stock**, and generate detailed reports in **Excel & PDF** formats.

---

## 🚀 Features

### 🔹 Backend (Node.js + Express)

- JWT-based authentication
- Secure password hashing using **bcryptjs**
- CRUD operations for:
  - Products
  - Suppliers
  - Stock management
- Input validation using **express-validator**
- MongoDB database using **Mongoose**
- CORS enabled for frontend integration
- Environment variables via **dotenv**

### 🔹 Frontend (React)

- Modern animated dashboard (**Framer Motion**)
- Product, Supplier & Stock Management
- Low stock alerts
- Inventory reports:
  - 📊 Excel export (**xlsx**)
  - 📄 PDF export (**jsPDF + AutoTable**)
- Charts & analytics (**Recharts**)
- Responsive UI with **Tailwind CSS**
- Icons via **Lucide React** & **React Icons**
- Client-side routing (**React Router DOM**)

---

## 🛠️ Tech Stack


![react](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)&nbsp;
![nodejs](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js )&nbsp;
![express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express )&nbsp;
![mongodb](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb )&nbsp;
![tailwindcss](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss )&nbsp;
![jwt](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens )&nbsp;
![chart-js](https://img.shields.io/badge/Charts-Recharts-FF6384?style=for-the-badge&logo=chartdotjs )&nbsp;
![axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?style=for-the-badge&logo=axios )&nbsp;
![license](https://img.shields.io/badge/License-Open_Source-22C55E?style=for-the-badge)

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Frontend

- React 18
- Tailwind CSS
- Framer Motion
- Recharts
- Axios

---

## 📁 Project Structure

```
inventory-management-system/
│
├── backend/
│ ├── config/ # Database & app configuration
│ ├── controllers/ # Business logic
│ ├── middleware/ # Auth & validation middleware
│ ├── models/ # Mongoose models
│ ├── routes/ # API routes
│ ├── node_modules/
│ ├── .env # Environment variables
│ ├── .gitignore
│ ├── package.json
│ ├── package-lock.json
│ └── server.js # Backend entry point
│
├── frontend/
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # Auth & theme context
│ │ ├── services/ # API service files (Axios)
│ │ ├── utils/ # Helper & utility functions
│ │ ├── App.jsx # Main app component
│ │ ├── index.css # Global styles
│ │ └── index.js # React entry point
│ ├── .env # Frontend environment variables
│ ├── .gitignore
│ ├── package.json
│ ├── package-lock.json
│ ├── postcss.config.js
│ └── tailwind.config.js
│
└── README.md
```

---

## ⚙️ Backend Setup

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

### 2️⃣ Environment Variables (backend/.env)

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3️⃣ Run Backend

```bash
npm run dev
```


#### Backend runs at:

```bash
http://localhost:5000
```

### 🎨 Frontend Setup

#### 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

#### 2️⃣ Start Frontend

```bash
npm start
```

#### Frontend runs at:

```bash
http://localhost:3000
```

### 📊 Reports & Analytics

#### Excel Reports

- Summary

- All Products

- Low Stock Items

- Category Analysis

#### PDF Reports

- Inventory Summary

- Product Listings

- Low Stock Alerts

- Category-wise Value

### 🔐 Authentication

- JWT-based authentication

- Passwords encrypted using bcryptjs

- Protected API routes with middleware
