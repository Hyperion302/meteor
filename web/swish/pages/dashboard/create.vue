<template>
  <main class="createPage">
    <h1>Create Channel</h1>
    <icon-picker v-model="iconBlob" class="iconPickerField" />
    <text-field v-model="channelName" class="channelNameField" />
    <div class="buttons">
      <call-to-action
        class="create"
        :disabled="creating || !valid ? 'true' : 'false'"
        @click="create"
      >
        Create
      </call-to-action>
      <call-to-action
        class="cancel"
        :disabled="creating ? 'true' : 'false'"
        to="/dashboard"
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
import IconPicker from '~/components/IconPicker.vue';
import CallToAction from '~/components/CallToAction.vue';
import { createChannel, uploadIcon } from '~/services/channel';

@Component({
  components: {
    TextField,
    CallToAction,
    IconPicker,
  },
})
export default class CreatePage extends Vue {
  iconBlob?: any = null;
  channelName: string = '';
  creating: boolean = false;
  async create() {
    this.creating = true;
    if (this.valid) {
      // Create channel
      const newChannel = await createChannel(this.channelName);
      // Upload Icon
      if (this.iconBlob) {
        await uploadIcon(newChannel.id, this.iconBlob);
      }
    }
    await this.$router.push('/dashboard');
  }

  get valid(): boolean {
    if (this.channelName.length < 1) {
      return false;
    }
    return true;
  }
}
</script>

<style lang="sass">
.createPage
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
    max-width: 300px;
  .buttons
    margin: 12px 0;
    .create
      margin: 0 12px 0 0;
    .cancel
      margin: 0 0 0 12px;
</style>
