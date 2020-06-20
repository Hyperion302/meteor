<template>
  <span>
    <ais-instant-search index-name="prod_swish" :search-client="searchClient">
      <ais-autocomplete>
        <template slot-scope="{ currentRefinement, indices, refine }">
          <vue-autosuggest
            component-attr-id-autosuggest="autosuggestID"
            component-attr-class-autosuggest-results-container="resultsContainer"
            :suggestions="indicesToSuggestions(indices)"
            :get-suggestion-value="getSuggestionValue"
            :input-props="{
              style: 'width: 100%',
              class: 'searchInput',
              value: query,
            }"
            @input="refine"
            @selected="onSelect"
          >
            <template slot-scope="{ suggestion }">
              <div class="result">
                <ais-highlight
                  v-if="suggestion.item.type === 'channel'"
                  :hit="suggestion.item"
                  attribute="name"
                />
                <ais-highlight
                  v-if="suggestion.item.type === 'video'"
                  :hit="suggestion.item"
                  attribute="title"
                />
              </div>
            </template>
          </vue-autosuggest>
        </template>
      </ais-autocomplete>
      <ais-configure :query="query" hitsPerPage="10" />
    </ais-instant-search>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator';
import algoliasearch, { SearchClient } from 'algoliasearch/lite';
@Component({})
export default class Search extends Vue {
  @Prop({ type: String }) value?: string;
  query?: string = this.value;
  searchClient: SearchClient = algoliasearch(
    'VB80DMXNZ8',
    'f2145d2a9dfb20ecfd4355f01eb43065',
  );

  @Watch('query')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleQueryChange(oldVal: string, newVal: string) {
    this.$emit('input', newVal);
  }

  @Watch('value')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleValueChange(oldVal: string, newVal: string) {
    this.query = newVal;
  }
}
</script>

<style lang="sass"></style>
