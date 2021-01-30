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
          {{activeStatus[activeDataVo.activeStatus]}}
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
        <li>
          <div>
            <p class="num">{{activeDataVo.shareNumberSum}}</p>
            <span>分享次数</span>
          </div>
        </li>
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
            @change="checkDate($event)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onQuery">查询</el-button>
        </el-form-item>
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
          <li>
            <div>
              <p class="num">{{activeDataVo.shareNumber}}</p>
              <span>分享次数</span>
            </div>
          </li>
        </ul>
      </div>

      <div id="echartViews">
        <ve-line :data="chartData"></ve-line>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    activeDataVo: {
      type: Object
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      activeStatus: ['未知', '未开始', '进行中', '已关闭', '已结束'],
      activityId: '',
      form: {
        dateRange: []
      },
      TimestampNowDate: '',
      TimestampStart: '',
      TimestampEnd: ''
    }
  },
  methods: {
    checkDate($event) {
      // 日期校验
      if (!$event) {
        this.TimestampStart = ''
        this.TimestampEnd = ''
      } else {
        const endTime = moment($event[1], 'YYYY-MM-DD HH:mm:ss').valueOf()
        this.TimestampNowDate = moment(
          new Date(),
          'YYYY-MM-DD HH:mm:ss'
        ).valueOf()
        if (endTime > this.TimestampNowDate) {
          this.$alert('不能大于当前时间', '日期选择有误', {
            confirmButtonText: '确定',
            callback: action => {
              return
            }
          })
          this.form.dateRange = []
        } else {
          this.TimestampStart = $event[0]
          this.TimestampEnd = $event[1]
        }
      }
    },
    onQuery() {
      const options = {
        activeId: this.$route.query.id,
        beginTime: this.TimestampStart ? this.TimestampStart : '',
        endTime: this.TimestampEnd ? this.TimestampEnd : ''
      }

      this.$emit('searchData', options)
    }
  }
}
</script>

<style lang="scss" scoped>
.dataView {
  .dataTotal {
    height: 70px;
    width: 100%;
    border: solid 1px #e4e7ed;
    border-top: none;
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
    border-bottom: none;
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
