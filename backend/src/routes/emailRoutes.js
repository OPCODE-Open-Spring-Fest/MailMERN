const express = require('express');
const router = express.Router();
const { send, test, testEthereal } = require('../controllers/emailController');

router.post('/send', send);

router.post('/test', test);
router.post('/test-ethereal', testEthereal);
module.exports = router;