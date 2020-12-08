const fetch = require('node-fetch');
const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.clear = (event, context, callback) =>
{
    console.log('Clearing shopping list...');
    const base = process.env.URL;
    fetch(`${base}/shopping`)
    .then((res) =>
    {
        return res.json();
    })
    .then((data) =>
    {
        const batch = data.map((item) =>
        {
            const fetchOptions = {
                method: 'DELETE',
            };
            return fetch(`${base}/shopping/${item.id}`, fetchOptions)
            .then((res) =>
            {
                return res.json();
            });
        });
        Promise.all(batch).then((results) =>
        {
            console.log('Cleared shopping list: ', results);
            callback(null, results);
        });
    })
    .catch((err) =>
    {
        console.log('Error fetching shopping list: ', err);
        callback(err, err.stack);
    });

}