const Alexa = require("ask-sdk");
const https = require("https");
const ws = require("ws");
const botConnector = require("./botConnector");

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

    connection.send(message);

    const response = await new Promise((resolve, reject) => {
      connection.on("message", (response) => resolve(response));
    });

    return handlerInput.responseBuilder
      .speak(response)
      .reprompt()
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom()
  .withSkillId("amzn1.ask.skill.70b73154-805a-4ef4-bd91-3ccb95f548ce")
  .addRequestHandlers(
    LaunchRequestHandler,
    StopRequestHandler,
    SendMessageRequestHandler
  );

const skill = skillBuilder.create();
module.exports = skill;
