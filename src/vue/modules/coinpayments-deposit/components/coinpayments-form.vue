<template>
  <div class="coinpayments-form">
    <template v-if="!isFailed">
      <template v-if="!depositDetails">
        <form
          @submit.prevent="isFormValid() && showConfirmation()"
          novalidate
        >
          <div class="app__form-row">
            <amount-input-field
              v-model="form.amount"
              class="app__form-field"
              name="coinpayments-amount"
              validation-type="incoming"
              :label="'coinpayments-deposit.amount-lbl' | globalize"
              :asset="asset"
              :disabled="formMixin.isDisabled"
            />
          </div>
          <div class="app__form-actions">
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              type="submit"
              class="app__button-raised"
              :disabled="formMixin.isDisabled"
            >
              {{ 'coinpayments-deposit.request-address-lbl' | globalize }}
            </button>
            <form-confirmation
              v-if="formMixin.isConfirmationShown"
              @ok="hideConfirmation() || submit()"
              @cancel="hideConfirmation()"
            />
          </div>
        </form>
      </template>
      <address-viewer
        v-else
        :asset-code="asset.code"
        :amount="depositDetails.amount"
        :address="depositDetails.address"
        :end-time="depositDetails.endTime"
      />
    </template>
    <template v-else>
      <p>
        {{ 'coinpayments-deposit.no-address-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import AddressViewer from './address-viewer'

import config from '@/config'

import moment from 'moment'

import FormMixin from '@/vue/mixins/form.mixin'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  submitted: 'submitted',
}

const TRANSACTION_TIME_MARGIN = 600 // seconds

export default {
  name: 'coinpayments-form',
  components: {
    AddressViewer,
  },
  mixins: [FormMixin],
  props: {
    asset: { type: Object, required: true },
    balanceId: { type: String, required: true },
  },
  data () {
    return {
      MIN_AMOUNT: config.MIN_AMOUNT,
      MAX_AMOUNT: config.MAX_AMOUNT,
      form: {
        amount: '',
      },
      isFailed: false,
      depositDetails: null,
    }
  },
  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        this.depositDetails = await this.loadDeposit(
          {
            amount: this.form.amount,
            receiver: this.balanceId,
          }
        )
        this.depositDetails.endTime = moment().unix() +
          this.depositDetails.timeout - TRANSACTION_TIME_MARGIN
        this.$emit(EVENTS.submitted)
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isFailed = true
      }
      this.enableForm()
    },
    async loadDeposit (params) {
      const endpoint = '/integrations/coinpayments/deposit'
      const response = await api.postWithSignature(endpoint, {
        data: {
          type: 'coinpayments_deposit',
          attributes: params,
        },
      })
      return response.data
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/vue/forms/_app-form';
</style>
