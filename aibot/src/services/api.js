import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

// Auth endpoints
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const logout = () => api.post('/auth/logout');
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);

// Lesson endpoints
export const createLesson = (data) => api.post('/lessons', data);
export const getLessons = () => api.get('/lessons');
export const getLesson = (id) => api.get(`/lessons/${id}`);
export const updateLesson = (id, data) => api.put(`/lessons/${id}`, data);
export const deleteLesson = (id) => api.delete(`/lessons/${id}`);

// Add interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not on a quiz or results page
      const isQuizRoute = window.location.pathname.includes('/quiz/') || 
                         window.location.pathname.includes('/results/');
      if (!window.location.pathname.includes('/login') && !isQuizRoute) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Add these new endpoints
export const submitQuizResults = (lessonId, results) => {
  return api.post(`/quiz-results/${lessonId}`, results);
};

export const getQuizResults = (resultId) => {
  return api.get(`/quiz-results/${resultId}`);
};

export const getQuizStats = () => {
  return api.get('/quiz-results/admin/stats');
};

export const getLessonResults = (lessonId) => {
  return api.get(`/quiz-results/admin/lesson/${lessonId}`);
};

export default api; 