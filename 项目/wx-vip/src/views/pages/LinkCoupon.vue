<template>
  <div class="link-coupon" @scroll="onScroll">
    <img
      class="link-coupon-img"
      :src="bgType.find(item => item.type === themeClass) ? bgType.find(item => item.type === themeClass).bg : require('@/assets/01.png')"
      alt="bg"
    />
    <div class="link-coupon-maskBox" id="mask">
      <div class="link-coupon-btnBox" v-if="showBtn">
        <div class="link-coupon-btnBox-btn" @click="getCoupon">
          <img
            :src="bgType.find(item => item.type === themeClass) ? bgType.find(item => item.type === themeClass).btn : require('@/assets/gj01.png')"
            alt
          />
        </div>
      </div>
      <div class="link-coupon-maskBox-content">
        <div class="result" v-if="showType">
          <div class="result-con">
            <img
              class="result-img"
              @click="myCoupon"
              v-if="showType != 4 && showType != 1"
              :src="showType == 2 ? require('@/assets/mzj.png') : require('@/assets/sb.png')"
              alt
            />
            <div class="result-zj zj" v-if="showType == 1">
              <div class="result-zj-box" @click="myCoupon">
                <img class="result-zj-box-bg" src="@/assets/zj-bg1.png" alt />
                <div class="result-zj-box-amount">
                  {{ amount }}
                  <span class="result-zj-box-amount-y">元</span>
                  <img class="result-zj-box-amount-icon" src="@/assets/icon-coupon.png" alt />
                </div>
                <div class="result-zj-box-btn">恭喜您获得一张优惠券，点击优惠券查看</div>
              </div>
            </div>
            <div class="result-zj" v-if="showType != 1">
              <div class="result-zj-text jieshu">{{ msg }}</div>
            </div>
          </div>
        </div>
      </div>
      <canvas
        id="canvas"
        @touchmove="touchmove"
        v-if="!showPrize"
        @touchstart="touchstart"
        @touchend="touchend"
        width="616"
        height="320"
      ></canvas>
    </div>
    <div
      class="link-coupon-guize"
      :style="themeClass != 2 ?  'color: #7d5b3e' : 'color: #666'"
      v-html="configurationPage"
    ></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'LinkCoupon',
  data() {
    return {
      canvas: '', //画布
      ctx: '', //画笔
      ismousedown: false, //标志用户是否按下鼠标或开始触摸
      rootFont: '', // 获取html字体大小
      isScratch: false, // 是否刮过卡
      showPrize: false, // 显示奖品
      clientWidth: null,
      scrollTop: 0,
      showBtn: true,
      count: 0,
      showType: '', // 1 中奖 2 过期 3 领取失败 4 活动结束 / 未参加该活动 / 已抢光
      amount: 0,
      bgType: [
        {
          type: '1',
          bg: require('@/assets/01.png'),
          btn: require('@/assets/gj01.png'),
        },
        {
          type: '2',
          bg: require('@/assets/02.png'),
          btn: require('@/assets/gj02.png'),
        },
        {
          type: '3',
          bg: require('@/assets/03.png'),
          btn: require('@/assets/gj03.png'),
        },
        { type: '0', bg: '', btn: require('@/assets/gj01.png') },
      ],
      themeClass: '1',
      configurationPage: `<p>1、幸运刮刮卡</p><p>2、幸运刮刮卡</p><p>3、幸运刮刮卡</p><p>4、幸运刮刮卡</p><p>5、幸运刮刮卡</p>`,
      urlData: {},
      msg: '',
    };
  },
  mounted() {
    this.initCanvas();
    this.getPageSetting();
    this.shareStop();
  },
  methods: {
    shareStop() {
      setTimeout(() => {
        this.$store.dispatch('stopShare');
      }, 2000);
    },
    getCoupon() {
      this.showBtn = false;
      const { openid, companyKey, receiveid, eventid } = this.urlData;
      const body = {
        openid,
        companyKey,
        receiveid,
        eventid,
      };
      this._http({ url: '/jop-web/wxMember/getCoupon' }, body)
        .then((res) => {
          const data = res.data;
          if (!data.code) {
            const data = res.data.data;
            this.msg = data.msg;
            if (!data.state || data.state == 6) {
              this.amount = data.amount;
              this.showType = 1;
              if (data.state == 6) {
                this.showPrize = true;
              }
            } else {
              this.showPrize = true;
              if (data.state == 2) {
                this.showType = 3;
              } else if (data.state == 4 || data.state == 5) {
                this.showType = 2;
              } else {
                this.showType = 4;
              }
            }
          } else {
            this.$toast({
              message: res.data.msg,
              duration: 3000,
            });
          }
        })
        .catch((err) => console.log(err));
    },
    getPageSetting() {
      this.urlData = JSON.parse(localStorage.getItem('urlData')) || {};
      const { openid, companyKey, receiveid, eventid } = this.urlData;
      const body = {
        openid,
        companyKey,
        receiveid,
        eventid,
      };
      this._http({ url: '/jop-web/wxMember/couponIndex' }, body)
        .then((res) => {
          const data = res.data;
          if (!data.code) {
            document.title = data.data.titlePage;
            this.themeClass = data.data.themeClass;
            this.configurationPage = data.data.configurationPage;
            if (this.themeClass == 0) {
              this.bgType[3].bg = data.data.themebackground;
            }
          } else {
            this.$toast({
              message: res.data.msg,
              duration: 3000,
            });
          }
        })
        .catch((err) => console.log(err));
    },
    myCoupon() {
      this.$router.push(`/coupons/1`);
    },
    onScroll() {
      this.scrollTop = document.getElementsByClassName(
        'link-coupon'
      )[0].scrollTop;
    },
    initCanvas() {
      // 获取根字体大小
      this.rootFont = parseInt(
        window.getComputedStyle(document.documentElement, null)['font-size']
      );
      this.canvas = document.getElementById('canvas');
      this.clientWidth = document.documentElement.clientWidth;
      (this.canvas.width = Math.floor((this.clientWidth * 616) / 750)), //canvas宽 = 屏幕宽 * 设计稿里画布宽 / 750
        (this.canvas.height = Math.floor((this.clientWidth * 320) / 750)), //canvas高 = 屏幕宽 * 设计稿里画布高 / 750
        (this.canvas.style.width = this.canvas.width + 'px');
      this.canvas.style.height = this.canvas.height + 'px';
      this.ctx = this.canvas.getContext('2d');
      // 填充颜色背景
      // this.ctx.fillStyle = "#e5e5e5";
      // this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
      // this.ctx.fill();
      // 填充图片背景
      const fillImg = new Image();
      fillImg.src = require('@/assets/gua.png');
      fillImg.onload = () => {
        this.ctx.fillStyle = this.ctx.createPattern(fillImg, 'repeat');
        this.ctx.fillRect(
          0,
          0,
          this.canvas.clientWidth,
          this.canvas.clientHeight
        );
        this.ctx.globalCompositeOperation = 'destination-out';
      };
      //有些老的手机自带浏览器不支持destination-out,下面的代码中有修复的方法
      this.canvas.style.display = 'inherit';
    },
    touchstart(e) {
      e.preventDefault();
      this.ismousedown = true;
    },
    touchend(e) {
      e.preventDefault();
      // 填充颜色背景可用
      // let data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data, half = 0;
      // for (let i = 3, length = data.length; i < length; i += 4) {//因为有rgba四个值，下标0开始，所以初始i=3
      //     data[i] === 0 && half++;//存在imageData对象时half加1  PS:该像素区域透明即为不存在该对象
      // }
      // //当刮开的区域大于等于50%时，清空画布
      // if (half >= this.canvas.width * this.canvas.height * 0.5) {
      //     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);//清空画布
      // }
      if (this.count > 250) {
        this.showPrize = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //清空画布
      }
      setTimeout(() => {
        this.showPrize = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //清空画布
      }, 5000);
      this.ismousedown = false;
    },
    touchmove(e) {
      e.preventDefault();
      if (this.ismousedown) {
        if (e.changedTouches) {
          e = e.changedTouches[e.changedTouches.length - 1];
        }
        this.count++;
        const mask = document.getElementById('mask');
        const oX = this.canvas.offsetLeft + mask.offsetLeft,
          oY = this.canvas.offsetTop + mask.offsetTop - this.scrollTop;
        const x = (e.clientX + document.body.scrollLeft || e.pageX) - oX || 0,
          y = (e.clientY + document.body.scrollTop || e.pageY) - oY || 0;
        //画出来是透明的
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.rootFont * 0.4, 0, Math.PI * 2, true); // 调整画笔的大小
        this.ctx.fill();
      }
    },
  },
};
</script>


<style lang="less" scoped>
.link-coupon {
  position: relative;
  &-btnBox {
    position: absolute;
    height: 160px;
    width: 308px;
    left: 50%;
    margin-left: -154px;
    z-index: 11;
    &-btn {
      width: 159px;
      height: 36px;
      position: absolute;
      left: 50%;
      margin-left: -79.5px;
      top: 50%;
      margin-top: -18px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  &-img {
    width: 375px;
  }
  &-maskBox {
    position: absolute;
    width: 308px;
    height: 160px;
    left: 50%;
    margin-left: -154px;
    top: 382px;
    &-content {
      position: absolute;
      height: 100%;
      width: 100%;
      text-align: center;
      .result {
        position: absolute;
        height: 159px;
        width: 307px;
        background: #fdd97c;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        &-img {
          width: 40px;
          height: 38px;
          position: relative;
          z-index: 10;
        }
        .zj {
          height: 160px;
          width: 308px;
        }
        &-zj {
          &-box {
            position: absolute;
            width: 100%;
            height: 160px;
            &-bg {
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              position: absolute;
              width: 280px;
            }

            &-amount {
              position: relative;
              z-index: 10;
              top: 24px;
              font-size: 60px;
              font-family: Source Han Sans CN;
              font-weight: 800;
              color: #fffefe;
              opacity: 1;
              text-shadow: 0px 3.5px 0px rgba(164, 25, 23, 0.56);
              display: flex;
              align-items: baseline;
              width: 100%;
              justify-content: center;
              &-icon {
                width: 68px;
                height: 25px;
              }
              &-y {
                font-size: 17px;
                font-family: Source Han Sans CN;
                font-weight: 500;
                color: #fffefe;
                display: inline-block;
                margin-right: 10px;
                text-shadow: none;
              }
            }
            &-btn {
              position: absolute;
              width: 100%;
              top: 105px;
              left: 50%;
              transform: translate(-50%);
              z-index: 10;
              font-size: 11px;
              font-family: Alibaba PuHuiTi;
              font-weight: 400;
              color: #fff;
              line-height: 30px;
              &-text {
                color: #4ca2f2;
              }
            }
          }
          &-text {
            font-size: 14px;
            font-family: Alibaba PuHuiTi;
            font-weight: 500;
            color: #ff4836;
            line-height: 30px;
          }
          .jieshu {
            color: #562a02;
          }
        }
      }
    }
    #canvas {
      position: relative;
      z-index: 10;
    }
  }
  &-guize {
    width: 279px;
    height: 203px;
    overflow-y: auto;
    position: absolute;
    left: 50%;
    top: 586px;
    margin-left: -139.5px;
    font-size: 12px;
    font-family: Alibaba PuHuiTi;
    font-weight: 400;
    line-height: 20px;
    /deep/ p {
      margin: 0;
      line-height: 20px;
    }
  }
}
</style>

