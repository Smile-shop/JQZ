<template>
  <div class="comfirm-order">
    <a-modal
      :title="parentData.title"
      :visible="modalVisible"
      centered
      @cancel="cancel"
    >
      <template>
        <div>
          <!-- 关闭交易 -->
          <p v-if="parentData.modalStatus === 'close'">确定要关闭订单，关闭后客户将无法支付！</p>
          <!-- 处理意见 -->
          <p v-if="parentData.modalStatus === 'resolution'">处理账号：{{parentList.name}}</p>
          <!-- 撤销审核 -->
          <div v-if="parentData.modalStatus === 'cancellation'">
            <p class="cancel-tip">确认撤销「通过申请」操作？</p>
            <p>(撤销操作后，将需重新审核申请)</p>
          </div>
          <!-- 取消备货 -->
          <p v-if="parentData.modalStatus === 'cancelGoods'">取消「订单备货」操作吗？</p>
          <!-- 订单审核 -->
          <p v-if="parentData.modalStatus === 'reviewOrder'" class="cancel-tip">确认进行订单审核吗？</p>
          <!-- 取消订单确认 -->
          <p v-if="parentData.modalStatus === 'cancelOrder'">撤销「订单确认」操作吗？</p>
          <!-- 取消订单审核 -->
          <p v-if="parentData.modalStatus === 'cancelApproval'">撤销「订单审核」操作吗？</p>
          <!-- 修改物流 -->
          <div v-if="parentData.modalStatus === 'modify'">
            <div>
              <p class="modify-title">已录物流信息</p>
              <p class="modify-content">物流信息：顺丰快递</p>
              <p class="modify-content">物流单号：sf1232398989283983</p>
            </div>
            <div>
              <p class="modify-title" style="margin-top: 16px">输入新物流信息</p>
              <p class="modify-content">物流信息：
                <a-select default-value="" style="width: 180px">
                  <a-select-option value="">
                    选择快递
                  </a-select-option>
                  <a-select-option value="shunfeng">
                    顺丰快递
                  </a-select-option>
                  <a-select-option value="yuantong">
                    圆通快递
                  </a-select-option>
                  <a-select-option value="yunda">
                    韵达快递
                  </a-select-option>
                  <a-select-option value="other">
                    其他快递
                  </a-select-option>
                </a-select>
              </p>
              <p class="modify-content">物流单号：&nbsp;&nbsp;<a-input placeholder="请输入单号" style="width: 180px"/></p>
            </div>
          </div>
          <div class="c-textarea-box"
           v-if="parentData.modalStatus === 'close'||
            parentData.modalStatus === 'cancellation' ||
            parentData.modalStatus === 'reviewOrder' ||
            parentData.modalStatus === 'cancelOrder' ||
            parentData.modalStatus === 'cancelApproval' ||
            parentData.modalStatus === 'cancelGoods'"
            >
            <textarea class="c-textarea" v-model="initData.remark" maxlength="400" placeholder="请添加处理意见" rows="4" @keyup="keyEvent"></textarea>
            <span class="c-textarea-number"><span>{{initData.textareaNumber}}</span>/400</span>
          </div>
        </div>
        <!-- 确认收货 -->
        <p v-if="parentData.modalStatus === 'receivingGoods'">确认用户已经收到货了？</p>
        <!-- 确定发货 -->
        <p v-if="parentData.modalStatus === 'sendGoods'">确定要发货吗？</p>
        <!-- 确定备货 -->
        <p v-if="parentData.modalStatus === 'okGoods'">确定要备货吗？</p>
        <!-- 处理意见 -->
        <p v-if="parentData.modalStatus === 'resolution'" class="resolution">{{parentList.remark}}</p>
      </template>
      <template slot="footer">
        <div class="order-f-button">
          <a-button v-if="parentData.modalStatus === 'resolution'" @click="cancel" type="primary">关闭</a-button>
          <template v-else>
            <a-button @click="cancel">取消</a-button>
            <a-button @click="okMethod" type="primary">确定</a-button>
          </template>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api';
export default defineComponent({
  props: {
    modalVisible: {
      type: Boolean,
    },
    // 父组件数据
    parentData: {
      type: Object
    },
    parentList: {
      type: Object
    }
  },
  setup(props, context) {
    const initData = reactive({
      textareaNumber: 0,
      remark: '',
    })
    // 取消
    const cancel = () => {
      context.emit('cancel');
    }
    // 确认
    const okMethod = () => {
      console.log((props.parentData as any).modalStatus)
      // 直接发货
      if ((props.parentData as any).type === 'direct') {
        context.emit('ok-event', (props.parentData as any).modalStatus, initData.remark, (props.parentData as any).type);
      } else {
        context.emit('ok-event', (props.parentData as any).modalStatus, initData.remark);
      }
    }
    // textarea事件
    const keyEvent = (e: any) => {
      initData.textareaNumber = (e.target.value).length;
    }
    return {
      cancel,
      okMethod,
      initData,
      keyEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.c-textarea-box {
  position: relative;
  margin-top: 18px;
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
.cancel-tip {
  color: #263446;
}
.resolution {
  min-height: 76px;
  border-radius: 2px;
  border: 1px solid #D6DDEC;
  padding: 6px 0 6px 12px;
  color: #373E4F;
  margin-top: 18px;
  width: 472px;
}
.modify-title {
  color: #80869D;
}
.modify-content {
  margin-top: 16px;
  padding-left: 20px;
}
</style>
