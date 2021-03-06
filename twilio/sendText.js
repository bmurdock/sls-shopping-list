const Messenger = require('./messenger.js');
const twilioSid = process.env.TWILIO_SID;
const twilioAuthToken = process.env.TWILIO_AUTH;
const twilioClient = require('twilio')(twilioSid, twilioAuthToken); // eslint-disable-line

module.exports.sendText = (event, context, callback) => {
    console.log('Attempting to send Twilio SMS: ', event);
    // We only want a 10 digit number here, thanks a lot TWILIO!
    if (typeof event.to === 'string' && event.to.length > 10)
    {
        event.to = event.to.slice(event.to.length - 10);
    }
	const messenger = new Messenger(twilioClient);
	const response = {
		headers: {
			'Access-Control-Allow-Origin': '*'
		}, // CORS requirement
		statusCode: 200,
	};
	event = (typeof event === 'string') ? JSON.parse(event) : event;
	Object.assign(event, {
		from: process.env.TWILIO_PHONE
	});
	messenger.send(event).then((message) => {
		console.log(`message ${message.body}`);
		console.log(`date_created: ${message.date_created}`);
		response.body = JSON.stringify({
			message: 'Text message successfully sent!',
			data: message,
		});
		callback(null, response);
	}).catch((error) => {
        console.log('Error sending text: ', error);
		response.statusCode = error.status;
		response.body = JSON.stringify({
			message: error.message,
			error: error, // eslint-disable-line
		});
		callback(null, response);
	});
};