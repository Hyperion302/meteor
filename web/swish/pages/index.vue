<template>
  <span>
    <main v-if="$auth.loggedIn" class="splash">
      <div class="searchWrapper">
        <ais-instant-search
          index-name="prod_swish"
          :search-client="searchClient"
        >
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
                  placeholder: 'Find something new...',
                }"
                @input="
                  refine($event);
                  onInput($event);
                "
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
      </div>
    </main>
    <main v-else class="splash">
      <div class="hero">
        <h1>Video Reimagined</h1>
        <call-to-action @click="$auth.loginWith('auth0')">
          Show Me
        </call-to-action>
      </div>
      <div class="about">
        <h1>But, why?</h1>
        <p>
          Traditionally, online platforms have offered their services free of
          charge in exchange for running ads and collecting data. For the user,
          this model is inherently flawed. Since the user is not providing
          revenue, they are not the customer. In fact, since they themselves
          (their eyes) are the objects being sold, <i>they are the product</i>.
          This means that user needs are rarely met, as long as they keep
          viewing ads. Instead, priority is given to the businesses
          <i>that run ads</i>, which has resulted in the many policy
          controversies platforms like YouTube have had recently. What content
          is allowed, and how valuable content is, is determined solely by the
          customer: advertisers. This means that content is unfairly moderated
          and demonitized, even if users are eager to view it. Swish is an
          answer to this business model. It seeks to reimagine the content
          platform as a service that facilitates an exchange of content between
          a viewer and a creator, not another way to sell people to
          corporations.
        </p>
        <h1>How does it work</h1>
        <p>
          Everyone pays a subscription fee of $3 every month. We take a small
          portion to pay for operating expenses. The rest is proportionally
          divided between the creators you watch based on how much you watch
          them.
        </p>
        <div class="columns">
          <div class="column">
            <h2>Support the creators you love even more</h2>
            <p>
              $2 out of the $3 monthly fee goes directly to the content creators
              you watch.
            </p>
          </div>
          <div class="column">
            <h2>No ads, no privacy violations</h2>
            <p>
              We have no ads and no reason to collect data. To us, users are
              more than just eyes: they're customers.
            </p>
          </div>
          <div class="column">
            <h2>Be the customer, not the product</h2>
            <p>
              Start being treated as a customer, not a product. Your voice
              matters, and decisions are made with only you and your opinions in
              mind.
            </p>
          </div>
        </div>
      </div>
    </main>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import algoliasearch, { SearchClient } from 'algoliasearch/lite';
import CallToAction from '~/components/CallToAction.vue';
import Search from '~/components/Search.vue';

@Component({
  components: {
    CallToAction,
    Search,
  },
  layout: (context: any): string => {
    return context.$auth.loggedIn ? 'signedIn' : 'signedOut';
  },
})
export default class HomePage extends Vue {
  // This value is used as a loopback to the Algolia search system
  query: string = '';
  // We need this extra variable to track the value of the input tag
  searchVal: string = '';
  searchClient: SearchClient = algoliasearch(
    'VB80DMXNZ8',
    'f2145d2a9dfb20ecfd4355f01eb43065',
  );

  indicesToSuggestions(indices: any) {
    return indices.map(({ hits }: { hits: any }) => ({ data: hits }));
  }

  getSuggestionValue(suggestion: any): string {
    return suggestion.item.type === 'channel'
      ? suggestion.item.name
      : suggestion.item.title;
  }

  onInput(input: any) {
    this.searchVal = input;
  }

  onSelect(selected: any) {
    let search: string = '';
    if (selected) {
      search =
        selected.item.type === 'channel'
          ? selected.item.name
          : selected.item.title;
    } else {
      search = this.searchVal;
    }
    this.$router.push({
      path: '/search',
      query: {
        q: encodeURIComponent(search),
      },
    });
  }
}
</script>

<style lang="sass">
.splash
  height: 100vh;
  .hero
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    h1
      text-align: center;
      font-size: 6em;
      @media only screen and (max-width: 600px)
        font-size: 4em;
      font-weight: bold;
      margin: 10 0;
  .about
    width: 60%
    @media only screen and (max-width: 600px)
      width: 90%
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .columns
      width: 100%;
      justify-content: space-between;
      display: flex;
      flex-wrap: wrap;
      .column
        width: 32%;
        h2
          width: 100%;
          text-align: center;
      @media only screen and (max-width: 600px)
        display: block;
        .column
          margin: 0 auto;
          width: 100%;
  .searchWrapper
    margin: 0 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    #autosuggestID
      width: 100%;
      max-width: 400px;
      input
        border: 1px solid #dddddd;
        border-radius: 4px;
        font-size: 24px;
        padding: 4px;
        @supports (-webkit-appearance: none) or (-moz-appearance: none)
          -webkit-appearance: none;
          -moz-appearance: none;
      .resultsContainer
        position: absolute;
        ul
          list-style-type: none;
          list-style-position: outside;
        .result
          padding: 5px;
          &:hover
            background-color: #dddddd;
          &:before
            padding: 1px 5px;
            float: left;
            font-family: 'Material Icons';
            content: '\e8b6'
</style>
