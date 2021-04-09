const express = require('express');

const alexaController = require('../controllers/alexa');

const router = express.Router();

router.post(alexaController.getResponseFromPython);

module.exports = router;