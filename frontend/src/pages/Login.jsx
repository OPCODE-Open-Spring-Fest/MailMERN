import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-hot-toast";
import axios from "axios";                     
import { useAuth } from "../context/AuthContext"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Logging in..."); 

    try {
      
      const { data } = await axios.post(
        "/api/v1/user/login", 
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, 
        }
      );

      
      toast.dismiss(loadingToast); 
      
      if (data.success) {
        toast.success(data.message || "Logged in successfully!");
        login(data.user); 
        navigate("/dashboard"); 
      } else {
        
        toast.error(data.message || "Login failed. Please try again.");
      }

    } catch (error) {
      
      console.error("Login error:", error);
      toast.dismiss(loadingToast); // Dismiss loading toast
      

      const errorMessage =
        error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);

    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="page login">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
       
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}