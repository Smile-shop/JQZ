<template>
  <div class="view-roow">
    <section class="slide-image">
      <el-carousel height="100px">
        <el-carousel-item v-for="item in viewData.advertistings" :key="item.id">
          <img :src="item.advertisingImg" alt style="height: 100%;" />
        </el-carousel-item> 
      </el-carousel>
    </section>
    <section class="title">
      <img src="~@/assets/images/super-mkt/sptj.png" alt />
    </section>
    <section>
      <div class="btns">
        <a href="javascript:void(0)" v-if="viewData.integralIsShow === '1'" class="btn active">积分兑好礼</a>
        <a href="javascript:void(0)" v-if="viewData.smallIsShow === '1'" class="btn">商城精选</a>
      </div>
    </section>
    <section
      class="show-pic"
      v-if="viewData.integralIsShow === '1' || viewData.smallIsShow === '1'"
    >
      <img src="~@/assets/images/super-mkt/pic.png" alt />
    </section>
  </div>
</template>
<script>
export default {
  props: {
    viewData: {
      type: Object,
      default: {}
    }
  }
}
</script>
<style lang="scss" scoped>
.view-roow {
  padding: 0 15px;
  background: #fc4346;
  width: 377px;
  height: 700px;
  overflow: hidden;
  .slide-image {
    margin-top: 15px;
  }
  .title {
    text-align: center;
    img {
      transform: scale(0.5);
    }
  }
  .btns {
    display: flex;
    .btn {
      &.active {
        background: #bd3234 !important;
        color: #fff !important;
        &::after {
          border-width: 15px 15px 0 15px;
          border-color: #bd3234 transparent transparent transparent !important;
        }
      }
      &::after {
        position: absolute;
        bottom: -15px;
        left: calc(50% - 15px);
        content: '';
        display: inline-block;
        width: 0;
        height: 0;
        border-style: solid;
        border-color: #e23c3f transparent transparent transparent;
      }
      display: inline-block;
      position: relative;
      width: 170px;
      height: 44px;
      line-height: 44px;
      border-radius: 44px;
      opacity: 0.8;
      background: #e23c3f;
      margin: 0 auto;
      color: #fff;
      text-align: center;
    }
  }
  .show-pic {
    margin-top: 15px;
    text-align: center;
  }
}
</style>