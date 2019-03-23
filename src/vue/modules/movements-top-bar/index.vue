<template>
  <div>
    <top-bar>
      <template v-if="isInitialized && assets.length">
        <div
          slot="main"
          class="movements-top-bar__filters"
        >
          <span class="movements-top-bar__filters-prefix">
            {{ 'op-pages.filters-prefix' | globalize }}
          </span>
          <select-field
            v-model="asset"
            :values="assets"
            key-as-value-text="nameAndCode"
            class="app__select app__select--no-border"
          />
        </div>
      </template>
      <div
        class="movements-top-bar__actions"
        slot="extra"
      >
        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(WithdrawalDrawerPseudoModule)">
          <button
            v-ripple
            class="app__button-raised movements-top-bar__button-raised"
            @click="isWithdrawalDrawerShown = true"
          >
            <i class="mdi mdi-download movements-top-bar__btn-icon" />
            {{ 'op-pages.withdrawal' | globalize }}
          </button>
        </template>

        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(DepositDrawerPseudoModule)">
          <button
            v-ripple
            class="app__button-raised movements-top-bar__button-raised"
            @click="isDepositDrawerShown = true"
          >
            <i class="mdi mdi-upload movements-top-bar__btn-icon" />
            {{ 'op-pages.deposit' | globalize }}
          </button>
        </template>

        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(TransferDrawerPseudoModule)">
          <button
            v-ripple
            class="app__button-raised movements-top-bar__button-raised"
            @click="isTransferDrawerShown = true"
          >
            <!-- eslint-disable-next-line max-len -->
            <i class="mdi mdi-rotate-315 mdi-transfer movements-top-bar__btn-icon" />
            {{ 'op-pages.send' | globalize }}
          </button>
        </template>
      </div>
    </top-bar>

    <drawer :is-shown.sync="isWithdrawalDrawerShown">
      <template slot="heading">
        {{ 'withdrawal-form.withdrawal' | globalize }}
      </template>
      <withdrawal-form />
    </drawer>

    <drawer :is-shown.sync="isDepositDrawerShown">
      <template slot="heading">
        {{ 'deposit-form.deposit' | globalize }}
      </template>
      <deposit-form />
    </drawer>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form />
    </drawer>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import SelectField from '@/vue/fields/SelectField'

import WithdrawalForm from '@/vue/forms/WithdrawalForm'
import DepositForm from '@/vue/forms/DepositForm'
import TransferForm from '@/vue/forms/TransferForm'

import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'
import { DepositDrawerPseudoModule } from '@/modules-arch/pseudo-modules/deposit-drawer-pseudo-module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'

const EVENTS = {
  assetUpdated: 'asset-updated',
}

export default {
  name: 'movements-top-bar',
  components: {
    SelectField,
    TopBar,
    Drawer,
    WithdrawalForm,
    DepositForm,
    TransferForm,
  },
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    isInitialized: false,
    isTransferDrawerShown: false,
    isReedemDrawerShown: false,
    isDepositDrawerShown: false,
    isWithdrawalDrawerShown: false,
    WithdrawalDrawerPseudoModule,
    DepositDrawerPseudoModule,
    TransferDrawerPseudoModule,
    asset: {},
  }),
  computed: {
    ...mapGetters('movements-top-bar', {
      balances: types.balances,
      assets: types.assets,
    }),
  },
  watch: {
    asset: {
      deep: true,
      handler (value) {
        this.$emit(EVENTS.assetUpdated, value)
      },
    },
  },
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
    await this.loadAssets()
    this.setDefaultAsset()
    this.isInitialized = true
  },
  methods: {
    ...mapMutations('movements-top-bar', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('movements-top-bar', {
      loadBalances: types.LOAD_BALANCES,
      loadAssets: types.LOAD_ASSETS,
    }),
    setDefaultAsset () {
      this.asset = this.assets[0]
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.movements-top-bar__actions {
  display: flex;
  justify-content: space-between;

  button {
    margin-right: 1.2rem;
    &:last-child {
      margin-right: 0;
    }
  }
}

.movements-top-bar__button-raised.app__button-raised {
  line-height: 1;
}

.movements-top-bar__btn-icon {
  font-size: 1.8rem;
  margin-right: 0.5rem;

  &.mdi-rotate-315 {
    transform: translateY(-0.2rem);
  }
}

.movements-top-bar__filters {
  display: inline-flex;
  align-items: center;
}

.movements-top-bar__filters-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}
</style>