<template>
  <transition name="ranking-list">
    <div
      v-show="visible"
      class="ranking-list">
      <transition name="shade">
        <div
          v-show="visible"
          @click="close"
          class="ranking-list-shade">
        </div>
      </transition>
      <transition name="main">
        <main
          v-show="visible"
          :class="{
            'ranking-list-content': true,
          }">
          <header>
            <div class="title">
              <div>
                活动说明
              </div>
            </div>
          </header>
          <div class="content">
            <time>
              活动时间：{{gameDetail.beginTime}}至{{gameDetail.endTime}}
            </time>
            <dl class="contact">
              <dt>
                活动联系
              </dt>
              <dd>
                联系地址：{{gameDetail.serviceAddr}}
              </dd>
              <dd>
                联系电话：{{gameDetail.servicePhone}}
              </dd>
            </dl>
            <div class="prize-list" v-if="gameDetail.isShowPhoto === '1'">
              <h3>
                活动奖品
              </h3>
              <ul>
                <li
                  v-for="(item, index) of prizeList"
                  :key="index"
                  @click="toPage(item)"
                >
                  <img :src="item.imgName" alt="奖品">
                  <p>
                    {{item.productName}}
                  </p>
                </li>
              </ul>
            </div>
            <div class="activity-rule">
              <h3>
                活动规则
              </h3>
              <div
                v-html="gameDetail.rule"
                class="content"
              >
              </div>
            </div>
          </div>
        </main>
      </transition>
    </div>
  </transition>
</template>

<script>
import { imagesUrl } from '@/utils/imageURL';

export default {
  data() {
    return {
      rankingList: [],
      isShow: false,
    }
  },
  computed: {
    prizeListFilter(){
      return this.prizeList.filter((value) => {
        return value.isShowPhoto == 1;
      })
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    // 游戏详情
    gameDetail: {
      type: Object,
      required: false,
      default() {
        return {
          beginTime: '',
          endTime: '',
          serviceAddr: '',
          servicePhone: '',
          rule: '',
        }
      }
    },
    // 奖品列表
    prizeList: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  watch: {
    /* visible(value) {
    } */
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    imagesUrl,
    toPage(item) {
      const activeName = encodeURIComponent(this.gameDetail.activityName)
      const Pramas = { activeName, giftCode: item.jmpGiftCode }
      this.$router.push({ path: '/giftdetail', query: Pramas })
    },
  },
}
</script>

<style lang='scss' scoped>
  // 内容
  .main-leave-active, .main-enter-active {
    transition: transform 1s;
  }

  .main-enter, .main-leave-to {
    transform: translateY(100vh);
  }

  .main-enter-to, .main-leave {
    transform: translateY(0);
  }

  // 遮罩
  .shade-leave-active, .shade-enter-active {
    transition: opacity .5s;
  }

  .shade-enter, .shade-leave-to {
    opacity: 0;
  }

  .shade-enter-to, .shade-leave {
    opacity: 1;
  }

  // 主题
  .ranking-list-leave-active, .ranking-list-enter-active {
    transition: all .5s;
  }

  .ranking-list {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;

    > .ranking-list-shade {
      position: absolute;
      height: 100%;
      width: 100%;
      background:rgba(0,0,0,.4);
    }

    > .ranking-list-content {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      top: 50vw;
      background-color: #fff;
      border-top-left-radius: 1vw;
      border-top-right-radius: 1vw;
      padding: 0vw 5vw 5vw 5vw;
      transition: transform .5s;

      > header {
        display: flex;
        justify-content: center;
        position: relative;
        margin-bottom: 11vw;

        > .title {
          position: absolute;
          top: -4vw;
          background:linear-gradient(-24deg,rgba(250,80,30,1) 0%,rgba(253,122,45,1) 61%,rgba(248,172,41,1) 100%);
          box-shadow:0vw 0vw 11vw 0vw rgba(250,80,30,1);
          padding: 2vw 13vw;
          text-align: center;
          font-size: 5vw;
          color: #fff;
          font-weight: bold;
          transform: skew(-15deg);
          border-radius: 3vw;
          line-height: 1;

          > div {
            transform: skew(15deg);
          }
        }
      }

      > .content {
        display: flex;
        flex-direction: column;
        height: calc(100% - 10vw);
        overflow-y: auto;

        > time {
          margin-bottom: 4vw;
          text-align: center;
          font-size:3vw;
          color:rgba(158,158,158,1);
        }

        > .contact {
          margin-bottom: 3vw;
          font-size:3vw;
          color:rgba(52,51,51,1);
          line-height: 2.5;

          > dt {
            font-weight: bold;
          }
        }

        > .prize-list {
          margin-bottom: 7.77vw;
          background:rgba(255,239,228,1);
          border-radius:1vw;
          padding: 5vw 1.33vw 0 1.33vw;

          h3 {
            margin-bottom: 3vw;
            text-align: center;
            font-size:5vw;
            color:rgba(89,88,88,1);
          }

          > ul {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-snap-stop: always;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling:touch;

            > li {
              flex-shrink: 0;
              width: 29vw;
              scroll-snap-align: start;
              padding-bottom: 5vw;

              > img {
                margin-bottom: 2vw;
                height: 31vw;
                width: 100%;
                object-fit: contain;
                object-position: center center;
                padding: 3vw;
                background-color: #fff;
              }

              > p {
                text-align: center;
                font-size:3vw;
                color:rgba(89,88,88,1);
              }

              &:not(:last-of-type) {
                margin-right: 1vw;
              }
            }
          }
        }

        > .activity-rule {
          margin-bottom: 7.77vw;
          background:rgba(255,239,228,1);
          border-radius:1vw;
          padding: 5vw 1.33vw;

          h3 {
            margin-bottom: 3vw;
            text-align: center;
            font-size:5vw;
            color:rgba(89,88,88,1);
            border-bottom: 1px solid #fff;
            padding-bottom: 3vw;
          }

          > .content {
          }
        }
      }
    }
  }
</style>