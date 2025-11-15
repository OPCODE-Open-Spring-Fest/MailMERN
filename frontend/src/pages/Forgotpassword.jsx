import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { sendOtp, verifyOtp, resetPassword } from "../services/authService";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email) {
      setErr("Email is required");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const result = await sendOtp(email);
      if (result.success || result.message) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        setErr(result.message || "Failed to send OTP");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to send OTP";
      setErr(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!otp) {
      setErr("OTP is required");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const result = await verifyOtp(email, otp);
      if (result.success || result.message) {
        toast.success("OTP verified successfully!");
        setStep(3);
      } else {
        setErr(result.message || "OTP verification failed");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "OTP verification failed";
      setErr(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e?.preventDefault();
    if (!newPassword || !confirmPassword) {
      setErr("Both password fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    setErr("");
    try {
      const result = await resetPassword(email, newPassword);
      if (result.success || result.message) {
        toast.success("Password reset successfully! Please login.");
        navigate("/login");
      } else {
        setErr(result.message || "Password reset failed");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Password reset failed";
      setErr(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-cyan-400 cursor-pointer"
            onClick={() => navigate("/login")}
          />
          <h1 className="text-2xl font-bold text-center text-cyan-400">Forgot Password</h1>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label className="block text-gray-300 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-700 rounded-lg px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>
            {err && <p className="text-red-500 text-center mt-2">{err}</p>}
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <label className="block text-gray-300 font-medium mb-1">OTP</label>
            <input
              type="text"
              maxLength="4"
              className="w-full border border-gray-700 rounded-lg px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
            />
            <button
              type="submit"
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
            </button>
            {err && <p className="text-red-500 text-center mt-2">{err}</p>}
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setErr("");
              }}
              className="w-full mt-2 text-cyan-400 text-sm hover:underline"
            >
              Resend OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <label className="block text-gray-300 font-medium mb-1">New Password</label>
            <input
              type="password"
              className="w-full border border-gray-700 rounded-lg px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="New Password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
            />
            <label className="block text-gray-300 font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-gray-700 rounded-lg px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
            <button
              type="submit"
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
            </button>
            {err && <p className="text-red-500 text-center mt-2">{err}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
