# WatchTimeService

The WatchTimeService handles the high volume watchtime segment requests. It creates, aggregates, and checks watchtime for other services and clients. It tracks both deduplicated watch time and duplicated watch time.

## getSegments

Will get all a user's unique segments for a video

## processFragment

Given a client fragment of watch time, will create segments and record watch time

1. Checks fragment validity
2. Generates segments
3. Counts number of unique segments
4. Writes segments to bitfield and increments both watch time counters
5. Updates the search index if needed

## getVideoWatchTime

Aggregates watch time for an entire video

## getWatchTime

Returns watch time for a single user on a video

## A note on segment schema

There have been several schemas in consideration for segments.

`video:user:segmentIndex => "1"`

The problem with this approach is an _enormous_ number of rows. Each video would have a maximum of n x k rows, where n is the number of users who watched the video and k is the duration of the video in seconds. Also, this aproach does not take advantage of any Redis space saving techniques.

`video:user => bitfield`

This approach is much better than the last. Instead of creating a row for every segment, I can take advantage of Redis' bitfields and bit level operations. The bitfield is just a long binary number, where each bit represents one segment. If a segment is marked as 'watched', it's bit in the bitfield is `1`, else it's `0`. However, further space saving measures can be taken.

`video:userBucket => { user => bitfield }`

This approach creates buckets of user id's in videos. Each bucket is a hash. Within the bucket (hash), each key is a portion of a userID and each value is the bitfield from attempt #2. However, since this method relies on knowing the form of ID users have, it's very difficult to do. As of this writing, Swish has no definitive ID system for users, and relies on the JWT subject field passed to us by Auth0.

The final schema of the DB comes to:

`[video]:duration => number` Cached duration of the video (to save on DB queries)
`[video]:[user]:segments => bitfield` Deduplicated (guranteed unique) watchtime segments
`[video]:watchtimeUnique => number` Video watch time (dedpulicated seconds)
`[video]:[user]:watchtime => number` Accumulated watch time (duplicated seconds)
