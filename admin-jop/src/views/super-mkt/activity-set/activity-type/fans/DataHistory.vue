<template>
  <div class="activity-type-data-history">
    <el-card class="header" shadow="never">
      <el-form v-model="form" :inline="true" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input
            v-model="form.keyword"
          >
          </el-input> 
        </el-form-item>
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

    <el-table
      :data="dataList"
      border
      style="width: 100%"
      class="table"
    >
      <el-table-column
        label="编号"
        width="150"
      >
        <template slot-scope="scope">
          {{scope.row.code}}
          <!-- {{scope.$index + 1}} -->
        </template>
      </el-table-column>
      <el-table-column
        label="微信头像/昵称/openid"
        width="400"
      >
        <template
          slot-scope="scope"
        >
          <div class="user">
            <div class="left">
              <img
                :src="scope.row.avatarUrl"
                alt="头像"
              >
            </div>
            <div class="right">
              <p>
                {{scope.row.nickName}}
              </p>
              <p>
                {{scope.row.openid}}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="是否关注"
        width="100"
      >
        <template
          slot-scope="scope"
        >
          <el-icon
            v-if="scope.row.isFollow == 1"
            type="el-icon-success"
            size="30"
            color="#2d8cf0"
          >
          </el-icon>
          <el-icon
            v-else
            type="el-icon-error"
            size="30"
            color="#bbbec4"
          >
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column
        label="参与时间"
        width="200"
      >
        <template
          slot-scope="scope"
        >
          {{scope.row.createTime | momentFilter('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="recommends"
        label="推荐人数"
        width="150"
      >
      </el-table-column>
      <el-table-column
        label="推荐详情"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-tickets"
            size="small"
             @click="toPage('data', scope)"
          >
          </el-button>
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
import moment from 'moment';
import {
  getActivityJoinRecord,
} from '@/api/super-mkt/activity-set/fans';
import ElIcon from '@/components/ElIcon.vue';

@Component({
  name: 'data',
  components: {
    ElIcon
  }
})
export default class PrizeSetActivityTypeDataHistory extends Vue {
  activityId: any = ''
  form = {
    // 时间范围
    dateRange: null,
    keyword: '',
  }
  dataList = []
  pageNum = 1
  pageSize = 20
  total = 0
  columns = [
    {
      title: '编号',
      key: 'code',
    },
    {
      title: '昵称',
      key: 'nickName',
    },
    {
      title: 'openid',
      key: 'openid',
    },
    {
      title: '是否关注',
      key: 'isFollow',
    },
    {
      title: '参与时间',
      key: 'createTime',
    },
    {
      title: '推荐人数',
      key: 'recommends',
    },
  ]

  mounted() {
    this.setActivityId();
    this.getActivityJoinRecord();
  }

  activated() {
    this.setActivityId();
    this.getActivityJoinRecord();
  }

  // 设置activityId
  setActivityId() {
    const {id} = this.$route.query;
    this.activityId = id;
  }

  // 页面变化
  pageChange(pageNum: number) {
    this.pageNum = pageNum;
    this.getActivityJoinRecord();
  }

  // 页面跳转
  toPage(page: string, scope: any) {
    scope.row.activityId = this.activityId;

    switch (page) {
      case 'data':
        this.$router.push({
          path: '/super-mkt/activity-set/activity-type/fans/recommend',
          query: scope.row,
        })
        break;
      default:
        break;
    }
  }

  // 查询按钮点击
  onQuery() {
    this.pageNum = 1;
    this.getActivityJoinRecord();
  }

  // 获取参与记录
  getActivityJoinRecord() {
    return new Promise((resolve, reject) => {
      const body = {
        activityId: this.activityId,
        startTime: this.form.dateRange ? (this.form as any).dateRange[0] : '',
        endTime: this.form.dateRange ? (this.form as any).dateRange[1] : moment(new Date()).format('YYYY-MM-DD'),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        kw: this.form.keyword
      }

      getActivityJoinRecord(body).then((res: any) => {
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
.activity-type-data-history {
  & > .header {
    margin-bottom: 15px;

    & /deep/ {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  & > .table {
    .user {
      display: flex;

      > .left {
        overflow: hidden;
        margin-right: 10px;
        border-radius: 5px;
        width: 48px;
        height: 48px;

        & > img {
          height: 100%;
          width: 100%;
        }
      }

      > .right {
        > p {
          &:first-of-type {
            font-size: 14px;
            color: #333333;
          }

          &:last-of-type {
            font-size: 12px;
            color: #333333;
          }
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


