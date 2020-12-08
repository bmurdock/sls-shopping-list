// import list.json from the S3 bucket
const fetch = require('node-fetch');
const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const addItem = (item) => {
	return new Promise((resolve, reject) => {
		const timestamp = new Date().getTime();
		const params = {
			TableName: process.env.DYNAMODB_TABLE,
			Item: {
				id: uuid.v1(),
				text: item.text,
				checked: false,
				createdAt: timestamp,
				updatedAt: timestamp,
			},
		};
		dynamoDb.put(params, (error) => {
			if (error) {
				console.error(error);
				reject(new Error(`DynamoDB failed to put: ${error}`))
				return;
			}
			resolve(params.Item);
		});
	})
};

module.exports.import = (event, context, callback) => {
	const fileUrl = `https://${process.env.BUCKET}.s3.amazonaws.com/list.json`;
	console.log('url: ', fileUrl);
	fetch(fileUrl).then((res) => {
		console.log('got response: ', res);
		return res.json();
	}).then((data) => {
		console.log('data: ', data);
		const batch = data.items.map((item) => {
			return addItem(item);
		});
		Promise.all(batch)
        .then((results) =>
        {
            console.log('results: ', results)
            callback(null, results);
        });
	}).catch((err) => {
		console.log('error: ', err);
		callback(err, err.stack);
	});
};
