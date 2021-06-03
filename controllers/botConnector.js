const io = require("socket.io-client");

class PrivateBotConnector {
  constructor() {
    console.log("Bot connector created.");
  }

  connections = [];

  addConnection(id) {
    try {
      console.log(`Adding connection ${id}`);
      const socketConnection = io("http://localhost:8000/browse",{ 
        transports : [ "websocket", "polling"],
        pingTimeout: 10000,
        pingInterval: 30000,
        forceNew : false
      });
      socketConnection.on('connect', () => {
        console.log("Successfully connected to the server.");
        socketConnection.emit("start_session", {user: id});
      });
      socketConnection.on('session_ready', ()=>{
        console.log("User session created.");
      })
      socketConnection.on('connect_error', err => { console.log("Something went wrong in the socket connection.", err); });
      socketConnection.on("disconnect", () => this.removeConnection(id));
      this.connections.push({
        id: id,
        socket: socketConnection,
        readyMessage: false,
      });
    } catch (err) {
      console.log(err.stack);
    }
  }

  addReadyMessage(id, message){
    this.connections.find((map)=>map.id === id).readyMessage = message;
  }

  removeConnection(id){
    this.connections = this.connections.filter(conn=>conn.id != id);
  }

  getConnection(id) {
    console.log(`Retrieving connection ${id}`);
    return this.connections.find((map) => map.id === id).socket;
  }

  getReadyMessage(id){
    return this.connections.find((map) => map.id === id).readyMessage;
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
