<template>
  <div class="not-found">
    <img src="~@/assets/img/404.png" alt="404">
    <p>页面不见了，请返回首页</p>
    <router-link to="/home">
      返回首页
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup(props, { emit }){
    return {};
  }
})
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16vw;
  min-height: 100vh;
  width: 100vw;

  > img {
    margin-bottom: 8vw;
    width: 53vw;
    height: auto;
  }

  > p {
    margin-bottom: 10vw;
    font-size: 3.7vw;
    color: #999999;
  }

  > a {
    border: none;
    padding: 2.7vw 10vw;
    border-radius: 10vw;
    font-size: 3.7vw;
    color: #FFFFFF;
    background: #FC7125;
  }
}
</style>
