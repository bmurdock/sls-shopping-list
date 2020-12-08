#!/bin/bash
echo "Sending startup text..."
sls invoke -f sendText --path init.json
echo "Uploading initial shopping list..."
sls invoke -f s3put
echo "Clearing out old shopping list..."
sls invoke -f clear
echo "Importing starter list from S3 Bucket"
sls invoke -f import