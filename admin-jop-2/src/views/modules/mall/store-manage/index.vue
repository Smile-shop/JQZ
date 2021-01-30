<template>
  <page-wrapper class="store">
    <!-- 头部右边 -->
    <template #header-extra></template>
    <!-- 表格组件 -->
    <page-table>
      <!-- 查询表单 -->
      <template #form>

      </template>
      <!-- 表格 -->
      <a-table
        :columns="data.columns"
        :data-source="data.listData"
        :pagination="false"
        row-key="distId"
      >
        <template #index="text, record, index">
          <span>{{index + 1}}</span>
        </template>
        <template #imgs="text, record">
          <div class="store-img">
            <img v-if="Array.isArray(text) && text.length" :src="text.length ? text[0].url : ''" alt="">
            <div class="store-img-empty" v-else></div>
          </div>
        </template>
        <template #status="text">
          <span :class="text === 'OPEN' ? 'store-active' : 'store-noactive'">{{ text === 'OPEN' ? '正常营业' : '暂停营业' }}</span>
        </template>
        <template #action="record">
          <a @click="godetail(record.distId)">门店详情</a>
        </template>
      </a-table>
      <div class="page">
        <a-pagination
            :total="data.total"
            v-model="data.page.curPage"
            :show-total="total => `共 ${total}条`"
            show-size-changer show-quick-jumper
            :default-current="1"
            :pageSizeOptions="['10', '20', '30', '40']"
            @change="changeCurpage"
            @showSizeChange="changeSize"
          />
      </div>
    </page-table>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, computed, watch } from '@vue/composition-api'
import { queryWithDistPage } from '@/api/modules/mall/store-manage'
import PageTable from '@/layout/page-table.vue'
import router from '@/router'
const columns = [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '门店编号',
    key: 'id',
    dataIndex: 'id',
    customRender: (text: any) => text || '--'
  },
  {
    title: '门店logo',
    key: 'imgs',
    dataIndex: 'imgs',
    scopedSlots: { customRender: 'imgs' },
  },
  {
    title: '线上门店名称',
    key: 'name',
    dataIndex: 'name',
    customRender: (text: any) => text || '--'
  },
  {
    title: '所属分销商',
    key: 'distName',
    dataIndex: 'distName',
  },
  {
    title: '门店地址',
    key: 'address',
    dataIndex: 'address',
    customRender: (text: any) => text || '--'
  },
  {
    title: '门店电话',
    key: 'tel',
    dataIndex: 'tel',
    customRender: (text: any) => text || '--'
  },
  {
    title: '线上会员数',
    key: 'meNum',
    dataIndex: 'meNum',
  },
  {
    title: '线上门店状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]
export default defineComponent({
  name: 'StoreList',
  components: { PageTable },
  setup() {
    const data = reactive({
      listData: [
        { id: 1, tel: '0755-4434445', logo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597838119047&di=8352965ca14c26e67466babe13ccadd1&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F05%2F81%2F599dcf24c4d94_610.jpg', name: '金千枝翠竹店', belong: '金千枝', address: '深圳市罗湖区翠竹街道水贝一路111号', memberNum: 23, status: 1 },
        { id: 2, tel: '0755-4434446', logo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597838119047&di=8352965ca14c26e67466babe13ccadd1&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F05%2F81%2F599dcf24c4d94_610.jpg', name: '金千枝水贝店', belong: '金千枝', address: '深圳市罗湖区翠竹街道水贝一路112号', memberNum: 0, status: 2 }
      ],
      columns,
      page: {
        curPage: 1,
        pageSize: 10
      },
      total: 0
    });
    watch(() => data.page, (val) => { querPageData(val) })
    function godetail(distId: string) {
      router.push({ path: '/mall/store-manage/list/store-detail', query: { distId: distId } })
    }
    async function querPageData(page: any) {
      const res = await queryWithDistPage(page)
      data.listData = res.records
      data.total = res.totalRecord
      // console.log(res)
    }
    function changeCurpage(curPage: number, pageSize: number) {
      data.page = { curPage, pageSize }
    }
    function changeSize(curPage: number, pageSize: number) {
      data.page = { curPage, pageSize }
    }
    onMounted(() => {
      querPageData(data.page)
    });

    return {
      data,
      godetail,
      changeCurpage,
      changeSize
    };
  },
});
</script>

<style lang="scss" scoped>
.store{
  &-img{
    width: 40px;
    border-radius: 40px;
    overflow: hidden;
    background: #eee;
    img{
      height: 40px;
      width: 40px;
    }
    &-empty{
      width: 40px;
      height: 40px;
      background: #eee;
    }
  }
  &-active{
    color: #80869D;
  }
  &-noactive{
    color: red;
  }
  &-action{
    cursor: pointer;
  }
  .page{
    margin-top: 20px;
    text-align: right;
  }
}
</style>
