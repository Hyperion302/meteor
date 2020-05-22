<template>
  <div class="button-wrapper" @click="$emit('click')">
    <a class="button">{{ text }}</a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component({})
export default class CallToAction extends Vue {
  @Prop({ required: true }) readonly text!: string;
}
</script>

<style scoped>
.button-wrapper {
  text-align: center;
  display: block;
}
.button {
  background-color: #cc4421;
  color: #ffffff;
  width: auto;
  border-radius: 0.5em;
  padding: 1em 2em;
  border: none;
}
</style>
