<template>
  <span>
    <main class="dashboardPage">
      <call-to-action
        class="newChannelButton"
        to="/dashboard/create"
        :disabled="channels.length >= 10 ? 'true' : 'false'"
      >
        New Channel
      </call-to-action>
      <div class="channels">
        <dashboard-channel-tile
          v-for="channel in channels"
          :key="channel.id"
          class="tile"
          :channel="channel"
        />
      </div>
    </main>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import DashboardChannelTile from '~/components/DashboardChannelTile.vue';
import CallToAction from '~/components/CallToAction.vue';
import { queryChannels } from '~/services/channel';

@Component({
  components: {
    CallToAction,
    DashboardChannelTile,
  },
  layout: 'dashboard',
})
export default class DashboardPage extends Vue {
  async asyncData({ $auth }: { $axios: any; $auth: any }) {
    const channels = await queryChannels($auth.$state.user.sub);
    return {
      channels,
    };
  }
}
</script>

<style lang="sass">
.dashboardPage
  display: grid;
  height: 100vh;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  .newChannelButton
    grid-column: 9 / span 2;
    grid-row: 2 / span 1;
  .channels
    grid-column: 2 / span 10;
    grid-row: 3 / span 9;
    display: flex;
    flex-wrap: wrap;
    .tile
      margin: 20px;
</style>
