const { z } = require('zod');

 
const userValidationSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(100, 'Email must be less than 100 characters')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters')
});

const messageValidationSchema = z.object({
  message: z.string()
    .min(1, 'Message is required')
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
  category: z.enum(['general', 'support', 'sales', 'technical', 'other'])
    .optional()
    .default('general'),
  sentiment: z.enum(['positive', 'negative', 'neutral'])
    .optional()
    .default('neutral')
});

const chatbotMessageSchema = z.object({
  message: z.string()
    .min(1, 'Message is required')
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
  userEmail: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(100, 'Email must be less than 100 characters')
    .trim()
    .toLowerCase(),
  userName: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim()
});

 
const chatbotSendMessageSchema = z.object({
  message: z.string()
    .min(1, 'Message is required')
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
  userId: z.string()
    .min(1, 'User ID is required')
    .optional()
});

 
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {       
    
      const validatedData = schema.parse(req.body);   
      
   
      req.body = validatedData;
       
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
       
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors
        });
      }
      
     
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation'
      });
    }
  };
};
const loginValidationSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(100, 'Email must be less than 100 characters')
    .trim()
    .toLowerCase(),
    
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters')
});


 
const validateUser = validateRequest(userValidationSchema);
const validateMessage = validateRequest(messageValidationSchema);
const validateChatbotMessage = validateRequest(chatbotMessageSchema);
const validateChatbotSendMessage = validateRequest(chatbotSendMessageSchema);
const validateLogin = validateRequest(loginValidationSchema);

module.exports = {
  validateLogin,
  validateUser,
  validateMessage,
  validateChatbotMessage,
  validateChatbotSendMessage,
  validateRequest
};
