
# Table of Contents

[1. Overview 3](#overview)

[2. Prerequisites 3](#prerequisites)

[3. Development 3](#development)

[**Setting Up an App** 3](#setting-up-an-app)

[**Build SapphireIMS Bot using Bolt**
7](#build-sapphireims-bot-using-bolt)

[**Setting Events Registration** 12](#setting-events-registration)

[**Setting Slash Command** 13](#setting-slash-command)

[**Making SapphireIMS bot App Interactive**
14](#making-sapphireims-bot-app-interactive)

#  Overview

> SapphireIMS and Slack integration lets you to keep multiple Slack
> groups up to date on the status of tickets/Requests. To keep your team
> up to date on ticket/request changes
>
> You can do the following with this app:

1.  Use SapphireIMS RPA to automatically send messages regarding
    tickets/Requests to your organization's public Slack channels,
    keeping your team informed.

2.  If you want to keep a small number of users informed about special
    ticketing events, use the same RPA to publish to a private channel.

3.  Send support agents Direct Messages (DMs) regarding tickets that
    have been assigned or modified in their queue.

4.  To convert Direct Message (DM) discussions with peers and customers
    straight to Service Request or Incident, use the SapphireIMS
    'Create Request/Incident' slash command.

# Prerequisites

-   Slack integration depends on SapphireIMS API for actions.

-   Usernames in Slack and SapphireIMS has to be in sync (Note: We can
    create a additional field to update the Slack username).

-   Node.js 12.

-   Slack bolt JavaScript SDK.

# Development

> We must create a SapphireIMS bot and register within Slack App.
>
> Following steps provide detail on the same.

### **Setting Up an App**

Open in Web Browser [Slack App
Management](https://api.slack.com/apps?new_app=1&ref=tutorial_hello_world_bolt)
and create an app. In dialog box give app name as SapphireIMS, Choose a
workspace to install SapphireIMS app and click Create App.

![screen - Slack config create a slack
app](./images/media/image3.png)

Once SapphireIMS App is created, click Settings -\> Basic Information
Screen, scroll down to App Credentials, and find Signing secret by
clicking Show to reveal it. Copy the string, we have to store in .env
file.

![screen - Slack config app
credentials](./images/media/image4.png)

Create a .env file in your nodejs project and add slack related
environment variables
SLACK_SIGNING_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx and paste signing
secret code.

Next go to Features -\> OAuth & Permissions screen and scroll down to
Bot Token Scopes to specify the OAuth Scopes. Select chat:write to allow
the bot to post in channels in which it's added. Also, select chat:write
public to allow the bot to post public channels.

![screen - slack config
scopes](./images/media/image5.png)

We must obtain OAuth token, Go to Install App from left hand menu and
click Install App to workspace button. Once finished, get the bot token
and paste in .env SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxxxxxxxxxxxxxxxxx

![screen - slack config
install](./images/media/image6.png)

### **Build SapphireIMS Bot using Bolt**

Let us build the nodejs based project by executing npm init command and
following steps prompted by npm. Which will create package.json file in
the folder.

Step -1 : We must install Bold sdk -- To do same we must execute "npm i
\@slack/bolt"

Step -2 : Create a file index.js which will our main file.

Step -3 : Add the following code as below in index.js
```
+-----------------------------------------------------------------------+
| const { App } = require('\@slack/bolt');                            |
|                                                                       |
| var createTicket = require('./createRequest');                      |
|                                                                       |
| const payload = require('./payload');                               |
|                                                                       |
| const app = new App({                                                 |
|                                                                       |
| signingSecret: process.env.SLACK_SIGNING_SECRET,                      |
|                                                                       |
| token: process.env.SLACK_BOT_TOKEN,                                   |
|                                                                       |
| });                                                                   |
|                                                                       |
| (async () => {                                                        |
|                                                                       |
| // Start the app                                                      |
|                                                                       |
| await app.start(process.env.PORT \|\| 3000);                          |
|                                                                       |
| app.command('/createincident', async ({ command, ack, body, client  |
| }) => {                                                               |
|                                                                       |
| await ack()                                                           |
|                                                                       |
| try {                                                                 |
|                                                                       |
| // Call views.open with the built-in client                           |
|                                                                       |
| const result = await client.views.open({                              |
|                                                                       |
| // Pass a valid trigger_id within 3 seconds of receiving it           |
|                                                                       |
| trigger_id: body.trigger_id,                                          |
|                                                                       |
| // View payload                                                       |
|                                                                       |
| view: payload                                                         |
|                                                                       |
| });                                                                   |
|                                                                       |
| console.log(result);                                                  |
|                                                                       |
| }                                                                     |
|                                                                       |
| catch (error) {                                                       |
|                                                                       |
| console.error(error);                                                 |
|                                                                       |
| }                                                                     |
|                                                                       |
| })                                                                    |
|                                                                       |
| app.event('app_mention', async ({ event, say }) => {                |
|                                                                       |
| console.log(event);                                                   |
|                                                                       |
| await say(\`Hello \<@\${event.user}>\`);                              |
|                                                                       |
| });                                                                   |
|                                                                       |
| app.view('submit_ticket', async ({ ack, body, view, client }) => {    |
|                                                                       |
| await ack();                                                          |
|                                                                       |
| console.log(body);                                                    |
|                                                                       |
| console.log(view);                                                    |
|                                                                       |
| const user = body['user']['id'];                                      |
|                                                                       |
| const title =                                                         |
| view['                                                                |
| state']['values']['title_block']['title']['value'];                   |
|                                                                       |
| const desc =                                                          |
| view['state'][                                                        |
| 'values']['description_block']['description']['value'];               |
|                                                                       |
| //Create a request in SapphireIMS                                     |
|                                                                       |
| createTicket.createRequest(title,desc, client, user);                 |
|                                                                       |
| });                                                                   |
|                                                                       |
| console.log('⚡️ Bolt app is running!');                               |
|                                                                       |
| })();                                                                 |
+=======================================================================+
```
+-----------------------------------------------------------------------+

Step -- 4: Create a file payload.js, which is used for designing the
dialog Modal for getting the details from the user in the form

Ex:

![Graphical user interface, text, application, email Description
automatically
generated](./images/media/image7.png)

The above form payload is given below for reference which can be created
by using [slack
builder](https://app.slack.com/block-kit-builder/TBAKXMP5Y)
```
+-----------------------------------------------------------------------+
| {                                                                     |
|                                                                       |
| "type": "modal",                                                  |
|                                                                       |
| "title": {                                                          |
|                                                                       |
| "type": "plain_text",                                             |
|                                                                       |
| "text": "Submit a Incident!!!"                                    |
|                                                                       |
| },                                                                    |
|                                                                       |
| "callback_id": "submit_ticket",                                   |
|                                                                       |
| "submit": {                                                         |
|                                                                       |
| "type": "plain_text",                                             |
|                                                                       |
| "text": "Submit"                                                  |
|                                                                       |
| },                                                                    |
|                                                                       |
| "blocks": [                                                        |
|                                                                       |
| {                                                                     |
|                                                                       |
| "block_id": "title_block",                                        |
|                                                                       |
| "type": "input",                                                  |
|                                                                       |
| "label": {                                                          |
|                                                                       |
| "type": "plain_text",                                             |
|                                                                       |
| "text": "Title"                                                   |
|                                                                       |
| },                                                                    |
|                                                                       |
| "element": {                                                        |
|                                                                       |
| "action_id": "title",                                             |
|                                                                       |
| "type": "plain_text_input"                                        |
|                                                                       |
| },                                                                    |
|                                                                       |
| "hint": {                                                           |
|                                                                       |
| "type": "plain_text",                                             |
|                                                                       |
| "text": "30 second summary of the problem"                        |
|                                                                       |
| }                                                                     |
|                                                                       |
| },                                                                    |
|                                                                       |
| {                                                                     |
|                                                                       |
| "block_id": "description_block",                                  |
|                                                                       |
| "type": "input",                                                  |
|                                                                       |
| "label": {                                                          |
|                                                                       |
| "type": "plain_text",                                             |
|                                                                       |
| "text": "Description"                                             |
|                                                                       |
| },                                                                    |
|                                                                       |
| "element": {                                                        |
|                                                                       |
| "action_id": "description",                                       |
|                                                                       |
| "type": "plain_text_input",                                       |
|                                                                       |
| "multiline": true                                                   |
|                                                                       |
| },                                                                    |
|                                                                       |
| "optional": true                                                    |
|                                                                       |
| },                                                                    |
|                                                                       |
| {                                                                     |
|                                                                       |
| "block_id": "urgency_block",                                      |
|                                                                       |
| "type": "input",                                                  |
|                                                                       |
| "label": {                                                          |
|                                                                       |
| "type": "plain_text",                                             |
|                                                                       |
| "text": "Importance"                                              |
|                                                                       |
| },                                                                    |
|                                                                       |
| "element": {                                                        |
|                                                                       |
| "action_id": "urgency",                                           |
|                                                                       |
| "type": "static_select",                                          |
|                                                                       |
| "options": [                                                       |
|                                                                       |
| {                                                                     |
|                                                                       |
| "text": {                                                           |
|                                                                       |
| "type": "plain_text",                                             |
|                                                                       |
| "text": "High"                                                    |
|                                                                       |
| },                                                                    |
|                                                                       |
| "value": "high"                                                   |
|                                                                       |
| },                                                                    |
|                                                                       |
| {                                                                     |
|                                                                       |
| "text": {                                                           |
|                                                                       |
| "type": "plain_text",                                             |
|                                                                       |
| "text": "Medium"                                                  |
|                                                                       |
| },                                                                    |
|                                                                       |
| "value": "medium"                                                 |
|                                                                       |
| },                                                                    |
|                                                                       |
| {                                                                     |
|                                                                       |
| "text": {                                                           |
|                                                                       |
| "type": "plain_text",                                             |
|                                                                       |
| "text": "Low"                                                     |
|                                                                       |
| },                                                                    |
|                                                                       |
| "value": "low"                                                    |
|                                                                       |
| }                                                                     |
|                                                                       |
| ]                                                                    |
|                                                                       |
| },                                                                    |
|                                                                       |
| "optional": true                                                    |
|                                                                       |
| }                                                                     |
|                                                                       |
| ]                                                                    |
|                                                                       |
| }                                                                     |
+=======================================================================+
```
+-----------------------------------------------------------------------+

Step -- 5: Let us create ticket/request logic which will be used to
create a request in SapphireIMS ( createRequest.js )
```
+-----------------------------------------------------------------------+
| var request = require('request');                                   |
|                                                                       |
| module.exports = {                                                    |
|                                                                       |
| createRequest : async function (title, desc, client, user){           |
|                                                                       |
| var options = {                                                       |
|                                                                       |
| 'method': 'POST',                                                 |
|                                                                       |
| 'url': process.env.SAPP_APP_URL+'/api/ticket/create',             |
|                                                                       |
| 'headers': {                                                        |
|                                                                       |
| 'Accept': 'application/json',                                     |
|                                                                       |
| 'Content-Type': 'application/json',                               |
|                                                                       |
| 'int-log-id': 'unique_id_for_each_request',                       |
|                                                                       |
| 'key': process.env.SAPP_API_KEY,                                    |
|                                                                       |
| 'token': process.env.SAPP_API_TOKEN                                 |
|                                                                       |
| },                                                                    |
|                                                                       |
| body: JSON.stringify({                                                |
|                                                                       |
| "requestType": "GET_TICKET",                                      |
|                                                                       |
| "integrationLogId": "qwertyasdfg",                                |
|                                                                       |
| "iteration": 0,                                                     |
|                                                                       |
| "ticket": {                                                         |
|                                                                       |
| "project": {                                                        |
|                                                                       |
| "projectName": "Service Request"                                  |
|                                                                       |
| },                                                                    |
|                                                                       |
| "service": {                                                        |
|                                                                       |
| "name": "Application Services"                                    |
|                                                                       |
| },                                                                    |
|                                                                       |
| "title": title,                                                     |
|                                                                       |
| "probDescription": desc,                                            |
|                                                                       |
| "submittedBy": {                                                    |
|                                                                       |
| "userName": "admin"                                               |
|                                                                       |
| }                                                                     |
|                                                                       |
| }                                                                     |
|                                                                       |
| })                                                                    |
|                                                                       |
| };                                                                    |
|                                                                       |
| await request(options, function (error, response) {                   |
|                                                                       |
| if (error) throw new Error(error);                                    |
|                                                                       |
| var json = JSON.parse(response.body);                                 |
|                                                                       |
| try {                                                                 |
|                                                                       |
| client.chat.postMessage({                                             |
|                                                                       |
| channel: user,                                                        |
|                                                                       |
| text: 'Your request id is '+json.requestNumber                      |
|                                                                       |
| });                                                                   |
|                                                                       |
| }                                                                     |
|                                                                       |
| catch (error) {                                                       |
|                                                                       |
| console.error(error);                                                 |
|                                                                       |
| }                                                                     |
|                                                                       |
| });                                                                   |
|                                                                       |
| }                                                                     |
|                                                                       |
| };                                                                    |
+=======================================================================+
```
+-----------------------------------------------------------------------+

Step -- 6: Start the application by running node index.js ( Note : Slack
required your bot to be published in https mode only )

Step -- 7: copy the url which is required for registering events.

### **Setting Events Registration**

We need to subscribe certain events, so that our bot will receive event
payload. Goto Event Subscriptions from left-hand menu, and turn the
toggle on.

Enter the URL which we copied from the Step -- 7 in Request URL field.
We have to append along with the URL /slack/events ex:
[https://server-address:port/slack/events](https://server-address:port/slack/events).

Scroll down to subscribe bot events. Click Add Bot User Event and add
following event

-   App_mention

### **Setting Slash Command**

Slash command is used to invoke the ticket/request creation form.

Ex:

![Graphical user interface, text, application, chat or text message
Description automatically
generated](./images/media/image8.png)

Go to left-hand menu and click Slash Commands -\> Click Create New
Command

![Graphical user interface, text, application, email Description
automatically
generated](./images/media/image9.png)

Note: Request URL we have to use same url which our bot is running and
followed by '/slack/events'

### **Making SapphireIMS bot App Interactive**

Go to left-hand menu and click Interactivity & Shortcuts, toggle the
switch to enable and enter the Request URL with '/slack/events'

Go to left-hand menu and click App Home -\> Scroll down to Message Tab
and make sure it is enabled and check the check box

![Graphical user interface, text, application, email Description
automatically
generated](./images/media/image10.png)
