<template>
  <a-config-provider :locale="zh_CN">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
// eslint-disable-next-line camelcase
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import store from '@/store';

export default defineComponent({
  setup() {
    function saveState() {
      sessionStorage.setItem('state', JSON.stringify(store.state));
    }

    onMounted(() => {
      // Firefox火狐浏览器下使用sortable.js进行拖拽时打开新窗口页面的问题处理
      document.body.ondrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
      };
      window.onpagehide = () => {
        saveState();
      };
    });

    return {
      zh_CN,
    };
  },
});
</script>

<style lang="scss">
</style>
