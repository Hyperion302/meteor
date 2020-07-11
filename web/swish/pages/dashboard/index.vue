<template>
  <div class="dashboardPage">
    <div class="sidebar">
      <div
        v-for="channel in channels"
        :key="channel.id"
        :class="['channelListElement', selected == channel.id ? 'active' : '']"
        :style="drawerOpen ? {} : { display: 'none' }"
        @click="selected = channel.id"
      >
        {{ channel.name }}
      </div>
      <nuxt-link
        tag="div"
        class="channelListElement newChannel"
        :style="drawerOpen ? {} : { display: 'none' }"
        to="/dashboard/create"
      >
        +
      </nuxt-link>
      <nuxt-link
        tag="div"
        class="channelListElement backToSite"
        :style="drawerOpen ? {} : { display: 'none' }"
        to="/"
      >
        Back to site
      </nuxt-link>
      <div class="channelListElement drawer" @click="drawerOpen = !drawerOpen">
        {{ drawerOpen ? '/\\' : '\\/' }}
      </div>
    </div>
    <div v-if="selected" class="main">
      <div class="top">
        <nuxt-link
          tag="div"
          class="iconWrapper"
          :to="`/dashboard/${currentChannel.id}/settings`"
        >
          <wrapped-image
            class="icon"
            :src="
              `https://storage.googleapis.com/prod-swish/channelIcons/${currentChannel.id}_128.png`
            "
            :size="128"
          />
          <div class="iconOverlay">
            <i class="material-icons">edit</i>
          </div>
        </nuxt-link>
      </div>
      <div class="videos">
        <video-tile
          v-for="video in currentChannel.videos"
          :key="video.id"
          class="video"
          :video="video"
          :wt="video.wt"
          :editable="true"
        />
        <div v-if="currentChannel.videos.length <= 1000" class="uploadVideo">
          <call-to-action :to="`/dashboard/${currentChannel.id}/upload`">
            Upload
          </call-to-action>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import DashboardChannelTile from '~/components/DashboardChannelTile.vue';
import CallToAction from '~/components/CallToAction.vue';
import WrappedImage from '~/components/WrappedImage.vue';
import VideoTile from '~/components/VideoTile.vue';
import { queryChannels } from '~/services/channel';
import { IChannel } from '~/models/channel';
import { queryVideos, getWatchtime } from '~/services/video';
import { IVideo } from '~/models/video';

@Component({
  components: {
    CallToAction,
    DashboardChannelTile,
    WrappedImage,
    VideoTile,
  },
  layout: 'default',
})
export default class DashboardPage extends Vue {
  channels: IChannel[] = [];
  drawerOpen: boolean = true;
  selected!: string;
  async asyncData({ $auth, query }: { query: any; $auth: any }) {
    // Run query channels to get a list of channels.
    // Run queryVideos on every channel to get a list of videos
    // Run getWatchtime on every video to get wt
    // FIXME: This should not be done here.  I do this process in other parts of the site.  It should
    // be abstracted.  Where, I don't know.
    const channels = await queryChannels($auth.$state.user.sub);
    const channelsWithVideos = await Promise.all(
      channels.map((channel: IChannel) => {
        return queryVideos(channel.id).then((videos: IVideo[]) => {
          return {
            ...channel,
            videos,
          };
        });
      }),
    );
    const channelsWithVidsWithWT = await Promise.all(
      channelsWithVideos.map((channel: IChannel & { videos: IVideo[] }) => {
        return Promise.all(
          channel.videos.map((video: IVideo) => {
            return getWatchtime(video.id).then((wt: number) => {
              return {
                ...video,
                wt,
              };
            });
          }),
        ).then((vidsWithWT) => {
          return {
            ...channel,
            videos: vidsWithWT,
          };
        });
      }),
    );
    return {
      selected: query.sel ? decodeURIComponent(query.sel) : channels[0].id,
      channels: channelsWithVidsWithWT,
    };
  }

  get currentChannel() {
    return this.channels.find((val: IChannel) => val.id === this.selected);
  }
}
</script>

<style lang="sass">
.dashboardPage
  height: 100vh;
  width: 100vw;
  display: flex;
  @media only screen and (max-width: 600px)
    display: block;
  .sidebar
    font-weight: 100;
    height: 100%;
    width: 15%;
    @media only screen and (max-width: 600px)
      height: auto;
      width: 100%;
    background-color: #000000;
    .channelListElement
      padding: 24px;
      height: 24px;
      color: #FFFFFF;
      &.newChannel
        text-align: center;
        font-size: 20px;
      &.backToSite
        width: 15%;
        position: absolute;
        @media only screen and (max-width: 600px)
          width: 100%;
          position: static;
        bottom: 0;
      &.active
        @media only screen and (min-width: 601px)
          border-left: 5px solid #FFFFFF;
        @media only screen and (max-width: 600px)
          border-top: 5px solid #FFFFFF;
      &.drawer
        text-align: center;
        @media only screen and (min-width: 601px)
          display: none;
      &:hover
        color: #000000;
        background-color: #FFFFFF;
        cursor: pointer;
  .main
    height: 100%;
    width: 85%;
    .top
      .iconWrapper
        position: relative;
        width: 128px;
        height: 128px;
        margin: 48px;
        .icon
          border-radius: 50%;
        .iconOverlay
          opacity: 0;
          background: rgba(0, 0, 0, 0.5);
          transition: .2s ease;
          border-radius: 50%;
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover
            opacity: 1;
            cursor: pointer;
          i
            color: #FFFFFF;
            font-size: 32px;
    .videos
      display: flex;
      flex-wrap: wrap;
      padding: 0 48px;
      .video
        margin: 12px;
      .uploadVideo
        width: 256px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        .uploadButton
          width: 96px;
          height: 48px;
          background-color: #c9c9c9;
          text-align: center;
          border-radius: 6px;
          font-size: 48px;
          line-height: 48px;
          text-decoration: none;
          font-weight: 100;
          color: #000000;
          p
            margin: 0;
          &:hover
            background-color: #9e9e9e;
            cursor: pointer;
</style>
