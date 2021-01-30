<template>
  <div :class="['query-form', size]">
    <slot/>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';

/**
 * @description 查询表单容器
 */
export default defineComponent({
  props: {
    size: {
      type: String,
      required: false,
      default: 'large'
    }
  },
  setup(props, context) {
    return {
    };
  },
});
</script>

<style lang="scss" scoped>
.query-form {
  ::v-deep > .ant-form {
    display: grid;
    grid-template: auto/repeat(4, 1fr);
    gap: 15px;

    .ant-form-item {
      display: flex;
      margin-right: 0;

      > .ant-form-item-label {
        flex-shrink: 0;
      }

      > .ant-form-item-control-wrapper {
        flex-grow: 1;
      }
    }
  }

  &.large {
    @media screen and (max-width: 1200px) {
      ::v-deep > .ant-form {
        grid-template: auto/repeat(3, 1fr);
      }
    }

    @media screen and (min-width: 1200px) {
      ::v-deep > .ant-form {
        grid-template: auto/repeat(5, 1fr);
      }
    }
  }

  &.small {
    @media screen and (max-width: 900px) {
      ::v-deep > .ant-form {
        grid-template: auto/repeat(2, 1fr);
      }
    }

    @media screen and (min-width: 900px) {
      ::v-deep > .ant-form {
        grid-template: auto/repeat(3, 1fr);
      }
    }
  }
}
</style>
