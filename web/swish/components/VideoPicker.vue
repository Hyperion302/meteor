<template>
  <client-only>
    <span>
      <input
        id="videoPicker"
        class="videoPickerInput"
        type="file"
        accept="video/mp4, video/quicktime"
        @change="(e) => handleChange(e.target.files[0])"
      />
      <label for="videoPicker">{{ labelText }}</label>
    </span>
  </client-only>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
@Component({})
export default class VideoPicker extends Vue {
  @Prop() value?: any;

  handleChange(f: any) {
    this.$emit('input', f);
  }

  get labelText(): string {
    if (this.value) {
      return 'Video chosen';
    }
    return 'Choose a video...';
  }
}
</script>

<style lang="sass">
.videoPickerInput
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute
  z-index: -1;
.videoPickerInput + label
  display: inline-block;
  cursor: pointer;

  font-size: 1em;
  font-weight: 100;
  color: #cb3b0e;

  padding: 1em;

  border-radius: 0.5em;
  border-width: 1px;
  border-color: #cb3b0e;
.videoPickerInput:focus + label
  outline: 1px dotted #000
  outline: -webkit-focus-ring-color auto 5px;
</style>
