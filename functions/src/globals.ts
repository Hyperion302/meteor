import * as admin from 'firebase-admin';
import { ILog } from './definitions';
import { Log, Logging } from '@google-cloud/logging';

export const db = admin.firestore();
const logging = new Logging();
export const log = logging.log('functions-log');

export async function addLog(logRef: Log, functionName: string, data: ILog) {
    /*const metadata = {
        resource: {
            type: 'cloud_function',
            labels: {
                function_name: functionName,
                region: 'us-central1'
            }
        }
    };
    const entry = logRef.entry(metadata, data);
    await logRef.write(entry);
    */
    console.log(data.message);
}