<template>
  <page-wrapper class="goods-list">
    <!-- 表格组件 -->
    <page-table>
      <!-- 查询表单 -->
      <template #form>
        <div class="goods-box">
          <div @click="goProductInfoFun('product-info')">商品信息</div>
          <div @click="goFun('1','product-specification')">关联商品</div>
          <div class="product-mess">商品详情</div>
        </div>
        <div>
          <a-form-model :label-col="initData.labelCol" :wrapper-col="initData.wrapperCol">
            <a-form-model-item label="商品详情：">
                <div>
                  <app-editor
                    v-model="initData.description"
                    @input="inputHallder"
                  />
                </div>
                 <div class="custom-title-box">
                  <p class="sub-title">说明：</p>
                  <p class="sub-text">1、不添加默认空白</p>
                  <p class="sub-text">2、支持文字，数字不超过2000字</p>
                  <p class="sub-text">3、支持图片，尺寸建议宽度为640</p>
                </div>
                <div class="custom-title-button">
                  <a-button  class="button-style" @click="goBack">返回</a-button>
                  <a-button type="primary"  class="button-style" @click="onSave">保存</a-button>
                </div>
            </a-form-model-item>
          </a-form-model>
        </div>
      </template>
    </page-table>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api';
import PageTable from '@/layout/page-table.vue';
import titleHeader from './components/search-form/title-header.vue';
import appEditor from '@/components/app-editor.vue';
import {
  updateSpuDescription,
  getSpuDescription
} from '@/api/modules/mall/goods-manage/product-list/index';
export default defineComponent({
  components: {
    PageTable,
    titleHeader,
    appEditor
  },
  setup(props, context) {
    const initData = reactive({ spuId: '', statusCode: 'N', wrapperCol: { span: 20 }, description: '', labelCol: { span: 2 } });
    const inputHallder = (context:string) => {
      initData.description = context;
    }
    // 商品分类信息-关联商品
    const goFun = (type:string, path: string) => {
      context.root.$router.push({
        path,
        query: {
          type: type,
          id: initData.spuId,
          statusCode: initData.statusCode
        }
      })
    }
    // 返回
    const goBack = () => {
      context.root.$router.go(-1);
    }
    const onSave = async () => {
      const skuobj = { description: initData.description, spuId: initData.spuId };
      await updateSpuDescription(skuobj);
      context.root.$message.success('设置商品详情成功');
    }
    const goProductInfoFun = (path: string) => {
      context.root.$router.push({
        path,
        query: {
          productId: initData.spuId,
          statusCode: initData.statusCode
        }
      })
    }
    onMounted(() => {
      initData.spuId = context.root.$route.query.id || '' as any;
      initData.statusCode = context.root.$route.query.statusCode || 'N' as any;
      if (initData.spuId !== '') {
        getSpuDescriptionById(initData.spuId);
      }
    });
    const getSpuDescriptionById = async (id:any) => {
      const spuObj = await getSpuDescription(id);
      if (spuObj) {
        initData.description = spuObj.description;
        initData.spuId = spuObj.spuId;
      }
    };
    return {
      initData,
      goFun,
      inputHallder,
      goProductInfoFun,
      goBack,
      onSave
    }
  }
})
</script>

<style lang="scss" scoped>
.goods-list {
  .goods-bread {
    height: 53px;
    margin-bottom: 30px;
    box-shadow:0px 2px 30px 0px rgba(120,148,245,0.1);
    display: flex;
    align-items: center;
    padding-left: 12px;
    margin-top: -29px;
    margin-left: -23px;
  }
  .goods-box {
    display: flex;
    height: 48px;
    border:1px solid rgba(235,238,245,1);
    margin-bottom: 24px;
    div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #263446;
      font-weight: 500;
      cursor: pointer;
    }
    .product-mess {
      background: #0045FF;
      color: #fff;
    }
  }
}
.custom-title-box {
  color: #80869D;
  margin-top: 14px;
}
.custom-title-button{
  text-align: center;
}
.button-style{
    width: 68px;
    padding: 7px;
    font-size: 12px;
    margin: 10px;
}
.sub-title{
    margin-bottom: 0px;
    font-size: 12px;
    color: #40445C;
    font-weight: 400;
}
.sub-text{
      margin-bottom: 0px;
    font-size: 12px;
    font-weight: 400;
    color: #40445C;
}
</style>
