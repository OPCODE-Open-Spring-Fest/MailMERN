import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-600">
        {/* Left Side — Branding */}
        <p className="text-center md:text-left mb-3 md:mb-0">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-slate-800">MailMERN</span> ·
          <span className="ml-1">Open Source Project</span> ·
          <span className="ml-1">Maintainer: code name Silver</span>
        </p>

        {/* Right Side — Links */}
        <div className="flex space-x-5 text-slate-500">
          <a
            href="#"
            className="hover:text-slate-900 transition-colors duration-200"
          >
            Docs
          </a>
          <a
            href="#"
            className="hover:text-slate-900 transition-colors duration-200"
          >
            GitHub
          </a>
          <a
            href="#"
            className="hover:text-slate-900 transition-colors duration-200"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
