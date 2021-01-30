<template>
  <div class="activity">
    <el-dialog :visible.sync="dialogTableVisible" width="760px" :before-close="handleClose">
      <div class="top-case">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
          <el-form-item label="活动状态">
            <el-select v-model="formInline.region" placeholder="全部状态">
              <el-option label="全部状态" value="0"></el-option>
              <el-option label="进行中" value="2"></el-option>
              <el-option label="已结束" value="3"></el-option>
              <el-option label="未开始" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.numOrName" placeholder="请输入活动编号/名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
          </el-form-item>
          <el-form-item v-show="swtichAll">
            <el-button
              style="background-color: rgba(230, 162, 60, 1); color: #fff;"
              @click="handleAll"
            >切换全部活动数据</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="gridData" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
        <el-table-column property="activityNum" label="活动编号" width="200"></el-table-column>
        <el-table-column property="activityName" label="活动名称"></el-table-column>
        <el-table-column property="activityStatus" label="活动状态" width="150">
          <template slot-scope="scope">
            <span
              v-if="scope.row.activityStatus == 2"
              style="color: rgba(32, 211, 114, 0.952941176470588)"
            >进行中</span>
            <span v-else-if="scope.row.activityStatus == 3">已结束</span>
            <span v-else style="color: #E6A23C;">未开始</span>
          </template>
        </el-table-column>
        <el-table-column property="address" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="text-decoration: underline;"
              @click="handleSwitch(scope.row)"
            >切换</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { searchActivityList } from '@/api/super-mkt/activity-set/fission';
@Component({
  components: {},
})
export default class Activity extends Vue {
  @Prop() dialogTableVisible!: boolean;
  @Prop() swtichAll!: boolean;

  gridData = [];

  formInline = {
    numOrName: '',
    region: '0',
  };

  currentPage4 = 1;

  pageSize = 8;

  total = 0;

  private mounted() {
    this.getAllActivity();
  }

  private trans(arr: any) {
    const l = arr;
    const result: any = [];
    l.map((item: any) => {
      const obj: any = {};
      (obj.activityNum = item.distributionNo),
        (obj.activityName = item.title),
        (obj.activityStatus = item.status);
      obj.activityId = item.id;
      result.push(obj);
    });
    return result;
  }

  private getAllActivity() {
    const params = {
      params: {
        status:
          Number(this.formInline.region) === 0
            ? ''
            : Number(this.formInline.region),
        distributionId: '',
        title: this.formInline.numOrName,
      },
      page: {
        pageSize: this.pageSize,
        pageNum: this.currentPage4,
      },
    };
    searchActivityList(params).then((res: any) => {
      const { list, total } = res.data;
      this.gridData = this.trans(list);
      this.total = total;
    });
  }

  private onSubmit() {
    this.getAllActivity();
  }

  private handleSizeChange() {
    console.log('ha');
  }

  private handleCurrentChange(val: number) {
    this.currentPage4 = val;
    this.getAllActivity();
  }

  private handleAll() {
    this.handleClose();
    this.$emit('switchAll');
  }

  private handleClose() {
    this.$emit('update:dialogTableVisible', false);
    this.formInline = {
      numOrName: '',
      region: '0',
    };
  }

  private handleSwitch(val: any) {
    this.$emit('switch', val);
    this.handleClose();
  }
}
</script>


<style lang="scss">
.activity {
  /deep/ .el-dialog__headerbtn {
    top: 44px;
    font-size: 24px;
  }
  .top-case {
    display: flex;
    justify-content: space-between;
    margin-top: -20px;
  }
  .block {
    margin-top: 40px;
    text-align: right;
  }
}
</style>