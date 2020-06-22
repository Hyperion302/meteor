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
        <h1>{{ video.title }}</h1>
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
import { getVideo } from '~/services/video';
import { IVideo } from '~/models/video';

@Component({
  components: {
    PlayerChannelTile,
  },
  layout: 'signedIn',
})
export default class WatchPage extends Vue {
  video!: IVideo;
  player!: VideoJsPlayer;
  async asyncData({ params }: { params: any }) {
    return {
      video: await getVideo(params.videoID),
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
    width: 100vw;
  .info
    margin: 48px 24px;
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
