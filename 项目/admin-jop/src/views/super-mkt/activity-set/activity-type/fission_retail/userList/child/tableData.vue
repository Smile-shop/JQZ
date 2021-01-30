<template>
  <div class="tableData">
    <el-table
      class="table-content"
      :data="dataList"
      border
      style="width: 100%"
      @sort-change="sortData"
    >
      <el-table-column label="用户昵称" min-width="120">
        <template slot-scope="scope">
          <div class="nick">
            <div class="imgBox">
              <el-image :src="scope.row.headimgUrl" style="width: 100%; height: 100%">
                <div
                  slot="error"
                  class="image-slot"
                  style="display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        background: #f5f7fa;
                        color: #909399;"
                >
                  <img src="@/assets/images/super-mkt/fission_retail/avatar.png" alt="">
                </div>
              </el-image>
            </div>
            <span>{{scope.row.nickname || '--'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="邀请人数" prop="inviteUserNum" sortable="custom" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.inviteUserNum || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="分销订单" prop="orderNum" sortable="custom" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.directOrderNum + scope.row.indirectOrderNum || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="一级订单" prop="directOrderNum" sortable="custom" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.directOrderNum || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="二级订单" prop="indirectOrderNum" sortable="custom" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.indirectOrderNum || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="已到账" prop="arrivedAmount" sortable="custom" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.arrivedAmount || '--' | money(2)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="已提现" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.withdrawedAmount || '--' | money(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="待提现" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.nonwithdrawAmount || '--' | money(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="渠道来源" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.channelName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="所属门店" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.shopName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="会员卡号" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.memberCard || '--' }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component({})
export default class SumCard extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: [],
  })
  dataList!: any;

  sortData(column: any) {
    this.$emit('sortData', column);
  }
}
</script>

<style lang="scss" scoped>
.tableData {
  .table-content {
    margin-top: 20px;
    .nick {
      display: flex;
      align-items: center;
      .imgBox {
        min-width: 40px;
        max-width: 40px;
        height: 40px;
        border-radius: 40px;
        border: 1px solid #eee;
        overflow: hidden;
        margin-right: 5px;
        img {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
</style>


