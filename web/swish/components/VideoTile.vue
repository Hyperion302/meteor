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
      v-if="editable"
      tag="i"
      class="material-icons"
      :to="`/dashboard/${video.channel.id}/${video.id}/settings`"
      >edit</nuxt-link
    >
    <p class="title">{{ truncatedTitle }}</p>
    <p class="info">
      {{ vc }} view{{ vc !== '1' ? 's' : '' }} · {{ vt }} · {{ ud }}
    </p>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { IVideo } from '~/models/video';
import WrappedImage from '~/components/WrappedImage.vue';
import { calcEVC, shortenCount, formatDuration, formatDate } from '~/util';

@Component({
  components: {
    WrappedImage,
  },
})
export default class DashboardVideoTile extends Vue {
  @Prop({ required: true }) readonly video!: IVideo;
  @Prop() readonly wt?: number;
  @Prop({ default: false }) readonly editable!: boolean;

  get truncatedTitle(): string {
    return this.video.title.length > 52
      ? this.video.title.substring(0, 49) + '...'
      : this.video.title;
  }

  get vc(): string {
    if (!this.wt) return '0';
    return shortenCount(calcEVC(this.wt, this.video));
  }

  get vt(): string {
    if (!this.wt) return '0 s';
    return formatDuration(this.wt, true);
  }

  get ud(): string {
    return formatDate(this.video.uploadDate);
  }
}
</script>

<style lang="sass">
.dashboardVideoTile
  width: 256px;
  cursor: pointer;
  position: relative;
  .title
    margin: 12px 24px 6px 24px;
    width: 256px - 24px * 2;
    overflow-wrap: break-word;
    font-weight: bold;
  .info
    margin: 6px 24px 12px 24px;
    width: 256px - 24px * 2;
    color: #9e9e9e;
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
