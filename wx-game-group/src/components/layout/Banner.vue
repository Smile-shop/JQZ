<template>
  <div class="banner">
    <a
      v-if="logo"
      id="logo"
      href="javascript:void(0)"
      :style="`background: url('${logo}') no-repeat center/100%;`"
    />
    <a v-else id="logo" href="javascript:void(0)" />
    <section
      v-show="background"
      class="bg"
      :style="`background: url('${background}') no-repeat center/100%;`"
    />
    <section v-show="!background" class="bg default" />
  </div>
</template>

<script>
export default {
  props: {
    background: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/rem.scss';
.banner {
  position: relative;
  width: 100vw;
  height: 40vw;
  display: block;
}
.bg {
  height: 100%;
}
.banner #logo {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 21.3vw;
  height: 13.5vw;
  display: block;
  z-index: 99;
  background: url('./images/logo.png') no-repeat center/100%;
}
</style>
