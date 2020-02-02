# APIGatewayService

Handles all API requests and authenticates user tokens. Exposes _publicly facing_ HTTP endpoints.

## Authentication

All of the endpoints below attach auth data to their request by first calling [UserAuthService](/backend/services/UserAuthService/README.md)/authenticate with the token provided by the request

## Video

### GET /video

Calls [VideoDataService](/backend/services/VideoDataService/README.md)/getVideo

### POST /video

Calls [VideoDataService](/backend/services/VideoDataService/README.md)/createVideo

### POST /uploadVideo

Calls (and streams) [VideoContentService](/backend/services/VideoContentService/README.md)/uploadVideo

### PUT /video

Calls [VideoDataService](/backend/services/VideoDataService/README.md)/updateVideo

### DELETE /video

Calls [VideoDataService](/backend/services/VideoDataService/README.md)/deleteVideo

## Channel

### GET /channel

Calls [ChannelDataService](/backend/services/ChannelDataService/README.md)/getChannel

### POST /channel

Calls [ChannelDataService](/backend/services/ChannelDataService/README.md)/createChannel

### POST /uploadIcon

Calls [ChanenlContentService](/backend/service/ChannelContentService/README.md)/uploadIcon

### PUT /channel

Calls [ChannelDataService](/backend/services/ChannelDataService/README.md)/updateChannel

### DELETE /channel

Calls [ChannelDataService](/backend/services/ChannelDataService/README.md)/deleteChannel
