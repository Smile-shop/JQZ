<template>
  <div class="pool-count">
    <div class="content">
      <div class="item">
        <p>今日新增线索池数</p>
        <p>{{customerData.todayAddCluePool}}</p>
      </div>
      <div class="item">
        <p>线索池总数</p>
        <p>{{customerData.cluePoolSum}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {getCustomerResourceStatistics} from '@/api/common';

@Component({
})
export default class PoolCount extends Vue {
  customerData = {
    todayAddCluePool: 0,
    cluePoolSum: 0
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
.pool-count {
  .content {
    border: 1px solid #e4e7ed;
    border-radius: 5px;
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
}
</style>


