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
        <!-- <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="getExcel"
          >
            导出
          </el-button>
        </el-form-item> -->
      </el-form>
    </el-card>

    <ul class="total">
      <li>
        <div>
          参加人数
        </div>
        <div>
          {{top.joinCount}}
        </div>
      </li>
      <li>
        <div>
          拉新人数
        </div>
        <div>
          {{top.newCount}}
        </div>
      </li>
      <li>
        <div>
          取关人数
        </div>
        <div>
          {{top.unFollowCount}}
        </div>
      </li>
      <li>
        <div>
          净增人数
        </div>
        <div>
          {{top.newCount - top.unFollowCount}}
        </div>
      </li>
      <li>
        <div>
          完成人数
        </div>
        <div>
          {{top.doneCount}}
        </div>
      </li>
      <li>
        <div>
          完成率
        </div>
        <div>
          {{resultCompletionRate(top)}}
        </div>
      </li>
    </ul>

    <el-table
      :data="dataList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="times"
        label="日期"
        width="200"
      >
        <template
          slot-scope="scope"
        >
          {{scope.row.times | momentFilter('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="joinCount"
        label="参与人数"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="newCount"
        label="拉新人数"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="unFollowCount"
        label="取关人数"
        width="150"
      >
      </el-table-column>
      <el-table-column
        label="净增人数"
        width="150"
      >
        <template
          slot-scope="scope"
        >
          {{scope.row.newCount - scope.row.unFollowCount}}
        </template>
      </el-table-column>
      <el-table-column
        prop="exchangeCount"
        label="完成人数"
        width="150"
      >
      </el-table-column>
      <el-table-column
        label="完成率"
      >
        <template slot-scope="scope">
          {{resultCompletionRate(scope.row)}}
        </template>
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
  getActivityTop,
  getActivityStatistics,
} from '@/api/super-mkt/activity-set/fans';
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
    exchangeCount: 0,
    followCount: 0,
    joinCount: 0,
    newCount: 0,
    unfollowCount: 0,
  }
  dataList = []
  pageNum = 1
  pageSize = 20
  total = 0
  columns = [
    {
      title: '日期',
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
      title: '完成人数',
      key: 'exchangeCount',
    },
    {
      title: '完成率',
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
    const {exchangeCount, joinCount} = item;

    if (Number.isFinite(exchangeCount) && Number.isFinite(joinCount)) {
      const count = exchangeCount / joinCount;

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
    this.getActivityStatistics();
  }

  // 页面变化
  pageChange(pageNum: number) {
    this.pageNum = pageNum;
    this.getActivityStatistics();
  }

  // 获取Top统计
  getActivityTop() {
    return new Promise((resolve, reject) => {
      const body = {
        activityId: this.activityId,
        startTime: this.form.dateRange ? (this.form as any).dateRange[0] : '',
        endTime: this.form.dateRange ? (this.form as any).dateRange[1] : moment(new Date()).format('YYYY-MM-DD'),
      }

      getActivityTop(body).then((res: any) => {
        const {data} = res;

        this.top = data;

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 获取活动数据列表
  getActivityStatistics() {
    return new Promise((resolve, reject) => {
      const body = {
        activityId: this.activityId,
        startTime: this.form.dateRange ? (this.form as any).dateRange[0] : '',
        endTime: this.form.dateRange ? (this.form as any).dateRange[1] : moment(new Date()).format('YYYY-MM-DD'),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }

      getActivityStatistics(body).then((res: any) => {
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
  & > .header {
    & /deep/ {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  & > .total {
    display: flex;
    margin: 15px 0;
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


