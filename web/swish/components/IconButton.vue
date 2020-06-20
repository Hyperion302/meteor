<template>
  <span @click="$emit('click')">
    <nuxt-link :to="to">
      <i class="material-icons icon">
        {{ icon }}
      </i>
    </nuxt-link>
  </span>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator';
@Component({})
export default class IconButton extends Vue {
  @Prop({ required: true }) readonly icon!: string;
  @Prop({ default: '' }) readonly to!: string;
}
</script>

<style></style>
