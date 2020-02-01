# Services

## APIGatewayService

Handles all API requests and authenticates user tokens

## CDNService

Handles all callbacks from the CDN provider ([Google Cloud Storage](https://cloud.google.com/storage))

## VideoDataService

Provides video data fields

## VideoTranscodingService

Provides video transcoding endpoints (Handles MUX webhooks and submits transcoding jobs)

## VideoUploadService

Provides video data streaming endpoints and stores them to the CDN.

## ChannelDataService

Provides channel data fields

## ChannelUploadService

Provides channel art streaming endpoints and stores them to the CDN.

## ChannelUGCService

Preprocesses (resizes, transforms, formats, etc.) channel-related uploads.

## UserAuthService

Authenticated user tokens

# Interesting or complicated (or both) Flows

## Uploading a video

To create a video, the user first sends a request to "allocate" the video, which hits the /createVideo endpopint in [VideoDataService](/backend/services/VideoDataService/README.md). A nonuploaded, untranscoded video object is returned (empty schema with no mux fields).

The user would then stream a multipart upload to [VideoUploadService](/backend/services/VideoUploadService/README.md)/uploadVideo that would stream their data to the CDN.

The [CDNService](/backend/services/CDNService/README.md) on upload completed, _if the completed upload is a video_, would trigger [VideoTranscodingService](/backend/services/VideoTranscodingService/README.md)/transcodeVideo to request a transcoding job.

Once the transcoding job is complete, a call back to [VideoTranscodingService](/backend/services/VideoTranscodingService/README.md)/muxEndpoint would mark the video as transcoded and ready, and would attach video transcoding data to the DB object.

## Uploading channel art

This is similar, albeit less complicated without transcoding, to the video upload flow

To upload channel art, the user first begins streaming their art to a streaming endpoint (/uploadIcon for channel icon) provided by [ChannelUploadService](/backend/services/ChannelUploadService), which would stream their art to the CDN.

The [CDNService](/backend/services/CDNService/README.md) on upload completed, _if the completed upload is channel art_, would trigger an endpoint (/processIcon for channel icon) provided by [ChannelUGCService](/backend/services/ChannelUGCService/README.md) to process the UGC.

The call to the [ChannelUGCService](/backend/services/ChannelUGCService/README.md) would compress and resize channel art, and stream reformatted art back to the CDN. Once the stream is complete, it would trigger the CDN to delete the old channel art.
