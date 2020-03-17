# APIGatewayService

Handles all API requests and authenticates user tokens. Exposes _publicly facing_ HTTP endpoints.

## Authentication

The APIGatewayService _authenticates_ user requests, and expects downstream services to properlly check permission bounds and react accordingly.

## External

### POST /muxWebhook

Authenticates the webhook and forwards directly to [VideoContentService](../VideoContentService/README.md)/muxWebhook

## Video

### GET /video/:id

Calls [VideoDataService](../VideoDataService/README.md)/getVideo

### GET /video?<query>

Calls [VideoDataService](../VideoDataService/README.md)/queryVideo

### POST /video

Calls [VideoDataService](../VideoDataService/README.md)/createVideo

### POST /video/:id/upload

Calls (and streams) [VideoContentService](../VideoContentService/README.md)/uploadVideo

### PUT /video

Calls [VideoDataService](../VideoDataService/README.md)/updateVideo

### DELETE /video

Calls [VideoDataService](../VideoDataService/README.md)/deleteVideo

## Channel

### GET /channel/:id

Calls [ChannelDataService](../ChannelDataService/README.md)/getChannel

### POST /channel

Calls [ChannelDataService](../ChannelDataService/README.md)/createChannel

### POST /channel/:id/uploadIcon

Calls [ChanenlContentService](/backend/service/ChannelContentService/README.md)/uploadIcon

### PUT /channel/:id

Calls [ChannelDataService](../ChannelDataService/README.md)/updateChannel

### DELETE /channel/:id

Calls [ChannelDataService](../ChannelDataService/README.md)/deleteChannel
