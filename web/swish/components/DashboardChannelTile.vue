<template>
  <nuxt-link tag="div" class="channelTile" :to="`/dashboard/${channel.id}`">
    <img :src="iconURL" @error="imageLoadError" />
    <h2>{{ channel.name }}</h2>
    <nuxt-link
      tag="i"
      :to="`/dashboard/${channel.id}/settings`"
      class="material-icons"
    >
      settings
    </nuxt-link>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { IChannel } from '~/models/channel';

@Component({})
export default class DashboardChannelTile extends Vue {
  @Prop({ required: true }) readonly channel!: IChannel;
  iconExists: boolean = true;
  get iconURL(): string {
    if (this.iconExists) {
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
.channelTile
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
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
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
