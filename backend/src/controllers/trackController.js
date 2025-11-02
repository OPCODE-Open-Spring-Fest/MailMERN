// controllers/trackingController.js
const path = require('path');
const fs = require('fs');
const EmailEvent = require('../models/EmailEvent');
const logger = require('../utils/logger');

exports.trackOpen = async (req, res) => {
    const { emailId } = req.params;
    try {
        await EmailEvent.create({
            email: emailId,             // ✅ required field
            eventType: 'opened',
            timestamp: new Date()
        });
        logger.info(`Open event logged for ${emailId}`);
    } catch (err) {
        logger.error('Error logging open event:', err);
    }

    const pixelPath = path.join(__dirname, '../assets/pixel.png');
    if (fs.existsSync(pixelPath)) {
        res.setHeader('Content-Type', 'image/png');
        fs.createReadStream(pixelPath).pipe(res);
    } else {
        const img = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFxgJ/2fT8ZgAAAABJRU5ErkJggg==',
            'base64'
        );
        res.setHeader('Content-Type', 'image/png');
        res.end(img);
    }
};

exports.trackClick = async (req, res) => {
    const { emailId } = req.params;
    const redirect = req.query.redirect;

    try {
        await EmailEvent.create({
            email: emailId,             // ✅ required field
            eventType: 'clicked',
            timestamp: new Date(),
            metadata: { redirect }
        });
        logger.info(`Click event logged for ${emailId}`);
    } catch (err) {
        logger.error('Error logging click event:', err);
    }

    if (redirect) return res.redirect(redirect);
    res.status(400).send('Missing redirect URL');
};
