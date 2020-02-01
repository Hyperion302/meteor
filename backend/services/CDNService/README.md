# CDNService

Handles all callbacks from the CDN provider ([Google Cloud Storage](https://cloud.google.com/storage))

## Note: Getting events from the CDN

Google cloud storage will push updates to a PubSub topic. The CDNService will listen with a pull-type subscription for new events and process them as necessary. Thus, there will no specific "handleEvent" endpoint
