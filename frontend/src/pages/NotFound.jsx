import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-center text-white px-6">
      {/* 404 Title */}
      <h1 className="text-[7rem] md:text-[9rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 drop-shadow-lg">
        404
      </h1>

      
      <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-gray-100">
        Page Not Found
      </h2>

     
      <p className="text-gray-400 mb-10 max-w-md text-lg leading-relaxed">
        The page you’re looking for doesn’t exist or might have been moved.  
        Please check the URL or return to the homepage.
      </p>

    
      <Link
        to="/"
        className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-black font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-sky-500/30"
      >
        <ArrowLeft size={20} />
        Go Back Home
      </Link>

      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl absolute -top-40 -left-40 animate-pulse"></div>
        <div className="w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl absolute bottom-0 right-0 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
