<template>
  <ul class="app-menu">
    <router-link
      v-for="item of props.menus"
      :key="item.name"
      tag="li"
      :to="item.to"
      replace
    >
      {{item.name}}
    </router-link>
  </ul>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';

/**
 * @description 按钮列表, 用于将多个按钮组合在一起使用
 */
export default defineComponent({
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
  setup(props, context) {
    onMounted(() => {
      console.log(props, context);
    });

    return {
      props,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-menu {
  display: grid;
  place-items: center;
  justify-content: start;
  grid-auto-flow: column;
  gap: 30px;
  border-bottom: 1px solid #EBEEF5;

  > li {
    cursor: pointer;
    padding: 8px;
    font-weight: bold;
    font-size: 16px;

    &.router-link-active {
      color: #0045FF;
      border-bottom: 2px solid currentColor;
    }
  }
}
</style>
