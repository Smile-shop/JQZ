<template>
  <div
    :style="{
      color: color
    }"
    class="app-loading"
  >
    <i class="iconfont icon-Loading">
    </i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    color: {
      type: String,
      default: '#FFF'
    }
  },
  setup(props, { emit }) {
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
.app-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  font-size: 10vw;

  > .iconfont {
    transform-origin: center center;
    animation-name: rotate-animation;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes rotate-animation {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
