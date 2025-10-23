# 🤖 Chatbot Response Engine

## How It Works

The chatbot uses **OpenAI GPT-3.5-turbo** for intelligent responses to user queries. When OpenAI API is unavailable, it falls back to **predefined responses** for common questions.

### Response Flow:
1. User sends a message
2. System categorizes the message (greeting, pricing, support, features)
3. Analyzes sentiment (positive, negative, neutral)
4. Calls OpenAI API if available, otherwise uses predefined responses
5. Saves conversation to database
6. Returns response to user

### Message Categories:
- **greeting**: hello, hi, hey
- **pricing**: price, cost, pricing
- **support**: help, support, issue, problem
- **features**: feature, capability, what can
- **default**: other queries

### Predefined Responses:
When OpenAI is unavailable, the chatbot uses simple predefined responses:
```javascript
greeting: "Hello! How can I help you today?"
pricing: "Our pricing plans start at $9.99/month..."
support: "I'm here to help! Can you describe the issue?"
features: "Our platform offers mass email sending..."
```

## Setup

1. Add OpenAI API key to `backend/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

2. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Start servers:
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

4. Visit `/chatbot` or use the chat widget

## API Endpoints

- `POST /api/chatbot/message` - Send message, get response
- `GET /api/chatbot/history/:userId` - Get chat history
- `POST /api/chatbot/test` - Test chatbot

## Files Created

**Backend:**
- `services/chatbotService.js` - Core AI logic
- `controllers/chatbotController.js` - API handlers
- `routes/chatbotRoutes.js` - Routes
- `models/Message.js` - Database schema

**Frontend:**
- `pages/Chatbot.jsx` - Chat interface
- `components/ChatbotWidget.jsx` - Embeddable widget