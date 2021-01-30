<template>
  <app-mask :modelValue="modelValue">
    <div class="app-message-box">
      <div class="container">
        <div v-if="title" class="title">{{title}}</div>
        <div v-if="message" class="message" v-html="message" />
        <div class="control">
          <button @click="cancel" class="cancel">取消</button>
          <button @click="affirm" class="affirm">确定</button>
        </div>
      </div>
    </div>
  </app-mask>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import appMask from './app-mask.vue';

export default defineComponent({
  components: { appMask },
  emits: ['affirm', 'cancel', 'update:modelValue'],
  props: {
    // 头部提示
    title: {
      type: String,
      default: '提示',
    },
    // 消息
    message: {
      type: String,
      default: '确定吗？',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    asyncClose: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    // 取消事件
    function cancel() {
      emit('cancel');
      emit('update:modelValue', false);
    }

    // 确认事件
    function affirm() {
      emit('affirm');
      if (!props.asyncClose) {
        emit('update:modelValue', false);
      }
    }

    return {
      cancel,
      affirm,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-message-box {
  > .container {
    padding: 7vw 3vw;
    width: 80vw;
    margin-bottom: 5.5vw;
    background: #ffffff;
    border-radius: 2.1vw;

    > .title {
      margin-bottom: 3vw;
      text-align: center;
      font-size: 4.3vw;
      color: #1d0800;
    }

    > .message {
      text-align: center;
      font-size: 3.7vw;
      color: #9d9595;
    }

    > .control {
      display: flex;
      justify-content: space-between;
      margin-top: 7vw;

      > button {
        width: 35vw;
        border-radius: 4.8vw;
        padding: 2vw;
        font-size: 3.7vw;

        &.cancel {
          border: 1px solid #fc7125;
          background-color: #fff;
          color: #fc7125;
        }

        &.affirm {
          border: 1px solid #fc7125;
          background-color: #fc7125;
          color: #fff;
        }
      }
    }
  }
}
</style>
