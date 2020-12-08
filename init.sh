#!/bin/bash
echo "Sending startup text..."
#sls invoke -f sendText --path init.json
echo "Uploading initial shopping list..."
sls invoke -f s3put