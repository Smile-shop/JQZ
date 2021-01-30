<template>
  <div class="product-edit">
    <el-form ref="form"
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="商品名称">
        {{formData.name}}
      </el-form-item>
      <el-form-item label="对外名称">
        <el-input v-model="formData.outName"></el-input>
      </el-form-item>
      <el-form-item label="兑换门店">
        <div class="form-item-content">
          <el-checkbox
            v-model="storesCheckAll"
            @change="storesCheckAllHandle"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="formData.shopNames"
            @change="storesItemCheck"
          >
            <el-checkbox
              v-for="(item, index) in stores"
              :key="index"
              :label="item.shopName"
            >
              {{item.shopName}}
              <span v-if="item.nameOut" class="chekbox-label">(对外：{{item.nameOut}})</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="商品详情">
        <wang-editor ref="ue"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="updateProductDetail"
        >
          保存
        </el-button>
        <el-button
          type="success"
          @click="emitBack"
        >
          返回
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Emit} from 'vue-property-decorator';
import {getProductInfo, updateProductDetail} from '@/api/super-crm/point-mall';
import {getShopList} from '@/api/super-crm/wx-mall';
import {Message} from 'element-ui';
import WangEditor from '@/components/WangEditor.vue';

@Component({
  components: {
    WangEditor
  }
})
export default class PointMallProductDetailEditProductEdit extends Vue {
  formData: any = {
    name: '',
    outName: '',
    detail: '',
    shopNames: [], // 门店
  }
  stores: any[] = [] // 门店列表
  storesCheckAll = false;

  @Prop({
    type: String,
  })
  code!: string;

  @Emit('back')
  emitBack() {
    return false;
  }

  mounted() {
    this.getProductInfo();
    this.getShops();
  }

  // 获取门店参数
  getShops() {
    const body = {
    }

    getShopList(body).then((res: any) => {
      const {data} = res;

      this.stores = data;

      if (this.stores.length === this.formData.shopNames.length) {
        this.storesCheckAll = true;
      } else {
        this.storesCheckAll = false;
      }
    })
  }

  // 门店全选
  storesCheckAllHandle(value: boolean) {
    if (value) {
      (<any> this.formData.shopNames) = this.stores.map((item, index) => {
        return item.shopName;
      })

    } else {
      this.formData.shopNames = [];
    }
  }

  // 门店选择时
  storesItemCheck(value: any[]) {
    this.formData.shopNames = value;
    if (value.length === this.stores.length) {
      this.storesCheckAll = true;
    } else {
      this.storesCheckAll = false;
    }
  }

  // 获取产品信息
  getProductInfo() {
    const body = {
      code: this.code,
    }

    getProductInfo(body).then((res: any) => {
      const {data} = res;

      this.formData = {
        name: data.productName,
        outName: data.outName,
        detail: data.giftDetail,
        shopNames: data.exchangeShopNames ? data.exchangeShopNames : [],
      };

      (this.$refs.ue as any).setContent(data.giftDetail);
    })
  }

  // 更新产品信息
  updateProductDetail() {
    this.formData.detail = (<any> this.$refs.ue).getContent();

    const body = {
      code: this.code,
      ...this.formData
    }
    updateProductDetail(body).then((res: any) => {
      Message.success('提交成功');
    })
  }
}
</script>

<style lang="scss" scoped>
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


