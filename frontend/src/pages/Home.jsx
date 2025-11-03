import React from "react";
import { useNavigate } from "react-router-dom";
import ChatbotWidget from "../components/ChatbotWidget";
import {Mail,Brain, BarChart3, Send, Users, Sparkles, Github } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-200 overflow-hidden text-gray-800">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <section className="text-center px-6 md:px-20 mt-20">
        <h2 className="text-5xl md:text-6xl font-extrabold text-black leading-tight">
          Automate Conversations.<br />
          <span className="text-gray-500">Scale Your Email Marketing.</span>
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Build, send, and automate your email campaigns with <strong>AI-powered assistance</strong>.
          MailMERN helps you send mass emails, reply smartly, and manage campaigns — all open-source and built with MERN.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 flex gap-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-700 transition-all duration-300"
          >
           <Send className="w-6 h-6 text-white" />
            Start Now
          </button>
          <a
            href="https://github.com/OPCODE-Open-Spring-Fest/MailMERN"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 flex gap-2 border border-gray-500 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            <Github className="w-6 h-6 text-gray-700" />
             View on GitHub
          </a>
        </div>
      </section>

      {/*Features*/}
      <section className="mt-24 px-6 mb-24 md:px-20">
        <h3 className="text-center text-3xl font-bold text-gray-900 mb-10">
          Powerful Features of MailMERN 
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Send className="w-8 h-8 text-gray-500" />,
              title: "Mass Email Sending",
              desc: "Send thousands of personalized emails with one click using secure SMTP or API integrations."
            },
            {
              icon: <Brain className="w-8 h-8 text-gray-500" />,
              title: "AI Auto-Responder",
              desc: "Automatically reply to user queries, schedule meetings, and answer FAQs with AI."
            },
            {
              icon: <BarChart3 className="w-8 h-8 text-gray-500" />,
              title: "Analytics Dashboard",
              desc: "Track open rates, clicks, and engagement metrics in real-time with visual insights."
            },
            {
              icon: <Users className="w-8 h-8 text-gray-500" />,
              title: "Contact Management",
              desc: "Upload, segment, and manage your contact lists with ease using MongoDB integration."
            },
            {
              icon: <Sparkles className="w-8 h-8 text-gray-500" />,
              title: "Smart Scheduling",
              desc: "Schedule campaigns and follow-ups automatically using Node Cron."
            },
            {
              icon: <Mail className="w-8 h-8 text-gray-500" />,
              title: "Template Builder",
              desc: "Design professional HTML email templates with custom layouts and reusable blocks."
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-lg border border-gray-100 shadow-md rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                {feature.icon}
                <h4 className="text-lg font-semibold text-gray-900">{feature.title}</h4>
              </div>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <ChatbotWidget />
    </div>
  );
}
