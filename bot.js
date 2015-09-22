var HTTPS = require('https');
const util = require('util');
const natural = require('natural');
var request = require('request');
var botID = process.env.BOT_ID;


function respond() {
  var request = JSON.parse(this.req.chunks[0]),
  index = request.text.indexOf('/g');
  
  if (index != -1 && request.name != 'gifbot') {
    searchTerm = request.text.substr(3);
    this.res.writeHead(200);
    requestLink(searchTerm);
    this.res.end();
  } else {
    this.res.writeHead(200);
    console.log("don't care");
    this.res.end();
  }
}  
  
function requestLink(searchTerm) {
  request('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + searchTerm, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    jsonData = body,
    parsedData = JSON.parse(jsonData),
    postMessage(parsedData.data.image_url);
   }
});  
} 

function postMessage(botResponse) {
  var options, body, botReq;


  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

exports.respond = respond;