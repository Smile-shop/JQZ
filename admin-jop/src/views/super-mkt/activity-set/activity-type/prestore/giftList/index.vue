<template>
  <div class="gift-wrap">
    <el-form class="demo-form-inline">
      <el-form-item>
        <switch-activity :activityName="activityName" @click="dialogTableVisible=true" />
      </el-form-item>
    </el-form>
    <el-table :data="tableData">
      <el-table-column label="图片" min-width="120" prop="img">
        <template slot-scope="scope">
          <div style="width: 60px; height: 60px;">
            <img :src="scope.row.img" alt="" style="width: 100%">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="礼品名称" min-width="120" prop="giftName">
        <template slot-scope="scope">
          <span>{{scope.row.giftName ? scope.row.giftName : '——'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="礼品线上名称" min-width="120" prop="giftLineName">
        <template slot-scope="scope">
          <span>{{scope.row.giftLineName ? scope.row.giftLineName : '——'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预存金额" min-width="120" prop="money">
        <template slot-scope="scope">
          <span>{{scope.row.money ? scope.row.money : '——'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="线上库存" prop="stockOnLine">
        <template slot-scope="scope">
          <span>{{scope.row.stockOnLine ? scope.row.stockOnLine : '——'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计预存" prop="sumStock">
        <template slot-scope="scope">
          <span>{{scope.row.sumStock ? scope.row.sumStock : '——'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="待兑换"  prop="waitChange">
        <template slot-scope="scope">
          <span>{{scope.row.waitChange ? scope.row.waitChange : '——'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="待领取"  prop="waitGet">
        <template slot-scope="scope">
          <span>{{scope.row.waitGet ? scope.row.giftName : '——'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已领取"  prop="Getted">
        <template slot-scope="scope">
          <span>{{scope.row.Getted ? scope.row.Getted : '——'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已过期" min-width="120" prop="exir">
        <template slot-scope="scope">
          <span>{{scope.row.exir ? scope.row.exir : '——'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" min-width="120" prop="exirTime">
        <template slot-scope="scope">
          <span>{{scope.row.exirTime ? scope.row.exirTime : '——'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin-top: 20px">
      <el-pagination
        v-show="total > 0"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="page.pageSize"
        @size-change="getList"
        @current-change="getList"
        :current-page.sync="page.pageNum"
        :total="total"
      ></el-pagination>
    </div>
    <activity :dialogTableVisible.sync="dialogTableVisible" @switch="handleSwitch" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import switchActivity from '../component/switch-activity.vue';
import activity from '../component/activity.vue';
@Component({components: {
    switchActivity,
    activity
  }
})
export default class GiftList extends Vue {
  private activityName: string = '';
  private dialogTableVisible: boolean = false;
  private page = { pageNum: 1, pageSize: 10 };
  private total = 30;
  private tableData = [
    {
      img: 'http://www.jqzjop.com/ftp_images/01/null/6afd176771d6435f.jpg',
      giftName: 'au750戒指',
      giftLineName: 'au750戒指，限时兑换',
      money: '9.9',
      stockOnLine: 30,
      sumStock: 25,
      waitChange: 6,
      waitGet: 5,
      Getted: 10,
      exir: 3,
      exirTime: '2020-03-23 18:59:59'
    },
    {
      img: 'http://www.jqzjop.com/ftp_images/01/null/6afd176771d6435f.jpg',
      giftName: 'au750戒指',
      giftLineName: 'au750戒指，限时兑换',
      money: '9.9',
      stockOnLine: 30,
      sumStock: 25,
      waitChange: 6,
      waitGet: 5,
      Getted: 10,
      exir: 3,
      exirTime: '2020-03-23 18:59:59'
    }
  ]
  private getList() {
    console.log(this.page.pageNum)
  }
  private handleSwitch(val: any) {
    // this.page.pageNum = 1;
    this.activityName = val.activityName;
    // this.form.distributionId = val.activityId;
    // this.countOrderRecord();
    // this.pageQueryChannel();
    // this.getVerifierForOrder(this.form.distributionId);
  }
}
</script>

<style lang="scss">

</style>