import { tID, IServiceInvocationContext } from '../../definitions';
import { IWatchTimeSegment } from './definitions';
import { redisClient } from '../../sharedInstances';
import { promisify } from 'util';
import { getVideo } from '../VideoDataService';
import {
  InvalidFieldError,
  InternalError,
  AuthorizationError,
  ResourceNotFoundError,
} from '../../errors';
import { updateWatchtime } from '../SearchService';

// Used to keep the the unique segment finder fast
const MAX_SEGMENTS_PER_FRAG = 10;

const getAsync = promisify(redisClient.get).bind(redisClient);
const existsAsync = promisify(redisClient.exists).bind(redisClient);

/**
 * Modified rounding function that can round to any decimal place
 * @param x Number to round
 * @param n Decimal to round to.  Negative values specify decimal places greater than or equal to 1.
 */
function roundToN(x: number, n: number): number {
  const scaleFac = Math.pow(10, n);
  return Math.round(x * scaleFac) / scaleFac;
}

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
  const bitfield = await getAsync(Buffer.from(`${video}:${user}:segments`));
  if (bitfield == null) {
    return [];
  }
  const segments: IWatchTimeSegment[] = [];
  // Loop over every byte in the bitfield
  for (const pair of bitfield.entries()) {
    const byte = pair[1];
    const offset = pair[0] * 8;
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
  // Get total duration of the video to check bounds (cached)
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
  const segmentIndices: number[] = [];
  for (let i = startTime; i < endTime; i++) {
    segmentIndices.push(i);
  }

  // Check segment count
  if (segmentIndices.length > 10) {
    throw new AuthorizationError(
      'WatchTime',
      `create more than ${MAX_SEGMENTS_PER_FRAG} segments per fragment`,
    );
  }

  // Find unique segments
  const existingSegments = await getSegments(context, video, user);
  const existingIndices = existingSegments.map(
    (segment: IWatchTimeSegment) => segment.index,
  );
  const uniqueSegmentIndices = segmentIndices.filter(
    (segIndex: number) => !existingIndices.includes(segIndex),
  );

  const multi = redisClient.multi();
  // Increment deduplicated video specific counter
  multi.incrby(`${video}:watchtimeUnique`, uniqueSegmentIndices.length);
  // Increment user specific counter
  multi.incrbyfloat(`${video}:${user}:watchtime`, roundToN(t2 - t1, 3));
  // Write segments to bitfield last since their reply indices aren't important
  uniqueSegmentIndices.forEach((segmentIndex) => {
    multi.setbit(`${video}:${user}:segments`, segmentIndex, '1');
  });
  const { newVideoWatchtime, newUserWatchtime } = await new Promise(
    (resolve, reject) => {
      multi.exec((err, reply) => {
        if (err) reject(err);
        resolve({
          newVideoWatchtime: reply[0],
          newUserWatchtime: reply[1],
        });
      });
    },
  );

  // Update the search index if the video watch time has changed by at least a minute
  // This part could possibly be implemented in a better way
  // I use normalization to see if the watch time crosses the minute boundary.
  const oldVideoWatchtime = newVideoWatchtime - uniqueSegmentIndices.length;
  const normOffset = Math.floor(oldVideoWatchtime / 60);
  const normOldWt = oldVideoWatchtime / 60 - normOffset;
  const normNewWt = newVideoWatchtime / 60 - normOffset;
  if (normOldWt < 1 && normNewWt >= 1) {
    // Crossed the minute boundary, update search index
    await updateWatchtime(context, video, newVideoWatchtime);
  }
  // Return new indices
  return uniqueSegmentIndices.map(
    (segmentIndex: number): IWatchTimeSegment => {
      return {
        index: segmentIndex,
      };
    },
  );
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
  return await getAsync(`${video}:watchtimeUnique`);
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
  return await getAsync(`${video}:${user}:watchtime`);
}
