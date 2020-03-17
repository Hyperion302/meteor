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

Deletes a videos master video, transcoding assets, and content record

## uploadVideo

_Video can only be uploaded by author_

Streams video data to CDN
