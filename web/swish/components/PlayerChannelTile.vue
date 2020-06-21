<template>
  <nuxt-link tag="div" class="smallChannelTile" :to="`/channel/${channel.id}`">
    <img
      class="channelIcon"
      :src="iconURL"
      @error="
        () => {
          iconExists = false;
        }
      "
    />
    <h2 class="channelName">{{ channel.name }}</h2>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { IChannel } from '~/models/channel';

@Component({})
export default class PlayerChannelTile extends Vue {
  iconExists: boolean = true;
  @Prop({ required: true }) readonly channel!: IChannel;

  get iconURL() {
    if (this.iconExists) {
      return `https://storage.googleapis.com/prod-swish/channelIcons/${this.channel.id}_64.png`;
    } else {
      return 'https://via.placeholder.com/64';
    }
  }
}
</script>

<style lang="sass">
.smallChannelTile
  box-sizing: border-box;
  width: 200px;
  height: 70px;
  border: 1px solid #dddddd;
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 5px;
  &:hover
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.25);
    cursor: pointer;
  h2
    margin: 0 0 0 5px;
    font-weight: 200;
    font-size: 16px;
    text-overflow: ellipsis;
  img
    width: 60px;
    height: 60px;
</style>
