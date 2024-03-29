<template>
  <div class="sales-list">
    <div class="sales__state-filter">
      <select-field
        :is-value-translatable="true"
        :disabled="!isLoaded"
        v-model="filters.state"
        :values="Object.values(SALE_STATES)"
        key-as-value-text="labelTranslationId"
        class="sales-asset-selector__field app__select app__select--no-border"
      />
    </div>
    <template v-if="filteredSales.length">
      <div class="sales__sale-cards">
        <drawer :is-shown.sync="isDetailsDrawerShown">
          <template slot="heading">
            {{ 'sales.overview-title' | globalize }}
          </template>
          <sale-overview :sale="selectedSale" />
        </drawer>

        <template v-for="sale in filteredSales">
          <sale-card
            class="sales__sale-card"
            :key="sale.id"
            :sale="sale"
          />
        </template>
      </div>
    </template>

    <template v-else-if="isLoaded">
      <no-data-message
        icon-name="inbox"
        :title="'sales.no-sales-title' | globalize"
        :message="'sales.no-sales-desc' | globalize"
      />
    </template>

    <template v-else>
      <loader :message-id="'sales.loading-msg'" />
    </template>

    <!--
    v-show is a hack to hide `More` button if there are no sales,
    matching the filtering criteria (when no data message is shown).
  -->
    <collection-loader
      v-show="filteredSales.length"
      class="sales__loader"
      :first-page-loader="recordsLoader"
      @first-page-load="setRecords"
      @next-page-load="extendRecords"
    />
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import Loader from '@/vue/common/Loader'
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import SelectField from '@/vue/fields/SelectField'

import SaleOverview from '@/vue/pages/sales/SaleOverview'
import SaleCard from '@/vue/pages/sales/SaleCard'

import { api } from '@/api'
import { vueRoutes } from '@/vue-router/routes'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { SaleRecord } from '@/js/records/entities/sale.record'

const SALE_STATES = {
  live: {
    labelTranslationId: 'sales.sale-live-state',
    value: 'live',
    state: 1,
  },
  upcoming: {
    labelTranslationId: 'sales.sale-upcoming-state',
    value: 'upcoming',
  },
  all: {
    labelTranslationId: 'sales.sale-all-state',
    value: 'all',
  },
}

export default {
  name: 'sales-list',
  components: {
    Drawer,
    Loader,
    CollectionLoader,
    NoDataMessage,
    SaleOverview,
    SaleCard,
    SelectField,
  },
  props: {
    isUserSales: {
      type: Boolean,
      default: false,
    },
  },

  data: _ => ({
    saleRecords: [],
    filters: {
      baseAsset: '',
      state: SALE_STATES.live,
    },
    isLoaded: false,
    isDetailsDrawerShown: false,
    selectedSale: null,
    SALE_STATES,
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),

    // A workaround for filtering sales by base asset, since sales.getPage
    // method loads all the existing sales.
    filteredSales () {
      if (this.filters.baseAsset === '') {
        return this.saleRecords
      } else {
        return this.saleRecords
          .filter(sale => {
            return sale.baseAsset.toLowerCase()
              .includes(this.filters.baseAsset.toLowerCase())
          })
      }
    },

    recordsLoader () {
      const saleState = this.filters.state.value

      let opts = {
        page: { order: 'desc' },
        filter: {},
        include: ['base_asset', 'quote_assets', 'default_quote_asset'],
      }
      let endpoint

      if (this.isUserSales) {
        opts.filter.owner = this.accountId
        endpoint = `/v3/sales`
      } else {
        endpoint = `/v3/accounts/${this.accountId}/sales`
      }

      switch (saleState) {
        case SALE_STATES.live.value:
          opts.filter.state = SALE_STATES.live.state
          break
        case SALE_STATES.upcoming.value:
          opts.filter.min_start_time = new Date().toISOString()
          break
      }

      return function () {
        return api.getWithSignature(endpoint, opts)
      }
    },
  },

  watch: {
    'recordsLoader': function () {
      this.saleRecords = []
      this.isLoaded = false
    },
    isUserSales () {
      this.recordsLoader()
    },
  },

  methods: {
    setRecords (data) {
      this.saleRecords = data.map(sale => new SaleRecord(sale))
      this.isLoaded = true
    },

    extendRecords (data) {
      this.saleRecords = this.saleRecords
        .concat(data.map(sale => new SaleRecord(sale)))
    },
  },
}
</script>

<style lang="scss">
.sales-asset-selector__field {
  width: auto;
}
</style>
