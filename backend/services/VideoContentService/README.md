# VideoContentService

Stores videos in the CDN and manages transcoding jobs

## muxEndpoint

Subsequent actions depend heavily on event received.

- Transcoding complete
- 1. Calls [SearchService](/backend/services/SearchService/README.md)/addVideo for search indexing
- 2. Updates video transcoding data in DB

## transcodeVideo

Submits transcoding job to Mux

## getVideo

Returns transcoding information from DB

## uploadVideo

Streams video data to CDN
