import React from "react";
import ChatbotWidget from "../components/ChatbotWidget";

export default function Home() {
  return (
    <div className="page home">
      <h1>Welcome to MailMERN 🚀</h1>
      <p>
        This is the open-source MERN starter to build a Mass Email &
        Smart Reply System.
      </p>
      
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">🤖 Try Our AI Assistant</h2>
        <p className="text-blue-800 mb-4">
          Click the chat button in the bottom right corner to interact with our AI assistant. 
          It can help you with questions about features, pricing, support, and more!
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Ask about features</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Get pricing info</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Request support</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">General questions</span>
        </div>
      </div>
      
      <ChatbotWidget />
    </div>
  );
}
