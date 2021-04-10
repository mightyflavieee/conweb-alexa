const express = require('express');
const apiRoutes = require('./routes/index');
const app = express();

app.use('/api', apiRoutes);
app.listen(5000);
console.log('listening at 5000');