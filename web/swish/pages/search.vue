<template>
  <main class="searchPage">
    <ais-instant-search index-name="prod_swish" :search-client="searchClient">
      <ais-search-box
        autofocus
        :class-names="{
          'ais-SearchBox': 'searchBox',
        }"
      >
        <template slot-scope="{ currentRefinement, isSearchStalled, refine }">
          <input
            type="search"
            :value="currentRefinement"
            @input="
              refine($event.currentTarget.value);
              updateQueryString($event.currentTarget.value);
            "
          />
        </template>
      </ais-search-box>
      <ais-infinite-hits>
        <div slot-scope="{ items, refinePrevious, refineNext }">
          <div v-for="item in items" :key="item.objectID">
            <search-result
              v-if="item.type === 'channel'"
              type="channel"
              :channel="item"
            />
            <search-result
              v-if="item.type === 'video'"
              type="video"
              :video="item"
            />
          </div>
          <call-to-action @click="refineNext">Show more</call-to-action>
        </div>
      </ais-infinite-hits>
      <ais-configure :query="query" hitsPerPage="50" />
    </ais-instant-search>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import algoliasearch, { SearchClient } from 'algoliasearch/lite';
import Search from '~/components/Search.vue';
import CallToAction from '~/components/CallToAction.vue';
import SearchResult from '~/components/SearchResult.vue';
@Component({
  components: {
    Search,
    SearchResult,
    CallToAction,
  },
  layout: 'search',
})
export default class SearchPage extends Vue {
  asyncData({ query }: { query: any }) {
    return {
      query: query.q ? decodeURIComponent(query.q) : '',
    };
  }

  searchClient: SearchClient = algoliasearch(
    'VB80DMXNZ8',
    'f2145d2a9dfb20ecfd4355f01eb43065',
  );

  updateQueryString(query: string) {
    this.$router.push({
      query: {
        q: encodeURIComponent(query),
      },
    });
  }
}
</script>

<style lang="sass">
.searchPage
  height: 100vh;
  padding: 96px;
  .searchBox
    input
      border: 1px solid #dddddd;
      border-radius: 4px;
      font-size: 24px;
      padding: 4px;
      @supports (-webkit-appearance: none) or (-moz-appearance: none)
        -webkit-appearance: none;
        -moz-appearance: none;
</style>
