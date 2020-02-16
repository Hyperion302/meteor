import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import { readFile } from 'fs';
// #region Firestore
export const firestoreInstance = new Firestore({
    keyFilename: process.env.GOOGLE_ACCOUNT_CREDENTIALS
});
// #endregion Firestore

// #region Storage
export const storageInstance = new Storage({
    keyFilename: process.env.GOOGLE_ACCOUNT_CREDENTIALS
});
// #endregion Storage

// #region Mux Secrets
// #endregion Mux Secrets
