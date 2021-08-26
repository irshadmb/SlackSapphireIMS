var request = require('request');

module.exports = {
createRequest : async function (title, desc, client, user){
  var options = {
  'method': 'POST',
  'url': process.env.SAPP_APP_URL+'/api/ticket/create',
  'headers': {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'int-log-id': 'unique_id_for_each_request',
    'key': process.env.SAPP_API_KEY,
    'token': process.env.SAPP_API_TOKEN
  },
  body: JSON.stringify({
    "requestType": "GET_TICKET",
    "integrationLogId": "qwertyasdfg",
    "iteration": 0,
    "ticket": {
      "project": {
        "projectName": "Service Request"
      },
      "service": {
        "name": "Application Services"
      },
      "title": title,
      "probDescription": desc,
      "submittedBy": {
        "userName": "admin"
      }
    }
  })

};

await request(options, function (error, response) {
  if (error) throw new Error(error);
  var json = JSON.parse(response.body);
  try {
      client.chat.postMessage({
      channel: user,
      text: 'Your request id is '+json.requestNumber
      });
    }
    catch (error) {
      console.error(error);
    }
    
  
});
}
};