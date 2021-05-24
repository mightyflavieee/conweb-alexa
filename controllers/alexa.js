const Alexa = require("ask-sdk");
const https = require("https");
const io = require("socket.io-client");
const BotConnector = require("./botConnector");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const connector = BotConnector.getInstance();
    const idConnection = handlerInput.requestEnvelope.session.user.userId;
    connector.addConnection(idConnection);
    return handlerInput.responseBuilder
      .speak("Hi. How can I help you?")
      .reprompt("I didn't catch that. What can I help you with?")
      .getResponse();
  },
};

const StopRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "SessionEndedRequest" ||
      (request.type === "IntentRequest" &&
        request.intent.name === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Ok master. GoodBye.")
      .getResponse();
  },
};

const SendMessageRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" && request.intent.name === "SendMessage"
    );
  },
  async handle(handlerInput) {
    const message =
      handlerInput.requestEnvelope.request.intent.slots.message.value;

    const idConnection = handlerInput.requestEnvelope.session.user.userId;
    const connector = BotConnector.getInstance();
    const connection = connector.getConnection(idConnection);
    connection.emit("send_request", { request: user_request });

    const response = await new Promise((resolve, reject) => {
      connection.on("response_ready", (response) => resolve(response));
    });

    return handlerInput.responseBuilder
      .speak(response)
      .reprompt()
      .getResponse();
  },
};

const OpenWebpageRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" && request.intent.name === "OpenWebpage"
    );
  },
  async handle(handlerInput) {
    //const url = handlerInput.requestEnvelope.request.intent.slots.url.value;
    // custom url is not possible for the moment
    const idConnection = handlerInput.requestEnvelope.session.user.userId;
    const connector = BotConnector.getInstance();
    const connection = connector.getConnection(idConnection);
    console.log("initialized connection");
    connection.emit("open_page", {
      url: "http://conweb.mateine.org/examples/index.html",
    });
    console.log("sended to python bot");
    const response = await new Promise((resolve, reject) => {
      connection.on("page_loaded", (response) => resolve(response));
    });
    if (response.status == "OK") {
      return handlerInput.responseBuilder
        .speak(
          "Web Page opened. Say 'send what can I do here' to see all the options."
        )
        .reprompt()
        .getResponse();
    }
  },
};

const skillBuilder = Alexa.SkillBuilders.custom()
  .withSkillId("amzn1.ask.skill.70b73154-805a-4ef4-bd91-3ccb95f548ce")
  .addRequestHandlers(
    LaunchRequestHandler,
    StopRequestHandler,
    SendMessageRequestHandler,
    OpenWebpageRequestHandler
  );

const skill = skillBuilder.create();
module.exports = skill;
