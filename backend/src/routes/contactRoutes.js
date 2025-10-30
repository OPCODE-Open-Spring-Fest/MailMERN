const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', contactsController.listContacts);
// Create
router.post('/', contactsController.createContact);
// Delete
router.delete('/:id', contactsController.deleteContact);
// Bulk delete
router.delete('/', contactsController.bulkDelete);
//import
router.post('/import', upload.single('file'), contactsController.importContacts);
//export
router.get('/export', contactsController.exportContacts);

module.exports = router;