<template>
  <div class="withdrawList">
    <div class="form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item class="label">
          <switch-activity :activityName="activityName" @click="handleActivity" />
        </el-form-item>
        <el-form-item label="类型" style="margin-left: 120px;">
          <el-select v-model="formInline.region" placeholder="所有类型">
            <el-option label="全部类型" value="0"></el-option>
            <el-option label="奖励未到账" value="奖励未到账"></el-option>
            <el-option label="商家信息欺诈" value="商家信息欺诈"></el-option>
            <el-option label="商品与描述不符" value="商品与描述不符"></el-option>
            <el-option label="对我公司的意见和建议" value="对我公司的意见和建议"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈时间">
          <el-date-picker
            v-model="formInline.timer"
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button type="primary" size="small" @click="onSubmit">搜索</el-button>
      </div>
    </div>
    <div class="table">
      <el-table stripe :data="tableData" border style="width: 100%">
        <el-table-column prop="order" label="反馈单号" :formatter="format"></el-table-column>
        <el-table-column prop="nickName" label="活动编号" :formatter="format"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称" :formatter="format"></el-table-column>
        <el-table-column prop="type" label="类型" :formatter="format"></el-table-column>
        <el-table-column prop="content" label="内容">
          <template slot-scope="scope">
            <div class="overHidden">{{scope.row.content || '--'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" :formatter="format"></el-table-column>
        <el-table-column prop="phone" label="手机号码" :formatter="format"></el-table-column>
        <el-table-column prop="date" label="反馈时间" :formatter="format"></el-table-column>
        <el-table-column prop="createTime" label="操作">
          <template slot-scope="scope">
            <el-popover placement="left-start" width="400" v-model="scope.row.createTime">
              <p
                style="margin-bottom: 10px; margin-top: 15px; margin-left: 15px; font-size: 16px;"
              >反馈明细</p>
              <p style="margin: 0 15px; height: 100px; overflow: auto;">{{scope.row.detail}}</p>
              <div style="text-align: right; margin-top: 20px">
                <el-button type="primary" size="mini" @click="scope.row.createTime = false">确定</el-button>
              </div>
              <el-button
                slot="reference"
                type="text"
                size="small"
                @click="handleDetail(scope.row)"
              >查看明细</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <Activity
      :dialogTableVisible.sync="dialogTableVisible"
      :swtichAll="swtichAll"
      @switch="handleSwitch"
      @switchAll="handleSwitchAll"
    />
  </div>
</template> 

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Activity from '../component/activity.vue';
import { operation } from '@/api/super-mkt/activity-set/fission';
import switchActivity from '../component/switch-activity.vue';

@Component({
  components: {
    Activity,
    switchActivity,
  },
})
export default class ActivityFeedback extends Vue {
  formInline = {
    timer: '',
    region: '0',
  };

  activity: any = {
    activityName: '',
    activityNum: '',
    activityStatus: '',
    activityId: '',
  };

  activityName: string = '';

  tableData = [];

  currentPage4: number = 1;

  pageSize: number = 10;

  total: number = 0;

  dialogTableVisible: boolean = false;

  swtichAll: boolean = true;

  mounted() {
    this.requestList();
  }
  format(row: any, column: any, cellValue: any) {
    return cellValue || '--';
  }
  transformat(arr: any) {
    const l = arr;
    const result: any = [];
    l.map((item: any) => {
      const obj: any = {};
      (obj.order = item.id),
        (obj.nickName = item.nickName),
        (obj.type = item.type),
        (obj.content = item.detail),
        (obj.name = item.userName),
        (obj.phone = item.phone),
        (obj.date = item.createTime),
        (obj.detail = item.detail),
        result.push(obj);
    });
    return result;
  }

  requestList() {
    const params = {
      beginTime: this.formInline.timer ? this.formInline.timer[0] : '',
      distributionId: this.activity.activityId,
      endTime: this.formInline.timer
        ? this.endTimer(this.formInline.timer[1])
        : '',
      pageNum: this.currentPage4,
      pageSize: this.pageSize,
      type: Number(this.formInline.region) === 0 ? '' : this.formInline.region,
    };
    operation(params).then((res: any) => {
      const { list, total } = res.data;
      this.tableData = this.transformat(list);
      this.total = total;
    });
  }

  endTimer(time: any) {
    const all = time.split(' ');
    const result = all[0] + ' 23:59:59';
    return result;
  }

  onSubmit() {
    this.requestList();
  }

  handleSizeChange(val: number) {
    this.pageSize = val;
    this.requestList();
  }

  handleCurrentChange(val: number) {
    this.currentPage4 = val;
    this.requestList();
  }

  handleDetail(val: any) {
    // console.log('查看明细', val.detail)
  }

  handleActivity() {
    this.dialogTableVisible = true;
  }

  resetSearch() {
    this.formInline = {
      timer: '',
      region: '0',
    };

    this.activityName = '';
    this.currentPage4 = 1;
    this.pageSize = 10;
    this.total = 0;
  }

  handleSwitch(val: any) {
    this.resetSearch();
    const { activityName, activityNum, activityStatus } = val;
    this.activity = val;
    this.activityName = activityName;
    this.requestList();
  }

  private handleSwitchAll() {
    this.activity = {
      activityName: '',
      activityNum: '',
      activityStatus: '',
      activityId: '',
    };
    this.activityName = '';
    this.resetSearch();
    this.requestList();
  }
}
</script>

<style lang="scss" scoped>
.withdrawList {
  .form {
    display: flex;
    justify-content: space-between;
    .submit {
      margin-right: 60px;
    }
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
  .overHidden {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>