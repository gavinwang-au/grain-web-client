<template>
  <div class="verification-fund-form__section">
    <p class="verification-fund-form__section-label">
      {{ 'fund-form.photo-verification-lbl' | globalize }}
    </p>

    <div class="app__form-row">
      <div class="app__form-field">
        <p class="verification-fund-form__photo-explanation">
          {{ 'fund-form.photo-explanation-msg' | globalize }}
        </p>
        <button
          v-ripple
          class="verification-fund-form__verification-code-btn"
          :disabled="isDisabled"
          @click.prevent="isCodeShown = true"
        >
          {{
            isCodeShown
              ? verificationCode
              : 'fund-form.verification-code-btn' | globalize
          }}
        </button>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="selfie"
          name="verification-fund-verification-photo"
          :note="'fund-form.image-type-note' | globalize"
          :file-extensions="['jpg', 'png']"
          :document-type="DOCUMENT_TYPES.kycSelfie"
          :label="'fund-form.photo-lbl' | globalize"
          :disabled="isDisabled"
          :error-message="getFieldErrorMessage('selfie')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SectionMixin from './section.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { mapMutations } from 'vuex'
import { types } from '../store/types'

import { documentContainer } from '@/validators'

export default {
  name: 'section-selfie',
  mixins: [FormMixin, SectionMixin],
  props: {
    verificationCode: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    isCodeShown: false,
    DOCUMENT_TYPES,
  }),
  validations: {
    selfie: { documentContainer },
  },
  computed: {
    selfie: {
      get () { return this.callGetter(types.selfie) },
      set (v) { this.setSelfie(v) },
    },
  },
  methods: {
    ...mapMutations('verification-fund-form', {
      setSelfie: types.SET_SELFIE,
    }),
  },
}
</script>

<style lang="scss" scoped>
  @import '../scss/styles';
</style>
