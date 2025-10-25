import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { loginUser } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      console.log(result.data);
      setLoading(false);
      navigate("/"); // Redirect on success
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-10 border border-gray-700">
        <h1 className="text-4xl font-extrabold mb-4 text-cyan-400 text-center">MailMERN</h1>
        <p className="text-gray-400 mb-8 text-center">Sign in to your account</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-12 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-3 text-gray-400 hover:text-cyan-400 transition"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-cyan-400 font-medium hover:underline transition"
            >
              Forgot Password?
            </button>
          </div>

          {err && <p className="text-red-500 text-center">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-cyan-400 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
