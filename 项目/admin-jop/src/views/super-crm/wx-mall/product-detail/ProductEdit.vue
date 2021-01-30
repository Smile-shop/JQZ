<template>
  <div class="product-edit">
    <el-form ref="form"
      label-width="100px"
    >
      <el-form-item label="商品名称">
        {{productInfo.productName}}
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
import {productDetailsOptions, updateProductDetailsOptions} from '@/api/super-crm/wx-mall';
import {Message} from 'element-ui';
import WangEditor from '@/components/WangEditor.vue';

@Component({
  components: {
    WangEditor
  }
})
export default class PointMallProductDetailEditProductEdit extends Vue {
  @Prop({
    type: String,
  })
  code!: string;

  productInfo = {
    productName: '',
    detail: ''
  }

  @Emit('back')
  emitBack() {
    return false;
  }

  mounted() {
    this.getProductInfo();
  }

  // 获取产品信息
  getProductInfo() {
    const body = {
      code: this.code,
    }

    productDetailsOptions(body).then((res: any) => {
      const {data} = res;
      this.productInfo = data;
      (<any> this.$refs.ue).setContent(data.detail);
    })
  }

  // 更新产品信息
  updateProductDetail() {
    const body = {
      code: this.code,
      detail: (<any> this.$refs.ue).getContent()
    }
    updateProductDetailsOptions(body).then((res: any) => {
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
