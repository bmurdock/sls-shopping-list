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
            Key: 'list.json',
            Body: data,
            ContentType: 'application/json; charset=utf-8',
            ACL: 'public-read',
        },function(err, data) {
            if (err)
            {
                console.log('Error occurred with s3 upload: ', err, err.stack);
                callback(err, err.stack);
            }
            else
            {
                console.log('S3 upload success: ', data);
                callback(null,data);
            }
        });
    });
}