<template>
  <app-editor
    v-model="data.content"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, watch } from '@vue/composition-api';
import AppEditor from '@/components/app-editor.vue';

export default defineComponent({
  components: {
    AppEditor,
  },
  setup() {
    const data = reactive({
      content: '',
    })

    watch(() => data.content, (value) => {
      console.log(value);
    })

    return {
      data
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
