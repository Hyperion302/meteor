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
import { createHmac } from 'crypto';
import { isArray } from 'util';
import authMiddleware from './auth';

const app = express();

// #region Middleware
app.use('/video*', authMiddleware);
app.use('/channel*', authMiddleware);

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
app.post('/muxWebhook', async (req, res) => {
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
    const hmac = createHmac('sha256', process.env.MUXWEBHOOKSECRET);
    hmac.update(payload);
    const digest = hmac.digest('hex');
    if (digest !== signature) {
        res.status(500).send('Invalid Signature');
    }
    // TODO: Check timestamp for tolerance

    // TODO: Develop after having a deployed version (so I can properly test URLs)
});
// #endregion External

// #region Video Routes
app.get('/video', async (req, res) => {
    // Service Request
    try {
        // Build query
        const query: IVideoQuery = {
            author: req.query.author,
            before: req.query.before,
            after: req.query.after,
            channel: req.query.channel,
        };
        const videos = await videoDataService.queryVideo(query);
        res.status(200).send(videos);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
app.get('/video/:id', async (req, res) => {
    // Service Request
    try {
        const video = await videoDataService.getVideo(req.params.id);
        res.status(200).send(video);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
app.post('/video', express.json(), async (req, res) => {
    // Service Request
    try {
        // Cleanse inputs
        const title = req.body.title;
        if (!(typeof title === 'string') || title.length > 32) {
            const error: IError = {
                resource: title,
                message: 'Invalid video title',
            };
            throw error;
        }
        const description = req.body.description;
        if (!(typeof description === 'string') || description.length > 1024) {
            const error: IError = {
                resource: description,
                message: 'Invalid video description',
            };
            throw error;
        }
        const channel = req.body.channel;
        if (!(typeof title === 'string')) {
            const error: IError = {
                resource: title,
                message: 'Invalid channel ID',
            };
            throw error;
        }
        const author = req.body.author; // TODO: REPLACE DURING AUTH BUILDUP
        const video = await videoDataService.createVideo(
            title,
            description,
            author,
            channel,
        );
        res.status(201).send(video);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
app.post('/video/:id/upload', (req, res) => {
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
                .uploadVideo(req.params.id, 'test', file, mimetype)
                .then(() => {
                    res.writeHead(200);
                    res.end();
                });
        },
    );
    req.pipe(busboyInstance);
});
app.put('/video/:id', express.json(), async (req, res) => {
    // Service request
    try {
        // Build update object
        const update: IVideoUpdate = {};
        const title = req.body.title;
        if (title) {
            if (!(typeof title === 'string') || title.length > 32) {
                const error: IError = {
                    resource: title,
                    message: 'Invalid video title',
                };
                throw error;
            }
            update.title = title;
        }
        const description = req.body.description;
        if (description) {
            if (
                !(typeof description === 'string') ||
                description.length > 1024
            ) {
                const error: IError = {
                    resource: description,
                    message: 'Invalid video description',
                };
                throw error;
            }
            update.description = description;
        }
        const newVideo = await videoDataService.updateVideo(
            req.params.id,
            update,
        );
        res.status(200).send(newVideo);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
app.delete('/video/:id', async (req, res) => {
    // Service Request
    try {
        await videoDataService.deleteVideo(req.params.id);
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

//#endregion Video Routes

// #region Channel Routes
app.get('/channel', async (req, res) => {
    // Service Request
    try {
        // Build query
        const query: IChannelQuery = {
            owner: req.query.owner,
        };
        const videos = await channelDataService.queryChannel(query);
        res.status(200).send(videos);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
app.get('/channel/:id', async (req, res) => {
    // Service Request
    try {
        const channel = await channelDataService.getChannel(req.params.id);
        res.status(200).send(channel);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
app.post('/channel', express.json(), async (req, res) => {
    // Service Request
    try {
        // Cleanse inputs (just name for now)
        const name = req.body.name;
        if (!(typeof name === 'string') || name.length > 32) {
            const error: IError = {
                resource: name,
                message: 'Invalid channel name',
            };
        }
        const owner = req.body.owner; // TODO: REPLACE DURING AUTH BUILDUP
        const channel = await channelDataService.createChannel(name, owner);
        res.status(201).send(channel);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
app.post('/channel/:id/uploadIcon', (req, res) => {
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
            channelContentService.uploadIcon(req.params.id, file).then(() => {
                res.writeHead(200);
                res.end();
            });
            // We can assume that this will only be called once since the file limit is 1
        },
    );
    req.pipe(busboyInstance);
});
app.put('/channel/:id', express.json(), async (req, res) => {
    // Service Request
    try {
        // Build update object
        const update: IChannelUpdate = {};
        const name = req.body.name;
        if (name) {
            if (!(typeof name === 'string') || name.length > 32) {
                const error: IError = {
                    resource: name,
                    message: 'Invalid channel name',
                };
                throw error;
            }
            update.name = name;
        }
        const newChannel = await channelDataService.updateChannel(
            req.params.id,
            update,
        );
        res.status(200).send(newChannel);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
app.delete('/channel/:id', async (req, res) => {
    // Service Request
    try {
        await channelDataService.deleteChannel(req.params.id);
        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
// #endregion Channel Routes

export default app;
