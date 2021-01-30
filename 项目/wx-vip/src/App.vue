<template>
  <main>
    <Loading v-if="Loading"></Loading>
    <router-view/>
    <PageError :model="pageErrorData"></PageError>
  </main>
</template>

<script>
import Loading from './views/Loading';
import PageError from './views/PageError';
import { mapState } from 'vuex';
import axios from 'axios';
import { getPerformanceTiming } from './utils/performance.js';

export default {
  name: 'App',
  components: {
    Loading,
    PageError
  },
  computed: {
    ...mapState({
      Loading: state => state.Loading,
      urlData: state => state.urlData,
      pageErrorData: state => state.pageErrorData
    })
  },
  mounted() {
    let bodyDom = document.querySelector('body');
    bodyDom.style.fontSize = '14px';
    const params = {
      companyKey: this.urlData.companyKey,
      openid: this.urlData.openid
    }
    this.$store.dispatch('getHomeMemberIndex', params);
    const themeColor = window.localStorage.getItem('themeColor');
    if(themeColor) {
      this.$store.commit('appThemeColor', themeColor);
    }
    if (process.env.NODE_ENV == 'development') {
      const performanceTime = getPerformanceTiming();
      window.sessionStorage.setItem('performanceTime', JSON.stringify(performanceTime));
    }
    
  }
}
</script>

<style lang="less">
* {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
img {
  max-width: 100%!important;
}
</style>
