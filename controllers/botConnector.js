const WebSocket = require("ws");

class PrivateBotConnector {
  constructor() {
    console.log("Bot connector created.");
  }

  connections = [];

  addConnection(id) {
    try {
      console.log(`Adding connection ${id}`);
      const socketConnection = new WebSocket("ws://localhost:6666");
      socketConnection.on("error", () =>
        console.log("Something went wrong in the socket connection.")
      );
      socketConnection.on("open", () => console.log("Socket connected."));
      socketConnection.on("close", () => this.removeConnection(id));
      this.connections.push({
        id: id,
        socket: socketConnection,
      });
    } catch (err) {
      console.log(err.stack);
    }
  }

  removeConnection(id){
    this.connections = connections.filter(conn=>conn.id != id);
  }

  getConnection(id) {
    console.log(`Retrieving connection ${id}`);
    return this.connections.find((map) => map.id === id).socket;
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
