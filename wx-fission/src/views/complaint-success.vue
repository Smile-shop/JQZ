<template>
  <main class="complaint-success">
    <div class="complaint-success-title">
      <i class="iconfont icon-xuanze complaint-success-title-icon"></i>
      <div class="complaint-success-title-text">感谢您的反馈</div>
    </div>
    <button class="complaint-success-btn" @click="back">返回</button>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {},
  setup() {
    const data = reactive({
      list: [
        { name: '商家信息欺诈' },
        { name: '奖励未到账' },
        { name: '商品与描述不符' },
        { name: '对我公司的意见和建议' },
      ],
    });
    const router = useRouter();
    const back = () => {
      router.push({
        path: '/home',
      });
    };
    return {
      data,
      back,
    };
  },
});
</script>

<style lang="scss" scoped>
.complaint-success {
  background: #f7f7f7;
  height: 100vh;
  overflow: hidden;
  text-align: center;
  &-title {
    margin-top: 16.8vw;
    &-icon {
      width: 12.6vw;
      height: 12.6vw;
      font-size: 18vw;
      color: #03c160;
    }
    &-text {
      font-size: 3.7vw;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #1d0800;
      line-height: 5.3vw;
      margin-top: 3.5vw;
    }
  }
  &-btn {
    font-size: 3.7vw;
    margin-top: 23.3vw;
    width: 73.1vw;
    height: 10.7vw;
    background: #03c160;
    border-radius: 1.1vw;
    border: none;
    outline: none;
    color: #fff;
  }
}
</style>
