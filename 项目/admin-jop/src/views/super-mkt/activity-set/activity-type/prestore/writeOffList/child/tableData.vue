<template>
  <div class="tableData">
    <el-table
      class="table-content"
      :data="dataList"
      border
      style="width: 100%"
      @sort-change="sortData"
    >
      <el-table-column label="核销员昵称" min-width="130">
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
            <span>{{scope.row.nickName || '--'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属门店" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.shopName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.name || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.phone || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="verifyNum" label="累计核销数量" sortable="custom" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.verifyNum }}</div>
        </template>
      </el-table-column>
      <el-table-column label="职位" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.position || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.createTime | momentFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <slot name="action" :row="scope.row" />
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
        width: 40px;
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
