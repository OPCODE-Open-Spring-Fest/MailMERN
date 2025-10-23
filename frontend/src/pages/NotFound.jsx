import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // optional icon (you can remove if you like)

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center text-white px-6">
      {/* 404 Text */}
      <h1
        className="text-8xl font-extrabold mb-4"
        style={{ color: "#87CEEB" }}
      >
        404
      </h1>

      {/* Subtitle */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        Oops! Page Not Found
      </h2>

      {/* Message */}
      <p className="text-gray-400 mb-8 max-w-md">
        The page you’re looking for doesn’t exist or might have been moved.
      </p>

      {/* Button */}
     {/* Button */}
<Link
  to="/"
  className="flex items-center gap-2 font-medium px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
  style={{
    backgroundColor: "#87CEEB", // English sky blue
    color: "#000", // black text
    boxShadow: "0 2px 6px rgba(135, 206, 235, 0.25)", // reduced glow
  }}
>
  <ArrowLeft size={20} />
  Go Back Home
</Link>

    </div>
  );
}
