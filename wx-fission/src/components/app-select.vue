<template>
  <app-mask
    :modelValue="isShow"
    @click="onClose"
  >
    <ul class="app-select">
      <li
        class="option"
        v-for="(item, index) of list"
        :key="index"
        @click="onChange(item)"
      >
        <div class="left">
          <div class="title">
            {{item}}
          </div>
        </div>
        <div class="right">
          <div :class="{
            radio: true,
            active: checkedValue == item
          }">
            <i class="iconfont icon-checked"></i>
          </div>
        </div>
      </li>
    </ul>
  </app-mask>
</template>

<script lang="ts">
import { defineComponent, createVNode } from 'vue'
import AppMask from './app-mask.vue';

export default defineComponent({
  emits: ['update:isShow','update:modelValue','change'],
  components: {
    AppMask,
  },
  props: {
    checkedValue: {
      type: [String, Number],
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    modelValue: {
      type: [String, Number],
    }
  },
  setup(props, { emit }) {
    function onClose() {
      emit('update:isShow', false);
    }

    function onChange(item: any) {
      emit('update:isShow', false);
      emit('change', item);
    }

    return {
      onClose,
      onChange
    }
  }
})
</script>

<style lang="scss" scoped>
.app-select {
  border-radius: 5vw 5vw 0 0;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #FFF;
  height: 70vh;
  overflow-y: auto;

  > .option {
    display: flex;
    align-items: center;
    padding: 4vw;
    border-bottom: 1px solid #EEEEEE;

    > .left  {
      flex-grow: 1;
      margin-right: 5vw;

      > .title {
        font-size: 3.7vw;
        font-weight: bold;
        color: #000;
      }
    }

    > .right {
      white-space: nowrap;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 2.7vw;
      color: #999999;

      > .radio {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 1px solid #CCCCCC;
        height: 4.7vw;
        width: 4.7vw;

        > .iconfont {
          color: #FFF;
          font-size: 3vw;
          display: none;
        }

        &.active {
          border: none;
          background: #FF0000;

          > .iconfont {
            display: unset;
          }
        }
      }
    }
  }
}
</style>
