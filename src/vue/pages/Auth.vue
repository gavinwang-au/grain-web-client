<template>
  <div class="auth">
    <div class="auth__titles">
      <h3 class="auth__title-small">
        {{ 'auth-pages.small-title' | globalize }}
      </h3>
      <!-- eslint-disable -->
      <h1
        class="auth__title-big"
        v-html="$options.filters.globalize('auth-pages.big-title', { escapeValue: false })"
      />
      <!-- eslint-enable -->
      <!-- <template v-if="buildVersion">
        <p class="auth__version">
          {{ buildVersion }}
        </p>
      </template> -->
    </div>
    <div class="auth__form">
      <logo class="auth__logo" />

      <div class="auth__idle-message-wrp">
        <idle-message />
      </div>

      <div class="auth__form-wrapper">
        <centered-form>
          <router-view />
        </centered-form>
      </div>

      <!-- <section class="auth__footer-section">
        <app-footer />
      </section> -->
    </div>
  </div>
</template>

<script>
import Logo from '../assets/Logo'
import IdleMessage from '@/vue/common/IdleMessage'
// import AppFooter from '@/vue/navigation/Footer'
import CenteredForm from '@/vue/common/CenteredForm'
import config from '@/config'

export default {
  name: 'auth',
  components: {
    Logo,
    IdleMessage,
    // AppFooter,
    CenteredForm,
  },
  data () {
    return {
      buildVersion: config.BUILD_VERSION,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.auth {
  display: flex;
  flex: 1;
}

.auth__titles,
.auth__form {
  width: 50%;
}

.auth__titles {
  background-color: $_cornflowerBlue;
  background-image: url('../../../static/grain_chain_page.png');
  background-position: center;
  background-repeat: repeat-x;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 11rem;

  @include respond-to(large) {
    padding: 0 7rem;
  }
  @include respond-to(medium) {
    display: none;
  }
}

.auth__title-big {
  color: $col-text-auth-title-big;
  font-size: 5.6rem;
  line-height: 1.2;

  @include respond-to(large) {
    font-size: 4rem;
  }
}

.auth__title-small {
  color: $col-text-auth-title-small;
  font-size: 2.4rem;
  margin-bottom: 5.6rem;

  @include respond-to(large) {
    font-size: 2rem;
  }
}

.auth__form {
  padding: 3rem 4rem;
  position: relative;

  @include respond-to(large) {
    padding: 6rem 7rem;
  }
  @include respond-to(medium) {
    margin: 0 auto;
    max-width: 48rem;
    padding: 6rem 1.6rem;
    width: 100%;
  }
}

.auth__form-wrapper {
  width: 50%;
  margin: auto;

  @include respond-to(large) {
    width: 70%;
  }
  @include respond-to(medium) {
    width: 100%;
  }
}

.auth__logo {
  display: inline-block;
  margin-bottom: 16.5rem;

  @include respond-to-height(950px) {
    margin-bottom: 12rem;
  }
  @include respond-to-height(750px) {
    margin-bottom: 6.4rem;
  }
}

.auth__footer-section {
  padding: 1.6rem;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.auth__version {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  font-size: 1.2rem;
  color: $col-text-auth-version;
}

.auth__idle-message-wrp {
  margin-top: -6rem;
  margin-bottom: 4rem;
}
</style>
