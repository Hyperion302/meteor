<template>
  <span>
    <main class="watchPage">
      <div class="player">
        <video ref="player" class="video-js vjs-fill vjs-big-play-centered">
          <p class="vjs-no-js">
            Sorry, Swish can't be used on your browser. Try upgrading to a more
            modern browser.
          </p>
        </video>
      </div>
      <div class="info">
        <h2>{{ video.title }}</h2>
        <h3 class="watchtime">
          {{ evc }} view{{ evc !== 1 ? 's' : '' }} • {{ wtString }} •
          {{ uploadDateString }}
        </h3>
        <div class="descriptionChannelBox">
          <player-channel-tile class="channel" :channel="video.channel" />
          <p class="description">
            {{ video.description }}
          </p>
        </div>
      </div>
    </main>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import videojs, { VideoJsPlayer } from 'video.js';
import PlayerChannelTile from '~/components/PlayerChannelTile.vue';
import { getVideo, getWatchtime, submitFragment } from '~/services/video';
import { IVideo } from '~/models/video';

@Component({
  components: {
    PlayerChannelTile,
  },
  layout: 'signedIn',
})
export default class WatchPage extends Vue {
  video!: IVideo;
  wt!: number;
  lastTs: number = 0;
  player!: VideoJsPlayer;
  fragmentInterval!: any;
  async asyncData({ params }: { params: any }) {
    return {
      video: await getVideo(params.videoID),
      wt: await getWatchtime(params.videoID),
    };
  }

  mounted() {
    this.player = videojs(this.$refs.player, {
      controls: true,
      autoplay: true,
      sources: [
        {
          src: this.videoURL,
          type: 'application/x-mpegURL',
        },
      ],
    });
    this.player.on('play', this.handleStart);
    this.player.on('ended', this.handleEnd);
    this.player.on('pause', this.handleEnd);
  }

  // FIXME: In the event that the video is paused/ended before
  // a second passes, the interval will never execute
  // and a fragment will never be sent.  I should
  // detect this and send a fragment anyway in handleEnd

  handleStart() {
    this.lastTs = this.player.currentTime();
    if (this.fragmentInterval) {
      clearInterval(this.fragmentInterval);
    }
    this.fragmentInterval = setInterval(this.submitFragment, 1000);
  }

  submitFragment() {
    const t1 = this.lastTs;
    const t2 = this.player.currentTime();
    this.lastTs = t2;

    submitFragment(this.video.id, { t1, t2 });
  }

  handleEnd() {
    clearInterval(this.fragmentInterval);
    this.fragmentInterval = null;
  }

  head() {
    return {
      title: this.video.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.video.description,
        },
      ],
    };
  }

  get videoURL(): string {
    if (this.video.content) {
      return `https://stream.mux.com/${this.video.content.playbackID}.m3u8`;
    } else {
      return '';
    }
  }

  get evc(): number {
    if (!this.video.content) {
      return 0;
    }
    return Math.round(this.wt / this.video.content.duration);
  }

  get uploadDateString(): string {
    if (!this.video.content) {
      return '';
    }
    const mills = this.video.uploadDate * 1000;
    const dateObj = new Date(mills);
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const day = dateObj.toLocaleString('en-US', { day: 'numeric' });
    const year = dateObj.toLocaleString('en-US', { year: 'numeric' });
    return `${month} ${day}, ${year}`;
  }

  get wtString(): string {
    if (!this.video.content) {
      return 'Less than 1 minute';
    }
    // Less than a minute, seconds
    if (this.wt < 60) {
      return `${this.wt} second${this.wt !== 1 ? 's' : ''}`;
    }
    // Less than an hour, minutes
    if (this.wt < 3600) {
      const minutes = Math.floor(this.wt / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    // Less than a day, hours
    if (this.wt < 86400) {
      const hours = Math.floor(this.wt / 3600);
      return `${hours} hour${hours !== 0 ? 's' : ''}`;
    }
    // Less than a week, days
    if (this.wt < 604800) {
      const days = Math.floor(this.wt / 86400);
      return `${days} week${days !== 0 ? 's' : ''}`;
    }
    // Less than a month, weeks
    if (this.wt < 2419200) {
      const weeks = Math.floor(this.wt / 604800);
      return `${weeks} hour${weeks !== 0 ? 's' : ''}`;
    }
    // Less than a year, months
    if (this.wt < 125798400) {
      const months = Math.floor(this.wt / 2419200);
      return `${months} hour${months !== 0 ? 's' : ''}`;
    }
    // Years
    if (this.wt >= 125798400) {
      const years = Math.floor(this.wt / 125798400);
      return `${years} hour${years !== 0 ? 's' : ''}`;
    }

    return '';
  }

  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
</script>

<style lang="sass">
.watchPage
  .player
    padding: 60px 0 0 0;
    height: 80vh;
    @media only screen and (max-width: 600px)
      height: 40vh;
  .info
    margin: 24px 24px;
    .watchtime
      font-weight: 400;
      color: #606060
    .descriptionChannelBox
      display: flex;
      @media only screen and (max-width: 600px)
        display: block;
      width: 100%
      .channel
        min-width: 200px;
      .description
        margin: 0 12px;
        @media only screen and (max-width: 600px)
          margin: 12px 0;
        min-width: 0;
</style>
