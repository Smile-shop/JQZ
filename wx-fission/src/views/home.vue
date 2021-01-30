<template>
  <div id="home">
    <header>
      <div class="banner">
        <img :src="home.imgUrl" alt="banner">
      </div>
      <div class="barrage">
        <div
          v-if="home.wserSummaryDtoList && home.wserSummaryDtoList.length"
          class="track"
          :style="{
            animationDuration: '10s',
          }"
        >
          <div
            v-for="(item, index) of home.wserSummaryDtoList.slice(0, 5)"
            :key="index"
            class="bullet"
          >
            <img v-if="item.headimgUrl" :src="item.headimgUrl" alt="头像" />
            <img v-else src="~@/assets/img/avatar.png" alt="头像" />
            {{item.nickname}}&nbsp;&nbsp;已购买
          </div>
        </div>
        <div
          v-if="home.wserSummaryDtoList && home.wserSummaryDtoList.length > 5"
          class="track"
          :style="{
            animationDelay: '2s',
            animationDuration: '12s'
          }"
        >
          <div
            v-for="(item, index) of home.wserSummaryDtoList.slice(5, 10)"
            :key="index"
            class="bullet"
          >
            <img v-if="item.headimgUrl" :src="item.headimgUrl" alt="头像" />
            <img v-else src="~@/assets/img/avatar.png" alt="头像" />
            {{item.nickname}}&nbsp;&nbsp;已购买
          </div>
        </div>
      </div>
    </header>
    <main>
      <div
        v-if="home.isShowStock == 1"
        class="sale"
      >
        <div class="sale-top">
          <div class="left">
            <img src="~@/assets/img/sale.png" alt="促销">
          </div>
          <div v-if="home.status == 3" class="right">
            活动结束了
          </div>
          <div v-if="home.status == 1" class="right">
            距开始
            <span class="time">
              {{time.day}}天
            </span>:
            <span class="time">
              {{time.hour}}
            </span>:
            <span class="time">
              {{time.minute}}
            </span>:
            <span class="time">
              {{time.second}}
            </span>
          </div>
          <div v-if="home.status == 2" class="right">
            距结束
            <span class="time">
              {{time.day}}天
            </span>:
            <span class="time">
              {{time.hour}}
            </span>:
            <span class="time">
              {{time.minute}}
            </span>:
            <span class="time">
              {{time.second}}
            </span>
          </div>
        </div>
        <div class="sale-bottom">
          <div class="left">
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
          <div class="right">
            <div class="progress">
              <div
                :style="{
                  width: `${(home.buyerCount / (home.stock + home.buyerCount) * 100) > 100 ? '100%' : (home.buyerCount / (home.stock + home.buyerCount) * 100)}%`
                }"
                class="current"
                v-if="home.buyerCount > 0"
              >
              </div>
              <div class="text">
                <div class="left">
                  已抢{{home.buyerCount}}
                </div>
                <div class="right">
                  仅剩{{home.stock}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="sale-2"
      >
        <div class="sale-top">
          <div class="left">
            <img src="~@/assets/img/sale.png" alt="促销">
          </div>
          <div v-if="home.status == 3" class="right">
            活动结束了
          </div>
          <div v-if="home.status == 1" class="right">
            距离开始还剩
          </div>
          <div v-if="home.status == 2" class="right">
            距离结束还剩
          </div>
        </div>
        <div class="sale-bottom">
          <div class="left">
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
          <div class="right">
            <span class="time">
              {{time.day}}天
            </span>:
            <span class="time">
              {{time.hour}}
            </span>:
            <span class="time">
              {{time.minute}}
            </span>:
            <span class="time">
              {{time.second}}
            </span>
          </div>
        </div>
      </div>
      <div class="commodity">
        <div class="name">
          {{home.title}}
        </div>
        <div class="detail">
          {{home.secondTitle}}
        </div>
        <div @click="toUser" class="buyers">
          <div
            v-if="top.length"
            class="left"
          >
            <div
              v-for="(item, index) of top.slice(0, 6)"
              :key="index"
              class="avatar"
            >
              <img v-if="item.headimgUrl" :src="item.headimgUrl" alt="头像" />
              <img v-else src="~@/assets/img/avatar.png" alt="头像" />
              <i
                v-if="index < 3"
                class="crown iconfont icon-huangguan"
              >
              </i>
            </div>
            <div
              class="avatar"
            >
              <i class="iconfont icon-gengduo0"></i>
            </div>
          </div>
          <div v-else class="left">
          </div>
          <div class="right">
            <span class="number">
              {{home.buyerCount}}
            </span>
            人已购买
            <i class="iconfont icon-gengduo1"></i>
          </div>
        </div>
      </div>
      <div class="enterprise">
        <div class="left">
          <img class="logo" :src="home.distributionMerchantSettingVo.brandLogo" alt="logo">
          <div class="describe">
            <div class="name">
              <span class="text">
                {{home.distributionMerchantSettingVo.brandName}}
              </span>
              <img src="~@/assets/img/vip.png" alt="图片">
            </div>
            <div class="introduction">
              {{home.distributionMerchantSettingVo.brandIntro}}
            </div>
          </div>
        </div>
        <div class="right">
          <a :href="`tel:${home.distributionMerchantSettingVo.phone}`">
            联系主办方
          </a>
        </div>
      </div>
      <div v-html="home.detail" class="commodity-images">
      </div>
      <app-top
        v-show="home.isOpenRanking == 1"
        v-model="top"
        page="home"
        :type="home.rankingType"
      />
    </main>
    <app-copyright
      :paddingBottom="isShowCountDown ? '18vw' : '5vw'"
    />
    <app-control
      :time="time"
    />
    <div class="fixed">
      <div @click="onShare" class="red-packet">
        <img src="~@/assets/img/red-packet.png" alt="红包">
        <span class="price">
          <span class="cny">
            ￥
          </span>
          {{home.oneCommission}}
        </span>
      </div>
      <div @click="store.commit('setIsShowService', true)" class="service">
        <i class="iconfont icon-kefu"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from "vue-router";
import AppCopyright from '../components/app-copyright.vue';
import AppTop from '../components/app-top.vue';
import AppControl from '../components/app-control.vue';
import { useStore } from 'vuex';
import { getRelativeTime } from '@/utils/time';
import { getMainInfo, queryRanking } from "@/api";
import vuex from '@/store/index'
import AppNeedBuyDialog from '@/components/app-need-buy-dialog.vue';
import AppBuyFailDialog from '@/components/app-buy-fail-dialog.vue';

export default defineComponent({
  components: {
    AppCopyright,
    AppTop,
    AppControl,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const topIsOver = ref(false);
    const top = ref([]);
    const time = ref({
      status: 3,
      day: '0',
      hour: '0',
      minute: '0',
      second: '0',
      millisecond: '0'
    })
    let timer = 0;
    const home = computed(() => store.state.home);

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

    // 用户页面
    function toUser() {
      router.push({
        path: '/user'
      })
    }

    // 分享
    function onShare() {
      router.push({
        path: '/share'
      })
    }

    // 获取首页数据
    async function getHome() {
      const body = {};
      // 倒计时
      function countDown(start: number, end: number) {
        const relativeTime = getRelativeTime(start, end);

        // 结束了
        if (relativeTime.status == 2) {
          time.value = relativeTime;
          getHome();
          return;
        }

        // 状态变换重新请求
        if (relativeTime.status != time.value.status) {
          time.value = relativeTime;
          getHome();
          return;
        }

        time.value = relativeTime;
        timer = setTimeout(() => {
          countDown(start, end);
        }, 200)
      }

      try {
        const res = await getMainInfo(body);

        if (res) {
          store.commit('setHome', res);
          document.title = res.title;
        }
        if (res.status == 3) {
          return;
        } else {
          time.value = getRelativeTime(res.beginTime, res.endTime);
          countDown(res.beginTime, res.endTime);
        }
      } catch (error) {
        console.warn(error);
      }
    }

    onMounted(() => {
      getHome();
    })

    onBeforeUnmount(() => {
      clearTimeout(timer);
    })

    return {
      toUser,
      onShare,
      time,
      top,
      store,
      topIsOver,
      isShowCountDown,
      home: computed(() => store.state.home)
    }
  }
})
</script>

<style lang="scss" scoped>
#home {
  min-height: 100vh;
  background: #F7F7F7;

  > header {
    position: relative;

    > .banner {
      height: 100vw;

      > img {
        object-fit: cover;
        object-position: center center;
        width: 100%;
        height: 100%;
      }
    }

    > .barrage {
      overflow: hidden;
      position: absolute;
      top: 5vw;
      width: 100vw;

      > .track {
        display: flex;
        width: max-content;
        animation-name: roll;
        animation-duration: 10s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        transform: translateX(100vw);

        &:not(:last-of-type) {
          margin-bottom: 5vw;
        }

        @keyframes roll {
          100% {
            transform: translateX(-100%);
          }
        }

        > .bullet {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          padding: .5vw 2vw .5vw .5vw;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 4.8vw;
          font-size: 2.7vw;
          color: #FFFFFF;

          &:not(:last-of-type) {
            margin-right: 5vw;
          }

          > img {
            margin-right: 2vw;
            border-radius: 50%;
            width: 5vw;
            height: 5vw;
            object-fit: cover;
            object-position: center center;
          }
        }
      }
    }
  }

  > main {
    padding: 3vw;

    > div:not(:last-of-type) {
      margin-bottom: 3vw;
    }

    > .sale, .sale-2 {
      padding: 3vw 7.5vw;
      background: linear-gradient(180deg, #FE8F35 0%, #FC5618 100%);
      border-radius: 15vw;

      > .sale-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1vw;

        > .left {
          color: #FFF;
          font-weight: bold;
          font-size: 5.3vw;

          > img {
            height: 5.3vw;
            width: auto;
            vertical-align: middle;
          }
        }

        > .right {
          color: #FFF;
          font-size: 3.2vw;

          > .time {
            display: inline-block;
            margin-left: .2vw;
            border-radius: 1vw;
            padding: .5vw;
            background-color: #FFF;
            color: #FD5C1B;

            &:not(:last-of-type) {
              margin-right: 1vw;
            }
          }
        }
      }

      > .sale-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;

        > .left {
          color: #FFF;
          font-size: 3.7vw;

          > .sale-price {
            font-size: 8vw;
            font-weight: bold;
            margin-right: 1vw;

            > .cny {
              font-size: 3.7vw;
            }
          }

          > .original-price {
            text-decoration: line-through;
          }
        }

        > .right {
          > .progress {
            text-align: end;
            position: relative;
            font-size: 2.7vw;
            border-radius: 5vw;
            background-color: #C14B00;
            width: 39vw;
            color: #FFF;
            height: 4.5vw;

            > .current {
              position: absolute;
              border-radius: 5vw;
              left: 0;
              top: 0;
              min-width: 5vw;
              height: 100%;
              background-color: #FE8B33;
              text-align: center;
              color: #1D0800;
            }

            > .text {
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 2vw;
              line-height: 1;
            }
          }
        }
      }
    }

    > .sale-2 {
      > .sale-top {
        > .right {
          font-size: 3.7vw;
        }
      }

      > .sale-bottom {
        > .right {
          color: #FFF;
          font-size: 3.2vw;

          > .time {
            display: inline-block;
            margin-left: .2vw;
            border-radius: 1vw;
            padding: .5vw;
            background-color: #FFF;
            color: #FD5C1B;

            &:not(:last-of-type) {
              margin-right: 1vw;
            }
          }
        }
      }
    }

    > .commodity {
      border-radius: 3vw;
      padding: 3vw 4vw;
      background-color: #FFF;

      > .name {
        margin-bottom: 1vw;
        font-size: 4.8vw;
        font-weight: bold;
        color: #1D0800;
        line-height: 1.5;
      }

      > .detail {
        margin-bottom: 6vw;
        color: #9D9595;
        font-size: 3.7vw;
        line-height: 1.5;
      }

      > .buyers {
        display: flex;
        align-items: center;
        justify-content: space-between;

        > .left {
          display: flex;
          position: relative;
          flex-grow: 1;

          > .avatar {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 7vw;
            width: 7vw;
            border: 1px solid #FFF;
            border-radius: 50%;
            background-color: #FFF;

            > .crown {
              position: absolute;
              left: -1.8vw;
              top: -2.4vw;
              font-size: 5vw;
            }

            > img {
              object-position: center center;
              object-fit: cover;
              height: 100%;
              width: 100%;
              border-radius: 50%;
            }

            &:not(:last-of-type) {
              margin-right: 2vw;
            }

            &:nth-of-type(1) {
              > .crown {
                color: #FD7B2B;
              }
            }

            &:nth-of-type(2) {
              > .crown {
                color: #B2E2FC;
              }
            }

            &:nth-of-type(3) {
              > .crown {
                color: #F2C29D;
              }
            }

            &:nth-of-type(5) {
              position: absolute;
              left: 30vw;
            }

            &:nth-of-type(6) {
              position: absolute;
              left: 33vw;
            }

            &:nth-of-type(7) {
              position: absolute;
              left: 36vw;
              border-color: #EEE;

              > .iconfont {
                font-size: 3.5vw;
                color: #FC7125;
              }
            }
          }
        }

        > .right {
          color: #9D9595;
          font-size: 3.7vw;

          > .number {
            font-size: 5.3vw;
            color: #1D0800;
          }

          > .iconfont {
            font-size: 3.7vw;
          }
        }
      }
    }

    > .enterprise {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FFFFFF;
      border-radius: 3.2vw;
      padding: 3.7vw 3vw;

      > .left {
        display: flex;
        align-items: center;
        margin-right: 3vw;

        > .logo {
          margin-right: 3vw;
          object-fit: cover;
          object-position: center center;
          border-radius: 50%;
          height: 11vw;
          width: 11vw;
        }

        > .describe {
          > .name {
            display: flex;
            align-items: center;
            margin-bottom: 1.5vw;
            line-height: 1.2;
            font-size: 3.7vw;
            color: #1D0800;

            > .text {
              max-width: 35vw;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            > img {
              margin-left: 2.5vw;
              height: 3vw;
              width: auto;
            }
          }

          > .introduction {
            font-size: 3.2vw;
            color: #9D9595;
          }
        }
      }

      > .right {
        flex-shrink: 0;

        > a {
          border-radius: 5vw;
          border: 1px solid #FC7125;
          padding: 1.6vw 3.2vw;
          font-size: 3.2vw;
          color: #FC7125;
          background-color: #FFF;
        }
      }
    }

    > .commodity-images {
      padding: 2vw;
      background: #FFFFFF;
      border-radius: 3.2vw;
      line-height: 1.5;
      overflow-x: hidden;
      word-break: break-all;

      > img {
        vertical-align: bottom;
        width: 100%;
        height: auto;
      }
    }
  }

  > .fixed {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    right: 2vw;
    top: 60vw;

    > .red-packet {
      display: flex;
      justify-content: center;
      position: relative;
      margin-bottom: 3vw;

      > img {
        width: 20vw;
        height: 28vw;
      }

      > .price {
        position: absolute;
        top: 13.5vw;
        font-size: 3.7vw;
        color: #F9F9F9;

        > .cny {
          font-size: 2.7vw;
        }
      }
    }

    > .service {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 11.7vw;
      height: 11.7vw;
      background: #FFFFFF;
      box-shadow: 0vw 0.5vw 1.6vw 0vw rgba(252,86,24,0.37);

      > .iconfont {
        color: #FC7125;
        font-size: 8vw;
      }
    }
  }
}
</style>
