<template>
  <div>
    <el-dialog title="通知接收人数" :visible.sync="dialogTableVisible" :before-close="cancelDialog" width="80%">
      <div><el-button type="primary" @click="addMethod">新增接收人</el-button></div>
      <el-table :data="tableData" @selection-change="handleSelectionChange" height="350">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
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
          prop="store"
          label="所属分销商">
          <template slot-scope="scope">
            <el-select placeholder="所属分销商" v-model="scope.row.store" style="width: 130px;">
              <el-option
                v-for="item in allShop"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          class="remark-class"
          prop="remark"
          label="备注信息">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="添加时间">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作">
          <template slot-scope="scope">
            <span class="re-span" @click="deleteEvent(1, scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="remove-box"><el-button type="primary" @click="deleteMethod">批量移除</el-button></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="goDialog">确 定</el-button>
      </span>
      <p>*温馨提示：接收微信模版消息推送需平台绑定公众号</p>
    </el-dialog>
    <el-dialog
      title="温馨提示"
      :visible.sync="tipVisible"
      width="30%"
      center>
      <p style="text-align: center">{{deleteType === 1 ? '确定删除吗?' : '确定批量移除吗?'}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipVisible = false">取 消</el-button>
        <el-button type="primary" @click="okDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { queryNoticeUserList, saveOrUpdateNoticeUser, queryShopList, delNoticeUser } from '@/api/system-set';
@Component({
})
export default class AddRecevice extends Vue {
  @Prop(Boolean) dialogTableVisible!: boolean;
  // 是否刷新标识
  @Prop(Boolean) isFresh!: boolean;
  private shopValue: string = ''
  // 选中后的数据
  private multipleSelection = []
  // 批量移除提示框
  private tipVisible: boolean = false;
  // 单个删除事件id
  private deleteId: any = null;
  // 单个删除事件标识 1
  private deleteType: any = null;
  private tableData: any = [];
  private formInline = {
    inputValue: ''
  }
  private allShop: any = []
  @Watch('dialogTableVisible')
  onChangeValue(newVal: boolean, oldVal: boolean) {
    if (newVal) {
      this.queryNoticeUserList();
      this.queryShopListFun();
    }
  }
  @Watch('isFresh')
  onChange(newVal: boolean) {
    this.queryNoticeUserList();
    this.queryShopListFun();
  }
  // 查询所属店铺
  private async queryShopListFun() {
    const data: any = await queryShopList({});
    this.allShop = data.data && data.data.length > 0 ? data.data.map((item: any) => {
      return {
        value: item.shopName,
        label: item.shopName
      }
    }) : []
    if (this.allShop.length > 0) {
      this.allShop.unshift({
        value: '',
        label: '所有分销商'
      })
    }
  }
  // 查询通知用户
  private async queryNoticeUserList() {
    const param = {
      noticeType: 'STOCK_WARNING'
    }
    const data: any = await queryNoticeUserList(param);
    this.tableData = data.data && data.data.length > 0 ? data.data.map((item: any) => {
      return {
        avator: item.headImgUrl,
        nickName: item.nickName,
        isGuan: item.isFollow === 1 ? '是' : '否',
        phone: item.userPhone,
        time: item.createTime,
        store: item.shopName,
        remark: item.remark,
        id: item.id,
        noticeType: item.noticeType,
        openId: item.openId
      }
    }) : []
  }
  // 删除通知用户
  private async delNoticeUserFun(type: number, id: any) {
    // 单条删除
    const params = {
      idList: type === 1 ? [id] : id
    }
    const data: any = await delNoticeUser(params);
    this.$message.success('删除成功')
    // 刷新列表
    this.$emit('fresh')
    // 关闭弹框
    this.tipVisible = false;
    this.queryNoticeUserList();
  }
  // 取消事件
  private cancelDialog() {
    this.$emit('cancelDialog')
  }
  // 新增接收人事件
  private addMethod() {
    this.$emit('addMethod')
  }
  // 复选框方法
  private handleSelectionChange(val: any) {
    this.multipleSelection = val;
  }
  // 单个删除事件
  private deleteEvent(type: any, id: any) {
    this.deleteType = type;
    this.deleteId = id;
    this.tipVisible = true;
  }
  // 批量移除事件
  private deleteMethod() {
    if (this.multipleSelection.length <= 0) {
      this.$message.warning('请选择要移除的数据');
      return
    }
    this.deleteType = 0;
    this.tipVisible = true;
  }
  // 批量移除提示框确定
  private okDialog() {
    if (this.deleteType === 1) {
      this.delNoticeUserFun(this.deleteType, this.deleteId);
    } else {
      const id = this.multipleSelection.map((item: any) => {
        return item.id;
      })
      this.delNoticeUserFun(0, id)
    }
  }
  // 弹窗确定事件
  private async goDialog() {
    const params = this.tableData.length > 0 ? this.tableData.map((item: any) => {
      return {
        id: item.id,
        noticeType: item.noticeType,
        openId: item.openId,
        remark: item.remark,
        shopName: item.store
      }
    }) : []
    await saveOrUpdateNoticeUser(params);
    this.$message.success('保存成功');
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
.re-span {
  color: #1B72F6;
  text-decoration: underline;
  cursor: pointer;
}
.remove-box {
  margin: 20px 0;
}
/deep/ .el-table {
  .has-gutter {
    tr {
      background: #f5f7fa;
    }
  }
}
/deep/ .el-dialog__body {
  padding-top: 10px;
}
.remark-span {
  padding: 6px;
  border: 1px solid #d7d7d7;
  border-radius: 4px;
}
</style>