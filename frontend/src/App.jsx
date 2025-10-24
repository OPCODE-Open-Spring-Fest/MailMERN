import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chatbot from "./pages/Chatbot";
import ForgotPassword from "./pages/Forgotpassword";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";

// Layout controller — hides Navbar/Footer on 404 page
function AppContent() {
  const location = useLocation();

  // Detect if we’re on the 404 page
  const isNotFoundPage =
    location.pathname === "/404" || location.pathname === "/not-found";

  return (
    <div className="app-container">
      {/*Show Navbar & Footer only when NOT on 404 */}
      {!isNotFoundPage && <Navbar />}

      <Routes>
 
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

  
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {!isNotFoundPage && <Footer />}

   
      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: "#333", color: "#fff" } },
          error: { style: { background: "#333", color: "#fff" } },
        }}
      />
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
