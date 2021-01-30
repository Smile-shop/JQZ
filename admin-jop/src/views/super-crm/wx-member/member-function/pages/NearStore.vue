<template>
  <div class="near-shop">
    <el-tabs v-model="activeName" class="tab-content">
      <el-tab-pane label="基础设置" name="1">
        <div class="header">
          <span>展示方式设置</span>
          <el-radio v-model="showWay" label="0">展示全部门店</el-radio>
          <el-radio v-model="showWay" label="1">只展示所属门店</el-radio>
        </div>
        <div class="shop-setting" v-if="shopList.length > 0">
          <el-checkbox
            :indeterminate="isIndeterminateShopAllCheck"
            v-model="isShopAllCheck"
            @change="allShopClick"
          >全选</el-checkbox>
          <el-checkbox-group v-model="shopCheckList">
            <el-checkbox
              :label="item.shopName"
              v-for="item in shopList"
              :key="item.shopName"
              @change="selectShopClick"
              class="checkbox-item"
            >
              {{item.shopName}}
              <span class="chekbox-label" v-if="item.nameOut">(对外：{{item.nameOut}})</span>
            </el-checkbox>
          </el-checkbox-group>
          <el-button type="primary" class="sub-btn" @click="subShopSetMethod">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="门店图片维护" name="2">
        <store-image v-if="activeName === '2'"></store-image>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import storeImage from './StoreImage.vue';
import {
  getNearShop,
  setNearShop
} from '@/api/super-crm/wx-member'

@Component({
  components: {
    storeImage
  }
})
export default class MemberPackage extends Vue {
  private showWay: string = '0';
  private shopList = [];
  private shopCheckList: string[] = [];
  private isShopAllCheck: boolean = false;
  private isIndeterminateShopAllCheck: boolean = true;
  private activeName: string = '1';

  private mounted() {
    this.getShopList()
  }
  // 绑定门店
  private getShopList() {
    getNearShop().then((res: any) => {
      this.shopList = res.data.nxshopList || []
      this.shopCheckList = this.shopList
        .filter((p: any) => p.showStatus === '1')
        .map((p: any) => p.shopName)
      this.showWay = res.data.showWaySet;
      this.selectShopClick()
    })
  }

  private selectShopClick() {
    this.isShopAllCheck = this.shopList.length === this.shopCheckList.length
    this.isIndeterminateShopAllCheck =
      this.shopCheckList.length > 0 &&
      this.shopCheckList.length < this.shopList.length
  }

  private allShopClick(value: any) {
    this.shopCheckList = value ? this.shopList.map((p: any) => p.shopName) : []
    this.isIndeterminateShopAllCheck = false
  }

  private subShopSetMethod() {
    const params = this.shopList.map((p: any) => {
      return {
        shopName: p.shopName,
        showStatus:
          this.shopCheckList.findIndex((item: any) => p.shopName === item) > -1
            ? '1'
            : '0',
        showWay: this.showWay,
        nameOut: p.nameOut
      }
    })
    setNearShop(params).then((res: any) => {
      this.$message({
        message: '保存成功!',
        type: 'success'
      })
    })
  }
}
</script>

<style lang="scss" scoped>
  .near-shop {
    .header {
      > span {
        font-size: 18px;
        font-weight: bold;
        padding-right: 50px;
      }
    }
    .shop-setting {
      padding: 30px 0;
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
      .sub-btn {
        margin-top: 20px;
      }
      .el-checkbox__label {
        width: 95%;
        white-space: normal;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        display: inline-block;
        -webkit-box-orient: vertical;
        vertical-align: middle;
        position: relative;
        .chekbox-label {
          position: absolute;
          bottom: -19px;
          left: 9px;
          font-size: 12px;
          color: #999;
          min-width: 200px;
        }
      }
    }
  }
</style>