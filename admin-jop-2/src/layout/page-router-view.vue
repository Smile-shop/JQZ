<template>
  <keep-alive
    :max="10"
    :include="componentNames"
  >
    <router-view />
  </keep-alive>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import store from '@/store';

export default defineComponent({
  setup() {
    const componentNames = computed(() => {
      return store.state.componentNames;
    })

    return {
      componentNames
    }
  }
});
</script>

<style lang="scss" scoped>
</style>
