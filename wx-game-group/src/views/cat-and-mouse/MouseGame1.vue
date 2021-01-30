<template>
  <div class="mouse-game">
    <div class="banner-content">
      <div class="game-time">活动时间：2018-04-29至2018-05-20</div>
    </div>
    <div class="road-content">
      <div class="road-item" v-for="(item, index) in roadFlgList" :key="index">
        <div class="road-left" v-if="item.type === '0'">
          <img src="~@/views/cat-and-mouse/assets/img/gold.png" alt="gold">
        </div>
        <div v-if="item.type === '0'">{{item.distance}}</div>
        <div class="road-right" v-if="item.type === '0'">
          <img src="~@/views/cat-and-mouse/assets/img/gold.png" alt="gold">
        </div>
      </div>
    </div>
    <div class="mouse-hands">
      <div class="left hand">
        <img @click.stop.prevent="catJump" src="~@/views/cat-and-mouse/assets/img/left-hand.png" alt="hand">
      </div>
      <div class="right hand">
        <img @click.stop.prevent="catJump" src="~@/views/cat-and-mouse/assets/img/right-hand.png" alt="hand">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roadFlgList: [
        {
          gift: {
            name: '',
            img: ''
          },
          type: '0',
          distance: 8
        },
        {
          type: '1',
        },
        {
          gift: {
            name: '',
            img: ''
          },
          type: '0',
          distance: 7
        },
        {
          type: '1',
        },
        {
          gift: {
            name: '',
            img: ''
          },
          type: '0',
          distance: 6
        },
        {
          type: '1',
        },
        {
          gift: {
            name: '',
            img: ''
          },
          type: '0',
          distance: 5
        },
        {
          type: '1',
        },
        {
          gift: {
            name: '',
            img: ''
          },
          type: '0',
          distance: 4
        },
        {
          type: '1',
        },
        {
          gift: {
            name: '',
            img: ''
          },
          type: '0',
          distance: 3
        },
        {
          type: '1',
        },
        {
          gift: {
            name: '',
            img: ''
          },
          type: '0',
          distance: 2
        },
        {
          type: '1',
        },
        {
          gift: {
            name: '',
            img: ''
          },
          type: '0',
          distance: 1
        },
      ]
    }
  },
  methods: {
    catJump() {
      let item = {};
      if (this.roadFlgList[0].type === '1') {
        item = {
          gift: {
            name: '',
            img: ''
          },
          type: '0',
          distance: this.roadFlgList[1].distance + 1
        }
      } else {
        item = {
          type: '1'
        }
      }
      this.roadFlgList.unshift(item)
    }
  }
}
</script>

<style lang="scss" scoped>
  .mouse-game {
    -webkit-user-select: none;/*禁用手机浏览器的用户选择功能 */
    -moz-user-select: none;
    position: relative;
    width: 100vw;
    height: 100vh;
    // overflow: hidden;
    .banner-content {
      position: absolute;
      top: 0;
      width: 100%;
      height: 213px;
      background: url('~@/views/cat-and-mouse/assets/img/banner.png') no-repeat;
      background-size: 100% 100%;
      z-index: 3001;
      .game-time {
        color: #ffffff;
        font-size: 11px;
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 40px;
      }
    }
    .road-content {
      position: absolute;
      z-index: 3000;
      top: -22px;
      left: calc(50% - 360px);
      width: 720px;
      height: 800px;
      background: url('~@/views/cat-and-mouse/assets/img/paodao1.png') no-repeat;
      background-size: 100% 100%;
      transform: perspective(200px) rotateX(25deg);
      .road-item {
        height: 37px;
        width: 280px;
        // background-color: #ffffff;
        text-align: center;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .road-left, .road-right {
          width: 40px;
          text-align: center;
          position: relative;
          > img {
            width: 30px;
          }
        }
        // .road-left:before {
        //   content: url('~@/views/cat-and-mouse/assets/img/gift.png');
        //   position: absolute;
        //   top: 0;
        //   left: -80px;
        //   width: 50px;
        //   height: 50px;
        //   background-color: #ffffff;
        // }
      }
    }
    .mouse-hands {
      position: absolute;
      bottom: 90px;
      left: 0;
      z-index: 4000;
      display: flex;
      width: 100%;
      justify-content: space-around;
      .hand {
        width: 108px;
        height: 108px;
        font-size: 0;
        border: 8px solid rgba(248, 123, 123, 0.2);
        border-radius: 50%;
        box-sizing: border-box;
        > img {
          width: 100%;
          border: 8px solid rgba(255, 255, 255, .3);
          border-radius: 50%;
        }
      }
    }
  }
</style>