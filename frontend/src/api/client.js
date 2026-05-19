// API client for Express backend
const resolveApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (!configuredUrl) {
    return 'http://localhost:5000/api';
  }

  const normalizedUrl = configuredUrl
    .replace(/\/+$/, '')
    .replace(/\/api\/index(\.js)?$/i, '')
    .replace(/\/index(\.js)?$/i, '');

  return normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;
};

const API_BASE_URL = resolveApiBaseUrl();

export class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('accessToken');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  getFormHeaders() {
    const headers = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let errorMessage = `Request failed with status ${response.status}`;

        if (contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => null);
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } else {
          const text = await response.text().catch(() => '');
          if (text && !text.includes('<!doctype html>')) {
            errorMessage = text;
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    this.setToken(response.tokens.accessToken);
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setToken(response.tokens.accessToken);
    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    
    this.setToken(null);
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  // Recording endpoints
  async uploadRecording(formData) {
    const url = `${this.baseURL}/recordings/upload`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getFormHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      let errorMessage = `Upload failed with status ${response.status}`;

      if (contentType.includes('application/json')) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } else {
        const text = await response.text().catch(() => '');
        if (text && !text.includes('<!doctype html>')) {
          errorMessage = text;
        }
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getUserRecordings(page = 1, limit = 10) {
    return this.request(`/recordings/my-recordings?page=${page}&limit=${limit}`);
  }

  async getRecording(id) {
    return this.request(`/recordings/${id}`);
  }

  async updateRecording(id, updates) {
    return this.request(`/recordings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteRecording(id) {
    return this.request(`/recordings/${id}`, {
      method: 'DELETE',
    });
  }

  async getPublicRecordings(page = 1, limit = 10) {
    return this.request(`/recordings/public?page=${page}&limit=${limit}`);
  }

  // User endpoints
  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async getUserRecordingsPublic(id, page = 1, limit = 10) {
    return this.request(`/users/${id}/recordings?page=${page}&limit=${limit}`);
  }
}

export const apiClient = new ApiClient();