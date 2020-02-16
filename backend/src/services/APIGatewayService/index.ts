/**
 *
 */
import express from 'express';
import busboy from 'busboy';
import * as videoDataService from '../VideoDataService';
import * as channelDataService from '../ChannelDataService';
import * as videoContentService from '../VideoContentService';
import { IVideoQuery } from '../VideoDataService/definitions';
import { IError } from '../../../src/definitions';
import { IChannelQuery } from '../ChannelDataService/definitions';
const app = express();

// #region Middleware
// #endregion Middleware

// #region Video Routes
app.get('/video', async (req, res) => {
    // Service Request
    try {
        // Build query
        const query: IVideoQuery = {
            author: req.query.author,
            before: req.query.before,
            after: req.query.after,
            channel: req.query.channel
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
        if (!(typeof title == 'string') || title.length > 32) {
            const error: IError = {
                resource: title,
                message: 'Invalid video title'
            };
        }
        const description = req.body.description;
        if (!(typeof description == 'string') || description.length > 1024) {
            const error: IError = {
                resource: description,
                message: 'Invalid video description'
            };
        }
        const channel = req.body.channel;
        if (!(typeof title == 'string')) {
            const error: IError = {
                resource: title,
                message: 'Invalid channel ID'
            };
        }
        const author = req.body.author; // TODO: REPLACE DURING AUTH BUILDUP
        const video = await videoDataService.createVideo(
            title,
            description,
            author,
            channel
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
            files: 1
        }
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
        }
    );
    req.pipe(busboyInstance);
});
app.put('/video', (req, res) => {
    res.send({
        message: 'PUT /video'
    });
});
app.delete('/video', (req, res) => {
    res.send({
        message: 'DELETE /video'
    });
});

//#endregion Video Routes

// #region Channel Routes
app.get('/channel', async (req, res) => {
    // Service Request
    try {
        // Build query
        const query: IChannelQuery = {
            owner: req.query.owner
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
        if (!(typeof name == 'string') || name.length > 32) {
            const error: IError = {
                resource: name,
                message: 'Invalid channel name'
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
app.post('/uploadIcon', (req, res) => {
    res.send({
        message: 'POST /uploadIcon'
    });
});
app.put('/channel', (req, res) => {
    res.send({
        message: 'PUT /channel'
    });
});
app.delete('/channel', (req, res) => {
    res.send({
        message: 'DELETE /channel'
    });
});
// #endregion Channel Routes

export default app;
