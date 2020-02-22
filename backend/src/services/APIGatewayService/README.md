# APIGatewayService

Handles all API requests and authenticates user tokens. Exposes _publicly facing_ HTTP endpoints.

## Authentication

All of the endpoints below attach auth data to their request by first calling [UserAuthService](../UserAuthService/README.md)/authenticate with the token provided by the request

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

### GET /channel

Calls [ChannelDataService](../ChannelDataService/README.md)/getChannel

### POST /channel

Calls [ChannelDataService](../ChannelDataService/README.md)/createChannel

### POST /uploadIcon

Calls [ChanenlContentService](/backend/service/ChannelContentService/README.md)/uploadIcon

### PUT /channel

Calls [ChannelDataService](../ChannelDataService/README.md)/updateChannel

### DELETE /channel

Calls [ChannelDataService](../ChannelDataService/README.md)/deleteChannel
