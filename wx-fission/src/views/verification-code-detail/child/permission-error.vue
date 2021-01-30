<template>
  <main class="permissionError">
    <img class="permissionError-img" src="@/assets/img/no-power.png" alt />
    <div class="permissionError-text1">您无核销此门店订单的权限</div>
    <div class="permissionError-text2">请联系商家设置</div>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';

export default defineComponent({
  components: {},
  setup(props) {
    return {
      props,
    };
  },
});
</script>

<style lang="scss" scoped>
.permissionError {
  text-align: center;
  &-img{
    width: 32vw;
    margin: 26vw 0 3.4vw 0;
  }
  &-text1{
    font-size: 4.8vw;
    color: #666;
    line-height: 12vw;
  }
  &-text2{
    color: #bbb;
    font-size: 3.7vw;
  }
}
</style>
