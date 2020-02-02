# ChannelDataService

Provides channel data fields and assembles related fields

## /getChannel

Retrieves data from DB

## /createChannel

1. Creates DB entry
2. Calls [SearchService](/backend/services/SearchService/README.md)/createChannel

## /updateChannel

1. Updates DB entry
2. Calls [SearchService](/backend/services/SearchService/README.md)/updateChannel to update fields

## /deleteChannel

1. Calls [SearchService](/backend/services/SearchService/README.md)/deleteChannel to remove from search index
2. Removes from DB
