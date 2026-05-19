// Constants and default objects for MERN stack API

// Default user object structure
export const DEFAULT_USER = {
  _id: '',
  email: '',
  fullName: '',
  avatarUrl: null,
  isVerified: false,
  createdAt: '',
  updatedAt: ''
};

// Default recording object structure
export const DEFAULT_RECORDING = {
  _id: '',
  userId: '',
  title: '',
  description: '',
  fileName: '',
  filePath: '',
  fileSize: 0,
  duration: 0,
  mimeType: 'video/webm',
  isPublic: false,
  views: 0,
  tags: [],
  url: '',
  createdAt: '',
  updatedAt: ''
};

// Default pagination structure
export const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalRecordings: 0,
  hasNext: false,
  hasPrev: false
};

// API response status codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
};

// Form validation rules
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Password must be at least 6 characters'
  },
  name: {
    required: true,
    minLength: 2,
    message: 'Name must be at least 2 characters'
  },
  title: {
    required: true,
    minLength: 1,
    maxLength: 200,
    message: 'Title must be between 1 and 200 characters'
  },
  description: {
    maxLength: 1000,
    message: 'Description cannot exceed 1000 characters'
  }
};

// File upload constants
export const FILE_UPLOAD = {
  maxSize: 100 * 1024 * 1024, // 100MB
  acceptedTypes: ['video/webm', 'video/mp4', 'video/mov'],
  maxDuration: 3600, // 1 hour in seconds
};

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile'
  },
  RECORDINGS: {
    UPLOAD: '/recordings/upload',
    MY_RECORDINGS: '/recordings/my-recordings',
    PUBLIC: '/recordings/public',
    BY_ID: '/recordings'
  },
  USERS: {
    BY_ID: '/users',
    RECORDINGS: '/recordings'
  }
};