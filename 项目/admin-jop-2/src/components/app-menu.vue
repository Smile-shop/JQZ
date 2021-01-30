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
 * @description 菜单
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
    border-bottom: 2px solid transparent;

    &.router-link-active {
      color: #0045FF;
      border-bottom: 2px solid currentColor;
    }
  }
}
</style>
