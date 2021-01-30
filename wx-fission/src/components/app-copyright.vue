<template>
  <div
    class="app-copyright"
    :style="{
      paddingBottom: paddingBottom ? paddingBottom : '5vw'
    }"
  >
    <div class="help">
      <span
        v-if="home.isOpenTradeRemark == 1"
        class="help-item"
        @click="isShowDealNotice = true"
      >
        交易须知
      </span>
      <router-link
        v-if="home.isOpenComplaint == 1"
        to="/complaint-feedback"
        class="help-item"
      >
        投诉反馈
      </router-link>
    </div>
    <div class="enterprise">
      此页面的产品或服务由
      <img :src="home.distributionMerchantSettingVo.brandLogo" alt="logo">
      <span class="name">
        {{home.distributionMerchantSettingVo.brandName}}
      </span>
      提供
    </div>
    <div class="supplier" v-if="home.copyrightType == 2">
      <img src="~@/assets/img/logo.png" alt="logo">
      金千枝平台 | 仅提供技术支持
      <i class="iconfont icon-gengduo1"></i>
    </div>
  </div>
  <app-dialog
    v-model="isShowDealNotice"
    title="交易须知"
  >
    <div class="deal-notice">
      <div v-html="home.distributionMerchantSettingVo.tradeNotice" class="content">
      </div>
    </div>
  </app-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import AppDialog from '@/components/app-dialog.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    AppDialog,
  },
  props: {
    paddingBottom: String
  },
  setup() {
    const store = useStore();
    const isShowDealNotice = ref(false);
    const router = useRouter();
    return {
      isShowDealNotice,
      home: computed(() => store.state.home),
    }
  }
})
</script>

<style lang="scss" scoped>
.app-copyright {
  padding: 7vw 0 5vw 0;

  > .help {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5vw;
    font-size: 3.2vw;
    color: #FC7125;

    > .help-item {
      padding: 0 2.5vw;
      border-right: 1px solid #FC7125;

      &:last-child {
        border-right: none;
      }
    }
  }

  > .enterprise {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.2vw;
    color: #9D9595;

    &:not(:last-child) {
      margin-bottom: 3vw;
    }

    > img {
      object-fit: cover;
      object-position: center center;
      margin-right: 2vw;
      margin-left: 2vw;
      width: 4.8vw;
      height: 4.8vw;
      background: #125FFA;
      border-radius: 3.2vw;
    }

    > .name {
      margin-right: 2vw;
      color: #1D0800;
    }
  }

  > .supplier {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.2vw;
    color: #125FFA;

    > img {
      object-fit: cover;
      object-position: center center;
      margin-right: 2vw;
      width: 4.8vw;
      height: 4.8vw;
      background: #125FFA;
      border-radius: 3.2vw;
    }

    > .iconfont {
      margin-left: 2vw;
      font-size: 2.5vw;
    }
  }
}

.deal-notice {
  padding: 5vw;

  > .content {
    overflow-x: hidden;
    overflow-y: auto;
    white-space: normal !important;
    word-break: break-all !important;
    height: 40vh;
    line-height: 1.5;
    font-size: 3.2vw;
    color: #1D0800;

    pre {
      white-space: normal !important;
      word-break: break-all !important;
    }
  }
}
</style>
