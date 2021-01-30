<template>
  <div class="container">
    <div class="search-box">
      <div>
        <span>openid：</span>
        <input type="text" v-model="formParams.openid">
        <span>会员姓名：</span>
        <input type="text" v-model="formParams.memberName">
        <span>会员卡号：</span>
        <input type="text" v-model="formParams.memberCard">
      </div> 
      <div>
        <span>参与时间：</span>
        <el-date-picker
          v-model="formParams.winningTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="limitDate($event)"
        ></el-date-picker>
        <button class="serchBtn" @click="onQuery">查询</button>
        <button class="getExcel" @click="exportTableData">导出</button>
      </div>
    </div>
    <section class="pagination-container">
      <el-pagination
        @current-change="pageChange"
        background
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </section>
    <el-table :data="dataList" border style="width: 100%" class="table">
      <el-table-column prop="openid" label="openid" align="center"></el-table-column>
      <el-table-column prop="memberName" label="会员姓名" align="center"></el-table-column>
      <el-table-column prop="memberCard" label="会员卡号" align="center"></el-table-column>
      <el-table-column prop="drawNumber" label="抽奖次数" align="center"></el-table-column>
      <el-table-column prop="shareNumber" label="分享次数" width="150"></el-table-column>
    </el-table>
    <Table :columns="columns" :data="tableData" ref="table" v-show="false"></Table>
    <!-- 导航栏 -->
  </div>
</template>
<script>
import { joinRecords } from '@/api/super-mkt/activity-set/nine'
import moment from 'moment'
export default {
  components: {},
  directives: {},
  data() {
    return {
      TimestampNowDate: '',
      TimestampStart: '',
      TimestampEnd: '',
      formParams: {
        openCode: '',
        memberName: '',
        memberCard: '',
        winningTime: '',
        openid: '',
      },
      activityId: '',
      form: {
        // 时间范围
        dateRange: null,
        keyword: ''
      },
      tableData: [],
      dataList: [],
      pageNum: 1,
      pageSize: 20,
      total: 0,
      columns: [
        {
          title: 'openid',
          key: 'openid'
        },
        {
          title: '会员姓名',
          key: 'memberName'
        },
        {
          title: '会员卡号',
          key: 'memberCard'
        },
        {
          title: '抽奖次数',
          key: 'drawNumber'
        },
        {
          title: '分享次数',
          key: 'shareNumber'
        },
      ]
    };
  },
  computed: {},
  mounted() {
    this.setActivityId();

  },
  activated() {
    this.setActivityId();

  },
  created() {
    this.getwinningRecords()
  },
  methods: {
    limitDate($event) {
      // 日期校验
      if (!$event) {
        this.TimestampStart = '';
        this.TimestampEnd = '';
      } else {
        const endTime = moment($event[1], 'YYYY-MM-DD HH:mm:ss').valueOf();
        this.TimestampNowDate = moment(
          new Date(),
          'YYYY-MM-DD HH:mm:ss'
        ).valueOf();
        if (endTime > this.TimestampNowDate) {
          this.$alert(
            '不能大于当前时间',
            '日期选择有误',
            {
              confirmButtonText: '确定',
              callback: action => {
                this.dateValue = [];
                return;
              }
            }
          );
          this.formParams.winningTime = [];
        } else {
          this.TimestampStart = moment($event[0]).format('YYYY-MM-DD');
          this.TimestampEnd = moment($event[1]).format('YYYY-MM-DD');
        }

      }

    },
    exportTableData() {
      this.$refs.table.exportCsv({
        filename: '参与记录',
        columns: this.columns,
        data: this.tableData
      });
    },
    // 设置activityId
    setActivityId() {
      const { id } = this.$route.query;
      this.activityId = id;
    },
    // 页面变化
    pageChange(pageNum) {
      this.pageNum = pageNum;
      this.getwinningRecords();
    },
    // 查询按钮点击
    onQuery() {
      this.pageNum = 1;
      this.getwinningRecords();
    },
    // 获取参与记录
    getwinningRecords() {
      return new Promise((resolve, reject) => {
        const options = {
          pageNum: this.pageNum,
          activeId: this.$route.query.id,
          beginTime: this.TimestampStart ? this.TimestampStart : '',
          endTime: this.TimestampEnd ? this.TimestampEnd : '',
          ...this.formParams
        };

        joinRecords(options).then(res => {
          const { data, code, msg } = res;
          if (code == 0) {
            const { list, pageNum, total, pageSize } = data;
            this.dataList = list;
            this.pageNum = pageNum;
            this.pageSize = pageSize
            this.total = total;
            this.tableData = data.list;
            resolve(data);
          } else {
            reject(msg);
          }
        })
        .catch(reason => {
          reject(reason);
        });
      });
    },
    getExcel() {
      return new Promise((resolve, reject) => {
        const options = {
          activityId: this.activityId,
          startTime: this.form.dateRange ? this.form.dateRange[0] : '',
          endTime: this.form.dateRange
            ? this.form.dateRange[1]
            : moment(new Date()).format('YYYY-MM-DD'),
          pageNum: 1,
          pageSize: 99999,
          kw: this.form.keyword
        };

        const httpRes = httpServer(getActivityJoinRecord, options);
        httpRes
          .then(res => {
            const { data, code, msg } = res;
            if (code == 0) {
              const { list, pageNum, total } = data;

              const dataList = list.map((item, index) => {
                item.isFollow = item.isFollow == 1 ? '是' : '否';
                item.createTime = moment(item.createTime).format('YYYY-MM-DD');

                return item;
              });

              Table.methods.exportCsv({
                filename: '参与记录',
                columns: this.columns,
                data: dataList
              });

              resolve(data);
            } else {
              reject(msg);
            }
          })
          .catch(reason => {
            reject(reason);
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
    .search-box {
      padding: 18px;
      background: #f5f5f5;
      color: #333;
      line-height: 38px;

      & > div {
        margin-top: 20px;

        .getExcel {
          float: right;
        }
      }
      & > div input {
        width: 121px;
        height: 38px;
        border-radius: 5px;
        outline: none;
        border: solid 1px #dcdfe6;
        margin-right: 20px;
        padding-left: 10px;
      }
      & > div span {
        margin-right: 10px;
      }
      & > div button {
        width: 98px;
        height: 40px;
        color: #fff;
        background: #409eff;
        border-radius: 5px;
        margin-left: 20px;
        border: none;
      }
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
    margin-bottom: 10px;
  }
}
</style>