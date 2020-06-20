<template>
  <nuxt-link tag="div" class="videoTile" :to="`/watch/${video.id}`">
    <img class="videoIcon" :src="previewImage" />
    <h2 class="videoName">{{ video.title }}</h2>
    <nuxt-link
      tag="i"
      :to="`/dashboard/${video.channel.id}/${video.id}/settings`"
      class="material-icons"
    >
      settings
    </nuxt-link>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { IVideo } from '~/models/video';

@Component({})
export default class DashboardVideoTile extends Vue {
  @Prop({ required: true }) readonly video!: IVideo;
  get previewImage(): string {
    if (this.video.content) {
      return `https://image.mux.com/${this.video.content.playbackID}/thumbnail.png?width=128&height=128&smart_crop=true&time=1`;
    }
    return '';
  }
}
</script>

<style lang="sass">
.videoTile
  box-sizing: border-box;
  width: 250px;
  height: 250px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  border: 1px solid #dddddd;
  border-radius: 5px;
  padding: 24px;
  &:hover
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.25);
    cursor: pointer;
  img
    grid-column: 1 / span 5;
    grid-row: 1 / span 3;
    width: 100%;
    height: 100%;
    display: inline-block;
  h2
    margin: 0;
    grid-column: 1 / span 3;
    grid-row: 4 / span 1;
    font-weight: 200;
    font-size: 28px;
    text-overflow: ellipsis;
  i
    grid-column: 5 / span 1;
    grid-row: 4 / span 1;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    align-self: center;
    &:hover
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.25);
</style>
