<template>
  <div class="operation">
    <!-- 聊天功能开关 -->
    <div class="message-right" style="margin-left: 0;">
      <div class="opertion-content">
        <div class="content-item">
          <p class="content-title">敏感信息设置</p>
          <el-checkbox label="拨打电话功能" true-label="1" false-label="0" v-model="checkList.phone"></el-checkbox>
          <el-checkbox label="查看消费记录" true-label="1" false-label="0" v-model="checkList.selectConsumeRecord"></el-checkbox>
        </div>

        <div class="content-item">
          <p class="content-title">其他操作</p>
            <el-checkbox label="发送短信" true-label="1" false-label="0" v-model="checkList.sendSms"></el-checkbox>
            <el-checkbox label="邀请评价" true-label="1" false-label="0" v-model="checkList.inviteReviews"></el-checkbox>
            <el-checkbox label="添加标签" true-label="1" false-label="0" v-model="checkList.addFlag"></el-checkbox>
            <el-checkbox label="跟进记录" true-label="1" false-label="0" v-model="checkList.followRecord"></el-checkbox>
            <el-checkbox label="会员邀请" true-label="1" false-label="0" v-model="checkList.memberInvite"></el-checkbox>
        </div>

        <div class="title">批量功能开关</div>
        <div class="content-item">
          <p class="content-title">发送消息</p>
          <el-checkbox label="批量发送微信模板消息" true-label="1" false-label="0" v-model="checkList.sendWxTemplateByBatch"></el-checkbox>
          <el-checkbox label="批量发送短信消息" true-label="1" false-label="0" v-model="checkList.sendSmsByBatch"></el-checkbox>
        </div>
        <el-button type="primary" class="message-btn" @click="setSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getMemberOperatSetInfo, patchMemberOperatSetInfo } from '@/api/system-set';

@Component({
})
export default class PoolCount extends Vue {
  private checkList: any = {
    phone: '0',
    selectConsumeRecord: '0',
    sendSms: '0',
    inviteReviews: '0',
    addFlag: '0',
    followRecord: '0',
    sendWxTemplateByBatch: '0',
    sendSmsByBatch: '0',
    memberInvite: '0',
  };
  private dateInput: string = '';
  private activeName: string = 'first';
  private img: any = require('@/assets/images/android/czgn.png');
  private mounted() {
    // 查询
    this.getSetInfo();
  }
  // 查询
  private getSetInfo() {
    getMemberOperatSetInfo().then((res: any) => {
      if (res.code === 0) {
        if (res.data) {
          this.checkList = res.data ? res.data : {};
        }
      } else {
        this.$message.error(res.msg);
      }
    })
  }
  // 保存
  private setSave() {
    // const params = this.checkList;
    const params = {
      phone: this.checkList.phone,
      selectConsumeRecord: this.checkList.selectConsumeRecord,
      sendSms: this.checkList.sendSms,
      inviteReviews: this.checkList.inviteReviews,
      addFlag: this.checkList.addFlag,
      followRecord: this.checkList.followRecord,
      sendWxTemplateByBatch: this.checkList.sendWxTemplateByBatch,
      sendSmsByBatch: this.checkList.sendSmsByBatch,
      memberInvite: this.checkList.memberInvite
    }
    this.$confirm('您当前操作是所有APP账号批量操作，此处功能关闭功能后，所有APP账号均不可使用，且清除已选状态', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '返回',
      type: 'warning',
      center: true
    }).then(() => {
      patchMemberOperatSetInfo(params).then((res: any) => {
        if (res.code === 0) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getSetInfo();
        } else {
          this.$message.error(res.msg);
        }
      })
    })
  }
}
</script>


