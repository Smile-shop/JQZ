<!--
 * @Author: your name
 * @Date: 2020-08-14 12:00:19
 * @LastEditTime: 2020-08-14 18:09:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin-jop-2\src\views\modules\mall\order\all\index.vue
-->
<template>
  <page-wrapper>
    <!-- 头部右边 -->
    <template #header-extra></template>
    <!-- 表格组件 -->
    <page-table>
      <!-- 查询表单 -->
      <template #form>
        <search-form @go-search="goSearch"></search-form>
      </template>
    </page-table>
    <!-- tabs标签栏 -->
    <div>
      <a-tabs @tabClick="tabHandle" defaultActiveKey="">
        <a-tab-pane v-for="item in data.tabList" :key="item.key" :tab="item.tab" >
          <custom-table :statusCode="item.key" :dataList="data.dataList" @emit-event="emitEvent"></custom-table>
        </a-tab-pane>
      </a-tabs>
    </div>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';
import { message } from 'ant-design-vue';
import PageTable from '@/layout/page-table.vue';
import searchForm from './components/search-form/index.vue';
import customTable from './components/custom-table/index.vue'
import {
  queryOrderPage
} from '@/api/modules/mall/order-manage/all-order/index';

export default defineComponent({
  components: {
    PageTable,
    searchForm,
    customTable
  },
  setup() {
    // 表单数据
    const data = reactive({
      dataList: {},
      tabKey: '',
      tabList: [
        {
          tab: '全部订单',
          key: ''
        },
        {
          tab: '待付款',
          key: 'NOTPAID'
        },
        {
          tab: '待发货',
          key: 'NOTSHIPPED'
        },
        {
          tab: '已发货',
          key: 'SHIPPED'
        },
        {
          tab: '待提货',
          key: 'NOTRECV'
        },
        {
          tab: '已完成',
          key: 'FINISHED'
        },
        {
          tab: '已关闭',
          key: 'CLOSED'
        },
        {
          tab: '已取消',
          key: 'CANCELED'
        },
        {
          tab: '售后中',
          key: '9'
        },
      ],
      formData: null, // 表单数据
    });
    const formModel = ref(0);
    const queryFormModel = ref();
    const tabHandle = (key: string) => {
      data.tabKey = key;
      const param = data.formData;
      const body = {
        ...modifyParam,
        userStatus: key
      }
      queryOrderPageFun(body);
    }
    // 搜索方法 formValue 表单搜索值
    let modifyParam: any = null;
    const goSearch = (formValue: any) => {
      data.formData = formValue;
      modifyParam = formValue;
      (data.formData as any).userStatus = data.tabKey;
      queryOrderPageFun(formValue);
    }
    // 订单列表查询
    const queryOrderPageFun = async (params?: any) => {
      let body = {};
      if (params) {
        body = Object.assign({}, params);
      }
      const responData = await queryOrderPage(body);
      data.dataList = responData;
    }
    // 子组件事件分页
    const emitEvent = (item: any) => {
      let body = {};
      body = Object.assign({}, data.formData, item, { userStatus: data.tabKey });
      queryOrderPageFun(body)
    }
    onMounted(() => {
      queryOrderPageFun()
    });

    return {
      data,
      formModel,
      tabHandle,
      goSearch,
      emitEvent
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
