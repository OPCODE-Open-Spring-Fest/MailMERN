// // All backend API calls will be handled here
// // For now, placeholders to help contributors start easily

// const API_URL = "http://localhost:5000/api";

// // Helper wrapper around fetch to return parsed json and throw on bad status
// const fetchJson = async (url, options = {}) => {
//   const res = await fetch(url, options);
//   const text = await res.text();
//   try {
//     const data = text ? JSON.parse(text) : {};
//     if (!res.ok) throw new Error(data?.message || res.statusText || 'Request failed');
//     return data;
//   } catch (err) {
//     // If JSON parse fails, throw an error with raw text
//     if (!res.ok) throw new Error(text || res.statusText || 'Request failed');
//     // parse succeeded previously but JSON parse error — rethrow
//     throw err;
//   }
// };

// // User API calls
// export const loginUser = async (credentials) =>
//   fetchJson(`${API_URL}/users/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(credentials),
//   });

// export const registerUser = async (userData) =>
//   fetchJson(`${API_URL}/users/register`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(userData),
//   });

// // Fetch dashboard metrics from backend; if backend unavailable return dummy data
// export const getMetrics = async () => {
//   try {
//     const data = await fetchJson(`${API_URL}/metrics`);
//     // expected shape: { totalSent, responseRate, pendingReplies }
//     return data;
//   } catch (err) {
//     // fallback dummy values for local/dev
//     return {
//       totalSent: 1245,
//       responseRate: 32.5, // percent
//       pendingReplies: 87,
//     };
//   }
// };
//   axios.post(`${API_URL}/users/register`, userData);

// // Chatbot API calls
// export const sendChatbotMessage = async (message, userId) =>
//   axios.post(`${API_URL}/chatbot/message`, { message, userId });

// export const testChatbot = async (message) =>
//   axios.post(`${API_URL}/chatbot/test`, { message });


// src/api.js
import axios from "axios";

// ======================= AXIOS INSTANCE =======================
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default api;


// ======================= FETCH BASED APIs =======================
const API_URL = "http://localhost:5000/api";

// Reusable fetch helper
const fetchJson = async (url, options = {}) => {
  const res = await fetch(url, options);
  const text = await res.text();

  try {
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(data?.message || res.statusText || "Request failed");
    return data;
  } catch (err) {
    if (!res.ok) throw new Error(text || res.statusText || "Request failed");
    throw err;
  }
};

// Auth APIs using fetch



// Dashboard Metrics
export const getMetrics = async () => {
  try {
    const data = await fetchJson(`${API_URL}/metrics`);
    return data;
  } catch (err) {
    return {
      totalSent: 1245,
      responseRate: 32.5,
      pendingReplies: 87,
    };
  }
};


// ======================= CHATBOT APIs (AXIOS) =======================
export const sendChatbotMessage = (message, userId) =>
  api.post(`/chatbot/message`, { message, userId });

export const testChatbot = (message) =>
  api.post(`/chatbot/test`, { message });
