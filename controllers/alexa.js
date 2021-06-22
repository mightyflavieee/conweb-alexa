const Alexa = require("ask-sdk");
const https = require("https");
const io = require("socket.io-client");
const BotConnector = require("./botConnector");
const VoiceHelper = require("../helpers/alexa-voice-helper");
const util = require('util')

const repromptMessage = VoiceHelper.emphasis("Hello, are you still there?", "strong")

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    console.log("LaunchRequest received");
    const connector = BotConnector.getInstance();
    const idConnection = handlerInput.requestEnvelope.session.user.userId;
    connector.addConnection(idConnection);
    return handlerInput.responseBuilder
      .speak("Hi! Welcome to the ConWeb project, which website do you want to open?")
      .reprompt(repromptMessage)
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
      .speak("Ending navigation, goodbye.")
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
    console.log("SendRequest recevied");
    const idConnection = handlerInput.requestEnvelope.session.user.userId;
    const connector = BotConnector.getInstance();
    const connection = connector.getConnection(idConnection);
    connection.emit("send_request", { request: message });
    const frameworkResponse = await new Promise((resolve, reject) => {
      connection.on("response_ready", (response) => resolve(response));

      console.log("Response fetched");
      
    });

    console.log(frameworkResponse);

    const response = frameworkResponse.response.response;
    let toAlexa;

    console.log(response);

    console.log(util.inspect(response, false, null, true));
    if(response){
      if(response.content){
        toAlexa = VoiceHelper.list(response.content);
      } else {
        toAlexa = VoiceHelper.list(response.options);
      }
    }


    return handlerInput.responseBuilder
      .speak(toAlexa)
      .reprompt(repromptMessage)
      .getResponse();
  },
};

const CheckReadyRequestHandler = {
  canHandle(handlerInput){
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" && request.intent.name === "CheckReady"
    );
  },

  async handle(handlerInput){
    const idConnection = handlerInput.requestEnvelope.session.user.userId;
    const connector = BotConnector.getInstance();
    const readyMessage = connector.getReadyMessage(idConnection);
    if(readyMessage){
      return handlerInput.responseBuilder.speak(readyMessage).reprompt(repromptMessage).
      getResponse();
    } else {
      return handlerInput.responseBuilder.speak(VoiceHelper.disappointed('Bot is not ready yet.')).reprompt(repromptMessage)
      .getResponse();
    }
  }
};

function getUrlToOpen(url){
  if(url === "landing") return "http://conweb.mateine.org/2021/site-bot-demo/dist/";
  return "http://conweb.mateine.org/examples/index.html";
}

const OpenWebpageRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" && request.intent.name === "OpenWebpage"
    );
  },
  async handle(handlerInput) {
    const url = handlerInput.requestEnvelope.request.intent.slots.url.value;
    const idConnection = handlerInput.requestEnvelope.session.user.userId;
    const connector = BotConnector.getInstance();
    const connection = connector.getConnection(idConnection);
    connection.emit("open_page", {
      url: getUrlToOpen(url),
    });
    connection.on("page_loaded", (response)=>{
      console.log("page loaded");
      connector.addReadyMessage(idConnection, VoiceHelper.excited("Page is loaded now. I am ready."))
    });
    const readyMessage = connector.getReadyMessage(idConnection);
    let message; 
    if(readyMessage){
      message = "Page is loaded, I am ready to navigate!";
    } else {
      message = "Page is loading, say ready to check the status";
    }
    return handlerInput.responseBuilder.speak(message).reprompt(repromptMessage).getResponse();
  },
};

// previous skill id: amzn1.ask.skill.70b73154-805a-4ef4-bd91-3ccb95f548ce

const skillBuilder = Alexa.SkillBuilders.custom()
  .withSkillId("amzn1.ask.skill.32b43ff1-d04f-4d77-89e4-f4c83011ef45")
  .addRequestHandlers(
    LaunchRequestHandler,
    StopRequestHandler,
    SendMessageRequestHandler,
    OpenWebpageRequestHandler,
    CheckReadyRequestHandler
  );

const skill = skillBuilder.create();
module.exports = skill;
