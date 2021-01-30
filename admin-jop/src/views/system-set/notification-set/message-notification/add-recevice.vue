<template>
  <div>
    <el-dialog title="新增接收人数" :visible.sync="dialogTableVisible" :before-close="cancelDialog" width="80%">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input style="width: 400px" v-model="formInline.inputValue" placeholder="输入微信昵称/openid/会员注册手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryWxUserPageFun">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData">
        <el-table-column
          prop="avator"
          label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.avator" class="avator-c"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="微信昵称">
        </el-table-column>
        <el-table-column
          prop="isGuan"
          label="关注公众号">
          <template slot-scope="scope">
            <span :class="scope.row.isGuan === '否' ? 'isGuan' : ''">{{scope.row.isGuan}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="会员注册手机号码">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checkBoxValue"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { queryWxUserPage, saveOrUpdateNoticeUser } from '@/api/system-set';
@Component({
})
export default class AddRecevice extends Vue {
  @Prop(Boolean) dialogTableVisible!: boolean;
  private tableData = [];
  private formInline = {
    inputValue: ''
  }
  // 查询微信用户
  private async queryWxUserPageFun() {
    if (this.formInline.inputValue === '') {
      this.$message.error('请输入查询条件');
      return
    }
    const param = {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      params: {
        queryName: this.formInline.inputValue
      }
    }
    const data: any = await queryWxUserPage(param);
    this.tableData = data.data && data.data.list.length > 0 ? data.data.list.map((item: any) => {
      return {
        avator: item.avatarUrl,
        nickName: item.nickName,
        isGuan: item.isFollow === 1 ? '是' : '否',
        phone: item.mobile,
        openid: item.openid,
        checkBoxValue: false
      }
    }) : []

  }
  // 确定事件
  private async addConfirm() {
    const datas =  this.tableData.filter((p: any) => p.checkBoxValue);
    if (datas.length <= 0) {
      this.$message.error('请选择要操作的数据');
      return false;
    }
    const params = this.tableData.filter((p: any) => p.checkBoxValue).map((item: any) => {
      return {
        openId: item.openid,
        noticeType: 'STOCK_WARNING'
      }
    })
    await saveOrUpdateNoticeUser(params)
    this.$emit('addConfirm')
  }
  private cancelDialog() {
    this.tableData = [];
    this.formInline.inputValue = '';
    this.$emit('cancelDialog')
  }
}
</script>
<style lang="scss" scoped>
.avator-c {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
.isGuan {
  color: #E40000;
}
</style>