<template>
  <nuxt-link tag="div" :to="linkLocation" class="searchResult">
    <wrapped-image
      :style="type === 'channel' ? { 'border-radius': '50%' } : {}"
      :src="iconURL"
      :size="type === 'channel' ? 128 : 256"
    />
    <div v-if="type === 'channel'" class="infoBox">
      <h3>{{ label }}</h3>
    </div>
    <div v-else class="infoBox">
      <h3>{{ label }}</h3>
      <nuxt-link
        v-if="parsedVideo"
        class="channelName"
        :to="`/channel/${parsedVideo.channel.id}`"
        >{{ parsedVideo.channel.name }}</nuxt-link
      >
      <p>{{ video.description }}</p>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import WrappedImage from '~/components/WrappedImage.vue';
import { getVideo } from '~/services/video';
import { IVideoSearchObject, IVideo } from '~/models/video';
import { IChannelSearchObject } from '~/models/channel';
@Component({
  components: {
    WrappedImage,
  },
})
export default class SearchResult extends Vue {
  iconURL: string = 'https://via.placeholder.com/128';
  @Prop() readonly video!: IVideoSearchObject;
  parsedVideo?: IVideo;
  @Prop() readonly channel!: IChannelSearchObject;
  @Prop({ required: true, type: String }) readonly type!: string;

  async mounted() {
    if (this.type === 'video') {
      this.parsedVideo = await getVideo(this.video.objectID);
      if (this.parsedVideo.content) {
        this.iconURL = `https://image.mux.com/${this.parsedVideo.content.playbackID}/thumbnail.png?width=256&height=256&smart_crop=true&time=1`;
      }
    } else {
      this.iconURL = `https://storage.googleapis.com/prod-swish/channelIcons/${this.channel.objectID}_128.png`;
    }
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
    .channelName
      text-decoration: none;
      color: #888888;
      font-weight: 100;
    h3
      font-size: 24px;
      margin: 0;
    p
      font-size: 12px;
</style>
