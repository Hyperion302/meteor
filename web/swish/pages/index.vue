<template>
  <span>
    <main v-if="$auth.loggedIn">
      <call-to-action @click="$auth.logout()" text="Log Out" />
    </main>
    <main v-else class="splash">
      <div class="center-me">
        <h1>Video Reimagined</h1>
        <call-to-action @click="$auth.loginWith('auth0')" text="Show Me" />
      </div>
    </main>
  </span>
</template>

<script lang="ts">
import CallToAction from '~/components/CallToAction.vue';
import { Component, Vue } from 'nuxt-property-decorator';
@Component({
  components: {
    CallToAction,
  },
})
export default class HomePage extends Vue {}
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 6em;
}
.splash {
  height: 100vh;
  display: grid;
}
.center-me {
  margin: auto;
}
</style>
