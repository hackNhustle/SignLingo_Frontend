import axios from 'axios';

const MODEL_BASE_URL_KEY = 'sign_model_base_url';
const DEFAULT_API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://signlingo-micro-services-backend-3.onrender.com/api/v1';
const DEFAULT_MODEL_BASE_URL = import.meta.env?.VITE_MODEL_BASE_URL || 'https://signlingo-micro-services-backend-3.onrender.com/api/v1/model/isl';
const DEFAULT_ASL_MODEL_URL = 'https://signlingo-micro-services-backend-3.onrender.com/api/v1/model/asl';

const getStoredModelBaseUrl = () => {
  try {
    const stored = localStorage.getItem(MODEL_BASE_URL_KEY);
    // If the browser cached a local broken proxy model, erase it and use the .env Cloud default
    if (stored && (stored === '/model-api' || stored === '/asl-api')) {
      localStorage.removeItem(MODEL_BASE_URL_KEY);
      return DEFAULT_MODEL_BASE_URL;
    }
    return stored || DEFAULT_MODEL_BASE_URL;
  } catch (_e) {
    return DEFAULT_MODEL_BASE_URL;
  }
};

const API_BASE_URL = DEFAULT_API_BASE_URL;
let MODEL_BASE_URL = getStoredModelBaseUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Model API for sign recognition (separate base URL)
const modelApi = axios.create({
  baseURL: MODEL_BASE_URL,
  timeout: 10000,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getRole: () => api.get('/auth/role'),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  uploadProfilePicture: (imageData) => {
    // imageData can be either FormData or {image_data: base64, extension: ext}
    if (imageData instanceof FormData) {
      // Handle FormData
      const uploadApi = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
      });

      const token = localStorage.getItem('token');
      if (token) {
        uploadApi.defaults.headers.common.Authorization = `Bearer ${token}`;
      }

      return uploadApi.post('/user/profile/picture', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      // Handle JSON (base64)
      return api.post('/user/profile/picture', imageData, { timeout: 30000 });
    }
  },
};

// ISL Conversion API (CORE FEATURE)
export const convertAPI = {
  textToSign: (data) => api.post('/convert/text-to-sign', data),
  signToText: (imageData, modelUrl = null) => {
    // imageData should be a base64 string or blob
    const formData = new FormData();
    // If imageData is a base64 string, convert to Blob
    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
      const arr = imageData.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      formData.append('file', blob, 'image.jpg');
    } else {
      formData.append('file', imageData);
    }

    // Send directly to the model service's /predict endpoint via Gateway proxy.
    // modelUrl overrides the stored MODEL_BASE_URL.
    // Default to ASL if the requested language is ASL, else ISL
    const targetBase = modelUrl || MODEL_BASE_URL;
    return axios.post(`${targetBase}/predict`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
  },
  speechToSign: (data) => api.post('/convert/speech-to-sign', data),
  // Health check for the model service (GET / returns { status, service })
  modelHealthCheck: (modelUrl = null) => {
    const targetBase = modelUrl || MODEL_BASE_URL;
    return axios.get(targetBase, { timeout: 5000 });
  },
};

// Learning & Practice API
export const learningAPI = {
  // Alphabet & Numbers
  getAlphabetList: () => api.get('/alphabet/list'),
  getCharacterData: (character) => api.get(`/alphabet/${character}`),
  submitWritingPractice: (data) => api.post('/practice/writing', data), // Corrected path

  // Vocabulary & Sentences
  getVocabularyByLetter: (letter) => api.get(`/vocabulary/${letter}`),
  getSentencesByLevel: (level) => api.get(`/sentences/${level}`),
  submitSentencePractice: (data) => api.post('/practice/sentence', data),

  // STEM Learning
  getSTEMModules: () => api.get('/stem/modules'),
  getSTEMLesson: (lessonId) => api.get(`/stem/lesson/${lessonId}`),
  getSTEMQuestions: (lessonId) => api.get(`/stem/questions/${lessonId}`),
};

// Videos & Content API
export const contentAPI = {
  getVideos: (category = null) => api.get('/videos', { params: category ? { category } : {} }),
  getVideo: (videoId) => api.get(`/videos/${videoId}`),
  createVideo: (data) => api.post('/videos', data),

  // ISL Images & Signs
  getISLImage: (sign) => api.get(`/api/isl-images/${sign}`),
  getAvailableSigns: () => api.get('/api/isl-data/available-signs'),
};

// Practice & Progress API
export const practiceAPI = {
  submitPractice: (data) => api.post('/practice/submit', data),
  getPracticeScores: () => api.get('/practice/score'),

  // User Progress
  getUserProgress: () => api.get('/user/progress'),
  markChapterComplete: (data) => api.post('/user/progress/chapter', data),

  // Analytics & Reports
  getProgressOverview: () => api.get('/progress/overview'),
  getLessonProgress: (lessonId) => api.get(`/progress/lesson/${lessonId}`),
  getVisualReports: (type = 'all') => api.get('/reports/visual', { params: { type } }),

  // User Analytics (NEW)
  getUserAnalytics: () => api.get('/user/analytics'),
  getWeeklyChartData: () => api.get('/user/weekly-chart'),
  getDailyPractice: () => api.get('/user/daily-practice'),
  getDailyQuiz: (language) => api.get('/user/daily-quiz', { params: { language } }),
};

// System & Utility API
export const systemAPI = {
  healthCheck: () => api.get('/health'),
  submitFeedback: (data) => api.post('/feedback', data),
  getAllUsers: () => api.get('/user/all'), // Corrected path
  testConnection: () => api.get('/test'),
};

// Helper functions for common operations
export const apiHelpers = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Set user token
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Remove user token
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Convert image to base64 for API
  imageToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      const status = error.response.status;
      const requestUrl = String(error.config?.url || '');
      const responseMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        error.response.data?.detail;

      const isSignRecognitionRequest =
        requestUrl.includes('/model-api/') ||
        requestUrl.includes('/asl-api/') ||
        requestUrl.includes('isl-alphabet-detection.onrender.com') ||
        requestUrl.includes('asl-alphabet-detection.onrender.com');

      if (isSignRecognitionRequest && status === 500) {
        const modelLabel = requestUrl.includes('/asl-api/') ? 'ASL' : 'ISL';
        const port = requestUrl.includes('/asl-api/') ? '8005' : '8003';
        return `${modelLabel} sign recognition service error. Make sure the model server is running on port ${port} and check its backend logs.`;
      }

      if (status === 404) {
        return 'Requested API route was not found';
      }

      if (status >= 500) {
        return responseMessage || `Server error occurred (${status})`;
      }

      return responseMessage || `Request failed (${status})`;
    } else if (error.request) {
      const requestUrl = String(error.config?.url || '');
      const isSignRecognitionRequest =
        requestUrl.includes('/model-api/') ||
        requestUrl.includes('/asl-api/') ||
        requestUrl.includes('isl-alphabet-detection.onrender.com') ||
        requestUrl.includes('asl-alphabet-detection.onrender.com');

      if (isSignRecognitionRequest) {
        const modelLabel = requestUrl.includes('/asl-api/') ? 'ASL' : 'ISL';
        const port = requestUrl.includes('/asl-api/') ? '8005' : '8003';
        return `${modelLabel} sign recognition service is unreachable. Start the model server on port ${port}.`;
      }

      return 'Network error - please check your connection';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  }
};

export const getModelBaseUrl = () => MODEL_BASE_URL;

export const setModelBaseUrl = (url) => {
  if (!url) return;
  MODEL_BASE_URL = url;
  modelApi.defaults.baseURL = url;
  try {
    localStorage.setItem(MODEL_BASE_URL_KEY, url);
  } catch (_e) {
    // ignore storage errors
  }
};

export default api;
