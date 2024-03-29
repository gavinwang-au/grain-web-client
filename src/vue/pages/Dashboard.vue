<template>
  <div class="dashboard">
    <template v-if="isLoaded">
      <div class="dashboard__toolbar">
        <asset-selector
          class="dashboard__asset-selector"
          :current-asset="currentAsset"
          @asset-change="setCurrentAsset"
          :scale="scale"
        />
        <div class="dashboard__actions">
          <!-- eslint-disable-next-line max-len -->
          <template v-if="getModule().canRenderSubmodule(WithdrawalDrawerPseudoModule)">
            <button
              v-ripple
              v-if="currentAsset"
              class="app__button-raised dashboard__action"
              @click="isWithdrawalDrawerShown = true"
            >
              <i class="mdi mdi-download dashboard__download-icon" />
              {{ 'dashboard.withdraw' | globalize }}
            </button>
          </template>

          <!-- eslint-disable-next-line max-len -->
          <template v-if="getModule().canRenderSubmodule(IssuanceFormModule)">
            <button
              class="app__button-raised dashboard__action"
              @click="createIssuanceFormIsShown = true"
            >
              <i class="mdi mdi-plus dashboard__plus-icon" />
              {{ 'dashboard.create-issuance-btn' | globalize }}
            </button>
          </template>

          <!-- eslint-disable-next-line max-len -->
          <template v-if="getModule().canRenderSubmodule(TransferDrawerPseudoModule)">
            <button
              v-if="currentAsset"
              class="app__button-raised dashboard__action"
              @click="transferFormIsShown = true"
            >
              <i class="mdi mdi-send mdi-rotate-315 dashboard__send-icon" />
              {{
                'dashboard.send-asset-lbl' | globalize({ asset: currentAsset })
              }}
            </button>
          </template>
        </div>
      </div>
      <template v-if="currentAsset">
        <div
          class="dashboard__activity"
          v-if="getModule().canRenderSubmodule(MovementsHistoryModule) &&
            currentAsset
          "
        >
          <submodule-importer
            :submodule="getModule().getSubmodule(MovementsHistoryModule)"
            :asset-code="currentAsset"
            :ref="REFS.movementsHistory"
            :latest-activity="true"
          />
        </div>
      </template>

      <drawer :is-shown.sync="showDrawer">
        <template
          v-if="createIssuanceFormIsShown &&
            getModule().canRenderSubmodule(IssuanceFormModule)"
        >
          <template slot="heading">
            {{ 'dashboard.create-issuance-title' | globalize }}
          </template>

          <submodule-importer
            :submodule="getModule().getSubmodule(IssuanceFormModule)"
            @issuance-created="showDrawer = false"
          />
        </template>

        <template v-if="transferFormIsShown">
          <template slot="heading">
            {{ 'transfer-form.form-heading' | globalize }}
          </template>
          <transfer
            @operation-submitted="updateBalancesAndList()"
            :asset-to-transfer="currentAsset"
            asset-type="grain"
          />
        </template>
      </drawer>
      <drawer :is-shown.sync="isWithdrawalDrawerShown">
        <template slot="heading">
          {{ 'op-pages.withdraw' | globalize }}
        </template>
        <withdrawal-form
          asset-type="grain"
          @operation-submitted="$emit(EVENTS.movementsUpdateRequired)"
        />
      </drawer>
    </template>

    <template v-else>
      <loader message-id="dashboard.data-loading" />
    </template>
  </div>
</template>

<script>
import AssetSelector from '@/vue/pages/dashboard/Dashboard.AssetSelector.vue'
import Transfer from '@/vue/forms/TransferForm'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import SubmoduleImporter from '@/modules-arch/submodule-importer'

import WithdrawalForm from '@/vue/forms/WithdrawalForm'

import { IssuanceFormModule } from '@/vue/modules/issuance-form/module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'

const REFS = {
  movementsHistory: 'movements-history',
}

export default {
  name: 'dashboard',
  components: {
    AssetSelector,
    Transfer,
    Loader,
    Drawer,
    SubmoduleImporter,
    WithdrawalForm,
  },
  data: () => ({
    currentAsset: null,
    isLoaded: false,
    createIssuanceFormIsShown: false,
    transferFormIsShown: false,
    showDrawer: false,
    isWithdrawalDrawerShown: false,
    scale: 'day',
    MovementsHistoryModule,
    WithdrawalDrawerPseudoModule,
    IssuanceFormModule,
    TransferDrawerPseudoModule,
    REFS,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
      vuexTypes.accountBalances,
      vuexTypes.defaultQuoteAsset,
    ]),
  },
  watch: {
    showDrawer (status) {
      if (!status) {
        this.createIssuanceFormIsShown = false
        this.transferFormIsShown = false
      }
    },
    createIssuanceFormIsShown (status) {
      this.showDrawer = status
    },
    transferFormIsShown (status) {
      this.showDrawer = status
    },
    currentAsset (value) {
      this.$router.push({
        query: { asset: value },
      })
      this.loadBalances()
    },
  },
  async created () {
    await this.loadBalances()
    this.setCurrentAsset()
    this.isLoaded = true
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    setCurrentAsset (value) {
      if (value) {
        this.currentAsset = value.code
      } else {
        const keys = this.accountBalances
          .filter(item => item.asset.isGrainCoin)
          .map(i => i.asset.code)
        this.currentAsset =
          keys.find(a => a === this.$route.query.asset) || keys[0] || ''
      }
    },

    // TODO: find a better way to execute child’s reload-list method
    updateList () {
      if (!this.$refs[REFS.movementsHistory]) {
        return
      }
      return this.$refs[REFS.movementsHistory].$children[0]
        .reloadCollectionLoader()
    },

    updateBalancesAndList () {
      return Promise.all([
        this.loadBalances(),
        this.updateList(),
      ])
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.dashboard {
  flex: 1;
}

.dashboard__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: -1rem;

  @include respond-to($small) {
    flex-direction: column-reverse;
  }
}

.dashboard__actions {
  display: flex;
  margin: 1.8rem 1rem 1rem;
}

.dashboard__plus-icon,
.dashboard__download-icon,
.dashboard__send-icon {
  font-size: 1.6rem;
  margin-right: 0.5rem;
}

.dashboard__send-icon {
  margin-top: -0.6rem;
}

.dashboard__asset-selector {
  margin: 1rem;
}

.dashboard__action {
  &:not(:first-child) {
    margin-left: 0.8rem;
  }
}

.dashboard__chart {
  margin-top: -4rem;
}

.dashboard__activity {
  width: 100%;
  margin-top: 2.4rem;
  overflow-x: auto;
}
</style>
