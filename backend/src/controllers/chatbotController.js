const { askBot } = require('../services/chatbotService');
const Message = require('../models/Message');
const logger = require('../utils/logger');

// Send message to chatbot and get response
exports.sendMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and cannot be empty'
      });
    }

    // Get chatbot response
    const botResponse = await askBot(message, userId);
    
    res.status(200).json({
      success: true,
      data: {
        message: message,
        response: botResponse.reply,
        category: botResponse.category,
        sentiment: botResponse.sentiment,
        timestamp: botResponse.timestamp
      }
    });

  } catch (error) {
    logger.error('Error in sendMessage controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
};


// Test chatbot endpoint (for development/testing)
exports.testChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Test message is required'
      });
    }

    const botResponse = await askBot(message);

    res.status(200).json({
      success: true,
      data: {
        input: message,
        output: botResponse.reply,
        category: botResponse.category,
        sentiment: botResponse.sentiment,
        timestamp: botResponse.timestamp
      }
    });

  } catch (error) {
    logger.error('Error in testChatbot controller:', error);
    res.status(500).json({
      success: false,
      error: 'Chatbot test failed'
    });
  }
};
