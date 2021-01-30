<template>
  <div class="tableData">
    <el-table
      class="table-content"
      :data="dataList"
      border
      style="width: 100%"
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
                  <img src="@/assets/images/super-mkt/fission_retail/avatar.png" alt />
                </div>
              </el-image>
            </div>
            <span>{{scope.row.nickname || '--'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员卡号" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.inviteUserNum || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="注册门店" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.directOrderNum + scope.row.indirectOrderNum || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账户余额" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.arrivedAmount | money(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.arrivedAmount | money(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="关注公众号状态" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.arrivedAmount | money(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="活动新增会员" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.withdrawedAmount || '--' | money(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="参与渠道" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.nonwithdrawAmount || '--' | money(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.channelName || '--' }}</div>
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


