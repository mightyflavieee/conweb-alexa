const ws = require("ws");

class PrivateBotConnector {
  constructor() {
    console.log("Bot connector created.");
  }

  connections = [];

  addConnection(id) {
    try {
      console.log(`Adding connection ${id}`);
      const socketConnection = new ws.WebSocket("wss://localhost/browse:5050")
        .onopen((socket) => console.log(socket))
        .onclose((event) => console.log(event));
      this.connections.push({
        id: socketConnection,
      });
    } catch (err) {
      console.log(err.stack);
    }
  }

  getConnection(id) {
    console.log(`Retrieving connection ${id}`);
    return this.connections.find((map) => map.id === id);
  }
}

class BotConnector {
  constructor() {
    throw new Error("Cannot create instance");
  }
  static getInstance() {
    if (!BotConnector.instance) {
      BotConnector.instance = new PrivateBotConnector();
    }
    return BotConnector.instance;
  }
}

module.exports = BotConnector;
