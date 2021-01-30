<template>
  <div class="goods-param-modal">
     <a-modal
      :title="parentData.title"
      :visible="parentData.modalVisible"
      centered
      width="30%"
      @cancel="cancel"
    >
      <div  class="rdgrp">
        <a-radio-group v-model="initData.radioValue">
          <div v-for="(item,index) in initData.dataList" :key="index">
              <p style="width:100px">{{item.kindName}}</p>
              <div>
                <template v-for="(it) in item.goodsPropList">
                    <a-radio :key="it.code" :value="getValue(it.name, it.code)" style="width:110px">{{it.name}}</a-radio>
                </template>
              </div>
          </div>
        </a-radio-group>
      </div>
      <p style="margin-top:20px">货品属性说明：自定义属性请正确关联货品属性；每个自定义属性仅可对应1个货品属性。</p>
      <template slot="footer">
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="onSubmit">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import {
  queryGoodPropList
} from '@/api/modules/mall/goods-manage/classification/index';
export default defineComponent({
  props: {
    parentData: {
      type: Object,
      default: {}
    }
  },
  setup(props, context) {
    const initData = reactive({
      radioValue: '',
      dataList: []
    })
    onMounted(() => {
      const id = props.parentData.data.id ? props.parentData.data.id : '';
      queryGoodPropListFun(id)
    })
    const queryGoodPropListFun = async (id: string) => {
      const responData = await queryGoodPropList(id);
      initData.dataList = responData;
    }
    const cancel = () => {
      context.emit('modal-cancel');
    }
    const onSubmit = () => {
      context.emit('modal-ok', initData.radioValue, props.parentData.data);
    }
    const getValue = (label: string, code: string) => {
      return `${label}-${code}`
    }
    return {
      initData,
      cancel,
      onSubmit,
      getValue
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep .ant-radio-wrapper {
  margin-bottom: 10px;
}
.rdgrp{
  width:600px;
  height:300px;
  overflow:scroll;
}
</style>
