<template>
  <div class="goods-info">
       <a-form-model
        ref="form"
        :model="data"
        :labelCol="{ span: 3}"
        :wrapperCol="{ span: 11}"
      >
        <a-form-model-item label="自动取消未支付订单：" prop="sysCancel">
          <a-radio-group v-model="data.form.sysCancel.open">
            <a-radio value="Y">
              开启
            </a-radio>
            <a-radio value="N">
              关闭
            </a-radio>
          </a-radio-group>
          <span class="timemspan">
            <a-input-number style="width:120px" v-model="data.sysCancelHour"  :min="0" :max="168"  :step="1" :precision="0"/><span>小时</span>
            <a-input-number style="width:120px" v-model="data.sysCancelMinute" :min="(data.sysCancelHour==0)? 1:0" :max="59" :step="1" :precision="0"/><span>分</span>
          </span>
           <p>订单生成后 ，用户在{{data.sysCancelHour}}小时{{data.sysCancelMinute}}分内未支付，系统自动取消</p>
        </a-form-model-item>
        <a-form-model-item label="自动确认收货时间：" prop="sysShipped">
           <a-radio-group v-model="data.form.sysShipped.open">
            <a-radio value="Y">
              开启
            </a-radio>
            <a-radio value="N">
              关闭
            </a-radio>
          </a-radio-group>
          <span class="timemspan">
            <a-input-number style="width:120px" v-model="data.sysShippedDate" :min="1" :step="1" :precision="0"/><span>天</span>
          </span>
           <p>订单发货后 ，用户在{{data.sysShippedDate}}天内未支付，系统自动确认收货（限配送订单有效）</p>
        </a-form-model-item>
        <a-form-model-item label="减库存方式：" prop="createSubtractStock">
          <a-radio-group v-model="data.form.createSubtractStock">
            <a-radio value="Y">
              下单减库存
            </a-radio>
          </a-radio-group>
          <p>用户提交订单即扣减库存</p>
        </a-form-model-item>
        <a-form-model-item label="是否允许直接发货：" prop="directShipped">
          <a-radio-group v-model="data.form.directShipped">
            <a-radio value="Y">
              开启
            </a-radio>
            <a-radio value="N">
              关闭
            </a-radio>
          </a-radio-group>
           <p>开启后，商家可以在「订单确认」环节，进行备货后发货，无需对已备货订单进行审核。</p>
        </a-form-model-item>
      </a-form-model>
        <div class="custom-title-button">
            <a-button  class="button-style" @click="onReset">恢复默认</a-button>
            <a-button type="primary"  class="button-style" @click="onSubmit">保存</a-button>
        </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api';
import {
  getOrderSetInfo,
  saveOrderSetInfo,
  resetOrderSetInfo
} from '@/api/modules/mall/order-manage/all-order/index';
export default defineComponent({
  setup(props, context) {
    const data = reactive({
      form: {
        sysCancel: { open: '', time: '' },
        sysShipped: { open: '', time: '' },
        createSubtractStock: '',
        directShipped: '',
      },
      rules: {
        sysCancel: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
        ]
      },
      sysCancelMinute: 0,
      sysCancelHour: 0,
      sysShippedDate: 0,
    })
    onMounted(() => {
      getOrderSet();
    })
    const getOrderSet = async () => {
      const body = '';
      const orderSetInfo = await getOrderSetInfo(body);
      data.form = orderSetInfo;
      const sysCancelArr = data.form.sysCancel.time.split('|');
      const sysShippedArr = data.form.sysShipped.time.split('|');
      const hindex = sysCancelArr.findIndex((item:any) => item.search('h') !== -1);
      if (hindex !== -1) {
        data.sysCancelHour = parseInt(sysCancelArr[hindex].split('h')[0]);
      } else {
        data.sysCancelHour = 0;
      }
      const mindex = sysCancelArr.findIndex((item:any) => item.search('m') !== -1);
      if (mindex !== -1) {
        data.sysCancelMinute = parseInt(sysCancelArr[mindex].split('m')[0]);
      } else {
        data.sysCancelMinute = (data.sysCancelHour === 0) ? 1 : 0;
      }
      const dindex = sysShippedArr.findIndex((item:any) => item.search('d') !== -1);
      if (dindex !== -1) {
        data.sysShippedDate = parseInt(sysShippedArr[dindex].split('d')[0]);
      } else {
        data.sysShippedDate = 1;
      }
    }

    const onSubmit = async () => {
      if (data.sysCancelHour === null || data.sysCancelMinute === null) {
        context.root.$message.warning('请自动取消未支付订单时间');
        return false;
      }
      if (data.sysShippedDate === null) {
        context.root.$message.warning('请填写收货时间');
        return false;
      }
      data.form.sysCancel.time = ((data.sysCancelHour > 0) ? data.sysCancelHour + 'h' : '0h') + '|' + ((data.sysCancelMinute > 0) ? data.sysCancelMinute + 'm' : '0m');
      data.form.sysShipped.time = data.sysShippedDate + 'd';
      const body = Object.assign({}, data.form);
      const orderSetInfo = await saveOrderSetInfo(body);
      context.root.$message.success('订单设置成功');
    }
    const onReset = async () => {
      const body = '';
      const isSet = await resetOrderSetInfo(body);
      if (isSet) {
        context.root.$message.success('恢复设置成功');
      }
      getOrderSet();
    }

    return {
      data,
      onReset,
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.goods-info{
  margin-top: 20px;
}
.custom-title-button{
  margin-left: 150px;
}
.button-style{
    width: 68px;
    padding: 7px;
    font-size: 12px;
    margin: 10px;
}
.timemspan *{
 margin-left: 15px;
}
</style>
