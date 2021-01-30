<template>
  <div id="share">
    <header>
      <i class="iconfont icon-notice"></i>
      <span class="text">
        关注公众号及时接收奖励金到账通知
      </span>
      <button @click="showFollow">
        马上关注
      </button>
    </header>
    <main>
      <template v-if="imageUrl">
        <a
          v-if="isApple()"
          href="javascript:;"
        >
          <img
            :src="imageUrl"
            alt="分享图片"
          >
        </a>
        <img
          v-else
          :src="imageUrl"
          alt="分享图片"
        >
      </template>
      <app-loading
        v-else
      />
    </main>
    <footer>
      <p>
        恭喜您获得分销资格，请长按保存图片
      </p>
      <p>
        每推广一位好友下单，您立即获得<mark>{{home.oneCommission}}</mark>元收益
      </p>
    </footer>
    <app-home-button></app-home-button>
  </div>
</template>

<script lang="ts">
import AppHomeButton from "@/components/app-home-button.vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import { getDistributionPosters, imageVerificationCode } from '@/api';
import { useStore } from "vuex";
import AppLoading from "@/components/app-loading.vue";
import { isApple } from '@/utils/platform';

export default defineComponent({
  components: {
    AppHomeButton,
    AppLoading
  },
  setup(){
    const store = useStore();
    const imageUrl = ref('');

    // 获取分享图片
    async function getShareImage() {
      const body = {};

      try {
        const res = await getDistributionPosters(body);
        const blob = await res.blob();
        const file = new File([blob], '分享二维码', {
          type: 'image/jpeg',
        });
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          imageUrl.value = fileReader.result as string;
        }
        // const url = window.URL.createObjectURL(file);
        // imageUrl.value = url;
      } catch (error) {
        console.warn(error);
      }
    }

    function showFollow() {
      store.commit('setIsShowFollow', true);
    }

    function init() {
      getShareImage();
    }

    onMounted(() => {
      init();
    });

    return {
      home: computed(() => store.state.home),
      store,
      showFollow,
      imageUrl,
      isApple,
    }
  }
})
</script>

<style lang="scss" scoped>
#share {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  > header {
    display: flex;
    align-items: center;
    padding: 3vw;
    background: #FFF7F2;
    font-size: 3.2vw;
    color: #1D0800;

    > .iconfont {
      margin-right: 3vw;
      font-size: 5vw;
      color: #FC7125;
    }

    > .text {
      flex-grow: 1;
    }

    > button {
      padding: 1.6vw 5.3vw;
      border-radius: 3.7vw;
      border: 1px solid #FC7125;
      background-color: transparent;
      font-size: 3.2vw;
      color: #FC7125;
    }
  }

  > main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    background: #000000;

    img {
      width: 73vw;
      height: auto;
    }
  }

  > footer {
    padding: 3.2vw;
    background-color: #FFF;

    > p {
      font-size: 3.7vw;
      color: #1D0800;
      text-align: center;
      line-height: 1.5;

      > mark {
        background-color: transparent;
        color: #FC7125;
      }
    }
  }
}
</style>
