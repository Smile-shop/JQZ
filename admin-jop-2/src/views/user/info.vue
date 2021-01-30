<template>
  <page-wrapper>
    <a-descriptions :title="user.name">
      <a-descriptions-item label="邮箱">
        {{user.email}}
      </a-descriptions-item>
      <a-descriptions-item label="电话">
        {{user.phone}}
      </a-descriptions-item>
    </a-descriptions>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from '@vue/composition-api';
import store from '@/store';

export default defineComponent({
  setup() {
    const data = reactive({});
    const user = computed(() => {
      return store.state.user;
    })

    return {
      data,
      user
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
