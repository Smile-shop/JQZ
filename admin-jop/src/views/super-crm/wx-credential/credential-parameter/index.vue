<template>
  <div class="parameter-set">
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
              :label="item.id"
            >
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item
        label="类别设置" 
      >
        <div class="form-item-content">
          <el-checkbox
            v-model="JewelryLargeCategorysCheckAll"
            @change="JewelryLargeCategorysCheckAllHandle"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="formData.categoryInfo"
            @change="JewelryLargeCategorysItemCheck"
          >
            <el-checkbox
              v-for="(item, index) in JewelryLargeCategorys"
              :key="index"
              :label="item.id"
            >
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item
        label="验证结果页面标题"
      >
        <el-input
          v-model="formData.title"
        >
        </el-input>
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
import {getCredentialParams, setCredentialParams} from '@/api/super-crm/wx-credential';
import {Message} from 'element-ui';
import {getSessionStorage} from '@/utils/storage';

@Component({
})
export default class WxCredentialCredentialParameter extends Vue {
  formData = {
    title: '', // 标题
    shopInfo: [], // 门店
    categoryInfo: [], // 首饰类别
  }
  stores: any[] = [] // 门店列表
  storesCheckAll = false;
  JewelryLargeCategorys: any[] = []; // 首饰类别
  JewelryLargeCategorysCheckAll = false;

  mounted() {
    this.getCredentialParams();
  }

  // 获取证书参数
  getCredentialParams() {
    const {user} = getSessionStorage();
    const {accountId} = user.account;

    const body = {
    }

    getCredentialParams(body).then((res: any) => {
      const {data} = res;
      const {JewelryLargeCategory, store, title} = data

      this.stores = store
      this.JewelryLargeCategorys = JewelryLargeCategory
      this.formData.title = title
      this.formData.shopInfo = store.filter((item: any) => {
        return item.check;
      }).map((item: any) => {
        return item.id;
      })
      this.storesCheckAll = this.formData.shopInfo.length === store.length;

      this.formData.categoryInfo = JewelryLargeCategory.filter((item: any) => {
        return item.check;
      }).map((item: any) => {
        return item.id;
      })
      this.JewelryLargeCategorysCheckAll = this.formData.categoryInfo.length === JewelryLargeCategory.length;
    })
  }

  // 设置证书参数
  setCredentialParams() {
    const {user} = getSessionStorage();
    const {accountId} = user.account;
    const {title, shopInfo, categoryInfo} = this.formData;
    const body = {
      title,
      shopInfo: shopInfo.map((item: any, index) => {
        return this.stores.find((item2, index2) => {
          item2.check = true;
          return item === item2.id;
        })
      }),
      categoryInfo: categoryInfo.map((item: any, index) => {
        return this.JewelryLargeCategorys.find((item2, index2) => {
          item2.check = true;
          return item === item2.id;
        })
      }),
    };

    setCredentialParams(body).then((res: any) => {
      Message.success('设置成功');
    })
  }

  // 门店全选
  storesCheckAllHandle(value: boolean) {
    if (value) {
      (<any> this.formData.shopInfo) = this.stores.map((item, index) => {
        return item.id;
      })
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

  // 类别全选
  JewelryLargeCategorysCheckAllHandle(value: boolean) {
    if (value) {
      (<any> this.formData.categoryInfo) = this.JewelryLargeCategorys.map((item, index) => {
        return item.id;
      })
    } else {
      this.formData.categoryInfo = [];
    }
  }

  // 类别选择时
  JewelryLargeCategorysItemCheck(value: any[]) {
    if (value.length === this.JewelryLargeCategorys.length) {
      this.JewelryLargeCategorysCheckAll = true;
    } else {
      this.JewelryLargeCategorysCheckAll = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.parameter-set {
  .el-form-item /deep/ {
    border-bottom: 1px solid #f5f5f5;

    .el-form-item__label {
      font-weight: bold;
    }
  }
}
</style>


