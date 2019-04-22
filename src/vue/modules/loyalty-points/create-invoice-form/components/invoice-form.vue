<template>
  <form
    novalidate
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.subject"
          @blur="touchField('form.subject')"
          name="create-invoice-subject"
          :label="'create-invoice-form.subject-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.subject')"
          :disabled="subject || formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          type="number"
          v-model="form.amount"
          @blur="touchField('form.amount')"
          name="create-invoice-amount"
          :label="'create-invoice-form.amount-lbl' | globalize({
            asset: form.asset
          })"
          :step="MIN_AMOUNT"
          :error-message="getFieldErrorMessage(
            'form.amount',
            {
              minValue: MIN_AMOUNT,
              maxDecimalDigitsCount: DECIMAL_POINTS
            }
          )"
          :disabled="amount || formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          type="number"
          v-model="form.accountNumber"
          @blur="touchField('form.accountNumber')"
          name="create-invoice-account-number"
          :label="'create-invoice-form.account-number-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.accountNumber')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          :values="quoteAssets"
          name="create-invoice-quote-asset"
          :disabled="formMixin.isDisabled"
          v-model="form.quoteAsset"
          key-as-value-text="nameAndCode"
          :label="'create-invoice-form.quote-asset-lbl' | globalize"
        />

        <vue-markdown
          v-if="form.asset !== form.quoteAsset.code"
          class="app__form-field-description invoice-form__price-per-point"
          :source="'create-invoice-form.price-hint' | globalize({
            baseAsset: form.asset,
            amount: {
              value: selectedAssetPair.price,
              currency: form.quoteAsset.code
            }
          })"
        />
      </div>
    </div>

    <vue-markdown
      class="invoice-form__total-price"
      :source="'create-invoice-form.total-price' | globalize({
        amount: {
          value: totalPrice,
          currency: form.quoteAsset.code
        }
      })"
    />

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        :is-pending="isFormSubmitting"
        @ok="submit"
        @cancel="hideConfirmation"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{ 'create-invoice-form.create-invoice' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import VueMarkdown from 'vue-markdown'

import FormMixin from '@/vue/mixins/form.mixin'
import { required, minValue, maxDecimalDigitsCount } from '@validators'

import { initApi, api } from '../_api'
import { config } from '../_config'
import { Wallet, base } from '@tokend/js-sdk'

import { mapGetters } from 'vuex'
import { types } from '../store/types'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { MathUtil } from '@/js/utils/math.util'

import { Invoice } from '../wrappers/invoice'

const EVENTS = {
  submit: 'submit',
}

const EMPTY_FEE = {
  sourceFee: {
    percent: '0.000000',
    fixed: '0.000000',
  },
  destinationFee: {
    percent: '0.000000',
    fixed: '0.000000',
  },
  sourcePaysForDest: true,
}

export default {
  name: 'invoice-form',
  components: { VueMarkdown },
  mixins: [FormMixin],

  props: {
    amount: { type: String, default: '' },
    subject: { type: String, default: '' },
    merchantEmail: { type: String, required: true },
    merchantSystem: { type: String, required: true },
  },

  data: _ => ({
    form: {
      amount: '',
      subject: '',
      accountNumber: '',
      quoteAsset: {},
      asset: '',
    },
    isFormSubmitting: false,

    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DECIMAL_POINTS: config.DECIMAL_POINTS,
  }),

  validations () {
    return {
      form: {
        amount: {
          required,
          minValue: minValue(config.MIN_AMOUNT),
          maxDecimalDigitsCount:
            maxDecimalDigitsCount(config.DECIMAL_POINTS),
        },
        subject: { required },
        accountNumber: { required },
      },
    }
  },

  computed: {
    ...mapGetters('create-invoice-form', {
      assetPairs: types.assetPairs,
    }),

    quoteAssets () {
      return this.assetPairs.map(p => p.quoteAsset)
    },

    selectedAssetPair () {
      return this.assetPairs
        .find(p => p.quoteAsset === this.form.quoteAsset)
    },

    totalPrice () {
      return MathUtil.multiply(
        this.selectedAssetPair.price,
        this.form.amount
      )
    },

    systemIdentifier () {
      return this.form.asset === this.form.quoteAsset.code
        ? this.merchantSystem
        : this.form.quoteAsset.system
    },

    loyaltyAccount () {
      return config.LOYALTY_ACCOUNTS.find(item => {
        return item.number === this.form.accountNumber &&
          item.system === this.systemIdentifier
      })
    },

    transactionSubject () {
      const firstLine = `${config.MERCHANT_ACCOUNT_ID}@${btoa(this.merchantSystem)}`
      const secondLine = JSON.stringify({
        merchant: config.MERCHANT_NAME,
        subject: this.form.subject,
      })

      return `${firstLine}\n${secondLine}`
    },

    reference () {
      return btoa(Math.random())
    },

    invoiceRecord () {
      return new Invoice({
        record: {
          ...this.form,
          totalPrice: this.totalPrice,
          reference: this.reference,
          system: this.systemIdentifier,
        },
        isConfirmed: false,
      })
    },
  },

  created () {
    this.populateForm()

    if (this.assetPairs.length) {
      this.form.quoteAsset = this.assetPairs[0].quoteAsset
    }
  },

  methods: {
    populateForm () {
      this.form.asset = config.DEFAULT_POINT
      this.form.amount = this.amount
      this.form.subject = this.subject
    },

    async submit () {
      if (!this.loyaltyAccount) {
        Bus.error('create-invoice-form.invalid-account-number-err')
        this.hideConfirmation()
        return
      }

      this.isFormSubmitting = true
      try {
        await this.initExternalSystemApi()
        await this.sendTransaction()
        this.$emit(EVENTS.submit, this.invoiceRecord)
      } catch (error) {
        this.isFormSubmitting = false
        this.hideConfirmation()
        ErrorHandler.process(error)
      }
    },

    async initExternalSystemApi () {
      const newWallet = new Wallet(
        this.merchantEmail,
        this.loyaltyAccount.secretSeed,
        this.loyaltyAccount.accountId
      )
      const newConfig = {
        horizonURL: this.systemIdentifier,
      }

      await initApi(newWallet, newConfig)
    },

    async sendTransaction () {
      const balanceId = await this.getQuoteAssetBalanceId()
      const recipient = await this.getPaymentRecipient()

      const operation = base.PaymentBuilder.payment({
        sourceBalanceId: balanceId,
        destination: recipient,
        amount: this.totalPrice,
        feeData: EMPTY_FEE,
        subject: this.transactionSubject,
        asset: this.form.quoteAsset.code,
        reference: this.reference,
      })

      await api().postOperations(operation)
    },

    async getQuoteAssetBalanceId () {
      const endpoint = `/v3/accounts/${this.loyaltyAccount.accountId}`
      const { data: account } = await api().get(endpoint, {
        include: ['balances'],
      })

      const balance = account.balances
        .find(b => b.asset.id === this.form.quoteAsset.code)

      return balance ? balance.id : ''
    },

    async getPaymentRecipient () {
      if (this.systemIdentifier === this.merchantSystem) {
        return config.MERCHANT_ACCOUNT_ID
      } else {
        return api().networkDetails.adminAccountId
      }
    },
  },
}
</script>

<style lang='scss'>
@import "@/vue/forms/_app-form";

.invoice-form__price-per-point, .invoice-form__total-price {
  strong {
    color: $col-text-highlighted;
  }
}

.invoice-form__total-price {
  margin-top: 2.4rem;

  p {
    font-size: 1.6rem;
  }
}
</style>