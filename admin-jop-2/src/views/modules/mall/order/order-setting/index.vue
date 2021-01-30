<template>
  <div class="goods-info">
    <div>
      <a-tabs @tabClick="tabHandle" defaultActiveKey="1">
        <a-tab-pane v-for="item in data.tabList" :key="item.key" :tab="item.tab" :disabled='item.key=="2"'>
          <setForm v-if="item.key=='1'"></setForm>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';
import setForm from './set-form/index.vue';
export default defineComponent({
  components: {
    setForm
  },
  setup() {
    // 表单数据
    const data = reactive({
      dataList: {},
      tabKey: '1',
      tabList: [
        {
          tab: '订单设置',
          key: '1'
        },
        {
          tab: '售后设置',
          key: '2'
        },
      ]
    });
    onMounted(() => {
    });
    const tabHandle = (key: string) => {
      data.tabKey = key;
    }
    return {
      data,
      tabHandle
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
