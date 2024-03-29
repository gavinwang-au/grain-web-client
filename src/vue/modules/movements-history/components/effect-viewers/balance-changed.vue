<template>
  <tbody>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell" v-if="!isGrainCoin">
        {{ 'movements-history.amount-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell" v-if="isGrainCoin">
        {{ 'movements-history.credit-weight-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ amount | formatMoney }}
      </td>
    </tr>

    <template v-if="totalFee.value > 0">
      <tr class="attributes-viewer__table-row">
        <td class="attributes-viewer__table-cell">
          {{ 'movements-history.fixed-fee-lbl' | globalize }}
        </td>
        <td class="attributes-viewer__table-cell">
          {{ fixedFee | formatMoney }}
        </td>
      </tr>
      <tr class="attributes-viewer__table-row">
        <td class="attributes-viewer__table-cell">
          {{ 'movements-history.calculated-percent-fee-lbl' | globalize }}
        </td>
        <td class="attributes-viewer__table-cell">
          {{ calculatedPercentFee | formatMoney }}
        </td>
      </tr>
      <tr class="attributes-viewer__table-row">
        <td class="attributes-viewer__table-cell">
          {{ 'movements-history.total-fee-lbl' | globalize }}
        </td>
        <td class="attributes-viewer__table-cell">
          {{ totalFee | formatMoney }}
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script>
import { BalanceChangedEffect } from '../../wrappers/effect'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { MathUtil } from '@/js/utils'

export default {
  name: 'balance-changed',
  props: {
    effect: {
      type: BalanceChangedEffect,
      required: true,
    },
    assetCode: {
      type: String,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      assetByCode: vuexTypes.assetByCode,
    }),
    amount () {
      const currency = this.assetCode
      let value = this.effect.amount

      if (this.isLocked) {
        value = -value
      }

      return { currency, value }
    },
    fixedFee () {
      return {
        currency: this.assetCode,
        value: this.effect.fixedFee,
      }
    },
    calculatedPercentFee () {
      return {
        currency: this.assetCode,
        value: this.effect.calculatedPercentFee,
      }
    },
    totalFee () {
      return {
        currency: this.assetCode,
        value: MathUtil.add(
          this.effect.fixedFee,
          this.effect.calculatedPercentFee
        ),
      }
    },
    isGrainCoin () {
      return this.assetByCode(this.assetCode).isGrainCoin
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/attributes-viewer';
</style>
