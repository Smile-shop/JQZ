<template>
  <app-mask
    :modelValue="isShow"
    @click="onClose"
  >
    <ul class="app-select-store">
      <li
        class="option"
        v-for="(item, index) of list"
        :key="index"
        @click="onChange(item)"
      >
        <div class="left">
          <div class="title">
            {{item.nameOut || item.shopName}}
          </div>
          <div class="attribute">
            <i class="iconfont icon-dizhi"></i>
            {{item.address}}
          </div>
          <div class="attribute">
            <i class="iconfont icon-dianhua"></i>
            {{item.phone}}
          </div>
        </div>
        <div class="right">
          <span
            v-if="isShowDistance"
            class="distance"
          >
            {{item.distant}}
          </span>
          <div :class="{
            radio: true,
            active: checkedValue == item.shopName || checkedValue == item.nameOut
          }">
            <i class="iconfont icon-checked"></i>
          </div>
        </div>
      </li>
    </ul>
  </app-mask>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppMask from './app-mask.vue';

export default defineComponent({
  emits: ['update:isShow', 'update:modelValue', 'change'],
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
    isShowDistance: {
      type: Boolean,
      default: true,
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
      onChange,
    }
  }
})
</script>

<style lang="scss" scoped>
.app-select-store {
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
    padding: 4vw;
    border-bottom: 1px solid #EEEEEE;

    > .left  {
      flex-grow: 1;
      margin-right: 5vw;

      > .title {
        margin-bottom: 3vw;
        font-size: 3.7vw;
        font-weight: bold;
        color: #000;
      }

      > .attribute:not(:last-of-type) {
        margin-bottom: 2.5vw;
      }

      > .attribute {
        display: flex;
        align-items: center;
        font-size: 3.2vw;
        color: #999999;
        line-height: 1.5;

        > .iconfont{
          margin-right: 2.4vw;
          font-size: 3.5vw;
          color: #C2C2C2;
        }
      }
    }

    > .right {
      flex-shrink: 0;
      white-space: nowrap;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 2.7vw;
      color: #999999;

      > .distance {
        margin-bottom: 4vw;
      }

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
