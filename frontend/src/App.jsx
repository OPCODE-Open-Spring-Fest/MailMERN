import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Your Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import TemplateBuilder from "./pages/Campaign";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/Forgotpassword";
import Contacts from "./pages/Contact";
import BulkEmail from "./pages/BulkEmail";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />


          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/builder"
              element={
                <ProtectedRoute>
                  <TemplateBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bulk-email"
              element={
                <ProtectedRoute>
                  <BulkEmail />
                </ProtectedRoute>
              }
            />     
            <Route path="*" element={<NotFound />} />
          </Routes> 
          
          <Footer />


          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: '#333',
                  color: '#fff',
                },
              },
              error: {
                style: {
                  background: '#333',
                  color: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}