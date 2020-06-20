<template>
  <span>
    <main class="watchPage">
      <div class="player">
        <video
          id="player"
          class="video-js vjs-fill vjs-big-play-centered"
          controls
          preload="auto"
          data-setup="{}"
        >
          <source
            :src="`https://stream.mux.com/${video.content.playbackID}.m3u8`"
            type="application/x-mpegURL"
          />
          <p class="vjs-no-js">
            Sorry, Swish can't be used on your browser. Try upgrading to a more
            modern browser.
          </p>
        </video>
      </div>
      <div class="info">
        <h1>{{ video.title }}</h1>
        <div class="descriptionChannelBox">
          <player-channel-tile class="channelTile" :channel="video.channel" />
          <p class="description">
            {{ video.description }}
          </p>
        </div>
      </div>
    </main>
    <script src="https://vjs.zencdn.net/7.8.2/video.js"></script>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import PlayerChannelTile from '~/components/PlayerChannelTile.vue';
import { getVideo } from '~/services/video';

@Component({
  components: {
    PlayerChannelTile,
  },
  layout: 'signedIn',
})
export default class WatchPage extends Vue {
  async asyncData({ params }: { params: any }) {
    return {
      video: await getVideo(params.videoID),
    };
  }
}
</script>

<style lang="sass">
.watchPage
  .player
    height: 500px;
    width: 100vw;
  .info
    padding: 0 24px;
    .descriptionChannelBox
      display: flex;
      width: 100%
      .channelTile
        min-width: 200px;
      .description
        margin: 0 12px;
        min-width: 0;
</style>
