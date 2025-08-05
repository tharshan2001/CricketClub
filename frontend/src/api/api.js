import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Player related endpoints
export const getPlayers = () => api.get('/players');
export const getPlayer = (id) => api.get(`/players/${id}`);
export const createPlayer = (playerData) => api.post('/players', playerData);
export const updatePlayer = (id, playerData) => api.put(`/players/${id}`, playerData);
export const deletePlayer = (id) => api.delete(`/players/${id}`);

// Match related endpoints
export const getMatches = () => api.get('/matches');
export const getMatch = (id) => api.get(`/matches/${id}`);
export const createMatch = (matchData) => api.post('/matches', matchData);
export const updateMatch = (id, matchData) => api.put(`/matches/${id}`, matchData);
export const deleteMatch = (id) => api.delete(`/matches/${id}`);
export const recordMatchScore = (id, scoreData) => api.post(`/matches/${id}/score`, scoreData);

// News related endpoints
export const getNews = () => api.get('/news');
export const getNewsItem = (id) => api.get(`/news/${id}`);
export const createNews = (newsData) => api.post('/news', newsData);
export const updateNews = (id, newsData) => api.put(`/news/${id}`, newsData);
export const deleteNews = (id) => api.delete(`/news/${id}`);

// Tournament related endpoints
export const getTournaments = () => api.get('/tournaments');
export const getTournament = (id) => api.get(`/tournaments/${id}`);
export const createTournament = (tournamentData) => api.post('/tournaments', tournamentData);
export const updateTournament = (id, tournamentData) => api.put(`/tournaments/${id}`, tournamentData);
export const deleteTournament = (id) => api.delete(`/tournaments/${id}`);

// Authentication endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');

// Financial endpoints
export const getPayments = () => api.get('/payments');
export const createPayment = (paymentData) => api.post('/payments', paymentData);
export const getPayment = (id) => api.get(`/payments/${id}`);
export const updatePayment = (id, paymentData) => api.put(`/payments/${id}`, paymentData);
export const deletePayment = (id) => api.delete(`/payments/${id}`);

export default api;