// All backend API calls will be handled here
// For now, placeholders to help contributors start easily

import axios from "axios";

const API_URL = "http://localhost:5000/api";

// User API calls
export const loginUser = async (credentials) =>
  axios.post(`${API_URL}/users/login`, credentials);

export const registerUser = async (userData) =>
  axios.post(`${API_URL}/users/register`, userData);

// Chatbot API calls
export const sendChatbotMessage = async (message, userId) =>
  axios.post(`${API_URL}/chatbot/message`, { message, userId });

export const testChatbot = async (message) =>
  axios.post(`${API_URL}/chatbot/test`, { message });
