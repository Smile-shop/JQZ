<template>
  <div class="container">
    <div class="top">
      <ul>
        <li>
          <span>活动标题:</span>
          {{activeDataVo.activeName}}
        </li>
        <li> 
          <span>活动状态:</span>
          {{activeStatus}}
        </li>
        <li>
          <span>活动时间:</span>
          {{activeDataVo.beginTime}}&nbsp;&nbsp;&nbsp;到&nbsp;&nbsp;&nbsp;{{activeDataVo.endTime}}
        </li>
      </ul>
    </div>
    <div class="dataTab">
      <ul>
        <li>
          <div>活动数据</div>
        </li>
        <li>
          <div>
            <p class="num">{{activeDataVo.showNumberSum}}</p>
            <span>展示量</span>
          </div>
        </li>
        <li>
          <div>
            <p class="num">{{activeDataVo.joinNumberSum}}</p>
            <span>参与人数</span>
          </div>
        </li>
        <!-- <li>
          <div>
            <p class="num">{{activeDataVo.shareNumberSum}}</p>
            <span>分享次数</span>
          </div>
        </li> -->
      </ul>
    </div>
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
            @change="limitDate($event)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onQuery">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" icon="el-icon-download" @click="getExcel">导出</el-button>
        </el-form-item>-->
      </el-form>
    </el-card>
    <div class="dataView">
      <div class="dataTotal">
        <ul class="everyTotal">
          <li>
            <div>
              <p class="num">{{activeDataVo.showNumber}}</p>
              <span>展示量</span>
            </div>
          </li>
          <li>
            <div>
              <p class="num">{{activeDataVo.joinNumber}}</p>
              <span>参与人数</span>
            </div>
          </li>
          <!-- <li>
            <div>
              <p class="num">{{activeDataVo.shareNumber}}</p>
              <span>分享次数</span>
            </div>
          </li> -->
        </ul>
      </div>
      <div id="echartViews">
        <ve-line :data="chartsData"></ve-line>
      </div>
    </div>

    <!-- 导航栏 -->
  </div>
</template>
<script>
import { getActivityTop, getActivityStatistics, dataShow } from '@/api/super-mkt/activity-set/nine'
import moment from 'moment'
export default {
  data() {
    return {
      activityId: '',
      form: {
        // 时间范围
        dateRange: null
      },
      TimestampNowDate: '',
      TimestampStart: '',
      TimestampEnd: '',
      activeStatus: '',
      dateList: [],
      showList: [],
      personList: [],
      shareList: [],
      top: {
        exchangeCount: 0,
        followCount: 0,
        joinCount: 0,
        newCount: 0,
        unfollowCount: 0
      },
      chartsData: {
        columns: ['展示量', '参与人数'],
        rows: [],
      },
      activeDataVo: {},
      dataList: [],
      pageNum: 1,
      pageSize: 20,
      total: 0,
    };
  },
  created() {
    const options = {
      activeId: this.$route.query.id,
      beginTime: this.form.dateRange
        ? new Date(this.form.dateRange[0]).format('YYYY-MM-dd')
        : '',
      endTime: this.form.dateRange
        ? new Date(this.form.dateRange[1]).format('YYYY-MM-dd')
        : ''
    };
    this.getdataShow(options);
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
          this.$alert('不能大于当前时间', '日期选择有误', {
            confirmButtonText: '确定',
            callback: action => {
              this.dateValue = [];
              return;
            }
          });
          this.form.dateRange = [];
        } else {
          this.TimestampStart = moment($event[0]).format('YYYY-MM-DD');
          this.TimestampEnd = moment($event[1]).format('YYYY-MM-DD');
        }
      }
    },
    getdataShow(options) {
      const activeStatus = ['未知', '未开始', '进行中', '已关闭', '已结束'];
      dataShow(options).then(res => {
          console.log(res)
          const { data, code, msg } = res;
          if (code == 0) {
            const { activeDataVo, datas, shows } = data;
            const index = Number(activeDataVo.activeStatus);
            this.activeDataVo = activeDataVo;
            console.log(this.activeDataVo)
            this.activeStatus = activeStatus[index];
            let createTime;
            let showNumber;
            let joinNumber;
            showNumber = shows.map((val, i) => {
              return val.showNumberSum == '' ? 0 : val.showNumberSum;
            }).reverse();

            joinNumber = datas.map((val, i) => {
              return val.joinNumberSum == '' ? 0 : val.joinNumberSum;
            }).reverse();

            if (shows.length > datas.length) {
              createTime = shows.map((val, i) => {
                return val.createTime.slice(0);
              }).reverse();
            } else {
              createTime = datas.map((val, i) => {
                return val.createTime.slice(0);
              }).reverse();
            }


            // let shareNumber = datas.map((val, i) => {
            //   return val.shareNumberSum == '' ? 0 : val.shareNumberSum;
            // }).reverse();
            if (datas.length != shows.length) {
              const showscreateTime = shows.map((val, i) => {
                      return val.createTime.slice(0);
                    }).reverse();
              const datascreateTime = datas.map((val, i) => {
                      return val.createTime.slice(0);
                    }).reverse();
              const showsStrcreateTime = showscreateTime.join(',');
              const datasStrcreateTime = datascreateTime.join(',');
              for (let i = 0; i < datas.length; i++) {
                if (showsStrcreateTime.indexOf(createTime[i]) == -1) {
                  showNumber.splice(i, 0, 0)
                }
              }
              for (let i = 0; i < datas.length; i++) {
                if (datasStrcreateTime.indexOf(createTime[i]) == -1) {
                  joinNumber.splice(i, 0, 0)
                }
              }
            }
            let rows;
            rows = [];
            showNumber.forEach((val, i) => {
              rows[i] = {
                日期: createTime[i],
                展示量: showNumber[i],
                参与人数: joinNumber[i]
              }
            });
            this.chartsData = {
              columns: ['日期', '展示量', '参与人数'],
              rows,
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 返回完成率
    resultCompletionRate(item) {
      const { exchangeCount, joinCount } = item;
      if (Number.isFinite(exchangeCount) && Number.isFinite(joinCount)) {
        const count = exchangeCount / joinCount;
        if (count) {
          return Math.round(count * 100) + '%';
        } else {
          return '0%';
        }
      } else {
        return '0%';
      }
    },
    // 设置activityId
    setActivityId() {
      const { id } = this.$route.query;
      this.activityId = id;
    },
    // 查询按钮点击
    onQuery() {
      const options = {
        activeId: this.$route.query.id,
        beginTime: this.TimestampStart ? this.TimestampStart : '',
        endTime: this.TimestampEnd ? this.TimestampEnd : ''
      };

      this.getdataShow(options);
    },
    // 页面变化
    pageChange(pageNum) {
      this.pageNum = pageNum;
      const options = {
        activeId: this.$route.query.id,
        pageNum,
        pageSize,
        beginTime: this.form.dateRange
          ? new Date(this.form.dateRange[0]).format('YYYY-MM-dd')
          : '',
        endTime: this.form.dateRange
          ? new Date(this.form.dateRange[1]).format('YYYY-MM-dd')
          : ''
      };
      this.getActivityStatistics();
    },
  }
}
</script>

<style lang="scss" scoped>
.dataView {
  .dataTotal {
    height: 70px;
    width: 100%;
    border: solid 1px #e4e7ed;
    font-size: 14px;
    margin-bottom: 20px;

    & > ul {
      width: 100%;
      height: 100%;

      & > li {
        float: left;
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        border-right: 1px solid #ddd;

        & > div {
          width: 100%;
          text-align: center;
          height: 30px;

          & > p {
            margin-top: -10px;
          }
          .num {
            font-size: 17px;
            color: #409eff;
          }
        }
      }
    }
  }

  #echartViews {
    width: 100%;
    height: 355px;
    margin: 0 auto;
  }
}

.container {
  .top {
    padding: 15px;
    border: solid 1px #e4e7ed;
    margin-bottom: 15px;
    color: #5e6d82;
    & > ul > li {
      padding-bottom: 10px;
      list-style: none;
      & > span {
        padding-right: 10px;
      }
    }
  }
  .dataTab {
    width: 100%;
    height: 88px;
    background-color: #f5f5f5;
    border: solid 1px #e4e7ed;
    font-size: 14px;

    & > ul {
      width: 100%;
      height: 100%;

      & > li {
        float: left;
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        border-right: 1px solid #ddd;
        & > div {
          width: 100%;
          text-align: center;
          height: 30px;

          & > p {
            margin-top: -10px;
          }
        }
      }
    }
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

        &:first-of-type {
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
.num {
  font-size: 24px;
  color: #409eff;
  padding-bottom: 3px;
}
</style>
