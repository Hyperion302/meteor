<template>
  <main class="uploadPage">
    <h1>Upload Video</h1>
    <text-field v-model="videoTitle" class="videoTitleField" />
    <text-field
      v-model="videoDescription"
      multiline
      class="videoDescriptionField"
    />
    <video-picker v-model="videoBlob" />
    <div class="buttons">
      <call-to-action
        class="upload"
        :disabled="uploading || !valid ? 'true' : 'false'"
        @click="upload"
      >
        Upload
      </call-to-action>
      <call-to-action
        class="cancel"
        :disabled="uploading ? 'true' : 'false'"
        :to="`/dashboard?sel=${channelID}`"
        border="false"
      >
        Cancel
      </call-to-action>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import TextField from '~/components/TextField.vue';
import VideoPicker from '~/components/VideoPicker.vue';
import CallToAction from '~/components/CallToAction.vue';
import { createVideo, uploadVideo } from '~/services/video';
@Component({
  components: {
    TextField,
    VideoPicker,
    CallToAction,
  },
})
export default class UploadPage extends Vue {
  videoBlob: any = null;
  videoTitle: string = '';
  videoDescription: string = '';
  channelID: string = '';
  uploading: boolean = false;
  asyncData({ params }: { params: any }) {
    return {
      channelID: params.channelID,
    };
  }

  async upload() {
    this.uploading = true;
    const createdVideo = await createVideo(
      this.videoTitle,
      this.videoDescription,
      this.channelID,
    );
    await uploadVideo(createdVideo.id, this.videoBlob);
    await this.$router.push(`/dashboard?sel=${this.channelID}`);
    this.uploading = false;
  }

  get valid(): boolean {
    if (this.videoTitle.length < 1) {
      return false;
    }
    if (this.videoDescription.length < 1) {
      return false;
    }
    if (!this.videoBlob) {
      return false;
    }
    return true;
  }
}
</script>

<style lang="sass">
.uploadPage
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 24px;
  display: flex;
  flex-direction: column;
  .videoTitleField
    margin: 12px 0;
    max-width: 300px;
  .videoDescriptionField
    margin: 12px 0;
    max-width: 300px;
    height: 200px;
  .buttons
    margin: 12px 0;
    .upload
      margin: 0 12px 0 0;
    .cancel
      margin: 0 0 0 12px;
</style>
