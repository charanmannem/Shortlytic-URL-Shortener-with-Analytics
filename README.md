## 🎯 Overview

**Shortlytic** is a production-ready URL shortening service built with the MERN stack, featuring advanced analytics, user authentication, and an admin dashboard. Designed for high performance and scalability, it handles 1000+ concurrent requests with <10ms redirect response time.

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6.20-CA4245?logo=react-router&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.10-8884D8)
![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.0-880000)
![Passport.js](https://img.shields.io/badge/Passport.js-0.7-34E27A?logo=passport&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0-000000?logo=json-web-tokens&logoColor=white)

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (Local installation or MongoDB Atlas account)
- **Git**
- **Google OAuth Credentials** (Optional, for OAuth login)

### Clone Repository

```bash
git clone https://github.com/charanmannem/Shortlytic-URL-Shortener-with-Analytics.git
cd Shortlytic-URL-Shortener-with-Analytics
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configurations
nano .env
```

### Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configurations
nano .env
```

### Start Development Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

---

## 🔐 Environment Variables

### Backend `.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/url-shortener
# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortener?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

