<template>
  <page-wrapper class="goods-list">
    <!-- 表格组件 -->
    <page-table>
      <!-- 查询表单 -->
      <template>
        <search-form :tabKey="initData.tabKey" @onSelectItem="onSelectItem"></search-form>
      </template>
    </page-table>
     <!-- tabs标签栏 -->
    <div>
      <a-tabs @tabClick="getTab" v-model="initData.tabKey">
        <a-tab-pane v-for="item in initData.tabList" :key="item.key" :tab="item.tab">
          <custom-table @get-recommand="getRecommand" @add-recommand="addRecommand" :pageSize="initData.pageSize" :totalRecord="initData.totalRecord" :statusCode="item.key" :dataList="initData.dataList"></custom-table>
        </a-tab-pane>
      </a-tabs>
    </div>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api'
import PageTable from '@/layout/page-table.vue';
import searchForm from './components/search-form/index.vue';
import customTable from './components/custom-table/index.vue';
import {
  querySpuPage,
  queryStatusCount,
} from '@/api/modules/mall/goods-manage/product-list/index';
export default defineComponent({
  components: {
    PageTable,
    searchForm,
    customTable
  },
  setup(props, context) {
    onMounted(() => {
      queryPage();
    })
    const initData = reactive({
      tabKey: 'N',
      tabList: [
        {
          tab: '待上架',
          key: 'N'
        },
        {
          tab: '已上架',
          key: 'Y'
        },
        {
          tab: '已售罄',
          key: 'S'
        },
        {
          tab: '回收站',
          key: 'R'
        },
      ] as any[],
      dataList: [] as any[],
      totalRecord: 0,
      pageSize: 10,
      curPage: 1,
      selectItem: {}
    })
    const queryPage = async () => {
      queryAllStatusCount();
      const body:any = Object.assign({ status: initData.tabKey, curPage: initData.curPage, pageSize: initData.pageSize }, initData.selectItem);
      if (body.recommandKind === 'ALL') {
        delete body.recommandKind;
      }
      const spdata = await querySpuPage(body);
      initData.dataList = (spdata.records as any[]).map((item, index) => {
        return Object.assign({ key: item.id, seq: (index + 1) + (initData.curPage - 1) * initData.pageSize }, item);
      });
      initData.totalRecord = spdata.totalRecord;
    }
    const queryAllStatusCount = async () => {
      const body = Object.assign({}, initData.selectItem);
      const allCount:any[] = await queryStatusCount(body);
      initData.tabList = allCount.map(item => {
        return { tab: item.statusStr + '(' + item.count + ')', key: item.status };
      });
    }
    // tabs切换获取key
    const getTab = (key: string) => {
      initData.tabKey = key;
      initData.totalRecord = 0;
      initData.curPage = 1;
      initData.pageSize = 10;
      initData.dataList = [];
      queryPage();
    }
    const onSelectItem = async (item:any) => {
      initData.selectItem = item;
      queryPage();
    }
    // 添加推荐位成功后刷新页面
    const addRecommand = () => {
      queryPage();
    }
    const getRecommand = (curPage: number, pageSize: number) => {
      initData.curPage = curPage;
      initData.pageSize = pageSize;
      queryPage();
    }
    return {
      initData,
      getTab,
      onSelectItem,
      addRecommand,
      getRecommand
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
