<template>
  <img
    :src="imageURL"
    :style="{ width: size, height: sizeY ? sizeY : size }"
    @error="handleLoadError"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class WrappedImage extends Vue {
  @Prop({ required: true }) readonly src!: string;
  @Prop({ required: true }) readonly size!: number;
  @Prop() readonly sizeY!: number;
  imageLoadError: boolean = false;
  get imageURL(): string {
    if (!this.imageLoadError) {
      return this.src;
    } else {
      return `https://via.placeholder.com/${this.size}`;
    }
  }

  handleLoadError() {
    this.imageLoadError = true;
  }
}
</script>

<style></style>
