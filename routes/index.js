const express = require('express');
const router = express.Router();
const alexaRouter = require('./alexa');

router.use('/alexa', alexaRouter)

module.exports = router;