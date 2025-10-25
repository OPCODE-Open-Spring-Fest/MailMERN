
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { registerUser } from "../services/authService";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!fullname || !email || !password) {
      setErr("All fields are required");
      return;
    }
    setLoading(true);

    try {
      await registerUser({ fullname, email, password });
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-10 border border-gray-700">
        <h1 className="text-4xl font-extrabold mb-4 text-cyan-400 text-center">MailMERN</h1>
        <p className="text-gray-400 mb-8 text-center">Create your account to get started</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullname" className="block mb-2 font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              id="fullname"
              placeholder="Full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
          </div>

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
                className="absolute right-3 top-4 text-gray-400 hover:text-cyan-400 transition"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          {err && <p className="text-red-500 text-center">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 font-semibold cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
