<template>
  <span>
    <main class="channelDashboardPage">
      <h1 class="channelName">{{ channel.name }}</h1>
      <call-to-action
        class="uploadButton"
        :to="`/dashboard/${channel.id}/upload`"
        :disabled="videos.length >= 1000 ? 'true' : 'false'"
      >
        Upload Video
      </call-to-action>
      <div class="videos">
        <video-tile
          v-for="video in videos"
          :key="video.id"
          settings-enabled
          class="tile"
          :video="video"
        />
      </div>
    </main>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import VideoTile from '~/components/VideoTile.vue';
import CallToAction from '~/components/CallToAction.vue';
import { getChannel } from '~/services/channel';
import { queryVideos } from '~/services/video';
@Component({
  components: {
    CallToAction,
    VideoTile,
  },
  layout: 'dashboard',
})
export default class ChannelDashboardPage extends Vue {
  async asyncData({ params }: { params: any }) {
    const channel = await getChannel(params.channelID);
    const videos = await queryVideos(channel.id);
    return {
      channel,
      videos,
    };
  }
}
</script>

<style lang="sass">
.channelDashboardPage
  display: grid;
  height: 100vh;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  h1
    grid-column: 2 / span 8;
    grid-row: 2 / span 1;
    margin: 0;
  .uploadButton
    grid-column: 9 / span 2;
    grid-row: 2 / span 1;
  .videos
    grid-column: 2 / span 10;
    grid-row: 4 / span 8;
    display: flex;
    flex-wrap: wrap;
    .tile
      margin: 24px;
</style>
