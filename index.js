const { App } = require('@slack/bolt');
var createTicket = require('./createRequest');
const payload = require('./payload');
const dotenv = require('dotenv');
dotenv.config();


const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});


(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);
  
  app.command('/createincident', async ({ command, ack, body, client }) => {
    await ack()
    try {
      // Call views.open with the built-in client
      const result = await client.views.open({
        // Pass a valid trigger_id within 3 seconds of receiving it
        trigger_id: body.trigger_id,
        // View payload
        view: payload
      });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  })

  app.event('app_mention', async ({ event, say }) => {
    console.log(event);
    await say(`Hello <@${event.user}>`);
  });

  app.view('submit_ticket', async ({ ack, body, view, client }) => {
  
    await ack();
    console.log(body);
    console.log(view);
    const user = body['user']['id'];
    const title = view['state']['values']['title_block']['title']['value'];
    const desc = view['state']['values']['description_block']['description']['value'];
    
    //Create a request in SapphireIMS
    createTicket.createRequest(title,desc, client, user);  
    
  });
  console.log('⚡️ Bolt app is running!');
})();

