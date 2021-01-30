<template>
  <div class="contain">
    <div class="top">
      <i class="iconfont icon-back" @click="back">&#xe6a4;</i>
      详情介绍
    </div>
    <swiper ref="swiper" :options="swiperOption">
      <swiper-slide v-for="(item, index) in activeDetail.picList" :key="index" class="slide-item">
        <img :src="item" alt class="pic" />
      </swiper-slide>
      <div slot="pagination" class="swiper-pagination" />
    </swiper>
    <div class="giftName">{{activeDetail.shelfName}}</div>
    <div class="description-content">
      <p>详情介绍</p>
      <div class="descTtext" v-html="activeDetail.productDetail"></div>
    </div>
  </div>
</template>

<script>
import { queryGiftDetail } from '@/axios/api.js'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      imgBase:
        'http://www.jbfsoft.net/jop-wx-web/op/showimage?companyKey=01&imgname=',
      imgEnd: '&alias=',
      loop: [],
      activeDetail: {},
      swiperOption: {
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      }
    }
  },
  created() {
    this._getGiftDetail()
  },

  computed: {},

  watch: {},

  methods: {
    back() {
      this.$router.go(-1)
    },
    _getGiftDetail() {
      const options = {
        activeName: decodeURIComponent(this.$route.query.activeName),
        giftCode: this.$route.query.giftCode
      }
      queryGiftDetail(options)
        .then(res => {
          const { data, code } = res
          if (code == 0) {
            const list = data.picList;
            const start = this.imgBase;
            const end = this.imgEnd+data.photoType;
            data.picList = list.map(item => {
              return start + item + end;
            })
            this.loop = data.picList;
            this.activeDetail = data;
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    // const options = {
    //   activeName: decodeURIComponent(this.$route.query.activeName),
    //   giftCode: this.$route.query.giftCode
    // }
    // queryGiftDetail(options)
    //   .then(res => {
    //     const { code, msg, data } = res
    //     if (code == 0) {
    //       this.activeDetail = data
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
    //  setTimeout(()=>{
    //      new Swiper('.slider-banner', {
    //            speed: 1000,
    //             loop: true,
    //             autoplay: {
    //                 disableOnInteraction: false,
    //                 delay: 4000,
    //             },
    //             preventLinksPropagation: false   // 阻止点击事件冒泡
    //         })
    //  },500)
  }
}
</script>

<style lang='scss'>
//@import url(); 引入公共css类
.contain {
  width: 100vw;
  .top {
    width: 100vw;
    height: 12vw;
    line-height: 12vw;
    text-align: center;
    background: #fff;
    font-size: 4vw;
    padding-right: 8vw;

    .icon-back {
      color: #fe5362;
      font-weight: bold;
      width: 3vw;
      height: 4vw;
      font-size: 6vw;
      float: left;
      vertical-align: middle;
    }

    .icon-share {
      color: #fe5362;
      font-weight: bold;
      width: 3vw;
      height: 4vw;
      font-size: 6vw;
      float: right;
      vertical-align: middle;
    }
  }
  .swiper-pagination-bullet-active {
    background: #d41010 !important;
  }
  .slide-item {
    text-align: center;
  }
  .giftName {
    position: relative;
    padding-left: 0.5rem;
    color: #333;
    font-size: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    background: #fff;
    margin-bottom: 1rem;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -1rem;
      height: 0.3rem;
      width: 100%;
      background: #f5f5f5;
    }
  }
  .description-content {
    background: #f5f5f5;
    p {
      position: relative;
      color: #d41010;
      font-size: 1rem;
      height: 2.5rem;
      line-height: 2.5rem;
      padding-left: 0.5rem;
      margin-bottom: 0.5rem;
      background: #fff;
    }
    .descTtext {
      margin: 0.5rem 0.5rem 0 0.5rem;
      font-size: 1rem;
      word-break: break-all;
    }
  }
  @keyframes fadeIn {
    0% {
      transform: translate3d(100%, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }
}
</style>