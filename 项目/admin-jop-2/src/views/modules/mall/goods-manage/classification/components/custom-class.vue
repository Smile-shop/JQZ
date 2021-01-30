<template>
  <div class="custom-class">
    <custom-component v-if="!initData.isEdit||initData.categoryData" :data="initData.categoryData" :edtype="edtype" ref="custom"></custom-component>
    <custom-param v-if="!initData.isEdit||initData.categoryData" :data="initData.categoryData" :edtype="edtype" ref="propList"></custom-param>
    <custom-param-two v-if="!initData.isEdit||initData.categoryData" :data="initData.categoryData" :edtype="edtype" ref="skuList"></custom-param-two>
    <div class="custom-class-footer">
        <a-form-model :model="initData.form" :label-col="initData.labelCol">
          <a-form-model-item>
            <a-button class="pre-btn" @click="prevPage">上一页</a-button>
            <a-button type="primary" @click="onSave">保存</a-button>
          </a-form-model-item>
        </a-form-model>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import customComponent from './custom-component.vue';
import customParam from './custom-param.vue';
import customParamTwo from './custom-param-two.vue';
import {
  addRetailCategory,
  getRetailCategoryById,
  updateRetailCategory
} from '@/api/modules/mall/goods-manage/classification/index';
export default defineComponent({
  props: {
    id: {
      type: String,
      value: ''
    },
    edtype: {
      type: Number,
      value: 0
    }
  },
  components: {
    customComponent,
    customParam,
    customParamTwo
  },
  setup(props, context) {
    const custom = ref();
    const propList = ref();
    const skuList = ref();
    const initData = reactive({
      form: {
        resource: '1'
      },
      labelCol: { span: 1 },
      isEdit: false,
      categoryData: null,
    })
    // 上一页
    const prevPage = () => {
      context.emit('custom-style')
    }
    const onSave = async () => {
      const basePropertyList = Object.assign([], propList.value.initData.tableData);
      const skuPropertyList = Object.assign([], skuList.value.initData.tableData);
      custom.value.initData.form.basePropertyList = basePropertyList;
      custom.value.initData.form.skuPropertyList = skuPropertyList;
      const body = custom.value.initData.form;
      if (initData.isEdit && props.edtype === 1) {
        await updateRetailCategory(body);
        context.root.$message.success('修改商品分类成功！');
      } else {
        await addRetailCategory(body);
        context.root.$message.success('添加商品分类成功！');
      }
    }
    const onGetCustom = async () => {
      const body = props.id;
      const categoryData = await getRetailCategoryById(body);
      initData.categoryData = categoryData;
    }
    onMounted(() => {
      if (props.id !== '') {
        initData.isEdit = true;
        onGetCustom();
      } else {
        initData.isEdit = false;
      }
    });
    return {
      initData,
      prevPage,
      onSave,
      custom,
      propList,
      skuList
    }
  }
})
</script>

<style lang="scss" scoped>
.custom-class {
  .custom-class-footer {
    margin: 40px 34px 60px;
  }
  .header {
    width: 100%;
    box-sizing: border-box;
    background: #F5F7FA;
    padding-left: 12px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 24px 0;
    p {
      color: #263446;
      padding-left: 8px;
      border-left: 3px solid #0045FF;
      margin: 0;
    }
  }
  .pre-btn {
    margin-right: 16px;
  }
}
</style>
