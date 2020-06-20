<template>
  <nuxt-link tag="div" class="channelTile" :to="`/channel/${channel.id}`">
    <img class="channelIcon" src="https://via.placeholder.com/60" />
    <h2 class="channelName">{{ channel.name }}</h2>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { IChannel } from '~/models/channel';

@Component({})
export default class PlayerChannelTile extends Vue {
  @Prop({ required: true }) readonly channel!: IChannel;
}
</script>

<style scoped>
.channelTile {
  box-sizing: border-box;
  width: 200px;
  height: 70px;
  border: 1px solid #dddddd;
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 5px;
}
.channelTile:hover {
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.channelTile h2 {
  margin: 0 0 0 5px;
  font-weight: 200;
  font-size: 16px;
  text-overflow: ellipsis;
}
</style>
