const Alexa = require('ask-sdk');
const https = require('https');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Hi. How can I help you?')
      .reprompt('I didn\'t catch that. What can I help you with?')
      .getResponse();
  },
}; // End LaunchRequestHandler

const StopRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request
    return request.type === 'SessionEndedRequest' ||
      (request.type === 'IntentRequest' &&
        request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Ok master. GoodBye.')
      .getResponse();
  },
};


const SendMessageRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request
    return request.type === 'IntentRequest' &&
      request.intent.name === 'SendMessage';
  },
  async handle(handlerInput) {
    const message = handlerInput.requestEnvelope.request.intent.slots.message.value;
    let returnMessage = '';
    await new Promise((resolve, reject) => {
      https.get('https://www.google.com', function(res) {
        res.setEncoding('utf8');
        res.on('data', function() {});
        res.on('end', function(body) {
          console.log(message);
          returnMessage = message;
          resolve();
        });
      });
    });


    return handlerInput.responseBuilder.speak('Called api: ' + returnMessage).reprompt().getResponse();

  },
};


exports.handler = Alexa.SkillBuilders.standard()
  .addRequestHandlers(
    LaunchRequestHandler,
    StopRequestHandler,
    SendMessageRequestHandler
  )
  .lambda();
