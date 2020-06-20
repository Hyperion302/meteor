<template>
  <span>
    <textarea
      v-if="multiline"
      :value="value"
      class="textfield multiline"
      @input="(e) => handleInput(e.target.value)"
    />
    <input
      v-else
      type="text"
      :value="value"
      class="textfield"
      @input="(e) => handleInput(e.target.value)"
    />
  </span>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator';
@Component({})
export default class TextField extends Vue {
  @Prop({ type: String }) readonly value!: string;
  @Prop({ type: Boolean, default: false }) readonly multiline!: boolean;
  handleInput(input: string) {
    this.$emit('input', input);
  }
}
</script>

<style scoped>
@supports (-webkit-appearance: none) or (-moz-appearance: none) {
  .textfield {
    -webkit-appearance: none;
    -moz-appearance: none;
  }
}

.textfield {
  border: none;
  width: 100%;
  height: 100%;
  border: 1px solid #dddddd;
  text-align: start;
  border-radius: 4px;
  font-size: 24px;
  padding: 4px;
}
.multiline {
  resize: none;
  font-size: 16px;
}
</style>
