<template>
  <app-mask
    :modelValue="modelValue"
  >
    <div class="app-dialog">
      <div class="container">
        <div v-if="title" class="title">
          {{title}}
        </div>
        <slot/>
      </div>
      <div @click="hide" class="close">
        <i class="iconfont icon-guanbi1"></i>
      </div>
    </div>
  </app-mask>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppMask from '@/components/app-mask.vue';

export default defineComponent({
  emits: ['update:modelValue'],
  components: {
    AppMask
  },
  props: {
    title: {
      type: String,
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    function hide() {
      emit('update:modelValue', false);
    }

    return {
      hide
    }
  }
})
</script>

<style lang="scss" scoped>
.app-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > .container {
    width: 80vw;
    margin-bottom: 5.5vw;
    background: #FFFFFF;
    border-radius: 2.1vw;
    overflow: hidden;

    > .title {
      padding: 6vw 0 0 0;
      text-align: center;
      font-size: 4.3vw;
      font-weight: bold;
      color: #1D0800;
    }
  }
  > .close {
    color: #FFF;
    font-size: 8vw;
  }
}
</style>
