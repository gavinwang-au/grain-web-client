<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{ 'auth-pages.sign-in' | globalize }}
    </h2>

    <div class="auth-page__content">
      <login-form />

      <div class="auth-page__tips">
        <div class="auth-page__tip">
          {{ 'auth-pages.no-account-question' | globalize }}
          <router-link class="auth-page__tip-link" :to="vueRoutes.signup">
            {{ 'auth-pages.no-account-answer' | globalize }}
          </router-link>
        </div>
        <div class="auth-page__tip">
          {{ 'auth-pages.forgot-pwd-question' | globalize }}
          <router-link class="auth-page__tip-link" :to="vueRoutes.recovery">
            {{ 'auth-pages.forgot-pwd-answer' | globalize }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/vue/forms/LoginForm'

import { vueRoutes } from '@/vue-router/routes'
import { Bus } from '@/js/helpers/event-bus'

import { walletsManager } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'login',
  components: {
    LoginForm,
  },
  data: _ => ({
    vueRoutes,
  }),
  async created () {
    try {
      // Verifying email if user came here from email link
      const verificationCode = this.$route.params.encodedVerificationCode
      if (verificationCode) {
        await walletsManager.verifyEmail(verificationCode)
        Bus.success('auth-pages.email-verified')
      }
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },
}
</script>

<style lang="scss" scoped>
@import './auth-page';
</style>
