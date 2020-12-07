const AWS = require('aws-sdk');

const lambda = new AWS.Lambda({
    region: "us-east-1"
});

module.exports.incoming = (event, context, callback) =>
{
    console.log('event: ', event);
    const command = event.body.Body;
    if (typeof command === 'string')
    {
        switch (command.trim().split(' ')[0]) {
            case 'list':
                callback(null, 'test, test, test');
                break;
            case 'add':
                const params = {
                    FunctionName: "sls-shopping-list-dev-create",
                    InvocationType: "RequestResponse",
                    Payload: JSON.stringify({text: "more stuff"}),
                };
                lambda.invoke(params, function(error, data) {
                    if (error) {
                      console.error(JSON.stringify(error));
                      return new Error(`Error printing messages: ${JSON.stringify(error)}`);
                    } else if (data) {
                      console.log(data);
                    }
                  });
                  break;
            default:
                break;
        }
    }

    callback(null, command);
}