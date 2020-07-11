<template>
  <nuxt-link tag="div" class="smallChannelTile" :to="`/channel/${channel.id}`">
    <wrapped-image
      class="channelIcon"
      :src="
        `https://storage.googleapis.com/prod-swish/channelIcons/${channel.id}_64.png`
      "
      :size="64"
    />
    <h2 class="channelName">{{ channel.name }}</h2>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import WrappedImage from '~/components/WrappedImage.vue';
import { IChannel } from '~/models/channel';

@Component({
  components: {
    WrappedImage,
  },
})
export default class PlayerChannelTile extends Vue {
  @Prop({ required: true }) readonly channel!: IChannel;
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
  color: #666666;
  &:hover
    cursor: pointer;
    color: #333333;
  h2
    margin: 0 0 0 5px;
    font-weight: 400;
    font-size: 16px;
    text-overflow: ellipsis;
  img
    width: 60px;
    height: 60px;
    border-radius: 50%;
</style>
