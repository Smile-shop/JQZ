<template>
  <div class="notification-set">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="code"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="通知名称"
        width="180">
        <template slot-scope="scope">
          {{scope.row.name}}
          <el-tooltip content="当赠品线上库存等于或低于设置预警值时（JMP「赠品上架」中设置），将推送此通知。" placement="top">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="通知类型">
      </el-table-column>
      <el-table-column
        prop="wxTitile"
        label="微信模版标题">
      </el-table-column>
      <el-table-column
        prop="wxId"
        label="微信模版id">
      </el-table-column>
      <el-table-column
        prop="recevice"
        align="center"
        label="通知接收人数">
        <template slot-scope="scope">
          <span class="re-span" @click="notification">{{scope.row.recevice}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="opertion"
        align="center"
        label="操作">
        <template>
          <span class="re-span" @click="addRecevice">新增接收人</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
        <template slot-scope="scope">
          <el-switch
            class="switch-box"
            style="display: inline-block"
            v-model="scope.row.isOpen"
            active-color="#13ce66"
            active-text="开启"
            active-value=1
            inactive-value=0
            @change="switchChange(scope.row.id, scope.row.isOpen)"
            >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column>
        <span class="look-span" @click="goLook">查看示例</span>
      </el-table-column>
    </el-table>
    <!-- 查看示例弹框 -->
    <el-dialog :visible.sync="lookResult" class="look-wrapper" width="25%">
      <p>赠品线上库存即将不足！剩余库存5件</p>
      <div class="look-box">
        <p><span class="tip-span">提醒事项：18k戒指</span></p>
        <p><span class="tip-span">关联联系人：小李</span></p>
      </div>
      <p class="tip-span">结尾语：</p>
      <p>请注意及时补货！</p>
    </el-dialog>
    <add-recevice :dialogTableVisible="receviceVisible" @cancelDialog="receviceDia" @addConfirm="addConfirm"></add-recevice>
    <notification-dialog :isFresh="isFresh" :dialogTableVisible="notificationVisible" @fresh="getTemplateByWarningStockFun" @addMethod="addRecevice" @cancelDialog="notificationDialog"></notification-dialog>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getTemplateByWarningStock, updateTemplateisOpen } from '@/api/system-set';
import { Col } from 'element-ui';
import addRecevice from './add-recevice.vue'
import notificationDialog from './notification-dialog.vue'
@Component({
  components: {
    addRecevice,
    notificationDialog
  }
})
export default class MsgValidate extends Vue {
  private receviceVisible = false;
  private notificationVisible = false;
  // 是否刷新标识
  private isFresh = false;
  private lookResult = false;
  private tableData = [
    // {
    //   code: '01',
    //   name: '赠品线上库存预警',
    //   type: '商家通知',
    //   wxTitile: '礼品库存预警',
    //   wxId: 'opentm89387948',
    //   recevice: '3',
    //   status: true
    // }
  ];
  private mounted() {
    this.getTemplateByWarningStockFun()
  }
  // 查询库存预警通知列表
  private async getTemplateByWarningStockFun() {
    const data: any = await getTemplateByWarningStock({});
    this.tableData = data.data && data.data.length > 0 ? data.data.map((item: any, index: any) => {
      return {
        code: '0' + parseInt(index + 1, 10),
        id: item.id,
        name: '赠品线上库存预警',
        type: '商家通知',
        wxTitile: item.title,
        wxId: item.tmNum,
        recevice: item.bindCount,
        isOpen: (item.isOpen).toString()
      }
    }) : []
  }
  // 打开新增接收人弹框
  private addRecevice() {
    this.receviceVisible = true;
    this.isFresh = false;
  }
  // 取消新增接收人弹框
  private receviceDia() {
    this.receviceVisible = false;
  }
  // 打开通知人数弹框
  private notification() {
    this.notificationVisible = true;
  }
  // 关闭通知人数弹框
  private notificationDialog() {
    this.notificationVisible = false;
  }
  // switch事件
  private async switchChange(id: any, val: any) {
    const param = {
      id: parseInt(id, 10),
      isOpen: val
    }
    await updateTemplateisOpen(param);
    val === '1' ? this.$message.success('开启成功') : this.$message.success('关闭成功');
  }
  // 新增接收人弹框确定
  private addConfirm() {
    // 关闭弹框
    this.receviceVisible = false;
    // 刷新查询库存预警通知列表
    this.getTemplateByWarningStockFun();
    this.isFresh = true;
  }
  // 查看示例
  private goLook() {
    this.lookResult = true;
  }
}
</script>

<style lang="scss" scoped>
.notification-set{
  .re-span {
    color: #1B72F6;
    text-decoration: underline;
    cursor: pointer;
  }
  .switch-box {
    height: 24px;
    line-height: 24px;
  }
  .look-span {
    color: #67C23A;
    cursor: pointer;
  }
  .look-box {
    margin: 20px 0;
  }
  .tip-span {
    color: #E40000;
  }
  /deep/ .look-wrapper {
    .el-dialog__body {
      padding-top: 0;
    }
  }
}
</style>
