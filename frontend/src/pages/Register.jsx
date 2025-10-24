import React, { useState } from "react";
import { toast } from "react-hot-toast";       
import { useNavigate } from "react-router-dom"; 
import axios from "axios";                     

export default function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Registering..."); 

    try {
      // 7. Make API call
      const { data } = await axios.post(
        "/api/v1/user/register",
        user, 
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      
      toast.dismiss(loadingToast); 
      
      if (data.success) {
        toast.success(data.message || "Registration successful! Please login.");
        navigate("/login"); 
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
      }

    } catch (error) {
      
      console.error("Registration error:", error);
      toast.dismiss(loadingToast); 
      
     
      const errorMessage =
        error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page register">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
        {}
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}