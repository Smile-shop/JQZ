<template>
  <teleport to="#app">
    <router-link to="/home" class="app-home-button">
      <i class="iconfont icon-shouye"></i>
    </router-link>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {

    }
  }
})
</script>

<style lang="scss" scoped>
.app-home-button {
  z-index: var(--zindex-popup-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 4vw;
  top: 35vh;
  border-radius: 50%;
  width: 11.7vw;
  height: 11.7vw;
  background: #FFFFFF;
  box-shadow: 0vw 0.5vw 1.6vw 0vw rgba(252,86,24,0.37);
  color: #FC7125;
  font-size: 6vw;
}
</style>
