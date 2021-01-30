<template>
  <div class="custom-count">
    <div class="content content-border border-radius">
      <div class="item">
        <p>今日目标客户</p>
        <p>{{customerData.todayAddClient}}</p>
      </div>
      <div class="item">
        <p>今日转会员数</p>
        <p>{{customerData.todayShiftMember}}</p>
      </div>
      <div class="item">
        <p>目标客户总数</p>
        <p>{{customerData.clientSum}}</p>
      </div>
      <div class="item">
        <p>转会员总数</p>
        <p>{{customerData.shiftClientSum}}</p>
      </div>
    </div>
    <div class="title">跟进统计</div>
    <div class="content content-border border-radius-top">
      <div class="item">
        <p>今日写跟进次数</p>
        <p>{{customerData.clientTodayWrite}}</p>
      </div>
      <div class="item">
        <p>写跟进总次数</p>
        <p>{{customerData.clientSumWrite}}</p>
      </div>
    </div>
    <div class="content content-border border-radius-bottom">
      <div class="item">
        <p>今日呼出电话次数</p>
        <p>{{customerData.clientTodayCall}}</p>
      </div>
      <div class="item">
        <p>呼出电话总次数</p>
        <p>{{customerData.clientSumCall}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {getCustomerResourceStatistics} from '@/api/common';

@Component({
})
export default class CustomCount extends Vue {
  customerData = {
    todayAddClient: 0,
    todayShiftMember: 0,
    clientSum: 0,
    shiftClientSum: 0,
    clientTodayWrite: 0,
    clientSumWrite: 0,
    clientTodayCall: 0,
    clientSumCall: 0,
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
.custom-count {
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


