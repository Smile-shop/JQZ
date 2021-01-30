<template>
  <div class="activity-type-data-active">
    <el-card class="header" shadow="never">
      <el-form v-model="form" :inline="true" class="demo-form-inline">
        <el-form-item label="时间">
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onQuery"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="activity-type-wrapper">
      <span class="activity-span">实时数据：{{top.currentDate}}</span>
    </div>
    <ul class="total">
      <li>
        <div>
          参与人数
          <el-tooltip content="参与人数=扫海报关注用户+发起海报推广用户" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div>
          {{top.parPul || 0}}
        </div>
      </li>
      <li>
        <div>
          拉新人数
          <el-tooltip content="活动期间，成功被邀请关注的用户" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div>
          {{top.pullNew || 0}}
        </div>
      </li>
      <li>
        <div>
          取关人数
          <el-tooltip content="活动期间，成功被邀请关注的用户取消关注" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div>
          {{top.cancelFollow || 0}}
        </div>
      </li>
      <li>
        <div>
          净增人数
          <el-tooltip content="拉新人数-取关人数" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div>
          {{top.increase || 0}}
        </div>
      </li>
      <li>
        <div>
          兑换人数
          <el-tooltip content="累计完成奖品兑换人数" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div>
          {{top.exchange || 0}}
        </div>
      </li>
      <li>
        <div>
          兑换率
          <el-tooltip content="累计完成奖品兑换人数/参与人数" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div>
          {{top.exchangePercent}}
        </div>
      </li>
      <li>
        <div>
          转化均价（元）
          <el-tooltip content="活动期间奖品领取人与活动新关注注册会员的销售实收金额 / 奖品领取人数+活动新关注注册的消费会员数" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div>
          {{top.conversionPrice || 0}}
        </div>
      </li>
    </ul>

    <el-table
      :data="dataList"
      border
      style="width: 100%"
      centerd
    >
      <el-table-column
        prop="times"
        label="统计截止时间"
      >
        <template
          slot-scope="scope"
        >
          {{scope.row.statisticsTime | momentFilter('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="parPul"
        label="参与人数"
      >
      </el-table-column>
      <el-table-column
        prop="pullNew"
        label="拉新人数"
      >
      </el-table-column>
      <el-table-column
        prop="cancelFollow"
        label="取关人数"
      >
      </el-table-column>
      <el-table-column
        label="净增人数"
      >
        <template
          slot-scope="scope"
        >
          {{scope.row.increase || 0}}
        </template>
      </el-table-column>
      <el-table-column
        prop="exchange"
        label="兑换人数"
      >
      </el-table-column>
      <el-table-column
        label="兑换率"
      >
        <template slot-scope="scope">
          {{scope.row.exchangePercent || 0}}
        </template>
      </el-table-column>
      <el-table-column
        prop="conversionPrice"
        label="转化均价（元）"
      >
      </el-table-column>
    </el-table>

    <!-- 导航栏 -->
    <section class="pagination-container">
      <el-pagination
        @current-change="pageChange"
        background
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </section>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {
  getCurrentFansStatistics,
  queryFansStatistics,
} from '@/api/super-mkt/activity-set/fans_plus';
import moment from 'moment';

@Component({
  name: 'data'
})
export default class PrizeSetActivityTypeDataActive extends Vue {
  activityId: any = ''
  form = {
    // 时间范围
    dateRange: null,
  }
  top = {
    cancelFollow: 0,
    conversionPrice: 0,
    customer: 0,
    exchangePercent: 0,
    exchange: 0,
    increase: 0,
    parPul: 0,
    pullNew: 0,
    currentDate: ''
  }
  dataList = []
  pageNum = 1
  pageSize = 10
  total = 0
  columns = [
    {
      title: '统计截止时间',
      key: 'times',
    },
    {
      title: '参与人数',
      key: 'joinCount',
    },
    {
      title: '拉新人数',
      key: 'newCount',
    },
    {
      title: '取关人数',
      key: 'unFollowCount',
    },
    {
      title: '净增人数',
      key: 'addCount',
    },
    {
      title: '兑换人数',
      key: 'exchangeCount',
    },
    {
      title: '兑换率',
      key: 'resultCompletionRate',
    },
    {
      title: '转化均价（元）',
      key: 'resultCompletionRate',
    },
  ]

  mounted() {
    this.setActivityId();
    this.getActivityTop();
    this.getActivityStatistics();
  }

  activated() {
    this.setActivityId();
    this.getActivityTop();
    this.getActivityStatistics();
  }

  // 返回完成率
  resultCompletionRate(item: any) {
    const {exchange, parPul} = item;

    if (Number.isFinite(exchange) && Number.isFinite(parPul)) {
      const count = exchange / parPul;

      if (count) {
        return Math.round(count * 100) + '%'
      } else {
        return '0%';
      }
    } else {
      return '0%';
    }
  }

  // 设置activityId
  setActivityId() {
    const {id} = this.$route.query;
    this.activityId = id;
  }

  // 查询按钮点击
  onQuery() {
    this.pageNum = 1;
    this.getActivityTop()
    this.getActivityStatistics();
  }

  // 页面变化
  pageChange(pageNum: number) {
    this.pageNum = pageNum;
    this.getActivityStatistics();
  }

  // 获取Top统计
  async getActivityTop() {
    const headers = {
      // activityId: '6874',
      activityId: this.activityId,
    }
    const body = {
      startTime: this.form.dateRange ? (this.form as any).dateRange[0] : '',
      endTime: this.form.dateRange ? (this.form as any).dateRange[1] : moment(new Date()).format('YYYY-MM-DD'),
    }
    const data: any = await getCurrentFansStatistics(body, headers);
    this.top = data.data;
  }

  // 获取活动数据列表
  private getActivityStatistics() {

    return new Promise((resolve, reject) => {
      const body = {
        startTime: this.form.dateRange ? (this.form as any).dateRange[0] : '',
        endTime: this.form.dateRange ? (this.form as any).dateRange[1] : moment(new Date()).format('YYYY-MM-DD'),
        pageNum: this.pageNum,
      }
      const headers = {
        activityId: this.activityId
      }
      queryFansStatistics(body, headers).then((res: any) => {
        const {data} = res;

        const {list, pageNum, total} = data;
        this.dataList = list;
        this.pageNum = pageNum;
        this.total = total;

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.activity-type-data-active {
  /deep/.el-table th > .cell {
    text-align: center;
  }
  /deep/.el-table .cell {
    text-align: center;
  }
  .activity-type-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;
    padding-right: 12px;
  }
  & > .header {
    & /deep/ {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  & > .total {
    display: flex;
    margin: 12px 0 15px;
    border: 1px solid #dddddd;

    & > li {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #dddddd;
      height: 112px;

      &:last-of-type {
        border-right: 0;
      }

      & > div {
        line-height: 1;

        &:first-of-type {
          color: #666666;
          margin-bottom: 20px;
        }

        &:last-of-type {
          color: #666666;
          font-size: 30px;
          font-weight: bold;
        }
      }
    }
  }

  & > .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>


