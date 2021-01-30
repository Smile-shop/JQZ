<template>
  <div class="custom-clue-count">
    <div class="content content-border border-radius">
      <div class="item">
        <p>今日新增潜在客</p>
        <p>{{customerData.todayAddClientClue}}</p>
      </div>
      <div class="item">
        <p>今日转客户数</p>
        <p>{{customerData.todayShiftClient}}</p>
      </div>
      <div class="item">
        <p>潜在客总数</p>
        <p>{{customerData.clientClueSum}}</p>
      </div>
      <div class="item">
        <p>转客户总数</p>
        <p>{{customerData.shiftClientSum}}</p>
      </div>
    </div>
    <div class="title">跟进统计</div>
    <div class="content content-border border-radius-top">
      <div class="item">
        <p>今日写跟进次数</p>
        <p>{{customerData.clueTodayWrite}}</p>
      </div>
      <div class="item">
        <p>写跟进总次数</p>
        <p>{{customerData.clueSumWrite}}</p>
      </div>
    </div>
    <div class="content content-border border-radius-bottom">
      <div class="item">
        <p>今日呼出电话次数</p>
        <p>{{customerData.clueTodayCall}}</p>
      </div>
      <div class="item">
        <p>呼出电话总次数</p>
        <p>{{customerData.clueSumCall}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {getCustomerResourceStatistics} from '@/api/common';

@Component({
})
export default class CustomClueCount extends Vue {
  customerData = {
    todayAddClientClue: 0,
    todayShiftClient: 0,
    clientClueSum: 0,
    shiftClientSum: 0,
    clueTodayWrite: 0,
    clueSumWrite: 0,
    clueTodayCall: 0,
    clueSumCall: 0,
  }

  mounted() {
    this.getSuperCrmCountInfo();
  }

  // 获取统计数据
  async getSuperCrmCountInfo() {
    const res = await getCustomerResourceStatistics();
    const {data} = res;
    this.customerData = data;
  }
}
</script>

<style lang="scss" scoped>
.custom-clue-count {
  .title {
    font-size: 16px;
    color: #606266;
    padding: 12px 0;
  }
  .content {
    display: flex;
    justify-content: space-around;
    .item {
      text-align: center;
      background-color: #ffffff;
      padding: 8px 0;
      p:first-child {
        font-size: 14px;
        color: #606266;
        line-height: 32px;
      }
      p:last-child {
        font-size: 36px;
        color: #e12f30;
        font-weight: bold;
      }
    }
  }
  .content-border {
    border: 1px solid #e4e7ed;
  }
  .border-radius {
    border-radius: 5px;
  }
  .border-radius-top {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .border-radius-bottom {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top: 0;
  }
}
</style>


