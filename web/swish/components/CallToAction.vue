<template>
  <span @click="handleClick">
    <nuxt-link
      class="cta"
      :to="path"
      tag="button"
      :style="{
        padding: verticalPadding + ' ' + horizontalPadding,
        'border-style': border == 'true' ? 'solid' : 'none',
        'border-color': color,
        color: color,
        cursor: !disabledBool ? 'pointer' : 'default',
      }"
    >
      <slot></slot>
    </nuxt-link>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class CallToAction extends Vue {
  @Prop({ default: 'true' }) readonly border!: string;
  @Prop({ default: '2em' }) readonly horizontalPadding!: string;
  @Prop({ default: '1em' }) readonly verticalPadding!: string;
  @Prop({ default: 'false' }) readonly disabled!: string;
  @Prop({ default: '' }) readonly to!: string;
  handleClick() {
    if (!this.disabledBool) {
      this.$emit('click');
    }
  }

  get disabledBool(): boolean {
    return this.disabled === 'true';
  }

  get color(): string {
    return this.disabledBool ? '#cccccc' : '#cb3b0e';
  }

  get path(): string {
    return this.disabledBool ? '' : this.to;
  }
}
</script>

<style lang="sass">
.cta
  display: inline-block;
  background-color: #ffffff;
  color: #cb3b0e;

  margin: 0;

  border-radius: 0.5em;
  border-width: 0.5px;
  border-color: #cb3b0e;

  font-weight: 100;
  font-size: 16px;
  text-decoration: none;
</style>
