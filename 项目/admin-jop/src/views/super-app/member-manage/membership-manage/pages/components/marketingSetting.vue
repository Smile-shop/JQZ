<template>
  <div class="operation">
    <!-- 聊天功能开关 -->
    <div class="message-right" style="margin-left: 0;">
      <div class="opertion-content">
        <div class="content-item">
          <p class="content-title">赠送操作设置</p>
          <div class="check-div">
            <el-checkbox label="赠送积分" true-label="1" false-label="0" v-model="checkList.giveIntegral"></el-checkbox>
            <div class="check-setting">
              <span class="check-tip">设置每个账号每月可赠送积分限额：</span>
              <el-input class="el-input-class giveIntegralLimit" maxlength="7" true-label="1" false-label="0" :disabled="checkList.giveIntegral === '0' ? true : false"  v-model.number="checkList.giveIntegralLimit" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input> ，
            </div>
            <div class="check-setting check-custom">
              <span class="check-tip">每个账号每月可赠送单个客户限额：</span>
              <el-input class="el-input-class giveIntegralNum" maxlength="7" true-label="1" false-label="0" :disabled="checkList.giveIntegral === '0' ? true : false" @blur="onChange"  v-model.number="checkList.giveIntegralSingle" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
            </div>
          </div>
          <div class="check-div">
            <el-checkbox label="赠送优惠券" true-label="1" false-label="0" v-model="checkList.giveCoupon"></el-checkbox>
            <div class="check-setting">
              <span class="check-tip">设置每个账号每月可赠送优惠券张数：</span>
              <el-input class="el-input-class giveCouponNum" maxlength="7" true-label="1" false-label="0" :disabled="checkList.giveCoupon === '0' ? true : false" v-model="checkList.giveCouponNum" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
            </div>
          </div>
        </div>
        <el-button type="primary" class="message-btn" @click="setSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getMemberOperatSetInfo, patchGiveOperatSetInfo } from '@/api/system-set';

@Component({
})
export default class PoolCount extends Vue {
  private checkList: any = {
    giveIntegral: '0',
    giveIntegralLimit: '',
    giveCouponNum: '',
    giveCoupon: '0',
    giveIntegralSingle: ''
  };
  private dateInput: string = '';
  private activeName: string = 'first';
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
  // 客户限额
  private onChange() {
    if (this.checkList.giveIntegralSingle > this.checkList.giveIntegralLimit) {
      this.$message.error('可赠送单个客户限额不能大于可赠送积分限额')
    }
    return
  }
  // 保存
  private setSave() {
    // const params = this.checkList;
    const params = {
        giveIntegral: this.checkList.giveIntegral,
        giveIntegralLimit: this.checkList.giveIntegralLimit,
        giveCouponNum: this.checkList.giveCouponNum,
        giveCoupon: this.checkList.giveCoupon,
        giveIntegralSingle: (this.checkList.giveIntegralSingle).toString()
    }
    if (this.checkList.giveIntegral === '1' && (this.checkList.giveIntegralLimit === '' || this.checkList.giveIntegralLimit == '0')) {
      this.$message.error('请设置每个账号每月可赠送积分限额');
      const docElem: any = document.querySelector('.giveIntegralLimit .el-input__inner');
      docElem.focus();
      return;
    }
    if (this.checkList.giveIntegral === '1' && (this.checkList.giveIntegralSingle === '' || this.checkList.giveIntegralSingle == '0')) {
      this.$message.error('请设置每个账号每月可赠送单个客户限额');
      const docElem: any = document.querySelector('.giveIntegralNum .el-input__inner');
      docElem.focus();
      return;
    }
    if (this.checkList.giveIntegralSingle > this.checkList.giveIntegralLimit) {
      this.$message.error('可赠送单个客户限额不能大于可赠送积分限额')
      const docElem: any = document.querySelector('.giveIntegralNum .el-input__inner');
      docElem.focus();
      return
    }
    if (this.checkList.giveCoupon === '1' && this.checkList.giveCouponNum === '') {
      this.$message.error('设置每个账号每月可赠送优惠券张数');
      const docElem: any = document.querySelector('.giveCouponNum .el-input__inner');
      docElem.focus();
      return;
    }
    this.$confirm('您当前操作是所有APP账号批量操作，此处功能关闭功能后，所有APP账号均不可使用，且清除已选状态', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '返回',
      type: 'warning',
      center: true
    }).then(() => {
      patchGiveOperatSetInfo(params).then((res: any) => {
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

