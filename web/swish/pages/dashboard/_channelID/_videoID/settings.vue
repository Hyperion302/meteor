<template>
  <main class="videoSettingsPage">
    <h1>Video Settings</h1>
    <text-field v-model="videoTitle" class="videoTitleField" />
    <text-field
      v-model="videoDescription"
      multiline
      class="videoDescriptionField"
    />
    <div class="buttons">
      <call-to-action
        class="save"
        :disabled="saving || !valid ? 'true' : 'false'"
        @click="save"
      >
        Save
      </call-to-action>
      <call-to-action
        class="cancel"
        :disabled="saving ? 'true' : 'false'"
        :to="`/dashboard?sel=${video.channel.id}`"
        border="false"
      >
        Cancel
      </call-to-action>
      <call-to-action
        class="delete"
        :disabled="saving ? 'true' : 'false'"
        border="false"
        @click="delete_"
      >
        Delete
      </call-to-action>
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import CallToAction from '~/components/CallToAction.vue';
import TextField from '~/components/TextField.vue';
import { getVideo, deleteVideo, updateVideo } from '~/services/video';
import { IVideo } from '~/models/video';
@Component({
  components: {
    CallToAction,
    TextField,
  },
})
export default class VideoSettingsPage extends Vue {
  video?: IVideo;
  videoTitle: string = '';
  saving: boolean = false;
  videoDescription: string = '';
  async asyncData({ params }: { params: any }) {
    const video = await getVideo(params.videoID);
    return {
      video,
      videoTitle: video.title,
      videoDescription: video.description,
    };
  }

  get valid(): boolean {
    return this.titleValid || this.descriptionValid;
  }

  get titleValid(): boolean {
    if (!this.video) {
      return false;
    }
    if (this.videoTitle.length < 1 || this.videoTitle === this.video.title) {
      return false;
    }
    return true;
  }

  get descriptionValid(): boolean {
    if (!this.video) {
      return false;
    }
    if (
      this.videoDescription.length < 1 ||
      this.videoDescription === this.video.description
    ) {
      return false;
    }
    return true;
  }

  async save() {
    if (this.valid && this.video) {
      this.saving = true;
      const update = {
        ...(this.titleValid && { title: this.videoTitle }),
        ...(this.videoDescription && { description: this.videoDescription }),
      };
      await updateVideo(this.video.id, update);
      await this.$router.push(`/dashboard?sel=${this.video.channel.id}`);
      this.saving = false;
    }
  }

  async delete_() {
    if (this.video) {
      this.saving = true;
      await deleteVideo(this.video.id);
      await this.$router.push(`/dashboard?sel=${this.video.channel.id}`);
      this.saving = false;
    }
  }
}
</script>

<style lang="sass">
.videoSettingsPage
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
    .save
      margin: 0 12px 0 0;
    .cancel
      margin: 0 12px 0 12px;
    .delete
      margin: 0 0 0 12px;
</style>
