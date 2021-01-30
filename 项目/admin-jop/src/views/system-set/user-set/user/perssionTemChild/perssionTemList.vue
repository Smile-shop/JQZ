<template>
  <article class="tem-list">
    <el-button type="primary" icon="el-icon-plus" @click="goDetail(1)">新增权限模板</el-button>
    <div style="font-size: 14px; color: #666; padding: 20px 0 0 0;">总共可创建100个模板，还可以创建{{100-total}}个模板</div>
    <el-table
      class="table-content"
      :data="temList"
      border
      style="width: 100%"> 
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80">
      </el-table-column>
      <!-- <el-table-column
        prop="templateCode" 
        label="权限模板编号"
        min-width="160">
      </el-table-column> -->
      <el-table-column
        prop="templateName"
        label="权限模板名称"
        min-width="160">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="创建时间"
        min-width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.createTime | momentFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="更新时间"
        min-width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.modifyTime | momentFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="del(scope.row)">删除</el-button>
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
        @size-change="getTemList"
        @current-change="getTemList"
        :current-page.sync="page.pageNum" 
        :total="total">
      </el-pagination>
    </div>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { listPermissionsTemplates, deletePermissionsTemplates } from '@/api/system-set';

@Component({
})
export default class TemList extends Vue {
  private temList = []
  private total = 0
  private page = {pageNum: 1, pageSize: 10}

  private created() {
    this.getTemList()
  }
  private async getTemList() {
    const res = await listPermissionsTemplates({page: this.page})
    this.total = res.data.total || 0
    this.temList = res.data.list
  }
  private handleEdit(item: any) {
    if (this.total >= 100) {return this.$message.error('最多只能添加100个')}
    this.$emit('temId', item.id)
    this.goDetail()
  }
  private goDetail(type?: number) {
    if (this.total >= 100 && type) {
      return this.$message.error('最多只能添加100个模板')
    }
    this.$emit('change', { comName: 'TemDetail', type })
  }
  private del(item: any) {
    this.$confirm(`是否确定删除${item.templateName}吗？`, '信息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deletePermissionsTemplates({ permissionsTemplatesId: item.id }).then((res: any) => {
        if (!res.code) {
          this.$message.success(res.msg)
          this.getTemList()
        }
      })
    }).catch(() => {
      console.log('cancel')
    });
  }
}
</script>

<style lang="scss" scoped>
.tem-list {
  .table-content {
    margin-top: 20px;
  }
}
</style>
