<template>
  <div
    id="iframe"
  >
    <iframe
      :src="src"
      frameborder="0"
    >

    </iframe>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {State} from 'vuex-class';
import {getLocalStorage} from '@/utils/local-storage';
import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';

@Component({
})
export default class Iframe extends Vue {
  type: string = 'service';
  goodsId: string = '';
  @State('wxUserInfo')
  wxUserInfo: any;

  get src() {
    const type = this.type;
    const baseUrl = VUE_APP_BASE_URL;
    const localStorageData = getLocalStorage();
    const {wxUserInfo} = localStorageData;

    switch (type) {
      case 'service':
        if (wxUserInfo) {
          return `${baseUrl}/wx-interface-web/wx/auth?companyKey=${wxUserInfo.companyKey}&page=wx_chat_system${this.goodsId ? `&goodsId=${this.goodsId}` : ''}`;
        } else {
          return '';
        }
      case 'gift':
        return `${baseUrl}/wx_member/gift`;
      default:
        return '';
    }
  }


  beforeMount() {
    this.initData();
  }

  initData() {
    const route = this.$route;
    const {query} = route;
    const {type, goodsId} = query;
    if (goodsId) {
      this.goodsId = goodsId as string;
    }
    if (typeof type === 'string') {
      this.type = type;
    }
  }
}
</script>

<style lang="scss" scoped>
#iframe {
  > iframe {
    width: 100vw;
    height: 100vh;
  }
}
</style>
