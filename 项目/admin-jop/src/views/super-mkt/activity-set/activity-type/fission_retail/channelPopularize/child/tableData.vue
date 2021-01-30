<template>
  <div class="tableData">
    <el-table class="table-content" :data="dataList" border style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="120"></el-table-column>
      <el-table-column prop="endTime" label="渠道名称" min-width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.channelName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="操作">
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


