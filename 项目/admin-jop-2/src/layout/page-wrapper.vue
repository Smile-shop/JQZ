<template>
  <div class="pege-wrapper">
    <div class="page-main">
      <a-page-header
        @back="() => $router.go(-1)"
        class="page-header"
        :title="routeMeta.name"
      >
        <template #extra>
          <slot name="header-extra" />
        </template>
        <slot name="header-content" />
        <template #footer>
          <slot name="header-footer" />
        </template>
      </a-page-header>
      <div class="page-content">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
} from '@vue/composition-api';
import router from '@/router/index';
import store from '@/store/index';

export default defineComponent({
  setup(props, { emit }) {
    const collapsed = ref(false);
    const help = ref('platform');
    const routeMeta = computed(() => router.currentRoute.meta);

    function back() {
      router.back();
    }

    function collapseMenuSwitch() {
      collapsed.value = !collapsed.value;
    }

    onMounted(() => {
    });

    return {
      collapsed,
      back,
      collapseMenuSwitch,
      help,
      routeMeta,
    };
  },
});
</script>

<style lang="scss" scoped>
.pege-wrapper {
  > .page-main {
    flex-grow: 1;
    height: calc(100vh - 68px - 15px - 50px);
    overflow-y: auto;
    background-color: #FFF;

    > .page-header {
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 16px 24px;

      &::v-deep .ant-page-header-footer {
        &:empty {
          display: none;
        }

        &:not(:empty) {
          margin-bottom: 15px;
        }
      }
    }

    > .page-content {
      padding: 0 24px 24px 24px;
    }
  }
}
</style>
