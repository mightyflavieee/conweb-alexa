const express = require('express');
const apiRoutes = require('./routes/index');
const app = express();

app.use('/', apiRoutes);
app.listen(5000);
console.log('Listening at 5000');