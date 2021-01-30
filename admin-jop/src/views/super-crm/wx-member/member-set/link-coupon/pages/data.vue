<template>
  <div class="data">
    <el-table class="table-content" :data="sumData" border style="width: 100%">
      <el-table-column prop="dataType" label="数据类型" min-width="160"></el-table-column>
      <el-table-column prop="yesterday" label="昨日" min-width="160"></el-table-column>
      <el-table-column prop="week" label="本周" min-width="180"></el-table-column>
      <el-table-column prop="month" label="本月" min-width="160"></el-table-column>
      <el-table-column prop="count" label="累计" min-width="160"></el-table-column>
    </el-table>
    <div class="chart">
      <el-radio-group size="small" v-model="showType" @change="changeShow" class="chart-showType">
        <el-radio-button label="1">近7天</el-radio-button>
        <el-radio-button label="2">近一个月</el-radio-button>
      </el-radio-group>
      <ve-histogram
        :data="chartData"
        :settings="chartSettings"
        :extend="chartExtend"
        :colors="['#3aa1ff', '#19d4ae']"
      ></ve-histogram>
    </div>
    <el-table
      class="table-content"
      :data="activityList"
      border
      style="width: 100%; margin-top: 50px"
    >
      <el-table-column prop="couponName" label="券名称" min-width="160"></el-table-column>
      <el-table-column prop="giveNumber" label="送券数" min-width="160"></el-table-column>
      <el-table-column prop="getNumber" label="领取数" min-width="160"></el-table-column>
      <el-table-column prop="checkNumber" label="核销数" min-width="160"></el-table-column>
      <el-table-column prop="deductionAmount" label="抵扣金额" min-width="160"></el-table-column>
      <el-table-column prop="endTime" min-width="160">
        <template slot="header">
          <span>更多</span>
          <el-tooltip class="item" effect="dark" content="优惠券详细使用数据请到JMP优惠券管理模块查看" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-button size="small" @click="detail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { lookData } from '@/api/super-crm/wx-member';
import VeHistogram from 'v-charts/lib/histogram.common';
import moment from 'moment';

@Component({
  components: { VeHistogram },
})
export default class PositionManage extends Vue {
  private showType = '2';
  private chartExtend = {
    series(v: any) {
      if (v) {
        v.forEach((i: any) => {
          i.barGap = '0%';
          i.barWidth = 20;
        });
        return v;
      }
    },
  };
  private chartSettings = {
    labelMap: {
      date: '日期',
      PV: 'H5领券页面访问量（PV）',
      UV: 'H5领券页面访问用户数（UV）',
    },
  };
  private weekData = {};
  private monthData = {};
  private chartData = {};
  private sumData = [];
  private activityList = [];
  private created() {
    this.getData(this.$route.query.activityId);
  }
  private changeShow(val: any) {
    if (val === '1') {
      this.chartData = this.weekData;
    } else if (val === '2') {
      this.chartData = this.monthData;
    }
  }

  private async getData(activityId: any) {
    const res: any = await lookData({ activityId });
    const { code, data } = res;
    if (!code) {
      (this.sumData as any).push(
        Object.assign({}, data.dataPV, {
          dataType: 'H5领券页面访问量',
        }),
        Object.assign({}, data.dataUV, {
          dataType: 'H5领券页面访问用户数',
        })
      );
    }
    this.activityList = data.activityList;
    this.weekData = this.sortData(
      data.dataCartogramByWeekByUV.concat(data.dataCartogramByWeekByPV) || []
    );
    this.monthData = this.sortData(
      data.dataCartogramByMonthByUV.concat(data.dataCartogramByMonthByPV) || []
    );
    console.log(this.weekData, this.monthData);
    this.chartData = this.monthData;
  }
  private sortData(data: any) {
    const obj: any = {};
    const newArr: any[] = [];
    data.forEach((item: any) => {
      // item.accessDate = moment(item.accessDate).format('YYYY-MM-DD');
      // 根据对象的属性是唯一的，将值作为对象的属性名
      if (!obj[item.accessDate]) {
        const arr: any = [];
        arr.push(item);
        newArr.push(arr);
        obj[item.accessDate] = item;
      } else {
        newArr.forEach((value: any, index: number) => {
          // 如果已经存在  就循环新组的值将值插入属性相同的数组里   为了防止重复添加   只要和第一个比较就可以了
          if (value[0].accessDate == item.accessDate) {
            value.push(item);
          }
        });
      }
    });
    const n: any[] = [];
    newArr.forEach((item: any) => {
      const o: any = {};
      item.forEach((ii: any) => {
        o.date = ii.accessDate;
        if (item.length == 2) {
          if (ii.accessType == 1) {
            o.PV = ii.count;
          } else {
            o.UV = ii.count;
          }
        } else {
          if (ii.accessType == 1) {
            o.PV = ii.count;
            o.UV = 0;
          } else if (ii.accessType == 2) {
            o.UV = ii.count;
            o.PV = 0;
          }
        }
      });
      n.push(o);
    });
    n.sort((a: any, b: any) => {
      return moment(a.date).valueOf() - moment(b.date).valueOf();
    });
    const newData = {
      columns: ['date', 'PV', 'UV'],
      rows: n,
    };
    return newData;
  }
  private detail(item?: any) {
    this.$router.push({
      path: '/super-crm/wx-member/member-set/link-coupon/dataDetail',
      query: {
        ticketId: item.ticketId,
        activityId: this.$route.query.activityId,
        couponName: item.couponName,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.data {
  .chart {
    margin-top: 50px;
    &-showType {
      position: relative;
      float: right;
      z-index: 100;
      margin-right: 10px;
    }
  }
}
</style>
