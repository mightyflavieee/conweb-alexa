const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const alexaSkill = require('../controllers/alexa');
const router = express.Router();


const adapter = new ExpressAdapter(alexaSkill, true, true);
router.post('/', adapter.getRequestHandlers());


module.exports = router;

