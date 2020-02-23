/**
 * Test the API
 * Features End-To-End testing due to the limitations of firestore
 */
import app from '../services/APIGatewayService';
import request from 'supertest';
import { Server } from 'http';

const videoID = '92c265ed-ed91-474b-b30d-b639348b5767';
const channelID = 'a845432f-5adf-4d38-9548-b1f64df8227e';

describe('Video endpoints', () => {
    describe('GET /video/:id', () => {
        it('gets a video', async () => {
            await request('http://localhost:8080')
                .get(`/video/${videoID}`)
                .expect(200);
        });
    });
});
