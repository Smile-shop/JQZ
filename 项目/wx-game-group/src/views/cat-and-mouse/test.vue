<template>
  <div class="cat-and-mouse">
    <header>
      {{step}}
    </header>
    <main>
      <div class="track">
        <div
          class="present"
          ref="present"
        >
          <div class="left">
            <img :src="present.url" alt="图片">
          </div>
          <div class="right">
            <p>
              {{present.name}}
            </p>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <button
        @click="start"
      >
        开始
      </button>
      <button
        :disabled="!inProgress"
        @click="runClick"
      >
        跑
      </button>
      <button
        @click="reset"
      >
        重置
      </button>
    </footer>
  </div>
</template>

<script>
import anime from 'animejs';

export default {
  data() {
    return {
      // 游戏开始中
      inProgress: false,
      // 步数
      step: 0,
      // 需要步数
      needStep: 50,
      animeTarget: null,
      present: {
        name: '剃须刀',
        url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576927533627&di=d8ddf02c2e3fed6b706c0b0933503c63&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F1678106cdef43755dfdca358c8e7be77b88157591a189-J5Grb3_fw658'
      },
      presents: []
    }
  },
  computed: {
    // 礼物的DOM
    presentHTML() {
      return this.$refs.present;
    },
  },
  watch: {
    step(value) {
      if (this.inProgress && value == this.needStep) {
        this.getGift();
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 获得礼物
    getGift() {
      alert('得到礼物');
    },
    // 初始化
    init() {
      this.animeTarget = anime({
        targets: this.presentHTML,
        scale: 1.5,
        translateY: 300,
        duration: 2000,
        autoplay: false,
        easing: 'linear'
      });
      /* this.animeTarget = anime({
        targets: this.presentHTML,
        scale: `+=${0.5 / this.needStep}`,
        translateY: `+=${450 / this.needStep}`,
        duration: 500,
        easing: 'linear'
      }); */
    },
    // 重置
    reset() {
      this.step = 0;
      this.animeTarget.reset();
    },
    // 开始
    start() {
      this.inProgress = true;
    },
    // 结束
    end() {
      this.inProgress = false;
    },
    // 跑
    run() {
      this.step++;
      this.move();
    },
    // 移动
    move() {
      this.animeTarget.seek(2000 / this.needStep * this.step);
    }
  },
}
</script>

<style lang='scss' scoped>
  .cat-and-mouse {
    > main {
      display: flex;
      justify-content: center;
      height: 500px;
      background-color: beige;

      > .track {
        overflow: hidden;
        width: 60%;
        height: 100%;
        background-color: #ddd;

        > .present {
          display: flex;
          justify-content: center;
          height: 50px;

          > .left {
            width: 60px;

            > img {
              height: 100%;
              width: auto;
            }
          }

          > .right {
          }
        }
      }
    }
  }
</style>