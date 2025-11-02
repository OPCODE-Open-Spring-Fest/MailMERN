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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />


          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/builder" element={<TemplateBuilder />} />
           <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/contacts' element={<Contacts/>}/>
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