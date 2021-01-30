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
                排行榜
              </div>
            </div>
          </header>
          <div class="content">
            <div class="table-header">
              <div class="left">
                排名
              </div>
              <div class="middle">
                用户名
              </div>
              <div class="left">
                成绩
              </div>
            </div>
            <ul id="scroll-content">
              <li
                v-for="(item, index) of rankingList"
                :key="index">
                <div
                  class="left">
                  <img
                    v-if="index == 0"
                    src="./img/jiangbei@2x.png"
                    alt="奖牌">
                  <img
                    v-else-if="index == 1"
                    src="./img/yinpai@2x.png"
                    alt="奖牌">
                  <img
                    v-else-if="index == 2"
                    src="./img/tongpai@2x.png"
                    alt="奖牌">
                  <span class="number">
                    {{item.rownum}}
                  </span>
                </div>
                <div class="middle">
                  <img
                    :src="item.avatarUrl"
                    alt="头像"
                  >
                  {{item.nickName}}
                </div>
                <div class="right">
                  {{item.gameDistance}}米
                </div>
              </li>
              <li
                v-if="userRanking"
                class="user-ranking"
              >
                <div
                  class="left"
                >
                  <span class="number">
                    {{userRanking.rownum}}
                  </span>
                </div>
                <div class="middle">
                  <img
                    :src="userRanking.avatarUrl"
                    alt="头像"
                  >
                  我
                </div>
                <div class="right">
                  {{userRanking.gameDistance}}米
                </div>
              </li>
            </ul>
          </div>
        </main>
      </transition>
    </div>
  </transition>
</template>

<script>
import {
  rankingList,
  userRanking
} from '@/axios/cat-and-mouse'

export default {
  data() {
    return {
      rankingList: [],
      userRanking: null,
      /* userRanking: {
        rownum: 21,
        avatarUrl: 'https://www.baidu.com/img/baidu_jgylogo3.gif',
        nickName: '测试',
        gameDistance: 10
      }, */
    }
  },
  computed: {
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    id: {
      type: [Number, String],
      required: true,
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.getRankingList();
        this.getUserRanking();
      }
    }
  },
  mounted() {
    // var ios = navigator.userAgent.indexOf('iphone');
    // if(ios == -1){  
    //     //ios下运行
    //     var divEl = document.querySelector('#scroll-content')//你需要滑动的dom元素
    //     this.iosTrouchFn(divEl);
    // }
  },
  methods: {
    iosTrouchFn(el) {
        //el需要滑动的元素
        el.addEventListener('touchmove',function(e){
            e.isSCROLL = true;
        })
        document.body.addEventListener('touchmove',function(e){
            if(!e.isSCROLL){
                e.preventDefault(); //阻止默认事件(上下滑动)
            }else{
                //需要滑动的区域
                var top = el.scrollTop; //对象最顶端和窗口最顶端之间的距离 
                var scrollH = el.scrollHeight; //含滚动内容的元素大小
                var offsetH = el.offsetHeight; //网页可见区域高
                var cScroll = top + offsetH; //当前滚动的距离
    
                //被滑动到最上方和最下方的时候
                if(top == 0){
                    top = 1; //0～1之间的小数会被当成0
                }else if(cScroll === scrollH){
                      el.scrollTop = top - 0.1;
                }
            }
        }, {passive: false}) //passive防止阻止默认事件不生效
    },
    close() {
      this.$emit('update:visible', false);
    },
    // 获取排行榜数据
    async getRankingList() {
      const body = {
        page: {
          pageNum: 1,
          pageSize: 30
        },
        params: {
          activeId: this.id
        }
      }

      const res = await rankingList(body);
      this.rankingList = res.data.list;
    },
    // 获取用户排行榜数据
    async getUserRanking() {
      const body = {
        activeId: this.id
      }

      const {data} = await userRanking(body);

      if (data) {
        this.userRanking = data;
      }
    },
  },
  destroyed() {
    // document.body.removeEventListener('touchmove', () => {}, {capture: true})
  }
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
      padding: 0vw 2.5vw 2.5vw 2.5vw;
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

        > .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4vw;
          background:linear-gradient(0deg,rgba(255,19,55,1),rgba(253,135,94,1));
          border-radius:5vw;
          padding: 3vw 6vw;
          color: #fff;
          font-weight: bold;
          font-size:4vw;
        }

        > ul {
          flex-grow: 1;
          overflow-y: auto;
          padding: 0 2vw;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 15vw;
          overscroll-behavior: contain;

          > li {
            display: flex;
            align-items: center;
            padding: 2vw 0;

            &.user-ranking {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(255, 42, 63, 1);
              padding: 0 6vw;
              height: 15vw;

              > .left {
                color: #fff;
              }

              > .middle {
                color: #fff;
              }

              > .right {
                color: #fff;
              }
            }

            &:not(:last-of-type) {
              border-bottom: 1px solid rgba(245,235,236,1);
            }

            > .left {
              position: relative;
              display: flex;
              flex-shrink: 0;
              align-items: center;
              justify-content: center;
              align-self: stretch;
              width: 10vw;
              font-size:3vw;
              color:rgba(221,37,40,1);
              font-weight: bold;

              > img {
                height: 9vw;
                width: auto;
              }

              > .number {
                position: absolute;
              }
            }

            > .middle {
              display: flex;
              align-items: center;
              flex-grow: 1;
              font-size: 4vw;
              color:rgba(225,15,8,1);
              font-weight: bold;
              padding-left: 12vw;
              padding-right: 12vw;

              > img {
                object-fit: cover;
                object-position: center center;
                margin-right: 3vw;
                border-radius: 50%;
                height: 10vw;
                width: 10vw;
              }
            }

            > .right {
              flex-shrink: 0;
              font-size: 4vw;
              color:rgba(225,15,8,1);
              font-weight: bold;
            }
          }
        }
      }
    }
  }
</style>