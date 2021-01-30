<template>
  <div class="add-param-modal">
    <a-modal
      :title="parentData.title"
      :visible="parentData.modalVisible"
      centered
      @cancel="cancel"
    >
      <a-form-model
        ref="ruleForm"
        class="ruleForm"
        :model="initData.form"
        :rules="initData.rules"
        :label-col="initData.labelCol"
        :wrapper-col="initData.wrapperCol"
      >
        <a-form-model-item ref="name" :label="parentData.itemTitle" prop="name">
          <a-input v-model="initData.form.name" :placeholder="'请输入'+parentData.mes+'名称'" style="width: 260px"/>
          <p>说明：支持文字、英文、数字，字限制2-8个</p>
        </a-form-model-item>
        <a-form-model-item label="数据类型：" prop="region">
          <a-select show-search v-model="initData.form.region" placeholder="选择类型" style="width: 200px" option-filter-prop="children">
            <a-select-option v-for="(item,index) in initData.datatypeObj" :key="index" :value="index" >
              {{item}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="详情页规格属性：" prop="resource" v-if="parentData.modalType === '1'">
          <a-radio-group v-model="initData.form.resource">
            <a-radio value="Y">
              开启
            </a-radio>
            <a-radio value="N">
              关闭
            </a-radio>
          </a-radio-group>
          <p>说明：商品的产品属性；开启后，该属性会在小程序的商品详情页中展示</p>
        </a-form-model-item>
      </a-form-model>
      <!-- 底部 -->
      <template slot="footer">
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="onSubmit">添加</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api'
export default defineComponent({
  props: {
    parentData: {
      type: Object,
      default: {
        title: '',
        modalVisible: true,
        modalType: '',
        itemTitle: '',
        mes: ''
      }
    }
  },
  setup(props, context) {
    const initData = reactive({
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {
        name: '',
        region: undefined,
        resource: 'Y'
      },
      rules: {
        name: [
          { required: true, message: '请输入该字段' + props.parentData.mes + '名称', trigger: 'blur' },
          { min: 2, max: 8, message: '仅支持汉字、英文、数字，字限制2-8个', trigger: 'blur' },
          { pattern: '^[\u4e00-\u9fa5-a-zA-Z0-9]+$', message: '分类名称仅支持文字、数字、英文', trigger: 'blur' }
        ],
        region: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
      },
      datatypeObj: { NUM: '数字', STR: '文本' }
    })
    const ruleForm = ref();
    const cancel = () => {
      context.emit('modal-button');
      ruleForm.value.resetFields();
    }
    const onSubmit = () => {
      ruleForm.value.validate((valid: any) => {
        if (valid) {
          context.emit('modal-add', { name: initData.form.name, visible: initData.form.resource, datatype: initData.form.region });
          initData.form.name = '';
          initData.form.region = undefined;
          initData.form.resource = 'Y';
        } else {
          context.root.$message.warning('请正确填写信息');
          return false;
        }
      });
    }
    return {
      initData,
      cancel,
      onSubmit,
      ruleForm
    }
  }
})
</script>

<style lang="scss" scoped>
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
</style>
