<template>
  <span>
    <div class="masthead">
      <nuxt-link tag="a" class="logo" to="/dashboard">
        Swish
      </nuxt-link>
      <call-to-action
        class="button"
        border="false"
        horizontal-padding="1em"
        vertical-padding="0.5em"
        to="/"
        @click="1 + 1"
      >
        Back to site
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
export default class DashboardLayout extends Vue {}
</script>

<style lang="sass">
html
  font-family: 'Roboto', sans-serif;
body
  margin: 0;
.masthead
  z-index: 1
  background: #FFFFFF;
  position: absolute;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo
    color: black;
    text-decoration: none;
    margin-left: 24px;
    font-size: 16px;
  .button
    margin-right: 24px;
</style>
