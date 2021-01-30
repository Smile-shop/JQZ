<template>
  <article class="position-table">
    <el-button type="primary" icon="el-icon-plus" @click="createPosition">新增职位</el-button>
    <el-table
      class="table-content"
      :data="accountList"
      border
      style="width: 100%"> 
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        prop="positionName" 
        label="职位名称"
        align="center"
        width="160">
        <template slot-scope="scope">
          <div v-if="scope.row.type === '1'">
            <span>{{ scope.row.positionName }}</span>
            <span style="color:#5cadff">( 系统职位 )</span>
          </div>
          <div v-else>{{ scope.row.positionName }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="accountNames"
        label="子账户"
        align="center">
      </el-table-column>
      <el-table-column
        prop="endTime"
        align="center"
        label="子账户绑定最后修改时间"
        width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.modifyTime | momentFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="260">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.type !== '1'"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleBind(scope.row)">绑定子账户</el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="scope.row.type !== '1'"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getAccountPositionList, toCreatePositionMethods, toUpdatePositionMethods, deletePositionMethods } from '@/api/system-set';
import user from '@/utils/user';

@Component({
})
export default class PositionTable extends Vue {
  private accountList = [];
  private newPosition = {
    name: '',
    id: ''
  }

  private mounted() {
    this.getAccountPositionList();
  }

  private getAccountPositionList() {
    getAccountPositionList({accountId: user.serverUser.account.accountId}).then((res: any) => {
      this.accountList = res.data ? res.data : [];
    })
  }

  private createPosition() {
    this.$prompt('', '新建-职位', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '职位',
      inputPattern: /\S/,
      inputErrorMessage: '职位不能为空！'
    }).then(({ value }: any) => {
      const params = {
        accountId: user.serverUser.account.accountId,
        positionName: value
      };
      toCreatePositionMethods(params).then((res: any) => {
        this.getAccountPositionList();
      })
    }).catch(() => {
      console.log('cancel')
    });
  }

  private handleEdit(item: any) {
    this.$prompt('', '编辑-职位', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '职位',
      inputPattern: /\S/,
      inputErrorMessage: '职位不能为空！',
      inputValue: item.positionName
    }).then(({ value }: any) => {
      const params = {
        accountId: user.serverUser.account.accountId,
        positionName: value,
        positionId: item.positionId
      };
      toUpdatePositionMethods(params).then((res: any) => {
        this.getAccountPositionList();
      })
    }).catch(() => {
      console.log('cancel')
    });
  }

  private handleBind(item: any) {
    this.$emit('posBind', item);
  }

  private handleDelete(item: any) {
    this.$confirm(`确定要删除${item.positionName}吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deletePositionMethods({ positionId: item.positionId }).then((res: any) => {
        this.getAccountPositionList();
      })
    }).catch(() => {
      console.log('cancel')
    });
  }
}
</script>

<style lang="scss" scoped>
.position-table {
  .table-content {
    margin-top: 20px;
  }
}
</style>
