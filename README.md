# ScreenCast - MERN Stack Screen Recording App

A modern screen recording application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Capture your screen, record with webcam overlay, and manage your recordings with a beautiful, responsive interface.

## Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local file system with Multer
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

## Features

- 🎥 Screen recording with webcam overlay
- 👤 User authentication (register/login)
- 📱 Responsive design with dark/light mode
- 💾 Recording management (view, download, delete)
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure JWT-based authentication

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ScreenCast-Proj
   ```

2. **Install dependencies**
   
   For the frontend:
   ```bash
   cd frontend
   npm install
   ```
   
   For the backend:
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   
   **Frontend** - `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_NODE_ENV=development
   ```
   
   **Backend** - `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/screencast-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   UPLOAD_DIR=uploads
   NODE_ENV=development
   ```

4. **Set up MongoDB**
   
   - Install MongoDB locally or create a MongoDB Atlas account
   - Update the `MONGODB_URI` in your backend `.env` file
   - The database and collections will be created automatically

5. **Start the development servers**
   
   **Backend** (from the backend directory):
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend** (from the frontend directory):
   ```bash
   cd frontend
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Project Structure

```
ScreenCast-Proj/
├── backend/                 # Express.js backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── uploads/            # File upload storage
│   └── server.js           # Backend entry point
├── frontend/               # React frontend
│   ├── src/                # React source code
│   │   ├── api/            # API client
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   └── pages/          # Page components
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
└── README.md              # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Recordings
- `GET /api/recordings` - Get user recordings (protected)
- `POST /api/recordings` - Upload new recording (protected)
- `DELETE /api/recordings/:id` - Delete recording (protected)
- `GET /api/recordings/:id/download` - Download recording (protected)

## Development

### Frontend
- Built with React.js and Vite for fast development
- Uses Tailwind CSS for styling
- Radix UI for accessible components
- React Router for navigation

### Backend
- Express.js server with MongoDB
- JWT authentication middleware
- Multer for file uploads
- CORS configured for development and production

### Authentication Flow
1. User registers/logs in via frontend
2. Backend validates credentials and returns JWT token
3. Frontend stores token and includes in API requests
4. Backend middleware validates token for protected routes

## Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update environment variables for production API URL

### Backend (Railway/Heroku/Digital Ocean)
1. Deploy the `backend` folder to your hosting service
2. Set up environment variables in production
3. Ensure MongoDB connection is configured
4. Update CORS settings for production frontend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.