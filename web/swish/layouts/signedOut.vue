<template>
  <span>
    <div class="masthead">
      <div class="logo">
        Swish
      </div>
      <call-to-action
        class="button"
        border="false"
        horizontal-padding="1em"
        vertical-padding="0.5em"
        @click="$auth.loginWith('auth0')"
      >
        Sign In
      </call-to-action>
    </div>
    <nuxt />
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import CallToAction from '~/components/CallToAction.vue';

@Component({
  components: {
    CallToAction,
  },
})
export default class SignedOutLayout extends Vue {}
</script>

<style lang="sass">
html
  font-family: 'Roboto', sans-serif;
body
  margin: 0;
.masthead
  position: absolute;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo
    margin-left: 24px;
    font-size: 16px;
  .button
    margin-right: 24px;
</style>
