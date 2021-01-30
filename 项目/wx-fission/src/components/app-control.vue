<template>
  <div class="app-control">
    <div v-if="page == Page.home" class="home">
      <div
        v-if="canBuy"
        class="left"
      >
        <div class="price">
          <div class="explain">
            <img src="~@/assets/img/sale-red.png" alt="促销">
          </div>
          <div class="value">
            <span class="sale-price">
              <span class="cny">
                ¥
              </span>
              {{home.goodsPrice}}
            </span>
            <span class="original-price">
              ¥{{home.origPrice}}
            </span>
          </div>
        </div>
      </div>
      <div
        v-else
        class="left"
      >
        <div
          class="service"
          @click="store.commit('setIsShowService', true)"
        >
          <i class="iconfont icon-kefu"></i>
          客服
        </div>
      </div>
      <div class="right">
        <button
          v-if="home.purchased == 1"
          @click="toBuyFromPage"
        >
          已购买，去填写兑换信息
        </button>
        <button
          v-else-if="home.purchased == 2"
          @click="toVerificationPage"
        >
          查看购买凭证
        </button>
        <button
          v-else-if="home.status == 3"
          disabled
        >
          该活动已结束
        </button>
        <button
          v-else-if="home.status == 1"
          disabled
        >
          活动还未开始
        </button>
        <button
          v-else-if="home.isCanBuy == 1"
          @click="onBuy"
        >
          立即购买
        </button>
        <button
          v-else
          disabled
        >
          商品暂时无法购买
        </button>
      </div>
      <div
        v-if="isShowCountDown"
        class="count-down"
      >
        <span v-if="home.status == 1">
          距离活动开始还剩 {{time.day}}天 : {{time.hour}} : {{time.minute}} : {{time.second}} . {{Math.trunc(time.millisecond / 100)}}
        </span>
        <span v-else>
          距离活动结束还剩 {{time.day}}天 : {{time.hour}} : {{time.minute}} : {{time.second}} . {{Math.trunc(time.millisecond / 100)}}
        </span>
        <div class="arrows"></div>
      </div>
    </div>
    <div v-else class="child">
      <div class="left">
        <router-link to="/home" class="home">
          <i class="iconfont icon-shouye"></i>
          首页
        </router-link>
        <div
          class="service"
          @click="store.commit('setIsShowService', true)"
        >
          <i class="iconfont icon-kefu"></i>
          客服
        </div>
      </div>
      <div
        :class="{
          right: true,
          verification: page == Page.verification
        }"
      >
        <router-link v-if="page == Page.verification" to="/user" custom v-slot="{ navigate }">
          <button class="hollow" @click="navigate">
            排行榜
          </button>
        </router-link>
        <button @click="onShare">
          点我赚更多奖金
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
import appMessage from '@/utils/app-message';
import { addOrderApi, getWXPrepayRsp } from '@/api';

enum Page {
  home,
  child,
  verification,
}

export default defineComponent({
  props: {
    page: {
      type: [String, Number],
      default: Page.home
    },
    time: {
      type: Object,
      default() {
        return {
          status: 3,
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0
        }
      }
    }
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const home = computed(() => store.state.home);

    const canBuy = computed(() => {
      if (
        home.value.purchased != 1
        && home.value.purchased != 2
        && home.value.status != 3
        && home.value.status != 1
        && home.value.isCanBuy == 1
      ) {
        return true;
      }

      return false;
    })

    const isShowCountDown = computed(() => {
      if (
        home.value.purchased != 1
        && home.value.purchased != 2
        && home.value.status != 3
        && (home.value.status == 1 || home.value.isCanBuy == 1)
      ) {
        return true;
      }

      return false;
    })

    async function onBuy() {
      await store.dispatch('pay');
    }

    function toBuyFromPage() {
      router.push({
        path: '/buy-form'
      })
    }

    function toVerificationPage() {
      router.push({
        path: '/verification'
      })
    }

    // 分享
    function onShare() {
      router.push({
        path: '/share'
      })
    }

    return {
      Page,
      store,
      home,
      onBuy,
      toBuyFromPage,
      onShare,
      toVerificationPage,
      canBuy,
      isShowCountDown,
    }
  }
})
</script>

<style lang="scss" scoped>
.app-control {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5vw 4vw;
  background: #FFFFFF;
  box-shadow: 0vw -0.3vw 0.5vw 0vw rgba(252,113,37,0.08);

  > .home, .child {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .left {
      display: flex;

      > .service, .home {
        padding-right: 5vw;
        margin-right: 2vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #9D9595;
        font-size: 3.2vw;

        > .iconfont {
          font-size: 6vw;
          margin-bottom: 1vw;
        }
      }

      > .home {
        color: #FC7125;
      }

      > .price {
        margin-right: 15vw;

        > .explain {
          margin-bottom: 1vw;

          > img {
            height: 5.3vw;
            width: auto;
            vertical-align: middle;
          }
        }

        > .value {
          font-size: 3.7vw;

          > .sale-price {
            font-size: 7.5vw;
            font-weight: bold;
            background: linear-gradient(180deg, #FE8F35 0%, #FC5618 100%);
            background-clip: text;
            color: transparent;
            margin-right: 1vw;

            > .cny {
              font-size: 3.7vw;
            }
          }

          > .original-price {
            text-decoration: line-through;
            color: #999999;
          }
        }
      }

    }

    > .right {
      border-radius: 10vw;
      display: flex;
      align-items: center;
      flex-grow: 1;

      > button {
        border: none;
        flex-grow: 1;
        padding: 4vw 2vw;
        background: #FC7125;
        font-size: 3.7vw;
        color: #FFF;
        border-radius: 10vw;

        &:disabled {
          background-color: #FDB892;
        }
      }
    }

    > .count-down {
      position: absolute;
      border-radius: 5vw;
      padding: 3vw;
      right: 4vw;
      bottom: 20vw;
      background: #FC7125;
      opacity: 0.7;
      font-size: 3.2vw;
      color: #FFF;

      > .arrows {
        position: absolute;
        transform: rotate(45deg);
        right: 20vw;
        bottom: -1.5vw;
        height: 3vw;
        width: 3vw;
        background: #FC7125;
      }
    }
  }

  > .child {
    > .right {
      &.verification {
        > button {
          border-radius: 0 10vw 10vw 0;

          &.hollow {
            padding: calc(4vw - 1px) 2vw;
            background-color: #FFF;
            color: #FC7125;
            border: 1px solid #FC7125;
            border-radius: 10vw 0 0 10vw;
          }
        }
      }
    }
  }
}
</style>
