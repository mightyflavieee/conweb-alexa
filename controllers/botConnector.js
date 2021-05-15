///
/*.exports = {
    const connections : [],

    function create/*Connection(id){
        let socket = new WebSocket("wss://localhost/alexa:8080");
        console.log("Connection established with Python Bot");
        socket.onmessage = (event) => {};
        connections.push({
            id: id
        });
    }
};

*/

class PrivateBotConnector {
  constructor() {
    console.log("Bot connector created.");
  }

  connections = [];

  addConnection(id) {
    console.log(`Adding connection ${id}`);
    const socketConnection = new WebSocket("wss://localhost/browse:5050")
      .onclose((event) => console.log(event))
      .onopen((socket) => console.log(socket));
    this.connections.push({
      id: socketConnection,
    });
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
