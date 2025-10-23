const OpenAI = require('openai');
const logger = require('../utils/logger');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Predefined responses for common queries (fallback when OpenAI is not available)
const predefinedResponses = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What can I assist you with?",
    "Welcome! I'm here to help with your questions."
  ],
  pricing: [
    "Our pricing plans start at $9.99/month for basic features. Would you like to see our detailed pricing?",
    "We offer flexible pricing options. Let me connect you with our sales team for a personalized quote.",
    "You can find our current pricing on our website. We also offer custom enterprise solutions."
  ],
  support: [
    "I'm here to help! Can you describe the issue you're experiencing?",
    "Let me assist you with that. Please provide more details about your problem.",
    "I'll do my best to resolve your issue. What specific help do you need?"
  ],
  features: [
    "Our platform offers mass email sending, AI auto-responses, contact management, and analytics. What specific feature interests you?",
    "We have comprehensive email marketing tools including templates, scheduling, and tracking. Would you like a demo?",
    "Our main features include bulk email campaigns, automated responses, and detailed analytics. Which area would you like to explore?"
  ],
  default: [
    "I understand you're asking about that. Let me help you with more information.",
    "That's a great question! I'd be happy to assist you with that.",
    "I can help you with that. Let me provide you with the information you need."
  ]
};

// Function to categorize user message
const categorizeMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'greeting';
  } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
    return 'pricing';
  } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
    return 'support';
  } else if (lowerMessage.includes('feature') || lowerMessage.includes('capability') || lowerMessage.includes('what can')) {
    return 'features';
  }
  
  return 'default';
};

// Function to analyze sentiment
const analyzeSentiment = (message) => {
  const lowerMessage = message.toLowerCase();
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'like', 'thanks', 'thank you'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed'];
  
  const hasPositive = positiveWords.some(word => lowerMessage.includes(word));
  const hasNegative = negativeWords.some(word => lowerMessage.includes(word));
  
  if (hasPositive && !hasNegative) return 'positive';
  if (hasNegative && !hasPositive) return 'negative';
  return 'neutral';
};

// Function to get predefined response
const getPredefinedResponse = (category) => {
  const responses = predefinedResponses[category] || predefinedResponses.default;
  return responses[Math.floor(Math.random() * responses.length)];
};

// Main chatbot function
const askBot = async (message, userId = null) => {
  try {
    let response;
    let category = categorizeMessage(message);
    let sentiment = analyzeSentiment(message);
    
    // Try OpenAI API first if API key is available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful customer service assistant for MailMERN, an email marketing platform. 
              You help users with questions about:
              - Mass email sending and campaigns
              - AI-powered auto-responses
              - Contact management
              - Email templates and scheduling
              - Pricing and features
              - Technical support
              
              Keep responses concise, helpful, and professional. If you don't know something, offer to connect them with human support.`
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        });
        
        response = completion.choices[0].message.content;
        logger.info('OpenAI API response generated successfully');
      } catch (openaiError) {
        logger.warn('OpenAI API failed, using predefined response:', openaiError.message);
        response = getPredefinedResponse(category);
      }
    } else {
      // Use predefined responses when OpenAI API key is not available
      response = getPredefinedResponse(category);
      logger.info('Using predefined response for category:', category);
    }
    
    return {
      reply: response,
      category,
      sentiment,
      timestamp: new Date(),
      userId
    };
    
  } catch (error) {
    logger.error('Error in askBot function:', error);
    return {
      reply: "I apologize, but I'm experiencing technical difficulties. Please try again later or contact our support team.",
      category: 'default',
      sentiment: 'neutral',
      timestamp: new Date(),
      userId,
      error: error.message
    };
  }
};

module.exports = { 
  askBot
};
