const Alexa = require("ask-sdk");
const https = require("https");
const io = require("socket.io-client");
const BotConnector = require("./botConnector");
const VoiceHelper = require("../helpers/alexa-voice-helper");
const util = require('util')


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
      .reprompt()
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
      return handlerInput.responseBuilder.speak(readyMessage).reprompt().
      getResponse();
    } else {
      return handlerInput.responseBuilder.speak(VoiceHelper.disappointed('Bot is not ready yet.')).reprompt()
      .getResponse();
    }
  }
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
    connection.emit("open_page", {
      url: "http://conweb.mateine.org/examples/index.html",
    });
    connection.on("page_loaded", (response)=>{
      console.log("page loaded");
      connector.addReadyMessage(idConnection, VoiceHelper.excited("Page is loaded now. I am ready."))
    });
    return handlerInput.responseBuilder.speak("I have sent open request to framework.").reprompt().getResponse();
  },
};

// previous skill id: amzn1.ask.skill.70b73154-805a-4ef4-bd91-3ccb95f548ce

const skillBuilder = Alexa.SkillBuilders.custom()
  .withSkillId("amzn1.ask.skill.36fd5f85-9efd-4d01-9555-1648dd9bb0ac")
  .addRequestHandlers(
    LaunchRequestHandler,
    StopRequestHandler,
    SendMessageRequestHandler,
    OpenWebpageRequestHandler,
    CheckReadyRequestHandler
  );

const skill = skillBuilder.create();
module.exports = skill;
