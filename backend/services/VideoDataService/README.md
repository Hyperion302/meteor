# VideoDataService

The VideoDataService serves basic fields for videos and assembles related fields.

## getVideo

1. Retrieves flat fields from DB
2. Calls [VideoContentService](../VideoContentService)/getVideo for transcoding data
3. Calls [ChannelDataService](../ChannelDataService)/getChannel for channel data

## createVideo

1. Creates new untranscoded video in DB

## updateVideo

1. Updates video in DB with provided fields
2. Calls [SearchService](../SearchService/README.md)/updateVideo to update fields

## deleteVideo

1. Calls [SearchService](../SearchService/README.md)/deleteVideo to delete from search index
2. Calls [VideoContentService](../VideoContentService)/deleteVideo to delete transcoding entry
3. Deletes video from DB
