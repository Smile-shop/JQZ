<template>
  <div class="activity-type-data-history">
    <el-card class="header" shadow="never">
      <el-form v-model="form" :inline="true" class="demo-form-inline">
        <el-form-item label="参与时间" style="margin-bottom: 30px;">
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
        <el-form-item label="用户类型" class="el-form-class">
          <el-select v-model="form.userType" placeholder="所有类型" style="width: 110px;">
            <el-option
              v-for="item in userType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖品发放" class="el-form-class">
          <el-select v-model="form.prizeType" placeholder="所有级别" style="width: 110px;" @change="selectChange">
            <el-option
              v-for="item in prizeType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="form.prizeStatus" :disabled="form.prizeType ? false : true" placeholder="奖品状态" style="width: 110px;">
            <el-option
              v-for="item in prizeStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐人数" class="el-form-class">
          <el-input
            type="number"
            v-model.number="form.recommendNumMin"
            style="width: 100px;"
            onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
          >
          </el-input>
          至
          <el-input
            type="number"
            v-model.number="form.recommendNumMax"
            style="width: 100px;"
            onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
          >
          </el-input>
        </el-form-item>
        <el-form-item label="好友类型" class="el-form-class">
          <el-select v-model="form.friType" placeholder="所有类型" style="width: 110px;">
            <el-option
              v-for="item in friendStyle"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input
            v-model.trim="form.keyword"
            placeholder="输入用户昵称/openid/编号"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onQuery"
          >
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            @click="resetValue"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <p style="margin: 12px 0;color: #606266;">当前结果：{{total}}条</p>
    <el-table
      :data="dataList"
      border
      style="width: 100%"
      class="table"
      height="530"
    >
      <el-table-column
        prop="wmcode"
        label="编号"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="userType"
        label="用户类型"
        width="150"
        show-overflow-tooltip
        :render-header="renderHeader"
      >
      </el-table-column>
      <el-table-column
        prop="friType"
        label="好友类型"
        width="150"
        :render-header="renderHeader"
      >
      </el-table-column>
      <el-table-column
        label="微信头像/昵称/openid"
        width="300"
      >
        <template
          slot-scope="scope"
        >
          <div class="user">
            <div class="left">
              <img
                :src="scope.row.wicon"
                alt="头像"
              >
            </div>
            <div class="right">
              <p>
                {{scope.row.wname}}
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
            v-if="scope.row.follow == '1'"
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
          {{scope.row.participationTime | momentFilter('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="recommendNum"
        label="推荐人数"
        width="150"
      >
      </el-table-column>
      <el-table-column
        label="一级奖品"
        width="150"
      >
        <template slot-scope="scope">
          {{scope.row.level1 === '1' ? '未达标' : scope.row.level1 === '2' ? '已达标' : scope.row.level1 === '3' ? '已兑换' : scope.row.level1 === '4' ? '已领取' : '——'}}
        </template>
      </el-table-column>
      <el-table-column
        label="二级奖品"
        width="150"
      >
        <template slot-scope="scope">
          {{scope.row.level2 === '1' ? '未达标' : scope.row.level2 === '2' ? '已达标' : scope.row.level2 === '3' ? '已兑换' : scope.row.level2 === '4' ? '已领取' : '——'}}
        </template>
      </el-table-column>
      <el-table-column
        label="三级奖品"
        width="150"
      >
        <template slot-scope="scope">
          {{scope.row.level3 === '1' ? '未达标' : scope.row.level3 === '2' ? '已达标' : scope.row.level3 === '3' ? '已兑换' : scope.row.level3 === '4' ? '已领取' : '——'}}
        </template>
      </el-table-column>
      <el-table-column
        label="推荐详情"
        fixed="right"
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
  queryParPulStatistics,
} from '@/api/super-mkt/activity-set/fans_plus';
import ElIcon from '@/components/ElIcon.vue';

@Component({
  name: 'data',
  components: {
    ElIcon
  }
})
export default class PrizeSetActivityTypeDataHistory extends Vue {
  activityId: any = ''
  userTypeValue: string = ''
  // 表头文字提示
  tipText01 = {
    inReview: '分为1级用户与2级用户'
  }
  form = {
    // 时间范围
    dateRange: null,
    keyword: '',
    userType: '',
    prizeType: '',
    prizeStatus: '',
    recommendNumMax: '',
    recommendNumMin: '',
    friType: ''
  }
  dataList = []
  pageNum = 1
  pageSize = 10
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
  userType = [
    {
      value: null,
      label: '所有类型'
    },
    {
      value: 3,
      label: '一级用户'
    },
    {
      value: 2,
      label: '二级用户'
    },
  ]
  prizeType = [
    {
      value: null,
      label: '所有级别'
    },
    {
      value: 'level1',
      label: '一级奖品'
    },
    {
      value: 'level2',
      label: '二级奖品'
    },
    {
      value: 'level3',
      label: '三级奖品'
    },
  ]
  prizeStatus = [
    {
      value: '',
      label: '奖品状态'
    },
    {
      value: '1',
      label: '未达标'
    },
    {
      value: '2',
      label: '已达标'
    },
    {
      value: '3',
      label: '已兑换'
    },
    {
      value: '4',
      label: '已领取'
    },
  ]
  friendStyle = [
    {
      value: '',
      label: '所有类型'
    },
    {
      value: '1',
      label: '个人邀请'
    },
    {
      value: '2',
      label: '官方邀请'
    },
    {
      value: '3',
      label: '——'
    }
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
          path: '/super-mkt/activity-set/activity-type/fans_plus/recommend',
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
  async getActivityJoinRecord() {
    const headers = {
      activityId: this.activityId
    }
    const body: any = {
      startTime: this.form.dateRange ? (this.form as any).dateRange[0] : '',
      endTime: this.form.dateRange ? (this.form as any).dateRange[1] : '',
      pageNum: this.pageNum,
      keyword: this.form.keyword,
      friType: this.form.friType,
      recommendNumMax: this.form.recommendNumMax,
      recommendNumMin: this.form.recommendNumMin,
      userType: this.form.userType,
    }
    if (this.form.prizeType === 'level1') {
      body.level1 = this.form.prizeStatus
    }
    if (this.form.prizeType === 'level2') {
      body.level2 = this.form.prizeStatus
    }
    if (this.form.prizeType === 'level3') {
      body.level3 = this.form.prizeStatus
    }
    const res: any = await queryParPulStatistics(body, headers);
    const {data} = res;
    const {list, pageNum, total} = data;
    this.dataList = list;
    this.pageNum = pageNum;
    this.total = total;
  }
  // 重置
  resetValue() {
    this.form.dateRange = null;
    this.form.keyword = '';
    this.form.userType = '';
    this.form.prizeType = '';
    this.form.prizeStatus = '';
    this.form.recommendNumMax = '';
    this.form.recommendNumMin = '';
    this.form.friType = '';
    this.pageNum = 1;
    this.getActivityJoinRecord();
  }
  // 奖品发放
  selectChange() {
    if (this.form.prizeType === '') {
      this.form.prizeStatus = ''
    }
  }
  // 头部提示文字
  renderHeader(h: any, param: any ) {
    return h('el-tooltip', {
      props: {
        content: (() => {
          const label = param.column.label
          switch (label) {
            case '用户类型':
              return '分为1级用户与2级用户'
              break
            case '好友类型':
              return '显示二级用户被邀请的方式'
              break
          }
        })(),
        placement: 'top'
      },
      domProps: {
        innerHTML: param.column.label + '<span class="el-icon-warning-outline" style="margin-left:4px"></span>'
      }
    },
    [h('span')])
  }
}
</script>

<style lang="scss" scoped>
.activity-type-data-history {
  /deep/ input[type="number"]{
    -moz-appearance: none;
    text-align: center;
  }
  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  /deep/.el-table th > .cell {
    text-align: center;
  }
  /deep/.el-table .cell {
    text-align: center;
  }
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
            text-align: left;
          }

          &:last-of-type {
            font-size: 12px;
            color: #333333;
            text-align: left;
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
  .el-form-class {
    margin-left: 20px;
  }
}
</style>
