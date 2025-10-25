// src/services/authService.js

import api from "./api";


// Login API
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data; // return only the data
};

// Register API
export const registerUser = async ({ fullname, email, password }) => {
  const response = await api.post("/auth/register", { name: fullname, email, password });
  return response.data;
};

// Send OTP to email
export const sendOtp = async (email) => {
  const response = await api.post("/auth/send-otp", { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const resetPassword = async (email, newPassword) => {
  const response = await api.post("/auth/reset-password", { email, newPassword });
  return response.data;
};
