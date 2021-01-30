<template>
  <article class="basis-set">
    <el-form ref="form" :model="setModal" label-width="120px">
      <el-form-item label="设置时间：">
        <span class="info header">仅显示</span>
        <!-- <el-input style="width: 320px" v-model="form.name"></el-input> -->
        <el-date-picker
          v-model="setModal.time"
          style="width: 320px"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <span class="info footer">后的电子质保单</span>
      </el-form-item>
      <el-form-item label="设置显示数量：">
        <span class="info header">仅显示</span>
        <el-input style="width: 320px" type="number" v-model.number="setModal.number" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'></el-input>
        <span class="info footer">条</span>
      </el-form-item>
      <el-form-item label="显示评价按钮：">
        <el-switch v-model="setModal.orderEvaluate" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="评价送积分：">
        <el-input style="width: 375px" type="number" v-model.number="setModal.assessScore" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'></el-input>
        <span class="footer-info footer">(0为不增送)</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitConsumeInfo">保存</el-button>
      </el-form-item>
    </el-form>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getConsumeTime, getConsumeNumber, setConsumeTime, setConsumeNumber } from '@/api/super-crm/wx-quality-policy';
import moment from 'moment';

@Component({})
export default class BasisSet extends Vue {
  private setModal = {
    time: '',
    number: '',
    orderEvaluate: '0',
    assessScore: ''
  }

  private mounted() {
    this.getConsumeTime();
    this.getConsumeNumber();
  }

  private getConsumeTime() {
    getConsumeTime().then((res: any) => {
      // this.setModal.time = new Date(res.data.orderTime).format('yyyy-MM-dd');
      this.setModal.time = res.data.orderTime ? moment(res.data.orderTime).format('YYYY-MM-DD') : '';
    })
  }

  private getConsumeNumber() {
    getConsumeNumber().then((res: any) => {
      this.setModal.number = res.data.orderQueryDataQuantity;
      this.setModal.orderEvaluate = res.data.orderEvaluate;
      this.setModal.assessScore = res.data.assessScore || 0;
    })
  }

  private submitConsumeInfo() {
    Promise.all([this.submitConsumeTime(), this.submitConsumeNumber()]).then((res: any) => {
      this.$message.success('保存成功！');
    })
  }

  private submitConsumeTime() {
    const params = {
      orderTime: this.setModal.time ? moment(this.setModal.time).format('YYYY-MM-DD') : ''
    }
    return new Promise((resolve, reject) => {
      setConsumeTime(params).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject();
      });
    })
  }

  private submitConsumeNumber() {
    const params = {
      orderQueryDataQuantity: this.setModal.number,
      orderEvaluate: this.setModal.orderEvaluate,
      assessScore: this.setModal.assessScore
    }
    return new Promise((resolve, reject) => {
      setConsumeNumber(params).then((res: any) => {
        resolve(res);
      }).catch((err: any) => {
        reject();
      });
    })
  }
}
</script>

<style lang="scss" scoped>
.basis-set {
  /deep/ input[type="number"]{
    -moz-appearance: none;
  }
  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .info {
    font-size: 14px;
    color: #606266;
  }
  .header {
    padding-right: 12px;
  }
  .footer {
    padding-left: 12px;
  }
  .footer-info {
    font-size: 12px;
    color: #999999;
  }
}
</style>


