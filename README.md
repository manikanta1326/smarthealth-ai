# 🩺 SmartHealth AI

SmartHealth AI is a MERN Stack health monitoring application that helps users track their health profile, BMI, hydration, sleep goals, and daily wellness. It also provides an Admin Dashboard for monitoring all registered users and their health data.

---

# 🚀 Features

## 👤 User

- User Registration & Login (JWT Authentication)
- Edit Personal Health Profile
- BMI Calculator
- Daily Water Tracker
- Sleep Tracker
- Notifications
- Health Dashboard
- AI Chatbot (Ready for Gemini Integration)

## 👨‍💼 Admin

- Secure Admin Login
- View All Registered Users
- Monitor User Health Profiles
- View BMI & Health Status
- Delete Users
- Dashboard Statistics

---

# 🛠 Tech Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- Lucide React Icons
- Context API

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js

---

# 📂 Project Structure

```
smarthealth-ai/

│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
└── README.md
```

---

# ⚙ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/smarthealth-ai.git

cd smarthealth-ai
```

---

# Backend Setup

Go to backend folder

```bash
cd backend
```

Install dependencies

```bash
npm install
```

---

## Create .env

Create a file named

```
.env
```

Inside backend folder.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

---

## Run Backend

```bash
npm run dev
```

Server runs at

```
http://localhost:5000
```

Console

```
✅ MongoDB Connected

🚀 Server running on port 5000
```

---

# Frontend Setup

Open another terminal

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run React

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

---

# Backend Connection

Frontend communicates with backend using

```
frontend/src/services/api.js
```

API Base URL

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

All API requests are sent through this URL.

Example

```javascript
GET

/api/profile
```

```javascript
PUT

/api/profile
```

```javascript
POST

/api/auth/login
```

```javascript
POST

/api/auth/register
```

---

# Authentication

After Login

Backend returns

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

Frontend stores

```
localStorage

token

user
```

Every protected API sends

```javascript
Authorization: Bearer TOKEN
```

---

# MongoDB

Collections

```
users

profiles

todaylogs
```

Each Profile belongs to one User.

```
User

↓

Profile

↓

Today Log
```

---

# Admin Dashboard

Admin can

- View all registered users
- View health profiles
- Monitor BMI
- View health statistics
- Delete users

---

# Future Improvements

- Gemini AI Health Assistant
- Health Recommendation Engine
- Doctor Appointment Module
- Medicine Reminder
- Food Recommendation
- Health Report PDF
- Charts & Analytics

---

# Available Scripts

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

# API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login
```

## Profile

```
GET /api/profile

PUT /api/profile
```

## Today Log

```
GET /api/today-log

PUT /api/today-log
```

## Admin

```
GET /api/admin/dashboard

DELETE /api/admin/user/:id
```

---

# Author

**Manikanta Ch**

MERN Stack Developer

```
GitHub:
https://github.com/manikanta1326
```

---

# License

This project is developed for learning and portfolio purposes.