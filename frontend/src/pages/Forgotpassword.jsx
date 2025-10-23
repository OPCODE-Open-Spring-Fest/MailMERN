import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { sendOtp, verifyOtp, resetPassword } from "../services/authService";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await sendOtp(email);
      setErr("");
      setStep(2);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      setErr("");
      setStep(3);
    } catch (error) {
      setErr(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, newPassword);
      setErr("");
      navigate("/signin");
    } catch (error) {
      setErr(error?.response?.data?.message || "Password reset failed");
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
          <div>
            <label className="block text-gray-300 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-700 rounded-lg px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>
            {err && <p className="text-red-500 text-center mt-2">{err}</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-gray-300 font-medium mb-1">OTP</label>
            <input
              type="text"
              className="w-full border border-gray-700 rounded-lg px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
            </button>
            {err && <p className="text-red-500 text-center mt-2">{err}</p>}
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-gray-300 font-medium mb-1">New Password</label>
            <input
              type="password"
              className="w-full border border-gray-700 rounded-lg px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label className="block text-gray-300 font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-gray-700 rounded-lg px-3 py-2 mb-4 bg-gray-900 text-gray-100 focus:outline-none"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
            </button>
            {err && <p className="text-red-500 text-center mt-2">{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
