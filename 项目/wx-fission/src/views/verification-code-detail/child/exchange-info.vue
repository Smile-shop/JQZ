<template>
  <main class="info">
    <div class="info-title">兑换信息</div>
    <div class="info-content">
      <div class="info-content-item" v-for="(item, i) in props.productInfo" :key="i">
        <div class="info-content-item-l">{{item.name}}</div>
        <div class="info-content-item-r">{{item.value}}</div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {},
  props: {
    productInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const router = useRouter();
    const back = () => {
      router.push({
        path: '/home',
      });
    };
    return {
      props,
      back,
    };
  },
});
</script>

<style lang="scss" scoped>
.info {
  background: #ffffff;
  border-radius: 2.1vw;
  padding: 5vw 3vw;
  &-title {
    line-height: 4.2vw;
    padding-left: 4vw;
    position: relative;
    font-size: 3.7vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #1d0800;
    &::before {
      position: absolute;
      content: '';
      width: 1.1vw;
      height: 3.7vw;
      background: #fc7125;
      border-radius: 10vw;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  &-content {
    font-size: 3.7vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;

    line-height: 5.3vw;
    &-item {
      display: flex;
      margin-top: 5vw;
      &-l {
        width: 20vw;
        color: #9d9595;
      }
      &-r {
        flex: 1;
        color: #1d0800;
      }
    }
  }
}
</style>
