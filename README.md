# Swish, video reimagined

## Why?

Traditionally, online platforms have offered their services free of charge in exchange for running ads and collecting data. For the user, this model is inherently flawed. Since the user is not providing revenue, they are not the customer. In fact, since they themselves (their eyes) are the objects being sold, they are the _product_. This means that user needs are rarely met, as long as they keep viewing ads. Instead, priority is given to the businesses _running ads_, which resulted in the many policy controversies platforms like YouTube have had in recent years. What content is allowed, and how valuable content is, is determined solely by the customer: advertisers. This means that content is unfairly moderated and demonitized, even if users are eager to view it.

Swish is an answer to this business model. It seeks to reimagine the content platform as a service that facilitates an exchange of content between a viewer and a creator, not another way to sell eyes to advertisers.

## How does it work?

Everyone pays a subscription fee (TBD, currently $3) every month.  We take a small portion (TBD, currently $1) to pay for operating expenses. The rest is proportionally divided between the creators the user watches based on watch time.

What does this mean?

### Support the creators you love even more

$2 out of the $3 monthly fee goes directly to the content creators you watch.

### No ads, no privacy violations

We have no ads and no reason to collect data. To us, users are more than just eyes: they're customers.

### Become the customer, not the product

Start being treated as a customer, not a product. Your voice matters, and decisions are made with only you and your opinions in mind.

## Development

Development of Swish is divided into _phases_. Each phase has a minor semantic version associated with it. The final commit of each phase is tagged.

### Phase 1 (v0.1.0)

This is the initial phase of Swish. A basic app was built and backed by a Firebase API. Most of what was developed here is intended to be replaced or updated.

#### Goals

- Build basic mobile app and Firebase backend
- Settle on transcoding, search, database, and compute solutions
  - Settled on Algolia for search, Mux for transcoding, Firestore for database, and Firebase for compute

### Phase 2 (v0.2.0)

Difficulties with authentication and flexibility meant that a new backend had to be developed. A microservice architecture that ran on GKE was settled on. The mobile app needed to be updated and a web app needed be made.

#### Goals

- Build new API
- Update mobile app to use new API
- Develop webapp
- Finish basic CRUD functionality of the entire service

### Phase 3 (v0.3.0)

Phase 3 brings time tracking. Video players send a request every second to the backend containing what second of the video a user just watched, called a segment. The backend then stores each segment in a Redis database.

#### Goals

- Setup segment storage and processing
- Add watch time tracking to web and mobile platforms

### Phase 4 (v0.4.0)

Phase 4 brings payment. Payments are processed by Stripe. < More info as this gets closer >

#### Goals

- Setup payment processing through Stripe
- Send money to a channel's balance based on watch time

### Phase 5 (v0.5.0)

Phase 5 brings YouTube integration. Swish allows users to search and view YT videos on the Swish platform. However, to avoid legal trouble, it'll use the standard YT embed. This means that ads will be shown, and data will be collected. Time tracking and payment allocation is still done on YT videos viewed through Swish. When a YT video is first viewed through Swish, a video record will be created for it and a channel record will be created for the channel it's apart of. Earnings through watch time will be allocated as usual to the channel. A YT creator would then be able to come to Swish, setup an account, link his or her google account with his or her Swish account, and finally _link_ the original YT channel and the Swish channel. This serves as a way for Swish to verify this account as the true owner of the channel. The YT creator would then be able to claim any earnings they would have earned _for the last month_ from their YT videos embedded in Swish. The linking process also imports all of the channels YT videos to Swish and marks any existing ones as true Swish videos, removing ads.

It's important to note that _once a user links their YT channel to their Swish channel, they will be permanently unable to run YT videos on that linked Swish channel._ This is to prevent creators from being able to make revenue off of both ads and watch time, which goes against Swish's core mission.

#### Goals

- Add YT integration
