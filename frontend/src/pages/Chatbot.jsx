import React, { useState, useEffect, useRef } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        message: "Hello! I'm your AI assistant. How can I help you?",
        timestamp: new Date(),
        isBot: true
      }
    ]);
  }, []);

  // ✅ Detect meeting intent
  const detectMeetingIntent = (text) => {
    const t = text.toLowerCase();
    return /(schedule|book|set|create).*(meeting|call|appointment)/i.test(t);
  };

  // ✅ Schedule meeting (Google Calendar or fallback)
  const scheduleMeeting = async (meetingData) => {
    try {
      const res = await fetch('http://localhost:5001/api/google-calendar/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData),
      });

      const data = await res.json();
      if (data.success) {
        return `✅ Meeting scheduled successfully! [View on Google Calendar](${data.eventLink})`;
      } else {
        throw new Error(data.message || 'Failed to schedule meeting');
      }
    } catch (err) {
      console.error('Google Calendar not connected, using mock scheduler.');
      const res = await fetch('http://localhost:5001/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData),
      });
      const data = await res.json();
      return data.success
        ? `📅 Meeting added to internal scheduler for ${meetingData.date} at ${meetingData.time}.`
        : '❌ Failed to schedule meeting.';
    }
  };

  // ✅ Send message logic
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      message: inputMessage,
      timestamp: new Date(),
     isBot: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);


    try {
      // 1️⃣ Meeting intent
      if (detectMeetingIntent(inputMessage)) {
        const meetingData = {
          title: 'Chatbot Meeting',
          date: new Date().toISOString().split('T')[0],
          time:
            inputMessage.match(/(\d{1,2})(:\d{2})?\s?(am|pm)?/)?.[0] || '10:00 AM',
          duration: 30,
          userId: 'demo-user',
        };

        const confirmation = await scheduleMeeting(meetingData);
        const botMessage = {
          id: Date.now() + 1,
          message: confirmation,
          timestamp: new Date(),
          isBot: true,
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      // 2️⃣ Normal chatbot message
      const response = await fetch('http://localhost:5001/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          userId: 'demo-user',
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          message: data.data.response,
          timestamp: new Date(data.data.timestamp),
          isBot: true
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        message: "I'm sorry, I'm having trouble responding right now.",
        timestamp: new Date(),
        isBot: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="page chatbot-page">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.isBot
                      ? 'bg-white border border-gray-200 text-black'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                  <p className="text-sm">🤖 Typing...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
