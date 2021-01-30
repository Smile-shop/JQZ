<template>
  <page-wrapper class="setting">
      <a-form-model :model="data.form"  label-align="left" :label-col="data.labelCol" :wrapper-col="data.wrapperCol">
        <a-form-model-item label="未注册用户门店显示设置" required>
          <a-radio-group name="radioGroup" v-model="data.form.showShop" @change="changeCheckBox">
            <a-radio :value="index" class="setting-radio" v-for="(item, index) in data.list" :key="index">{{item.description}}</a-radio>
            <a-select placeholder="请选择门店" v-if="data.form.showShop === 1" v-model="data.form.shop" @change="changeStore" style="width: 150px">
              <a-select-option :value="item.id" v-for="item in data.storeList" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="">
          <div class="setting-tips">
            说明：<br>
            1、定位优先：根据用户授权的定位信息显示用户最近的门店，如用户无授权定位，则以系统设置优先;<br>
            2、已注册绑定门店的会员，默认显示绑定门店。
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="saveSetting">
            保存
          </a-button>
        </a-form-model-item>
      </a-form-model>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api'
import router from '@/router'
import { queryParameterList, queryStoreList, updateParameter } from '@/api/modules/mall/store-manage'

interface type {
  description: string
  id: string
  kind: string
  name: string
  value: string
}
export default defineComponent({
  name: 'Setting',
  props: {
    storeId: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    const data = reactive({
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        showShop: 0,
        shop: undefined
      },
      list: [],
      storeList: []
    });
    onMounted(() => {
      getStoreList()
    });
    async function getStoreSetting() {
      data.list = await queryParameterList({ kind: 'ALLSTORE' })
      data.form.showShop = data.list.findIndex((item: type) => JSON.parse(item.value).choose === 'Y')
      const i = data.list.findIndex((item: type) => item.name === 'SHOP_SYS')
      const store = data.storeList.find((item: type) => item.id === JSON.parse((data.list as type[])[i].value).storeId)
      data.form.shop = store ? JSON.parse((data.list as type[])[i].value).storeId : undefined
    }
    async function getStoreList() {
      data.storeList = await queryStoreList({})
      getStoreSetting()
    }
    function changeCheckBox(e: any) {
      data.form.shop = undefined
      data.list.forEach((item: type, index: number) => {
        const value = JSON.parse(item.value)
        value.storeId = ''
        if (e.target.value === index) {
          value.choose = 'Y';
          item.value = JSON.stringify(value)
        } else {
          value.choose = 'N';
          item.value = JSON.stringify(value)
        }
      })
    }
    function changeStore(val: string) {
      const i = data.list.findIndex((item: type) => item.name === 'SHOP_SYS')
      const value = JSON.parse((data.list as type[])[i].value)
      value.storeId = val;
      (data.list as type[])[i].value = JSON.stringify(value)
    }
    async function saveSetting() {
      if (data.form.showShop === 1 && !data.form.shop) {
        context.root.$message.error('请选择门店')
        return
      }
      await updateParameter(data.list)
      context.root.$message.success('保存成功')
    }
    return {
      data,
      saveSetting,
      changeCheckBox,
      changeStore
    };
  },
});
</script>

<style lang="scss" scoped>
.setting{
  font-size: 14px;
  &-radio:nth-child(1){
    margin-left: 14px;
  }
  &-radio:nth-child(2){
    margin-left: 103px;
  }
  &-editcontent{
    display: flex;
    align-items: center;
    margin-top: 20px;
    input{
      width: 200px;
    }
  }
  &-tips{
    color: #80869D;
    font-size: 14px;
    line-height: 25px;
  }
  ::v-deep .ant-form-item-label-left{
    width: 180px;
  }
}
</style>
