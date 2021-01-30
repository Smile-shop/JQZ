<template>
  <div class="setting">
    <a-form-model :model="data.form"  label-align="left" :label-col="data.labelCol" :wrapper-col="data.wrapperCol">
      <a-form-model-item label="配送方式" required>
        <a-checkbox-group v-model="data.form.type" @change="changeCheckBox" class="setting-checkbox">
          <span class="setting-men" v-for="(item, index) in data.sendType" :key="index">
            <a-checkbox :value="item.id" name="type">{{ item.parmDes }}<span v-if="item.displayName.trim() !== item.parmDes">（{{ item.displayName }}）</span></a-checkbox>
            <div class="setting-men-box">
              <a-icon class="edit" @click.stop="edit(index)" type="edit" />
            </div>
          </span>
        </a-checkbox-group>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="saveSetting">
          保存
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <a-modal v-model="data.visible" title="编辑" width="360px">
      <div>当前页面展示：{{data.showContent}}</div>
      <div class="setting-editcontent">修改页面显示：<a-input placeholder="请输入内容, 最长10个字" v-model="data.displayName" :max-length="10" class="setting-input" /></div>
      <div class="setting-tips">温馨提示：此设置只会变更页面显示</div>
      <div slot="footer">
        <a-button type="primary" @click="editDisplayName">确定</a-button>
        <a-button @click="cancel">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api'
import PageTable from '@/layout/page-table.vue'
import router from '@/router'
import { querByStoId, updateStoreParameter, updateByStoId } from '@/api/modules/mall/store-manage'
interface editData {
  appId: string
  displayName: string
  id: string
  parmId: string
  storeId: string
  value: string
}
export default defineComponent({
  name: 'Setting',
  components: { PageTable },
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
        type: [],
        showShop: 1,
        shop: undefined
      },
      active: 0,
      sendType: [],
      visible: false,
      showContent: '',
      displayName: ''
    });
    onMounted(() => {
      getStoreSetting()
    });
    async function getStoreSetting() {
      const res = await querByStoId(props.storeId)
      data.sendType = res;
      (data.form.type as string[]) = (data.sendType as editData[]).filter((item: editData) => item.value === 'Y').map((item: editData) => item.id)
    }
    function back() {
      router.go(-1)
    }
    function changeCheckBox(val: any) {
      data.sendType.forEach((item: editData) => {
        if (val.includes(item.id)) {
          item.value = 'Y'
        } else {
          item.value = 'N'
        }
      })
    }
    async function editDisplayName() {
      const editData: editData | undefined = (data.sendType as editData[]).find((item: editData) => item.displayName === data.showContent)
      const body = Object.assign({}, editData)
      changDisName(body)
      await updateStoreParameter(body)
      context.root.$message.success('保存成功')
      changDisName(editData)
      data.visible = false
    }
    function changDisName(body: editData | undefined) {
      if (body && body.displayName) {
        body.displayName = data.displayName
      }
    }
    function edit(index: number) {
      data.visible = true
      data.displayName = ''
      data.showContent = (data.sendType[index] as any).displayName
    }
    function cancel() {
      data.visible = false
    }
    async function saveSetting() {
      if (!data.form.type.length) {
        context.root.$message.error('请选择配送方式')
        return
      } else if (data.form.showShop === 2 && !data.form.shop) {
        context.root.$message.error('请选择门店')
        return
      }
      await updateByStoId(data.sendType)
      context.root.$message.success('保存成功')
    }
    return {
      data,
      back,
      edit,
      cancel,
      saveSetting,
      changeCheckBox,
      editDisplayName
    };
  },
});
</script>

<style lang="scss" scoped>
.setting{
  font-size: 14px;
  &-checkbox{
    margin-left: 80px;
  }
  &-men{
    display: inline-block;
    &:nth-child(1){
      margin-right: 80px;
    }
    .edit{
      display: none;
      &:hover{
        color:#0045ff;
      }
    }
    &-box{
      width: 14px;
      display: inline-block;
    }
    &:hover{
      .edit{
        display: inline-block;
        cursor: pointer;
      }
    }
  }
  &-radio{
    margin-left: 66px;
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
    margin-top: 24px;
  }
  ::v-deep .ant-form-item-label-left{
    width: 81px;
  }
}
</style>
