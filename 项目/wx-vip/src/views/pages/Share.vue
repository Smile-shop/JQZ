<template>
  <div>
    <div class="content" :style="{ 'background-color': themeColor }">
      <div class="div1">将此页面发给指定好友或分享到朋友圈</div>
      <div class="div2">邀请好友注册就送积分</div>
      <div class="share-btn" @click="shareShow = true">马上分享</div>
    </div>

    <div class="go-share-img" v-show="shareShow" @click="shareShow = false">
      <img src="../../assets/guide.png" alt="去分享">
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      themeColor: state => state.themeColor
    })
  },
  data() {
    return {
      shareShow: false
    }
  },
  created() {
    // this.$store.dispatch('goShare');
  }
}
</script>


<style lang="less" scoped>
.content {
  width: 100%;
  height: calc(100vh - 75px);
  background: url("../../assets/share-background.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  .div1, .div2 {
    position: absolute;
    color: white;
    font-size: 16px;
    font-weight: 500;
    width: 100vw;
    text-align: center;
    left: 0;
  }
  .div1 {
    bottom: 60vw;
  }
  .div2 {
    bottom: 50vw;
  }
  .share-btn {
    position: absolute;
    background-color: #16A5D4;
    color: white;
    width: 210px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 18px;
    border-radius: 22px;
    bottom: 30vw;
    left: calc((100vw - 210px)/2);
  }
}
.go-share-img {
  position: fixed;
  top: 0;
  background-color: black;
  width: 100vw;
  height: 100vh;
  opacity: .8;
  img {
    float: right;
    width: 160px;
  }
}
</style>
