<template>
  <div class="comfirm-order">
    <a-modal
      title="订单确认"
      :visible="modalVisible"
      centered
      @cancel="cancelClose"
      :width="540"
    >
      <a-form-model :model="initData.form" :label-col="initData.labelCol">
        <a-form-model-item label="取货方式：">
          <a-select v-model="initData.form.recvManner" placeholder="请选择" class="comfirm-width">
            <a-select-option value="EXP">
              快递配送
            </a-select-option>
            <a-select-option value="DIY">
              门店自提
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="导购员：">
          <a-select v-model="initData.form.sale" placeholder="请选择" class="comfirm-width">
            <!-- <a-select-option value="1">
            </a-select-option> -->
          </a-select>
          <span class="select-tip">（门店：{{initData.form.storeName ? initData.form.storeName : '—'}}）</span>
        </a-form-model-item>
        <a-form-model-item label="收件人：">
          <a-input  class="comfirm-width" v-model="initData.form.receiver" />
        </a-form-model-item>
        <a-form-model-item label="收件电话：">
          <a-input  class="comfirm-width" v-model="initData.form.phone"/>
        </a-form-model-item>
        <a-form-model-item label="收货地址：">
          <a-input  class="comfirm-width-w" v-model="initData.form.province"/><span class="comfrim-s">省</span>
          <a-input  class="comfirm-width-w" v-model="initData.form.city"/><span class="comfrim-s">市</span>
          <a-input  class="comfirm-width-w" v-model="initData.form.district"/><span class="comfrim-s">区</span>
          <a-input  class="comfirm-width-area" v-model="initData.form.address"/>
        </a-form-model-item>
        <a-form-model-item label="处理意见：">
          <a-input  class="comfirm-width-w2" v-model="initData.form.remark" placeholder="请添加处理意见(不能超过400字)" :maxLength="400"/>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <div class="order-f-button">
          <a-button @click="cancelClose">取消</a-button>
          <a-button @click="okMethod" type="primary">订单确认</a-button>
          <a-button @click="okFun" class="order-btn" v-if="initData.directShipped === 'Y'">直接发货</a-button>
        </div>
      </template>
    </a-modal>
    <!-- 取消取消订单确认弹窗 -->
    <a-modal
      title="取消订单确认"
      :visible="initData.cancelVisible"
      centered
      @ok="okFun"
      @cancel="cancelFun"
    >
      <p class="c-title">撤销订单确认操作吗？</p>
      <div class="c-textarea-box">
        <textarea class="c-textarea" maxlength="400" placeholder="请添加处理意见" rows="4" @keyup="keyEvent"></textarea>
        <span class="c-textarea-number"><span>{{initData.textareaNumber}}</span>/400</span>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {
  getOrderSetInfo
} from '@/api/modules/mall/order-manage/all-order/index';
import { defineComponent, reactive, onMounted } from '@vue/composition-api';
export default defineComponent({
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
      cancelVisible: false,
      textareaNumber: 0,
      form: {
        recvManner: '',
        sale: '',
        receiver: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        address: '',
        logic: '1',
        remark: '',
        storeName: ''
      },
      // 是否直接发货 Y | N
      directShipped: ''
    })
    onMounted(() => {
      (initData.form as any).recvManner = (props.modalList as any).recvManner;
      (initData.form as any).receiver = (props.modalList as any).receiver;
      (initData.form as any).phone = (props.modalList as any).phone;
      (initData.form as any).province = (props.modalList as any).province;
      (initData.form as any).city = (props.modalList as any).city;
      (initData.form as any).district = (props.modalList as any).district;
      (initData.form as any).address = (props.modalList as any).address;
      (initData.form as any).storeName = (props.modalList as any).storeName;
      getOrderSet();
    })
    // 查询是否直接发货
    const getOrderSet = async () => {
      const body = '';
      const orderSetInfo = await getOrderSetInfo(body);
      initData.directShipped = orderSetInfo && orderSetInfo.directShipped
      console.log(initData.directShipped)
    }
    // 关闭事件
    const cancelClose = () => {
      context.emit('cancel');
    }
    // 取消
    const cancel = () => {
      // context.emit('cancel');
      initData.cancelVisible = true;
    }
    // 确认
    const okMethod = () => {
      // context.emit('cancel');
      context.emit('ok-event', (props.modalList as any).status, (props.modalList as any).remark, initData.form, '');
    }
    // 直接发货
    const okFun = () => {
      context.emit('direct', props.modalList);
    }
    // 取消订单确认
    const cancelFun = () => {
      initData.cancelVisible = false;
    }
    // textarea事件
    const keyEvent = (e: any) => {
      initData.textareaNumber = (e.target.value).length;
    }
    return {
      initData,
      cancel,
      cancelClose,
      okMethod,
      cancelFun,
      okFun,
      keyEvent
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
  width: 400px;
  -moz-user-select:none; /*火狐*/
  -webkit-user-select:none; /*webkit浏览器*/
  -ms-user-select:none; /*IE10*/
  -khtml-user-select:none; /*早期浏览器*/
  user-select:none;
}
.comfirm-width-area {
  width: 140px;
}
.order-btn {
  background: #FFAD11;
  color: #fff;
  border-color: #FFAD11;
}
.c-textarea-box {
  position: relative;
  .c-textarea {
    padding-left: 12px;
    padding-top: 8px;
    width: 100%;
    border-radius:4px;
    border:1px solid rgba(214,221,236,1);
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none;
    &:focus {
      border-color: #0045FF;
    }
  }
  .c-textarea-number {
    position: absolute;
    bottom: 8px;
    right: 8px;
    color: #C0C6D1;
  }
}
</style>
