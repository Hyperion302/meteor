# VideoContentService

Stores videos in the CDN and manages transcoding jobs

## muxWebhook

Subsequent actions depend heavily on event received.

-   Transcoding complete
-   1. Calls [SearchService](../SearchService/README.md)/addVideo for search indexing
-   2. Updates video transcoding data in DB

## getVideo

Returns transcoding information from DB

## deleteVideo

_Videos can only be deleted by the video author or the channel owner_

Deletes a videos master video, transcoding assets, and content record

## uploadVideo

_Videos can only be uploaded by the author_

Streams video data to CDN
