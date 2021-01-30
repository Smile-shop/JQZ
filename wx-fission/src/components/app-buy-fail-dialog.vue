<template>
  <app-dialog v-bind="$attrs">
    <div class="buy-fail-dialog">
      <div class="header">
        <img src="~@/assets/img/pay-fail.png" alt="图片">
      </div>
      <div class="content">
        <div class="title">
          支付失败
        </div>
        <div class="message">
          支付遇到问题，请尝试继续支付，如有疑问请联系客服
        </div>
        <div class="control">
          <button @click="addService" class="cancel">
            添加客服微信
          </button>
          <button class="affirm">
            继续支付
          </button>
        </div>
      </div>
    </div>
  </app-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppDialog from '@/components/app-dialog.vue';
import { useStore } from 'vuex';

export default defineComponent({
  components: {
    AppDialog
  },
  inheritAttrs: false,
  props: {
  },
  setup(props, { emit }) {
    const store = useStore();

    function addService() {
      store.commit('setIsShowService', true);
    }

    return {
      addService
    }
  }
})
</script>

<style lang="scss" scoped>
.buy-fail-dialog {
  > .header {
    > img {
      width: 100%;
      height: 52vw;
    }
  }

  > .content {
    padding: 7vw 3vw;

    > .title {
      margin-bottom: 4vw;
      text-align: center;
      font-size: 4.3vw;
      color: #1D0800;
    }

    > .message {
      text-align-last: left;
      line-height: 1.5;
      margin-bottom: 4vw;
      text-align: center;
      font-size: 3.7vw;
      color: #9D9595;
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
          border: 1px solid #FC7125;
          background-color: #FFF;
          color: #FC7125;
        }

        &.affirm {
          border: 1px solid #FC7125;
          background-color: #FC7125;
          color: #FFF;
        }
      }
    }
  }
}
</style>
