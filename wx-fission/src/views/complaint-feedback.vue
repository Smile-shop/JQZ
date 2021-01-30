<template>
  <main class="complaint-feedback">
    <div class="complaint-feedback-title">请选择反馈类型</div>
    <ul class="complaint-feedback-list">
      <li
        class="complaint-feedback-list-item"
        v-for="item in data.list"
        :key="item"
        @click="select(item)"
      >
        <span class="complaint-feedback-list-item-text">{{ item.name }}</span>
        <span class="iconfont icon-arrow-down-bold complaint-feedback-list-item-icon"></span>
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
interface Item {
  name: string;
}
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
    const select = (item: Item) => {
      router.push({
        path: '/complaint-feedback-detail',
        query: { type: item.name },
      });
    };
    return {
      data,
      select,
    };
  },
});
</script>

<style lang="scss" scoped>
.complaint-feedback {
  background: #f7f7f7;
  height: 100vh;
  &-title {
    font-size: 3.7vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #9d9595;
    line-height: 11.7vw;
    padding: 0 4vw;
  }
  &-list {
    background: #fff;
    padding: 0 4vw;
    &-item {
      height: 11.7vw;
      border-bottom: 1px solid #ebedf0;
      line-height: 11.7vw;
      font-size: 3.7vw;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #1d0800;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-icon {
        transform: rotate(270deg);
        color: #b3b8c1;
      }
    }
  }
}
</style>
