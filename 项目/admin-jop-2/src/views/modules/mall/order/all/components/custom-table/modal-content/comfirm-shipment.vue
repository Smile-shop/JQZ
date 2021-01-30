<template>
  <div class="comfirm-order">
    <a-modal
      title="订单发货"
      :visible="modalVisible"
      centered
      @cancel="cancel"
      :width="540"
    >
      <a-form-model :model="initData.form" :label-col="initData.labelCol">
        <a-form-model-item label="导购员：">
          <a-select v-model="initData.form.sale" placeholder="请选择" class="comfirm-width">
            <a-select-option value="1">
              马晓明
            </a-select-option>
          </a-select>
          <span class="select-tip">（门店：深圳翠竹店）</span>
        </a-form-model-item>
        <a-form-model-item label="收件人：">
          <a-input  class="comfirm-width" v-model="initData.form.receiver"/>
        </a-form-model-item>
        <a-form-model-item label="收件电话：">
          <a-input  class="comfirm-width" v-model="initData.form.phone"/>
        </a-form-model-item>
        <a-form-model-item label="收货地址：">
          <a-input  class="comfirm-width-w" v-model="initData.form.province"/><span class="comfrim-s">省</span>
          <a-input  class="comfirm-width-w" v-model="initData.form.city"/><span class="comfrim-s">市</span>
          <a-input  class="comfirm-width-w" v-model="initData.form.district" /><span class="comfrim-s">区</span>
          <a-input  class="comfirm-width-area" v-model="initData.form.address"/>
        </a-form-model-item>
        <a-form-model-item label="物流信息：">
          <a-select v-model="initData.form.express" placeholder="请选择" class="comfirm-width">
            <a-select-option value="">
              选择快递
            </a-select-option>
            <a-select-option :value="item.value" v-for="(item, index) in initData.expressList" :key="index">
              {{item.label}}
            </a-select-option>
          </a-select>
          <a-input  class="comfirm-width-w2" v-model="initData.form.expressNo" placeholder="请输入单号"/>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <div class="order-f-button">
          <a-button @click="cancel">取消</a-button>
          <a-button @click="okMethod" type="primary">确认发货</a-button>
        </div>
      </template>
    </a-modal>
    <!-- 弹窗 -->
    <close-deal :parentData="initData.parentData" :modalVisible="initData.modalVisible"  @cancel="cancenFun" @ok-event="okEventFun"></close-deal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api';
import closeDeal from './close-deal.vue'
export default defineComponent({
  components: {
    closeDeal,
  },
  props: {
    modalVisible: {
      type: Boolean,
    },
    modalList: {
      type: Object
    }
  },
  setup(props, context) {
    const initData = reactive({
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      parentData: {
        title: '确定发货', // 子组件弹窗标题
        modalStatus: 'sendGoods' // 子组件弹窗标识
      },
      modalVisible: false,
      form: {
        express: '',
        sale: '',
        receiver: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        address: '',
        logic: '1',
        expressNo: ''
      },
      expressList: [
        {
          label: '顺丰快递',
          value: 'shunfeng'
        },
        {
          label: '圆通快递',
          value: 'yuantong'
        },
        {
          label: '韵达快递',
          value: 'yunda'
        },
        {
          label: '其他快递',
          value: 'other'
        },
      ]
    })
    onMounted(() => {
      (initData.form as any).recvManner = (props.modalList as any).recvManner;
      (initData.form as any).receiver = (props.modalList as any).receiver;
      (initData.form as any).phone = (props.modalList as any).phone;
      (initData.form as any).province = (props.modalList as any).province;
      (initData.form as any).city = (props.modalList as any).city;
      (initData.form as any).district = (props.modalList as any).district;
      (initData.form as any).address = (props.modalList as any).address;
    })
    // 取消
    const cancel = () => {
      context.emit('cancel');
    }
    // 确认
    const okMethod = () => {
      initData.modalVisible = true;
    }
    // 二次弹窗取消
    const cancenFun = () => {
      initData.modalVisible = false;
    }
    // 二次弹窗确定
    const okEventFun = () => {
      context.emit('ok-event', (props.modalList as any).status, (initData.form as any).express, (initData.form as any).expressNo);
    }
    return {
      initData,
      cancel,
      okMethod,
      okEventFun,
      cancenFun
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .comfirm-width {
  width: 118px;
}
.select-tip {
  font-size: 14px;
  margin-left: 18px;
}
.comfirm-width-w {
  width: 53px;
}
.comfrim-s {
  margin: 0 10px;
}
.comfirm-width-w2 {
  width: 250px;
  margin-left: 26px;
}
.comfirm-width-area {
  width: 140px;
}
</style>
