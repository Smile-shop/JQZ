<template>
  <div class="loading">
    <app-loading color="#555" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMainInfo, getShareInfo, getUserInfo } from '@/api/index';
import { useStore } from 'vuex';
import { setItem } from '@/utils/local-storage';
import AppLoading from '@/components/app-loading.vue';
import appMessage from '@/utils/app-message';

export default defineComponent({
  components: {
    AppLoading,
  },
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const { query } = route;

    console.log(query);
    console.log(location);
    console.log(store.state);

    async function login() {
      const body: {
        [key: string]: any;
      } = {};

      for (const [key, value] of Object.entries(store.state.query)) {
        if (value) {
          body[key] = value;
        }
      }

      return await store.dispatch('getUserInfo', body);
    }

    async function getShare() {
      const body = {};
      const res = await getShareInfo(body);

      if (res) {
        store.commit('setShare', res);
        return res;
      } else {
        return Promise.reject();
      }
    }

    function nextPage(verifier: number) {
      const orderNo = store.state.query.orderNo;

      if (orderNo) {
        router.replace({
          path: `/verification-code-detail`,
          query: { showPermisson: verifier == 1 ? 'fasle' : 'true' },
        });
      } else {
        router.replace({
          path: '/home',
        });
      }
    }

    // 获取首页数据
    async function getHome() {
      const body = {};

      try {
        const res = await getMainInfo(body);

        if (res) {
          store.commit('setHome', res);
        } else {
          return Promise.reject(res);
        }
      } catch (error) {
        console.warn(error);
        return Promise.reject(error);
      }
    }

    async function init() {
      if (process.env.NODE_ENV == 'development') {
        /* store.commit('setQuery', {
          code: '091b7Ykl2cfqg648jQkl29i1Nj1b7Ykw',
          companyKey: 'test01',
          platCompanyKey: 'test01',
          distributionId: '38',
          userId: '169',
          orderNo: '',
          channelId: '37'
        }); */
        store.commit('setQuery', {
          code: '033cnt0w30UcJV2qTD1w3JNG0O0cnt0m',
          companyKey: '01',
          platCompanyKey: '01',
          distributionId: '1',
          userId: '',
          orderNo: '',
          channelId: '1'
        });
      } else {
        store.commit('setQuery', query);
      }
      const res = await login();
      // await getShare();
      console.log(res);
      await Promise.all([getShare(), getHome()]);
      nextPage(res.verifier);
    }

    onMounted(() => {
      init();
    });
  },
});
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}
</style>
