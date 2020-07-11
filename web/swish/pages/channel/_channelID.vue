<template>
  <div class="channelPage">
    <div class="infoBox">
      <wrapped-image
        :src="
          `https://storage.googleapis.com/prod-swish/channelIcons/${channel.id}_128.png`
        "
        :size="128"
      />
      <h1>{{ channel.name }}</h1>
    </div>
    <div class="main">
      <div class="videosList">
        <video-tile
          v-for="video in videos"
          :key="video.id"
          class="videoTile"
          :video="video"
          :wt="video.wt"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import VideoTile from '~/components/VideoTile.vue';
import WrappedImage from '~/components/WrappedImage.vue';
import { getChannel } from '~/services/channel';
import { queryVideos, getWatchtime } from '~/services/video';
import { IChannel } from '~/models/channel';
import { IVideo } from '~/models/video';
@Component({
  components: {
    VideoTile,
    WrappedImage,
  },
  layout: 'signedIn',
})
export default class ChannelPage extends Vue {
  channel!: IChannel;
  video!: IVideo;
  async asyncData({ params }: { params: any }) {
    // Insert WT into videos
    const vids = await queryVideos(params.channelID);
    const vidsWithWT = await Promise.all(
      vids.map((vid: IVideo) => {
        return getWatchtime(vid.id).then((wt: number) => {
          return {
            ...vid,
            wt,
          };
        });
      }),
    );
    return {
      channel: await getChannel(params.channelID),
      videos: vidsWithWT,
    };
  }

  head() {
    return {
      title: `${this.channel.name} - Swish`,
    };
  }
}
</script>

<style lang="sass">
.channelPage
  padding: 60px 0 0 0;
  .infoBox
    height: 200px;
    background-color: #000000;
    display: flex;
    align-items: center;
    img
      margin: 0 24px;
      border-radius: 50%;
    h1
      color: #FFFFFF;
  .videosList
    display: flex;
    margin: 48px;
    .videoTile
      margin: 12px;
</style>
