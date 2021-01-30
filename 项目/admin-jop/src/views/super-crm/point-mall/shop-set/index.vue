<template>
  <div class="shop-set">
    <form action="#">
      <div class="exchange-shop">
        <p class="title">设置兑换门店</p>
        <el-checkbox
          v-model="isAll"
          @change="checkAllChange"
          class="checkAll"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          v-model="selectedShopList"
          class="checkbox-group"
        >
          <el-checkbox
            v-for="(item, index) in shopList"
            :label="item.shopId"
            :key="index"
          >
            {{item.shopName}}<span v-if="item.nameOut" class="chekbox-label">(对外：{{item.nameOut}})</span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div>
        <el-button
          type="primary"
          @click="updateExchangeShop"
        >
          保存
        </el-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {getExchangeShop, updateExchangeShop} from '@/api/super-crm/point-mall';
import {Message} from 'element-ui';

@Component({
})
export default class PointMallShopSet extends Vue {
  shopList: any[] = [];
  selectedShopList: any[] = [];
  isAll = false;

  @Watch('selectedShopList')
  watchSelectedShopList(value: any) {
    if (this.shopList.length === this.selectedShopList.length) {
      this.isAll = true;
    } else {
      this.isAll = false;
    }
  }

  mounted() {
    this.getExchangeShop();
  }

  // 全选
  checkAllChange(val: any) {
    if (val) {
      this.selectedShopList = this.shopList.map((item: any, index) => {
        return item.shopId
      })
    } else {
      this.selectedShopList = [] ;
    }
  }

  // 获取兑换门店列表
  getExchangeShop() {
    const data = {};

    getExchangeShop(data).then((res: any) => {
      const {data} = res;
      const {scoreShopList} = data;

      if (scoreShopList) {
        const scoreShopListFilter = scoreShopList.filter((item: any) => {
          return item.scoreShop === '1';
        });

        this.selectedShopList = scoreShopListFilter.map((item: any) => {
          return item.shopId;
        });

        this.shopList = scoreShopList;
      }
    })
  }

  // 提交
  updateExchangeShop() {
    const data = {
      shopId: this.selectedShopList,
    };

    updateExchangeShop(data).then((res: any) => {
      Message.success('修改成功');
    })
  }
}
</script>

<style lang="scss" scoped>
.shop-set {
  > form {
    .exchange-shop {
      > * {
        margin-bottom: 15px;
      }

      > .title {
        font-size: 14px;
        color: #606266;
      }

      /deep/ .el-checkbox-group {
        display: flex;
        flex-wrap: wrap;

        .el-checkbox {
          display: flex;
          align-items: center;
          width: 180px;
          margin-bottom: 30px;

          .el-checkbox__label{
            white-space: normal;
            position: relative;

            .chekbox-label{
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
    }
  }
}
</style>


