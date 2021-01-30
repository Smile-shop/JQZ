<template>
  <div class="shop-set">
    <el-form
      label-position="top"
      v-model="formData"
    >
      <el-form-item
        label="门店设置"
      >
        <div class="form-item-content">
          <el-checkbox
            v-model="storesCheckAll"
            @change="storesCheckAllHandle"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="formData.shopInfo"
            @change="storesItemCheck"
          >
            <el-checkbox
              v-for="(item, index) in stores"
              :key="index"
              :label="item.shopId"
            >
              {{item.shopName}}
              <span v-if="item.nameOut" class="chekbox-label">(对外：{{item.nameOut}})</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="setCredentialParams"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {getShopList, setShopList} from '@/api/super-crm/wx-mall';
import {Message} from 'element-ui';
import {getSessionStorage} from '@/utils/storage';

@Component({
})
export default class WxMallShopSet extends Vue {
  formData = {
    shopInfo: [], // 门店
  }
  stores: any[] = [] // 门店列表
  storesCheckAll = false;

  mounted() {
    this.getShops();
  }

  // 获取门店参数
  getShops() {
    const body = {
    }

    getShopList(body).then((res: any) => {
      const {data} = res;

      this.stores = data;
      this.formData.shopInfo = data.filter((item: any) => {
        return item.wxShop === '1';
      }).map((item: any) => {
        return item.shopId
      })

      if (this.stores.length === this.formData.shopInfo.length) {
        this.storesCheckAll = true;
      } else {
        this.storesCheckAll = false;
      }
    })
  }

  // 设置门店参数
  setCredentialParams() {
    const body = {
      shopId: this.formData.shopInfo
    };

    setShopList(body).then((res: any) => {
      Message.success('设置成功');
    })
  }

  // 门店全选
  storesCheckAllHandle(value: boolean) {
    if (value) {
      (<any> this.formData.shopInfo) = this.stores.map((item, index) => {
        return item.shopId;
      })

      console.log(this.formData)
    } else {
      this.formData.shopInfo = [];
    }
  }

  // 门店选择时
  storesItemCheck(value: any[]) {
    if (value.length === this.stores.length) {
      this.storesCheckAll = true;
    } else {
      this.storesCheckAll = false;
    }
  }
}
</script>

<style lang="scss">
.form-item-content{
  .el-checkbox-group {
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
</style>


