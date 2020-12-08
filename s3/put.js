const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
module.exports.put = (event, context, callback) => {
    console.log('event: ', event);
    console.log('env: ', process.env);

    fs.readFile('./starterlist.json', 'utf8', (err, data) =>
    {
        if (err)
        {
            console.log(err);
            callback(err);
            return;
        }
        console.log('data: ', data);
        s3.putObject({
            Bucket: process.env.BUCKET,
            Key: 'test.json',
            Body: data,
            ContentType: 'application/json; charset=utf-8',
        },function(err, data) {
            if (err) callback(err, err.stack); // an error occurred
            else callback(null,data); // successful response
            /*
            data = {
             ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
             VersionId: "tpf3zF08nBplQK1XLOefGskR7mGDwcDk"
            }
            */
        });

    });
}