<template>
  <div class="app-header">
    <div class="left-content" @click="back">
      <i class="iconfont icon-back" v-show="backIcon">&#xe6a4;</i>
    </div>
    <div class="body-content">
      <slot>游戏</slot>
    </div>
    <div class="right-content" @click="sharebox = true">
      <i class="iconfont icon-share">&#xe603;</i>
    </div>
    <div class="sharelayer" ref="shareLayer" v-show="sharebox" @click="sharebox = false">
      <img src="../assets/images/fenxiang.png" />
    </div>
  </div>
</template>

<script>
import { goBackIcon } from '@/utils/set-url-data.js'
export default {
  data() {
    return {
      backIcon: goBackIcon(), // 返回图标
      sharebox: false
    }
  },
  methods: {
    back() {
      if (this.backIcon) {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  background-color: #ffffff;
  height: 44px;
  display: flex;
  align-items: center;
  .left-content,
  .right-content {
    height: 44px;
    line-height: 44px;
    width: 40px;
    text-align: center;
    i {
      font-size: 28px;
      color: #fe5362;
      font-weight: bold;
    }
  }
  .right-content {
    i {
      font-size: 20px;
    }
  }
  .body-content {
    flex-grow: 1;
    text-align: center;
    font-size: 18px;
  }
  .sharelayer {
    width: 100vw;
    min-height: 100%;
    background: rgba(0, 0, 0, 0.8);
    padding: 0;
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;

    & > img {
      float: right;
      width: 13rem;
      height: 10rem;
      margin-top: 1rem;
      margin-right: 1rem;
    }
  }
}
</style>