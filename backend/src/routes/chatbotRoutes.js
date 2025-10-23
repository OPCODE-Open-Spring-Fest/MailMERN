const express = require('express');
const router = express.Router();
const {
  sendMessage,
  testChatbot
} = require('../controllers/chatbotController');

// POST /api/chatbot/message - Send a message to the chatbot
router.post('/message', sendMessage);

// POST /api/chatbot/test - Test chatbot functionality (development endpoint)
router.post('/test', testChatbot);

module.exports = router;
