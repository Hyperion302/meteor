<template>
  <main class="channelSettingsPage">
    <h1>Channel Settings</h1>
    <icon-picker
      v-model="iconBlob"
      :initial-preview="
        `https://storage.googleapis.com/prod-swish/channelIcons/${channel.id}_128.png`
      "
      class="iconPickerField"
    />
    <text-field v-model="channelName" class="channelNameField" />
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
        :to="`/dashboard?sel=${channel.id}`"
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
import TextField from '~/components/TextField.vue';
import IconPicker from '~/components/IconPicker.vue';
import CallToAction from '~/components/CallToAction.vue';
import {
  getChannel,
  updateChannel,
  deleteChannel,
  uploadIcon,
} from '~/services/channel';

import { IChannel } from '~/models/channel';
@Component({
  components: {
    TextField,
    IconPicker,
    CallToAction,
  },
})
export default class ChannelSettingsPage extends Vue {
  channel?: IChannel;
  channelName: string = '';
  iconBlob: any = null;
  saving: boolean = false;
  async asyncData({ params }: { params: any }) {
    const channel = await getChannel(params.channelID);
    return {
      channel,
      channelName: channel.name,
    };
  }

  async save() {
    if (this.valid && this.channel) {
      this.saving = true;
      // Update channel settings
      if (this.nameValid) {
        await updateChannel(this.channel.id, this.channelName);
      }
      if (this.iconValid) {
        await uploadIcon(this.channel.id, this.iconBlob);
      }
      await this.$router.push(`/dashboard?sel=${this.channel.id}`);
    }
  }

  async delete_() {
    if (this.channel) {
      // Delete
      this.saving = true;
      await deleteChannel(this.channel.id);
      await this.$router.push(`/dashboard`);
    }
  }

  get nameValid() {
    if (!this.channel) {
      return false;
    }
    // Valid Name?
    if (!this.channelName || this.channelName.length < 1) {
      return false;
    }
    // Name not the same?
    if (this.channelName === this.channel.name) {
      return false;
    }
    return true;
  }

  get iconValid() {
    if (!this.channel) {
      return false;
    }
    // Icon not changed? (iconBlob will still be undefined)
    if (!this.iconBlob) {
      return false;
    }
    return true;
  }

  get valid() {
    if (this.iconValid || this.nameValid) {
      return true;
    }
    return false;
  }
}
</script>

<style lang="sass">
.channelSettingsPage
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 24px;
  display: flex;
  flex-direction: column;
  .iconPickerField
    margin: 12px 0;
  .channelNameField
    margin: 12px 0;
    max-width: 25vw;
  .buttons
    margin: 12px 0;
    .save
      margin: 0 12px 0 0;
    .cancel
      margin: 0 12px 0 12px;
    .delete
      margin: 0 0 0 12px;
</style>
