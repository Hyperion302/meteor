import { Firestore } from '@google-cloud/firestore';
import { Storage, StorageOptions } from '@google-cloud/storage';
import { readFileSync } from 'fs';

const production: boolean = process.env.NODE_ENV == 'prod';

console.log(`Running in production: ${production}`);

// #region Firestore
let firestoreOptions: FirebaseFirestore.Settings;
if (production) {
    firestoreOptions = {};
} else {
    firestoreOptions = {
        keyFilename: process.env.GOOGLE_ACCOUNT_CREDENTIALS
    };
}

export const firestoreInstance = new Firestore(firestoreOptions);

// #endregion Firestore

// #region Storage
let storageOptions: StorageOptions;
if (production) {
    storageOptions = {};
} else {
    storageOptions = {
        keyFilename: process.env.GOOGLE_ACCOUNT_CREDENTIALS
    };
}
export const storageInstance = new Storage(storageOptions);
// #endregion Storage

// #region Mux Secrets
let muxID_: string;
let muxSecret_: string;
let muxWebhookSecret_: string;
if (production) {
    muxID_ = process.env.MUXID;
    muxSecret_ = process.env.MUXSECRET;
    muxWebhookSecret_ = process.env.MUXWEBHOOKSECRET;
} else {
    const secrets = JSON.parse(
        readFileSync(__dirname + '/secrets.json').toString()
    );
    muxID_ = secrets.muxID;
    muxSecret_ = secrets.muxSecret;
    muxWebhookSecret_ = secrets.muxWebhookSecret;
}

export const muxID = muxID_;
export const muxSecret = muxSecret_;
export const muxWebhookSecret = muxWebhookSecret_;
// #endregion Mux Secrets
