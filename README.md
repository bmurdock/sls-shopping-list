# Serverless SMS-Controlled Shopping List
This should deploy a serverless shopping list that is interacted with via SMS messages. SMS functionality facilitated by Twilio. This project will create several lambda functions as well as a DynamoDB table and an S3 Bucket.
## Caution
**This project likely is impractically expensive (even to test) due to Twilio SMS costs

## Setup
### Twilio
You must add your Twilio creditials to the serverless.yml file in the environment section:
```
  environment:
    DYNAMODB_TABLE: ${opt:stage, self:provider.stage}-${self:service}
    TWILIO_SID: <YOUR SID>
    TWILIO_AUTH: <YOUR AUTH TOKEN>
    TWILIO_PHONE: <TWILIO NUMBER USED FOR THIS PROJECT>
```

## Functionality
### Initial Text Message
There is a bash shell script (init.sh) that will send you an initial text notifiying you that the shopping list application has been deployed. This utilizes the init.json file, and the format of the file should be:
```
{
    "body": {
        "to": "<YOUR PHONE NUMBER>",
        "message": "Serverless Shopping List Starting..."
    }
}
```

### Initial Shopping List
There is a filed (starterlist.json) which contains the initial shopping list of items. When the server is deployed, this list is uploaded to S3, and then imported to DynamoDB.
An example starter list would be:
```
{
    "items": [
        {
            "text": "cereal"
        },
        {
            "text": "milk"
        }
    ]
}
```

### SMS Commands
In order to interact with the list, simply send an SMS message to the Twilio number you provided in the serverless environment variables.
* All commands are case-insensitive
Recognized Commands Are:
#### LIST
LIST will return all of the items currently on the shopping list
#### ADD
Add will add an item to the shopping list. You can add 1 item at a time using this format:
```
Add 2 loaves of whole-wheat bread
```

You can add multiple items at once using a comma-seperated list:
```
Add 1 gallon of milk,Captain Crunch,2 Packages of Peanut Butter M&Ms
```
#### Clear
Clear will clear all items off the current shopping list.

## Future Development
When interfacing via SMS, commands are rather clunky. However, the DynamoDB collection allows for a checklist style of shopping list. If you were to interface via HTML, React, or even a native phone app, you could support deleting single items, checking items as you place them in the cart, etc.

### Note On SMS
Anyone who sends commands to the Twilio number can interact with the list. Multiple people can add items, or get the current list.