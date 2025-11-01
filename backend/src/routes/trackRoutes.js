const express = require('express');
const router = express.Router();
const { trackOpen, trackClick } = require('../controllers/trackController');
router.get('/open/:emailId.png', trackOpen);
router.get('/click/:emailId', trackClick);

module.exports = router;
