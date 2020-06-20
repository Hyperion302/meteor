<template>
  <client-only>
    <div
      class="iconPicker"
      :style="{
        'background-image': `url('${preview}'), url('https://via.placeholder.com/128')`,
      }"
    >
      <label class="iconPickerInput">
        Choose an icon...
        <input
          type="file"
          accept="image/jpeg, image/png"
          @change="(e) => handleChange(e.target.files[0])"
        />
      </label>
    </div>
  </client-only>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator';
@Component({})
export default class IconPicker extends Vue {
  /*
  For now, I'm forced to use 'any' for the type instead of 'File'.  Since
  This code must be isomorphic, it unfortunately means that I can't simply specify
  'File' since it's not global in the Node.JS environment.
  */
  fr: any = null;
  previewURI: string = '';
  @Prop() value?: any;
  @Prop({ type: String }) initialPreview?: string;
  handleChange(f: any) {
    this.$emit('input', f);
    this.fr.readAsDataURL(f);
  }

  mounted() {
    this.fr = new FileReader();
    this.fr.onload = (e: any) => {
      // Update preview when loading finishes
      this.previewURI = e.target.result;
    };
  }

  get preview(): string | undefined {
    if (this.previewURI) return this.previewURI;
    return this.initialPreview;
  }
}
</script>

<style scoped>
.iconPicker {
  position: relative;
  width: 128px;
  height: 128px;
  background-position: center;
}
.iconPickerInput {
  position: absolute;
  left: 0px;
  width: 128px;
  height: 30px;
  font-weight: 200;
  text-align: center;
  cursor: pointer;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.3);
}

.iconPickerInput input {
  display: none;
}
</style>
