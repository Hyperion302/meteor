import { tID, IServiceInvocationContext } from '../../definitions';
import { IWatchTimeSegment } from './definitions';
import { redisClient } from '../../sharedInstances';
import { promisify } from 'util';
import { getVideo } from '../VideoDataService';
import { InvalidFieldError, InternalError } from '../../errors';

const getAsync = promisify(redisClient.get).bind(redisClient);
const bitcountAsync = promisify(redisClient.bitcount).bind(redisClient);

/**
 * Get all of a user's segments for a video
 * @param context Invocation context
 * @param video ID of video to get segments for
 * @param user ID of user to get segments for
 * @returns An array of segments
 */
export async function getSegments(
  context: IServiceInvocationContext,
  video: tID,
  user: tID,
): Promise<IWatchTimeSegment[]> {
  const bitfield = await getAsync(Buffer.from(`${video}:${user}`));
  if (bitfield == null) {
    return [];
  }
  const segments: IWatchTimeSegment[] = [];
  // Loop over every byte in the bitfield
  for (const pair of bitfield.entries()) {
    const byte = pair[1];
    const offset = pair[0] * 8;
    console.log(byte.toString(2));
    // Loop over every bit in the bitfield
    for (let i = 0; i < 8; i++) {
      const bitCheck = 1 << i;
      if (byte & bitCheck) {
        // Subtraction from 7 required since we're iterating backwards from
        // Index 7
        const segmentIndex = 7 - i + offset;
        segments.push({
          index: segmentIndex,
        });
      }
    }
  }

  return segments;
}

/**
 * Create segments from a fragment
 * @param context Invocation context
 * @param video ID of video to create a segment for
 * @param user ID of user to create segment for
 * @param t1 Starting timestamp of fragment (in seconds)
 * @param t2 Ending timestamp of fragment (in in seconds)
 * @returns Created segments
 */
export async function createSegments(
  context: IServiceInvocationContext,
  video: tID,
  user: tID,
  t1: number,
  t2: number,
): Promise<IWatchTimeSegment[]> {
  // Get total duration of the video to check bounds
  // This follows the GET - WATCH - MULTI - EXEC pattern
  // GET
  let duration = await getAsync(`${video}:duration`);
  if (duration == null) {
    // If video duration has not been cached yet, record its duration
    await new Promise((resolve, reject) => {
      // WATCH
      redisClient.watch(`${video}:duration`, function(watchError) {
        if (watchError) reject(watchError);
        // Request duration from content service
        getVideo(context, video)
          .then((videoObj) => {
            duration = videoObj.content.duration.toString();
            redisClient
              // MULTI
              .multi()
              // SET
              .set(`${videoObj.id}:duration`, duration)
              // EXEC
              .exec((err, reply) => {
                if (err) reject(err);
                if (reply == null)
                  reject(
                    new InternalError(
                      'WatchTime',
                      'Aborted video duration update to avoid race condition',
                    ),
                  );
                resolve(reply);
              });
          })
          .catch(reject);
      });
    });
  }
  // Check timestamps
  if (t1 < 0 || t1 >= t2) {
    throw new InvalidFieldError('WatchTime', 't1');
  }
  if (t2 > duration) {
    throw new InvalidFieldError('WatchTime', 't2');
  }

  // Generate segment(s) from the fragment
  const startTime = Math.floor(t1);
  const endTime = Math.ceil(t2);
  const segments: IWatchTimeSegment[] = [];
  for (let i = startTime; i < endTime; i++) {
    segments.push({
      index: i,
    });
  }

  // Write segments to bitfield
  // Since it's unlikely that a client will request the setting of more than a few segments,
  // it's safe to atomically set all bits using individual commands
  const multi = redisClient.multi();
  segments.forEach((segment) => {
    multi.setbit(`${video}:${user}`, segment.index, '1');
  });
  await new Promise((resolve, reject) => {
    multi.exec((err, reply) => {
      if (err) reject(err);
      resolve(reply);
    });
  });

  return segments;
}

/**
 * Aggregates all watch time for a video
 * @param context Invocation context
 * @param video ID of video to aggregate
 * @returns Watch time in seconds
 */
export async function getTotalWatchTime(
  context: IServiceInvocationContext,
  video: tID,
): Promise<number> {
  return 0;
}

/**
 * Aggregates all of a users watch time for a video
 * @param context Invocation context
 * @param video ID of video to aggregate
 * @param user ID of user to aggregate
 * @returns Watch time in seconds
 */
export async function getWatchTime(
  context: IServiceInvocationContext,
  video: tID,
  user: tID,
): Promise<number> {
  const bc = await bitcountAsync(`${video}:${user}`);
  if (bc == null) {
    return 0;
  }
  return bc;
}
