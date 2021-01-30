<template>
  <div class="withdrawList">
    <el-form>
      <el-form-item label="每日10:00前完成数据更新"></el-form-item>
      <el-form-item label="交易时间">
        <el-date-picker
          size="small"
          type="daterange"
          v-model="time"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @focus="focus"
          style="width: 250px;"
        />
        <span style="font-size: 14px; color: #606266;margin-left: 20px;">对账单接口只能下载三个月以内的账单</span>
      </el-form-item>
      <el-form-item label="账单类型">
        <el-radio size="small" :label="1" v-model="type">交易账单</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="down">下载微信对账单</el-button>
      </el-form-item>
      <el-dialog title="提示" center :visible.sync="dialogVisible" width="300px">
        <div class="loading">
          <i class="iconfont icon-loading loading-icon"></i>
          <div class="loading-text">数据加载中，请稍等, {{countTime}}s</div>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template> 

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class WithdrawList extends Vue {
  type: number = 1;
  time: any = [];
  duration: any = [];
  pickerOptions: any = {};
  dialogVisible: boolean = false;
  countTime: number = 15;
  timer: any = null;

  @Watch('dialogVisible')
  watchDialogVisible(val: boolean) {
    if (!val) {
      clearInterval(this.timer);
    }
  }
  down() {
    this.dialogVisible = true;
    this.countTime = 15;
    this.timer = setInterval(() => {
      if (this.countTime === 0) {
        clearInterval(this.timer);
        this.dialogVisible = false;
      } else {
        this.countTime--;
      }
    }, 1000);
  }
  focus() {
    this.duration = [];
    this.pickerOptions = {
      disabledDate: (time: any) => {
        if (this.duration.length) {
          const currentTime = this.duration[0];
          const start = currentTime.setMonth(currentTime.getMonth() - 3);
          const end = currentTime.setMonth(currentTime.getMonth() + 6);
          currentTime.setMonth(currentTime.getMonth() - 3);
          if (currentTime) {
            return time.getTime() > end || time.getTime() < start;
          }
        }
      },
      onPick: ({ minDate, maxDate }: any) => {
        // 当第一时间选中才设置禁用
        if (minDate && !maxDate) {
          this.duration[0] = minDate;
        }
        if (maxDate) {
          this.duration[1] = maxDate;
        }
      },
    };
  }
}
</script>
<style lang="scss" scoped>
.loading {
  &-icon {
    display: flex;
    justify-content: center;
    color: #66b1ff;
    font-size: 50px;
    animation: 1s loading infinite;
  }

  &-text {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    font-size: 14px;
    font-weight: 400;
    color: #333;
  }
}

@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>