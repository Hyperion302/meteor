<template>
  <nuxt-link tag="div" :to="linkLocation" class="searchResult">
    <img :src="iconURL" @error="imageLoadError" />
    <div v-if="type === 'channel'" class="infoBox">
      <h3>{{ label }}</h3>
    </div>
    <div v-else class="infoBox">
      <h3>{{ label }}</h3>
      <p>{{ video.description }}</p>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { getVideo } from '~/services/video';
import { IVideoSearchObject } from '~/models/video';
import { IChannelSearchObject } from '~/models/channel';
@Component({})
export default class SearchResult extends Vue {
  iconURL: string = 'https://via.placeholder.com/128';
  @Prop() readonly video!: IVideoSearchObject;
  @Prop() readonly channel!: IChannelSearchObject;
  @Prop({ required: true, type: String }) readonly type!: string;

  async mounted() {
    if (this.type === 'video') {
      const video = await getVideo(this.video.objectID);
      if (video.content) {
        this.iconURL = `https://image.mux.com/${video.content.playbackID}/thumbnail.png?width=128&height=128&smart_crop=true&time=1`;
      }
    } else {
      this.iconURL = `https://storage.googleapis.com/prod-swish/channelIcons/${this.channel.objectID}_128.png`;
    }
  }

  imageLoadError() {
    this.iconURL = 'https://via.placeholder.com/128';
  }

  get label() {
    return this.type === 'channel' ? this.channel.name : this.video.title;
  }

  get linkLocation() {
    return this.type === 'channel'
      ? `/channel/${this.channel.objectID}`
      : `/watch/${this.video.objectID}`;
  }
}
</script>

<style lang="sass">
.searchResult
  margin: 24px 0;
  height: 128px;
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover
    cursor: pointer
  .infoBox
    margin: 0 48px;
    color: black;
    h3
      font-size: 24px;
    p
      font-size: 12px;
</style>
