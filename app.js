const express = require('express');
const apiRoutes = require('./routes/index');
const app = express();

app.use('/', apiRoutes);
app.listen(5000);
console.log('Listening at 5000');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 6666 });

console.log("Server up!");

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
});