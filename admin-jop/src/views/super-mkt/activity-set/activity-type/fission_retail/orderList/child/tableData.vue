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
                  <img src="@/assets/images/super-mkt/fission_retail/avatar.png" alt />
                </div>
              </el-image>
            </div>
            <span>{{scope.row.nickname || '--'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="支付金额" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.payAmount || "--" | money(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.payStatus | payStatus}}</div>
        </template>
      </el-table-column>
      <el-table-column label="一级返现" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.oneCommission || '--' | money(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="直接上级" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.directSuperiorName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="二级返现" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.twoCommission || '--' | money(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="间接上级" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.indirectSuperiorName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="核销状态" min-width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.payStatus == 2">
            --
          </div>
          <div v-else-if="scope.row.payStatus == 1 && scope.row.verifyStatus == 2">
            已核销
          </div>
          <div v-else>
            未核销
          </div>
          <!-- <div>{{ scope.row.payStatus == 2 || scope.row.verifyStatus == 1 ? '--' : '已核销' }}</div> -->
        </template>
      </el-table-column>
      <el-table-column label="渠道来源" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.channelName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="兑换门店" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.shopName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" min-width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.payTime || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="130">
        <template slot-scope="scope">
          <slot name="action" :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component({
  filters: {
    payStatus(val: string | number) {
      switch (val) {
        case '2':
          return '未支付';
          break;
        case '1':
          return '已支付';
          break;
        default:
          return '--';
          break;
      }
    }
  },
})
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
        text-align: center;
        img {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
</style>
