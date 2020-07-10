<template>
  <nuxt-link tag="div" class="dashboardVideoTile" :to="`/watch/${video.id}`">
    <wrapped-image
      :src="
        `https://image.mux.com/${video.content.playbackID}/thumbnail.png?width=256&height=144&smart_crop=true&time=1`
      "
      size="256"
      size-y="144"
    />
    <nuxt-link
      tag="i"
      class="material-icons"
      :to="`/dashboard/${video.channel.id}/${video.id}/settings`"
      >edit</nuxt-link
    >
    <p class="title">{{ truncatedTitle }}</p>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { IVideo } from '~/models/video';
import WrappedImage from '~/components/WrappedImage.vue';

@Component({
  components: {
    WrappedImage,
  },
})
export default class DashboardVideoTile extends Vue {
  @Prop({ required: true }) readonly video!: IVideo;

  get truncatedTitle(): string {
    return this.video.title.length > 52
      ? this.video.title.substring(0, 49) + '...'
      : this.video.title;
  }
}
</script>

<style lang="sass">
.dashboardVideoTile
  width: 256px;
  cursor: pointer;
  position: relative;
  .title
    margin: 12px 24px;
    width: 256px - 24px * 2;
    overflow-wrap: break-word;
  &:hover > i
    opacity: 1;
  i
    padding: 0;
    z-index: 1;
    top: 6px;
    right: 6px;
    opacity: 0;
    position: absolute;
    background-color: #000000;
    color: #FFFFFF;
    border-radius: 2px;
    font-size: 24px;
  i:hover
    color: #000000;
    background-color: #FFFFFF;
</style>
