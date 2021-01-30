<template>
  <div>
    <div class="app-header">
      <div class="app-header-header" @click="goBack">
        <i v-show="isFirstPage" class="vip-v3-iconfont some-font-color" :style="{ 'color': themeColor }">&#xe60a;</i>
      </div>
      <div class="app-header-body">
        {{ navTitle }}
      </div>
      <div class="app-header-footer" :style="{ 'color': themeColor }" @click="headerRightClick">
        {{ navTitleRight }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: ['navTitle', 'navTitleRight', 'rightUrl'],
  data() {
    return {
    }
  },
  computed: {
    themeColor() {
      return window.localStorage.getItem('themeColor') || '#d41010';
    },
    ...mapState({
      urlData: state => state.urlData,
      isFirstPage: state => state.isFirstPage
    })
  },
  mounted() {
  },
  methods: {
    goBack() {
      if (this.isFirstPage) {
        this.$router.go(-1);
      }
    },
    headerRightClick() {
      // if(this.navTitleRight && this.rightUrl) {
      //   this.$router.push({
      //     path: `${this.rightUrl}`
      //   })
      // }
      this.$emit('headerRightClick');
    }
  }
}
</script>

<style lang="less" scoped>
.app-header {
  display: flex;
  align-items: center;
  height: 44px;
  width: 100%;
  background-color: #ffffff;
  .app-header-header, .app-header-footer {
    width: 120px;
    height: 44px;
    line-height: 44px;
  }
  .app-header-header {
    padding-left: 10px;
    line-height: 44px;
    font-size: 20px;
  } 
  .app-header-footer {
    text-align: right;
    padding-right: 10px;
    font-size: 14px;
  }
  .app-header-body {
    flex-basis: 50%;
    flex-grow: 1;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 1px;
    color: #333333;
  }
}
</style>
