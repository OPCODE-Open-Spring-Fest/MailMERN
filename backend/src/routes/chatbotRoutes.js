const express = require('express');
const router = express.Router();
const {
  sendMessage,
  testChatbot
} = require('../controllers/chatbotController');
const { validateChatbotSendMessage } = require('../middlewares/validationMiddleware');

// POST /api/chatbot/message - Send a message to the chatbot
router.post('/message',validateChatbotSendMessage, sendMessage);

// POST /api/chatbot/test - Test chatbot functionality (development endpoint)
router.post('/test',validateChatbotSendMessage, testChatbot);

module.exports = router;
