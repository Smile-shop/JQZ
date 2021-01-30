<template>
  <teleport to="#app">
    <div
      v-if="modelValue"
      class="app-mask"
      @click.self="onClick"
      :style="{
        background: `rgba(0, 0, 0, ${alpha})`
      }"
    >
      <slot/>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';

export default defineComponent({
  emits: ['click'],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    alpha: {
      type: Number,
      default: 0.5,
    }
  },
  setup(props, { emit }) {
    watch(() => props.modelValue, (value) => {
      if (value) {
        document.documentElement.style.height = '100vh';
        document.documentElement.style.overflowY = 'hidden';
      } else {
        document.documentElement.style.height = 'unset';
        document.documentElement.style.overflowY = 'auto';
      }
    })

    function onClick() {
      emit('click');
    }

    return {
      onClick,
    }
  }
})
</script>

<style lang="scss" scoped>
.app-mask {
  z-index: var(--zindex-popup-backdrop);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .9);
}
</style>
