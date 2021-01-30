<template>
  <page-wrapper class="storeDetail">
    <!-- <a class="storeDetail-back" @click="back"><a-icon type="arrow-left" />返回</a> -->
    <a-tabs :default-active-key="data.active" @tabClick="change">
      <a-tab-pane :key="0" tab="门店基础资料" >
        <base-data @getStoreId="getStoreId" @getStatus="getStatus" />
      </a-tab-pane>
      <!-- <a-tab-pane :key="1" tab="门店人员信息" >
        <sale-mans-list />
      </a-tab-pane> -->
      <a-tab-pane :key="2" tab="设置" :disabled="data.status=='CLOSE'">
       <setting :storeId="data.storeId" />
      </a-tab-pane>
    </a-tabs>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api'
import baseData from './child/baseData.vue'
import saleMansList from './child/saleMansList.vue'
import setting from './child/setting.vue'

import router from '@/router'
export default defineComponent({
  name: 'StoreDetail',
  components: { baseData, saleMansList, setting },
  setup(props, context) {
    const data = reactive({
      tabs: ['门店基础资料', '门店人员信息', '设置'],
      active: 0,
      storeId: '',
      status: 'OPEN'
    });
    function back() {
      router.go(-1)
    }
    function change(val: number) {
      data.active = val
    }
    function getStoreId(val: string) {
      data.storeId = val
    }
    function getStatus(val: string) {
      data.status = val
    }
    onMounted(() => {

    });

    return {
      data,
      back,
      change,
      getStoreId,
      getStatus
    };
  },
});
</script>

<style lang="scss" scoped>
.storeDetail{
  // padding: 24px;
  background: #fff;
  position: relative;
  &-back{
    position: absolute;
    right: 30px;
    top: 35px;
    z-index: 1;
  }
}
</style>
