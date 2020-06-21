<template>
  <span>
    <main class="channelPage">
      <img class="icon" :src="iconURL" @error="imageLoadError" />
      <h1>{{ channel.name }}</h1>
      <div class="videos">
        <video-tile
          v-for="video in videos"
          :key="video.id"
          class="videoTile"
          :video="video"
        />
      </div>
    </main>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import VideoTile from '~/components/VideoTile.vue';
import { getChannel } from '~/services/channel';
import { queryVideos } from '~/services/video';
import { IChannel } from '~/models/channel';
import { IVideo } from '~/models/video';
@Component({
  components: {
    VideoTile,
  },
  layout: 'signedIn',
})
export default class ChannelPage extends Vue {
  iconExists: boolean = true;
  channel!: IChannel;
  video!: IVideo;
  async asyncData({ params }: { params: any }) {
    return {
      channel: await getChannel(params.channelID),
      videos: await queryVideos(params.channelID),
    };
  }

  head() {
    return {
      title: `${this.channel.name} - Swish`,
    };
  }

  get iconURL(): string {
    if (this.iconExists && this.channel) {
      return `https://storage.googleapis.com/prod-swish/channelIcons/${this.channel.id}_128.png`;
    } else {
      return 'https://via.placeholder.com/128';
    }
  }

  imageLoadError() {
    this.iconExists = false;
  }
}
</script>

<style lang="sass">
.channelPage
  display: grid;
  height: 100vh;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  .icon
    grid-column: 2 / span 1;
    grid-row: 2 / span 1;
  h1
    grid-column: 4 / span 8;
    grid-row: 2 / span 1;
  .videos
    grid-column: 2 / span 10;
    grid-row: 4 / span 8;
    display: flex;
    flex-wrap: wrap;
</style>
