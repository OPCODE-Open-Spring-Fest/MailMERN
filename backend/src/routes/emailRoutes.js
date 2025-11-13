const express = require('express');
const router = express.Router();
const multer = require('multer');
const { send, test, testEthereal, bulkSend, getCampaign, getCampaigns } = require('../controllers/emailController');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/send', send);

router.post('/test', test);
router.post('/test-ethereal', testEthereal);
router.post('/bulk-send', upload.single('file'), bulkSend);
router.get('/campaign/:id', getCampaign);
router.get('/campaigns', getCampaigns);
module.exports = router;