<template>
  <div class="store-set">
    <div class="shop-setting">
      <header
        class="header-info"
        v-if="shopLimitNum > 0"
      >说明：当前已开通{{shopLimitNum}}个门店使用，若需开通更多门店使用，请联系客服购买更多门店使用权限。</header>
      <el-checkbox
        v-if="shopList.length > 0"
        :indeterminate="isIndeterminateShopAllCheck"
        v-model="isShopAllCheck"
        @change="allShopClick"
      >全选</el-checkbox>
      <el-checkbox-group v-model="shopCheckList">
        <el-checkbox
          :label="item.name"
          v-for="item in shopList"
          :key="item.name"
          @change="selectShopClick"
          @click.native="storeTip"
          class="checkbox-item"
        >
          {{item.name}}
          <span class="chekbox-label" v-if="item.outShopName">(对外：{{item.outShopName}})</span>
        </el-checkbox>
      </el-checkbox-group>
      <el-button type="primary" class="sub-btn" @click="subShopSetMethod" v-if="shopList.length > 0">保存</el-button>
    </div>
    <!-- 超出门店使用上限弹窗提示 -->
    <el-dialog
      title="温馨提示"
      :visible.sync="storeDialogVisible"
      width="30%"
      center>
      <span>超出门店使用上限，如需开通更多门店使用，请联系客服购买开通。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="storeDialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getCustomerShopSetting, updateCustomerShopSetting } from '@/api/system-set';
import { Col } from 'element-ui';

@Component({
})
export default class MsgValidate extends Vue {
  // 提示框
  private storeDialogVisible: boolean = false
  private isIndeterminateShopAllCheck: boolean = true
  private isShopAllCheck: boolean = false
  private shopCheckList = [] as any
  private shopLimitNum = 0; // 数量限制
  private shopList = [] as any
  private shopCheckListCopy = [] as any; // 只用来全选的时候判断用
  private mounted() {
    this.getCustomerShopSettingFun();
  }
  // 门店查询
  private async getCustomerShopSettingFun() {
    const data: any = await getCustomerShopSetting({});
    this.shopLimitNum = data.data.shopLimitNum ? data.data.shopLimitNum : 0
    this.shopList =  data.data.shopPermissionList ? data.data.shopPermissionList : []
    this.shopCheckList = this.shopList.filter((p: any) => p.isSelect).map((item: any) => {
      return item.name
    });
    this.shopCheckListCopy = this.shopCheckList;
  }
  // 全选方法
  private allShopClick(value: any) {
    if (this.shopLimitNum > 0) {
      if (value) {
        const shopCheck = [] as any;
        this.shopList.map((p: any) => {
          if (shopCheck.length < this.shopLimitNum) {
            shopCheck.push(p.name)
          }
        })
        if (this.shopCheckList.length > 0) {
          let mask = false;
          this.shopCheckList.map((p: any) => {
            shopCheck.map((item: any) => {
              if (p === item) {
                mask = true;
              }
            })
          })

          const newArr = [] as any;
          shopCheck.map((p: any) => {
            this.shopCheckList.map((item: any) => {
              if (p === item) {
                newArr.push(p);
              }
            })
          })

          const newArr2 = [] as any;
          this.shopCheckListCopy.map((p: any) => {
            if (!newArr.includes(p)) {
              newArr2.push(p);
            }
          })

          if (mask) {
            if (newArr.length === this.shopCheckList.length) {
              this.shopCheckList = shopCheck;

            } else {
              if (this.shopLimitNum === this.shopCheckList.length) {
                this.shopCheckList = this.shopCheckList;
              } else {
                shopCheck.splice(this.shopLimitNum - newArr2.length);
                this.shopCheckList = newArr2.concat(shopCheck)
              }
            }

          } else {
            shopCheck.splice(this.shopLimitNum - this.shopCheckList.length);
            this.shopCheckList = this.shopCheckList.concat(shopCheck)
          }


        } else {
          if (this.shopCheckListCopy.length > 0) {
            let mask = false;
            this.shopCheckListCopy.map((p: any) => {
              shopCheck.map((item: any) => {
                if (p === item) {
                  mask = true;
                }
              })
            })

            const newArr = [] as any;
            shopCheck.map((p: any) => {
              this.shopCheckListCopy.map((item: any) => {
                if (p === item) {
                  newArr.push(p);
                }
              })
            })

            const newArr2 = [] as any;
            this.shopCheckListCopy.map((p: any) => {
              if (!newArr.includes(p)) {
                newArr2.push(p);
              }
            })

            if (mask) {
              if (newArr.length === this.shopCheckListCopy.length) {
                this.shopCheckList = shopCheck;
              } else {
                if (this.shopLimitNum === this.shopCheckListCopy.length) {
                  this.shopCheckList = this.shopCheckListCopy;
                } else {
                  shopCheck.splice(this.shopLimitNum - newArr2.length);
                  this.shopCheckList = newArr2.concat(shopCheck)
                }
              }
            } else {
              shopCheck.splice(this.shopLimitNum - this.shopCheckListCopy.length);
              this.shopCheckList = this.shopCheckListCopy.concat(shopCheck)
            }

          } else {
            this.shopCheckList = shopCheck;
          }
        }
      } else {
        this.shopCheckList = [];
      }
    } else {
      this.shopCheckList = value ? this.shopList.map((p: any) => p.name) : [];
    }
    this.isIndeterminateShopAllCheck = false
  }
  private selectShopClick() {
    this.isShopAllCheck = this.shopList.length === this.shopCheckList.length
    this.isIndeterminateShopAllCheck =
    this.shopCheckList.length > 0 &&
    this.shopCheckList.length < this.shopList.length
  }
  // 超出门店使用上限弹窗提示
  private storeTip(e: any) {
    if (this.shopLimitNum > 0) {
      if (this.shopCheckList.length >= this.shopLimitNum) {
        if (e.target.checked) {
          this.storeDialogVisible = true;
          e.target.checked = false;
        }
      }
    }
  }
  // 保存
  private async subShopSetMethod() {
    const body = {
      permissionJson: this.shopCheckList.join(',')
    }
    const data = await updateCustomerShopSetting(body);
    this.$message.success('保存成功');
  }
}
</script>

<style lang="scss" scoped>
.store-set{
  .shop-setting {
    .header-info {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #333333;
      padding: 12px 0;
    }
    .checkbox-item {
      width: 185px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .el-checkbox__label .chekbox-label{
      position: absolute;
      bottom: -19px;
      left: 9px;
      font-size: 12px;
      color: #999;
      min-width: 200px;
    }
    .sub-btn{
      margin-top: 20px;
    }
  }
}
</style>
