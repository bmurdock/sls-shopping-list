const AWS = require('aws-sdk');
const fetch = require('node-fetch');
module.exports.receiveText = async (event, context, callback) => {
	const base = process.env.URL;
	const command = event.body.Body;
	const from = event.body.From;
	if (typeof command === 'string') {
        const parts = command.trim().split(' ');
        console.log('parts: ', parts);
		switch (parts[0].toUpperCase()) {
			case 'LIST':
                console.log("Should list shopping items");
				const data = await fetch(`${base}/shopping`).then((res) => {
					return res.json();
				});
				const list = data.map((item) => {
					return item.text;
				})
				const message = `Current List:\n${list.join('\n')}`;
				const sendOptions = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						to: from,
						message
					})
                };
                console.log('Send options: ', sendOptions);
				const sent = await fetch(`${base}/api/sendText`, sendOptions).then((res) => {
					return res.json();
				})
				callback(null, sent);
				break;
			case 'ADD':
				parts.shift();
				const items = parts.join(' ').split(',');
				const batch = items.map((item) => {
					const sendOptions = {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							text: item
						}),
					};
					return fetch(`${base}/shopping`, sendOptions).then((res) => {
						return res.json();
					});
				})
				Promise.all(batch).then((results) => {
					console.log('Items added to list: ', results);
					callback(null, results);
				});
				break;
			case 'CLEAR':
                console.log('Should clear list...');
				const fetchOptions = {
					method: 'POST',
				};
				fetch(`${base}/clear`, fetchOptions).then((res) => {
					return res.json();
				}).then((data) => {
					console.log("List should be cleared: ", data);
					callback(null, data);
				}).catch((err) => {
					console.log('Error clearing list: ', err);
					callback(err, err.stack);
				});
			default:
                console.log('Action not recognized: ', event);
                callback(new Error('Action not recognized'));
				break;
		}
	}
}