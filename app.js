const express = require('express');

const alexaRoutes = require('./routes/alexa');

const app = express();

app.use('/middleware', alexaRoutes);

app.listen(5000);

/*
const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');

const app = express();
const skillBuilder = Alexa.SkillBuilders.custom();
const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, true, true);

app.post('/', adapter.getRequestHandlers());
app.listen(3000);
*/