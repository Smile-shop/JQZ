<template>
  <!-- 商品详情 -->
  <div v-if="goodsDetailId === '1'">
    <goods-detail :searchValue="searchValue" :code="code" :goodsId="goodsId" :goodsStatus="goodsStatus" :shelveRule="shelveRule" :storageType="storageType" @go-back="goBack" @get-curPage="getCurPage"></goods-detail>
  </div>
  <article class="shelves-wrapper" v-else>
    <el-tabs v-model="tabActiveName" @tab-click="handleClick">
      <el-tab-pane :label="`待上架(${shelvesList.waitNum})`" name="first">
        <stay-shelves ref="child1" :searchValues="searchValue" :curPage="curPage" :tabIndex = "tabIndex" @getSelectShelvesStatusNum="getSelectShelvesStatusNum" @go-detail="getGoodsDetail" @get-data="getDetailData" @get-shelve-rule="getShelveRule" @get-stock-style="getStock(arguments)"></stay-shelves>
      </el-tab-pane>
      <el-tab-pane :label="`已上架(${shelvesList.onShelfNum})`" name="second">
        <stay-shelves ref="child2" :searchValues="searchValue" :curPage="curPage" :tabIndex = "tabIndex" @getSelectShelvesStatusNum="getSelectShelvesStatusNum" @go-detail="getGoodsDetail" @get-data="getDetailData" @get-status="getDetailStatus" @get-shelve-rule="getShelveRule" @get-stock-style="getStock(arguments)"></stay-shelves>
      </el-tab-pane>
      <el-tab-pane :label="`已下架(${shelvesList.downNum})`" name="third`">
        <stay-shelves ref="child3" :searchValues="searchValue" :curPage="curPage" :tabIndex = "tabIndex" @getSelectShelvesStatusNum="getSelectShelvesStatusNum" @go-detail="getGoodsDetail" @get-data="getDetailData" @get-shelve-rule="getShelveRule" @get-stock-style="getStock(arguments)"></stay-shelves>
      </el-tab-pane>
    </el-tabs>
  </article>

</template>

<script>
import stayShelves from './components/stay-shelves'
import goodsDetail from './components/goods-detail'
import {getSelectShelvesStatusNum} from '@/api/super-crm/cloud-showroom-shelves';

export default {
  components: {
    stayShelves,
    goodsDetail
 },
  data() {
    return {
      tabActiveName : 'first',
      tabIndex: 0,
      goodsDetailId: '0', // 商品详情标识 0 不是| 1 是
      goodsId: 0 , // 商品详情的值
      goodsStatus: 0, // 商品详情的状态值
      shelveRule: 0, // 上架规则
      shelvesList: {
        downNum: 0, // 已下架数量
        onShelfNum: 0, // 已上架数量
        waitNum: 0, // 未上架数量
      },
      storageType: 1, // 上架规则
      curPage: '0', // 当前页
      code: '',
      searchValue: null // 查询条件
    }
  },
  mounted() {
    this.getSelectShelvesStatusNum();
    if (this.$route.query.id) {
      this.goodsId = this.$route.query.id;
    }
    if (this.$route.query.code) {
      this.code = this.$route.query.code;
    }
    if (this.$route.query.goodsDetailId) {
      this.goodsDetailId = this.$route.query.goodsDetailId;
    }
    // 推荐位跳转过来的时候
    if (this.$route.query.index) {
      this.tabActiveName = this.$route.query.index;
      this.tabIndex = 1;
    }
  },
 methods: {
  // 点击tab事件
  handleClick(tab, event) {
    this.tabIndex = parseInt(tab.index, 10);
    if (tab.index == 0) {
      this.$refs.child1.currentPage = 1;
      this.$refs.child1.getFindProduct(this.tabIndex);
    } else if (tab.index == 1) {
      this.$refs.child2.currentPage = 1;
      this.$refs.child2.getFindProduct(this.tabIndex);
      this.$refs.child2.changeVal(this.tabIndex);
      this.$refs.child2.resetM();
    } else {
      this.$refs.child3.currentPage = 1;
      this.$refs.child3.getFindProduct(this.tabIndex);
    }
    this.getSelectShelvesStatusNum();
  },
  // 上架状态数量查询
  getSelectShelvesStatusNum() {
    getSelectShelvesStatusNum().then((res) => {
      if (res.code === 0) {
        this.shelvesList = res.replyData ? res.replyData : this.shelvesList;
      }
    })
  },
  // 获取商品详情的值
  getGoodsDetail(data) {
    this.goodsDetailId = data;
  },
  // 获取商品详情的数据
  getDetailData(id, code) {
    this.goodsId = id;
    this.code = code;
  },
  // 获取商品详情的数据
  getDetailStatus(status) {
    this.goodsStatus = status;
  },
  // 获取商品上架规则
  getShelveRule(rule) {
    this.shelveRule = rule
  },
  // 获取商品类型
  getStock(style) {
    this.storageType = style[0];
    this.searchValue = style[1];
  },
  // 返回
  goBack(val) {
    this.goodsDetailId = val
    this.searchValue.status = this.tabIndex;
  },
  // 获取页数
  getCurPage(val) {
    this.curPage = val;
  }
 }
}
</script>

<style lang="scss">
.shelves-wrapper{
  margin-top: -10px;
  .el-tabs__header{
    margin-bottom: 8px;
  }
}
</style>