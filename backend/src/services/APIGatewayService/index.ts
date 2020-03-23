import express from 'express';
import busboy from 'busboy';
import * as videoDataService from '../VideoDataService';
import * as channelDataService from '../ChannelDataService';
import * as videoContentService from '../VideoContentService';
import * as channelContentService from '../ChannelContentService';
import { IVideoQuery, IVideoUpdate } from '../VideoDataService/definitions';
import { IError } from '../../definitions';
import {
    IChannelQuery,
    IChannelUpdate,
} from '../ChannelDataService/definitions';
import {
    GenericError,
    InvalidFieldError,
    AuthorizationError,
} from '../../errors';
import { createHmac } from 'crypto';
import { isArray } from 'util';
import authMiddleware from './auth';

const app = express();

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
            userID: req.user.sub,
            token: req.user,
        },
    };
    next();
});

// #endregion Middleware

// #region External
app.post('/muxWebhook', async (req, res, next) => {
    // Check security
    if (!req.headers['Mux-Signature']) {
        res.status(500).send('Invalid Header');
    }
    let muxSignature: string;
    if (isArray(req.headers['Mux-Signature'])) {
        muxSignature = req.headers['Mux-Signature'][0];
    } else {
        muxSignature = req.headers['Mux-Signature'];
    }
    const signatureTimestamp = muxSignature.split(',')[0].split('=')[1]; // Pulls the number after t=
    const signature = muxSignature.split(',')[1].split('=')[1]; // Pulls the hash after the v1=
    const payload = `${signatureTimestamp}.${req.body}`;
    console.log(`Payload: ${payload}`);
    const hmac = createHmac('sha256', process.env.MUXWEBHOOKSECRET);
    hmac.update(payload);
    const digest = hmac.digest('hex');
    if (digest !== signature) {
        console.log(`Digest: ${digest}`);
        console.log(`Signature: ${signature}`);
        next(new AuthorizationError('Gateway', 'send webhook event'));
        // res.status(500).send('Invalid Signature');
    }
    // TODO: Check timestamp for tolerance

    // Forward request to VideoContentService
    console.log(`Body: ${req.body}`);
    res.sendStatus(200);
});
// #endregion External

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
        const video = await videoDataService.getVideo(
            req.context,
            req.params.id,
        );
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
        },
    });
    busboyInstance.on(
        'file',
        (fieldname, file, filename, encoding, mimetype) => {
            // We can assume that this will only be called once since the file limit is 1
            videoContentService
                .uploadVideo(req.context, req.params.id, file, mimetype)
                .then(() => {
                    res.writeHead(200);
                    res.end();
                })
                .catch((e) => {
                    next(e);
                });
        },
    );
    req.pipe(busboyInstance);
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
            if (
                !(typeof description === 'string') ||
                description.length > 1024
            ) {
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
        const videos = await channelDataService.queryChannel(
            req.context,
            query,
        );
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
        const channel = await channelDataService.createChannel(
            req.context,
            name,
        );
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
        },
    });
    busboyInstance.on(
        'file',
        (fieldname, file, filename, encoding, mimetype) => {
            console.log(`Got ${fieldname}`);
            channelContentService
                .uploadIcon(req.context, req.params.id, file)
                .then(() => {
                    res.writeHead(200);
                    res.end();
                })
                .catch((e) => {
                    next(e);
                });
            // We can assume that this will only be called once since the file limit is 1
        },
    );
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
    res.status(err.status).send({
        status: 'error',
        message: err.toString(),
    });
});

export default app;
