<template>
  <div class="post-method">
    <el-form label-position="top" label-width="80px" :model="form">
      <el-form-item label="名称">
        <el-checkbox true-label="1" false-label="0" v-model="form.openTypshope" :label="form.shop"></el-checkbox>
        <el-checkbox true-label="1" false-label="0" v-model="form.openExpressDelivery" :label="form.expressDelivery"></el-checkbox>
      </el-form-item>
      <el-form-item label="快递配送修改">
        <el-input v-model="form.expressDeliveryRemark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="setMailingMethodSetting" type="primary">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {setMailingMethodSetting, getMailingMethod} from '@/api/super-crm/wx-mall';

@Component({
})
export default class PostMethod extends Vue {
  form = {
    shop: '门店自取',
    openTypshope: '1',
    expressDelivery: '快递配送（运费到付）',
    expressDeliveryRemark: '运费到付',
    openExpressDelivery: '1',
  };

  mounted() {
    this.getMailingMethod();
  }

  @Watch('form.expressDeliveryRemark')
  watchFormExpressDeliveryRemark(value: string) {
    console.log(value)
    if (value) {
      this.form.expressDelivery = `快递配送（${value.trim()}）`
    } else {
      this.form.expressDelivery = `快递配送（运费到付）`
    }
  }

  async getMailingMethod() {
    const body = {};

    const { data } = await getMailingMethod(body);
    data.expressDeliveryRemark = '运费到付';
    const { expressDelivery } = data;
    const reg = /\（(.*)\）$/ig;
    expressDelivery.replace(
      reg,
      (match: string, $1: any) => {
        if ($1) {
          data.expressDeliveryRemark = $1;
        }
      }
    );

    this.form = data;
  }

  async setMailingMethodSetting() {
    const { openTypshope,  expressDelivery, openExpressDelivery, expressDeliveryRemark} = this.form;
    const body = {
      ...this.form
    };

    if (openTypshope == '0' && openExpressDelivery == '0') {
      this.$message.warning('必须选择一项');
    } else if (expressDeliveryRemark.length > 6) {
      this.$message.warning('快递配送文字不能超过6个');
    } else {
      const { data } = await setMailingMethodSetting(body);
      this.$message.success('设置成功');
      this.getMailingMethod();
    }
  }
}
</script>

<style lang="scss" scoped>
.post-method {
  width: 500px;
}
</style>
