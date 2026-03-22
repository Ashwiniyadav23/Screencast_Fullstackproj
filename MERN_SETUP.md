# MERN Stack Setup Guide

This guide walks you through setting up the MERN stack (MongoDB, Express.js, React, Node.js) for the ScreenCast application.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Project Structure

```
ScreenCast-Proj/
├── backend/                 # Express.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads directory
│   ├── .env.example       # Environment variables template
│   ├── package.json       # Backend dependencies
│   └── server.js          # Main server file
├── src/                    # React frontend
│   ├── api/               # API client
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   └── services/         # Service layer
├── .env.example           # Frontend environment variables
└── package.json          # Frontend dependencies
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ScreenCast-Proj
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: Secret key for JWT tokens
# - PORT: Backend server port (default: 5000)
```

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install frontend dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - VITE_API_URL: Backend API URL (default: http://localhost:5000/api)
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/screencast`

#### Option B: MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update MONGODB_URI in backend/.env

### 5. Running the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
Server will run on http://localhost:5000

#### Start Frontend Development Server
```bash
# In a new terminal, from root directory
npm run dev
```
Frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update user profile

### Recordings
- `POST /api/recordings/upload` - Upload recording
- `GET /api/recordings/my-recordings` - Get user recordings
- `GET /api/recordings/:id` - Get single recording
- `PATCH /api/recordings/:id` - Update recording
- `DELETE /api/recordings/:id` - Delete recording
- `GET /api/recordings/public` - Get public recordings

### Users
- `GET /api/users/:id` - Get user info
- `GET /api/users/:id/recordings` - Get user's public recordings

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/screencast
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

## Features

- ✅ User Authentication (Register/Login/Logout)
- ✅ Screen Recording with Audio
- ✅ File Upload and Storage
- ✅ Recording Management (CRUD operations)
- ✅ Public/Private Recording Settings
- ✅ User Profiles
- ✅ Responsive UI with Tailwind CSS

## Troubleshooting

### Backend Issues
1. **MongoDB Connection Failed**
   - Check if MongoDB service is running
   - Verify connection string in MONGODB_URI
   - Check network connectivity for Atlas

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set in backend/.env
   - Check token expiration settings

### Frontend Issues
1. **API Connection Failed**
   - Verify VITE_API_URL points to backend server
   - Check if backend server is running on correct port
   - Check browser console for CORS errors

2. **File Upload Issues**
   - Check backend uploads directory permissions
   - Verify file size limits in upload middleware

## Production Deployment

### Backend Deployment
1. Set NODE_ENV=production
2. Use production MongoDB URI
3. Set secure JWT_SECRET
4. Configure proper CORS settings
5. Use PM2 or similar for process management

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy dist/ folder to static hosting (Netlify, Vercel, etc.)
3. Update VITE_API_URL to production backend URL

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Database ODM**: Mongoose
- **UI Components**: Radix UI, shadcn/ui

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request