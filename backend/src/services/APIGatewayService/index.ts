import express from 'express';
import busboy from 'busboy';
import cors, { CorsOptions } from 'cors';
import * as videoDataService from '@services/VideoDataService';
import * as channelDataService from '@services/ChannelDataService';
import * as videoContentService from '@services/VideoContentService';
import * as channelContentService from '@services/ChannelContentService';
import * as watchTimeService from '@services/WatchTimeService';
import {
  IVideoQuery,
  IVideoUpdate,
} from '@services/VideoDataService/definitions';
import {
  IChannelQuery,
  IChannelUpdate,
} from '@services/ChannelDataService/definitions';
import { GenericError, InvalidFieldError, AuthorizationError } from '@/errors';
import authMiddleware from './auth';

// Predefined constants
const MAX_VIDEO_SIZE: number = 1 * Math.pow(10, 9); // 1 GB
const MAX_CHANNEL_ICON_SIZE: number = 4 * Math.pow(10, 6); // 4 MB

const app = express();

// CORS
const corsOptions: CorsOptions = {
  origin: ['https://swish.tv', 'http://swish.local:8080'],
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Health Check-able /
app.get('/', (req, res) => {
  res.sendStatus(200);
});
// Custom /healthz
app.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

// #region Middleware
// Auth
app.use('/video*', authMiddleware);
app.use('/channel*', authMiddleware);

// Context
app.use(['/video*', '/channel*'], (req, res, next) => {
  // Generate invocation context
  req.context = {
    auth: {
      elevated: false,
      userID: req.user['https://swish.tv/swishflake'],
      userIDInt: BigInt(req.user['https://swish.tv/swishflake']),
      token: req.user,
    },
  };
  next();
});

// #endregion Middleware

// #region Video Routes
app.get('/video', async (req, res, next) => {
  // Service Request
  try {
    // Build query
    const query: IVideoQuery = {
      author: req.query.author,
      before: req.query.before,
      after: req.query.after,
      channel: req.query.channel,
    };
    const videos = await videoDataService.queryVideo(req.context, query);
    res.status(200).send(videos);
  } catch (e) {
    next(e);
  }
});
app.get('/video/:id', async (req, res, next) => {
  // Service Request
  try {
    const video = await videoDataService.getVideo(req.context, req.params.id);
    res.status(200).send(video);
  } catch (e) {
    next(e);
  }
});
app.post('/video', express.json(), async (req, res, next) => {
  // Service Request
  try {
    // Cleanse inputs
    const title = req.body.title;
    if (!(typeof title === 'string') || title.length > 32) {
      throw new InvalidFieldError('Gateway', 'title');
    }
    const description = req.body.description;
    if (!(typeof description === 'string') || description.length > 1024) {
      throw new InvalidFieldError('Gateway', 'description');
    }
    const channel = req.body.channel;
    if (!(typeof title === 'string')) {
      throw new InvalidFieldError('Gateway', 'channel');
    }
    const video = await videoDataService.createVideo(
      req.context,
      title,
      description,
      channel,
    );
    res.status(201).send(video);
  } catch (e) {
    next(e);
  }
});
app.post('/video/:id/upload', (req, res, next) => {
  // Should be multipart
  const busboyInstance = new busboy({
    headers: req.headers,
    limits: {
      files: 1,
      fileSize: MAX_VIDEO_SIZE,
    },
  });
  busboyInstance.on('file', (fieldname, file, filename, encoding, mimetype) => {
    // We can assume that this will only be called once since the file limit is 1
    videoContentService
      .uploadVideo(req.context, req.params.id, file, mimetype)
      .then(() => {
        res.writeHead(204);
        res.end();
      })
      .catch((e) => {
        next(e);
      });
  });
  req.pipe(busboyInstance);
});
app.post('/video/:id/segments', express.json(), async (req, res, next) => {
  // Sevice request
  try {
    const t1 = parseFloat(req.body.t1);
    if (isNaN(t1)) throw new InvalidFieldError('Gateway', 't1');
    const t2 = parseFloat(req.body.t2);
    if (isNaN(t2)) throw new InvalidFieldError('Gateway', 't2');
    const segments = await watchTimeService.createSegments(
      req.context,
      req.params.id,
      req.context.auth.userID,
      t1,
      t2,
    );
    res.status(201).send(segments);
  } catch (e) {
    next(e);
  }
});
app.get('/video/:id/segments', async (req, res, next) => {
  // Service request
  try {
    const segments = await watchTimeService.getSegments(
      req.context,
      req.params.id,
      req.context.auth.userID,
    );
    res.status(200).send(segments);
  } catch (e) {
    next(e);
  }
});
app.get('/video/:id/watchtime', async (req, res, next) => {
  // Service request
  try {
    const wt = await watchTimeService.getTotalWatchTime(
      req.context,
      req.params.id,
    );
    res.status(200).send({ wt });
  } catch (e) {
    next(e);
  }
});
app.get('/video/:id/watchtime/:user', async (req, res, next) => {
  // Service request
  try {
    // Make sure you're only requesting your own watch time
    if (req.context.auth.userID !== req.params.user) {
      throw new AuthorizationError('Gateway', 'access foreign watch time');
    }
    const wt = await watchTimeService.getWatchTime(
      req.context,
      req.params.id,
      req.params.user,
    );
    res.status(200).send({ wt });
  } catch (e) {
    next(e);
  }
});
app.put('/video/:id', express.json(), async (req, res, next) => {
  // Service request
  try {
    // Build update object
    const update: IVideoUpdate = {};
    const title = req.body.title;
    if (title) {
      if (!(typeof title === 'string') || title.length > 32) {
        throw new InvalidFieldError('Gateway', 'title');
      }
      update.title = title;
    }
    const description = req.body.description;
    if (description) {
      if (!(typeof description === 'string') || description.length > 1024) {
        throw new InvalidFieldError('Gateway', 'description');
      }
      update.description = description;
    }
    const newVideo = await videoDataService.updateVideo(
      req.context,
      req.params.id,
      update,
    );
    res.status(200).send(newVideo);
  } catch (e) {
    next(e);
  }
});
app.delete('/video/:id', async (req, res, next) => {
  // Service Request
  try {
    await videoDataService.deleteVideo(req.context, req.params.id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

//#endregion Video Routes

// #region Channel Routes
app.get('/channel', async (req, res, next) => {
  // Service Request
  try {
    // Build query
    const query: IChannelQuery = {
      owner: req.query.owner,
    };
    const videos = await channelDataService.queryChannel(req.context, query);
    res.status(200).send(videos);
  } catch (e) {
    next(e);
  }
});
app.get('/channel/:id', async (req, res, next) => {
  // Service Request
  try {
    const channel = await channelDataService.getChannel(
      req.context,
      req.params.id,
    );
    res.status(200).send(channel);
  } catch (e) {
    next(e);
  }
});
app.post('/channel', express.json(), async (req, res, next) => {
  // Service Request
  try {
    // Cleanse inputs (just name for now)
    const name = req.body.name;
    if (!(typeof name === 'string') || name.length > 32) {
      throw new InvalidFieldError('Gateway', 'name');
    }
    const channel = await channelDataService.createChannel(req.context, name);
    res.status(201).send(channel);
  } catch (e) {
    next(e);
  }
});
app.post('/channel/:id/uploadIcon', (req, res, next) => {
  // Should be multipart
  const busboyInstance = new busboy({
    headers: req.headers,
    limits: {
      files: 1,
      fileSize: MAX_CHANNEL_ICON_SIZE,
    },
  });
  busboyInstance.on('file', (fieldname, file, filename, encoding, mimetype) => {
    channelContentService
      .uploadIcon(req.context, req.params.id, file)
      .then(({ rawSize, size128, size64, size32 }) => {
        // console.info(`${req.context.auth.userID} uploaded a ${rawSize} byte icon for ${req.params.id}, writing ${size128}, ${size64}, ${size32} bytes to GCS`)
        res.writeHead(204);
        res.end();
      })
      .catch((e) => {
        next(e);
      });
    // We can assume that this will only be called once since the file limit is 1
  });
  req.pipe(busboyInstance);
});
app.put('/channel/:id', express.json(), async (req, res, next) => {
  // Service Request
  try {
    // Build update object
    const update: IChannelUpdate = {};
    const name = req.body.name;
    if (name) {
      if (!(typeof name === 'string') || name.length > 32) {
        throw new InvalidFieldError('Gateway', 'name');
      }
      update.name = name;
    }
    const newChannel = await channelDataService.updateChannel(
      req.context,
      req.params.id,
      update,
    );
    res.status(200).send(newChannel);
  } catch (e) {
    next(e);
  }
});
app.delete('/channel/:id', async (req, res, next) => {
  // Service Request
  try {
    await channelDataService.deleteChannel(req.context, req.params.id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});
// #endregion Channel Routes

// any in this case because TS *refuses* to acknowledge the override
app.use((err: GenericError, req: any, res: any, next: any) => {
  res.status(err.status ? err.status : 500).send({
    status: 'error',
    message: err.toString(),
  });
});

export default app;
