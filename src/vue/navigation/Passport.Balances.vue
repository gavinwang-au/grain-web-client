<template>
  <div
    class="passport-balances
           passport-balances--direction-column"
  >
    <span class="passport-balances__label">
      {{ 'passport.balances-subheading' | globalize }}
    </span>

    <span
      v-for="(item, index) in filteredBalances"
      :key="index"
    >
      {{ { value: item.balance, currency: item.asset.code } | formatMoney }}
    </span>
    <router-link
      class="passport-balances__more-link"
      :to="vueRoutes.balances"
      @click.native="showMoreBalances"
    >
      {{ 'passport.show-more-link' | globalize }}
    </router-link>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { vueRoutes } from '@/vue-router/routes'

const MAX_BALANCES_COUNT = 3
const EVENTS = {
  moreLinkFollowed: 'more-link-followed',
}

export default {
  name: 'passport-balances',

  data: () => ({
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
    }),

    filteredBalances () {
      return this.accountBalances
        .filter(item => item.asset.isBaseAsset)
        .slice(0, MAX_BALANCES_COUNT)
    },
  },

  async created () {
    await this.loadBalances()
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    showMoreBalances () {
      this.$emit(EVENTS.moreLinkFollowed)
    },
  },
}
</script>

<style scoped lang="scss">
@import '~@scss/variables';

.passport-balances--direction-column {
  display: flex;
  flex-direction: column;
}

.passport-balances__label {
  font-weight: 700;
  font-size: 1.2rem;
}

.passport-balances__more-link {
  font-size: 1.2rem;
  cursor: pointer;
  color: $col-link;
}
</style>
