
<template>
  <div>
    <div class="content" @click="toastShow = true;">
      <div class="header" :style="{ 'color': themeColor }">
        <img src="../assets/bespeak-record.png" alt="图片">
        <div>{{ new Date(data.reservation_time).format("yyyy-MM-dd HH:mm") }}</div>
      </div>

      <div class="body">
        <div>预约门店：<span>{{ data.shopName }}</span></div>
        <div>预约项目：<span>{{ data.content.slice(0, 12) }}...</span></div>
      </div>
    </div>

    <Toast :type="1" :model="toastShow" :title="'预约资料'" :data="data" @close="toastShow = false"></Toast>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Toast from './Toast';
export default {
  props: ['data'],
  components: {
    Toast
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor
    })
  },
  data() {
    return {
      toastShow: false
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  background-color: white;
  margin-bottom: 10px;
  width: 100%;
  .header {
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #EEEEEE;
    img {
      width: 20px;
      height: 20px;
      padding: 10px;
    }
    div {
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .body {
    padding: 12px;
    div:first-child {
      padding-bottom: 6px;
    }
    div {
      font-size: 14px;
      color: #666666;
      span {
        color: black;
      }
    }
  }
}
</style>

