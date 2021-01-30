<template>
  <div class="page-table">
    <div class="buttons">
      <slot name="buttons"/>
    </div>
    <app-query-form :size="size">
      <slot name="form"/>
    </app-query-form>
    <div class="table">
      <slot/>
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
import AppQueryForm from '@/components/app-query-form.vue';

export default defineComponent({
  components: {
    AppQueryForm,
  },
  props: {
    size: {
      type: String,
      required: false,
      default: 'large'
    }
  },
  setup() {
  },
});
</script>

<style lang="scss" scoped>
.page-table {
  display: grid;
  grid-template-rows: max-content max-content auto;
  gap: 20px;

  > div {
    &:empty {
      display: none;
    }
  }

  > .buttons {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    gap: 10px;
  }

  > .table {
    ::v-deep .ant-table-wrapper {
      .ant-table-footer {
        display: grid;
        grid-auto-flow: column;
        justify-content: start;
        gap: 10px;
      }
    }
  }
}
</style>
