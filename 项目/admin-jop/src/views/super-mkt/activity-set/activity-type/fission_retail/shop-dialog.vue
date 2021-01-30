<template>
  <div>
    <el-dialog
      title="兑换门店"
      :visible.sync="dialogTableVisible"
      :before-close="cancelDialog"
      width="30%"
    >
      <div>
        <el-checkbox
          v-model="checkAll"
          @change="handleCheckAllChange"
          :indeterminate="isIndeterminate"
        >全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group @change="handleCheckedShopChange" v-model="checkedShop">
          <el-checkbox
            style="height:25px"
            v-for="item in shops"
            :label="item.shopName"
            :key="item.shopName"
          >{{item.shopName}}{{`${item.nameOut ? '('+item.nameOut+')': '' }`}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <span style="margin-right: 30px">*活动页面默认显示括号中门店别名，信息设置中可在门店管理中设置</span>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { queryShopOutList } from '@/api/super-mkt/activity-set/fission_retail';
@Component({})
export default class ShopDialog extends Vue {
  @Prop(Boolean) dialogTableVisible!: boolean;
  // 选择的门店
  @Prop({ default: [] }) valueList!: any[];
  checkedShop: any[] = [];
  shops = [];
  // 不确定性(门店列表)
  isIndeterminate = true;
  checkAll = false;
  mounted() {
    this.initValueList();
    this.getShopList();
  }

  initValueList() {
    this.checkedShop = Object.assign(this.valueList);
  }
  // 筛选一次初始化
  filterInit(arr: any) {
    const a = arr;
    const l = this.checkedShop;
    const result: any = [];
    l.map((item: any) => {
      a.forEach((ite: any) => {
        if (ite.shopName == item && !result.includes(ite.shopName)) {
          result.push(item);
        }
      });
    });
    this.checkedShop = result;
  }
  // 获取门店信息
  getShopList() {
    return new Promise((resolve, reject) => {
      const body = {};
      queryShopOutList(body)
        .then((res: any) => {
          const { data } = res;
          this.shops = data;
          resolve(res);
          this.filterInit(res.data);
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }
  // 门店单选
  handleCheckedShopChange(value: any) {
    const checkedCount = value.length;
    this.checkAll = checkedCount === this.shops.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.shops.length;
  }
  // 门店全选
  handleCheckAllChange(val: any) {
    this.checkedShop = val ? this.shops.map((item: any) => item.shopName) : [];
    this.isIndeterminate = false;
  }
  // 确定事件
  private async addConfirm() {
    const shops = Object.assign([], this.checkedShop);
    this.$emit('addConfirm', shops);
    this.checkedShop = [];
  }
  private cancelDialog() {
    this.$emit('cancelDialog');
    this.checkedShop = [];
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-checkbox__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 230px;
  font-size: 13px;
  line-height: 15px;
}
/deep/.el-checkbox__input {
  white-space: nowrap;
  cursor: pointer;
  outline: 0;
}
</style>