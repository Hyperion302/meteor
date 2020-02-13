import { Firestore } from '@google-cloud/firestore';
// #region Firestore
export const firestoreInstance = new Firestore({
    keyFilename: process.env.GOOGLE_ACCOUNT_CREDENTIALS
});
// #endregion Firestore
