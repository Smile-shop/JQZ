<template>
  <a-modal
    title="数据权限"
    :visible="value"
    :maskClosable="false"
    :width="900"
    @cancel="onCancel"
    @ok="onConfirm"
  >
    12312
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, watch } from '@vue/composition-api';

export default defineComponent({
  components: {
  },
  props: {
    value: Boolean,
  },
  setup(props, context) {
    // 表单数据
    const data = reactive({
    });

    function onCancel() {
      context.emit('cancel');
      context.emit('input', false);
    }

    function onConfirm(value: any) {
      context.emit('confirm', value);
    }

    watch(() => props.value, async (value) => {
      if (value) {
      }
    });

    return {
      data,
      onCancel,
      onConfirm,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
