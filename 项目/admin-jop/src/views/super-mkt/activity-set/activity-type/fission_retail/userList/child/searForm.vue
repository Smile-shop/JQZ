<template>
  <el-form :model="form" ref="form" inline class="demo-form-inline">
    <el-form-item label="用户昵称" prop="nickname">
      <el-input size="small" clearable placeholder="请输入" v-model="form.nickname" type="text" />
    </el-form-item>
    <el-form-item label="门店" prop="shopName">
      <el-select v-model="form.shopName" clearable placeholder="全部门店" size="small">
        <el-option label="全部门店" value=""></el-option>
        <el-option v-for="item in shopList" :key="item.name" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="float: right">
      <el-button size="small" type="primary" @click="sendData">搜索</el-button>
      <el-button size="small" @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getCustomerShopSetting } from '@/api/system-set';
@Component({})
export default class SearchForm extends Vue {
  form: any = {
    nickname: '',
    shopName: '',
  };
  shopList: any[] = [];
  created() {
    this.getCustomerShopSetting();
  }
  async getCustomerShopSetting() {
    const res: any = await getCustomerShopSetting({});
    const { code, data } = res;
    if (!code) {
      this.shopList = data.shopPermissionList.filter(
        (item: any) => item.isSelect
      );
    }
  }
  reset() {
    (this.$refs.form as any).resetFields();
    this.$emit('getFormData', this.form);
  }
  sendData() {
    this.$emit('getFormData', this.form);
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  width: 230px;
}
/deep/ .el-range-separator {
  width: 15px;
}
/deep/ .el-select {
    .el-input__icon {
      line-height: 40px;
    }
  }
</style>


