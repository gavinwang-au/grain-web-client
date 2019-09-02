<template>
  <div class="centered-form">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'centered-form',
}
</script>

<style lang="sass">
.centered-form {
  text-align: center;
}

.centered-form input,
.centered-form textarea {
  text-align: center;
}

.centered-form input ~ span,
.centered-form textarea ~ span {
  width: 100%;
}

.centered-form button {
  margin: auto;
}
</style>
