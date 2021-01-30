<template>
  <div class="advertising">
    <swiper ref="swiper" :options="swiperOption" :class="envelope ? 'envelope': '' ">
      <swiper-slide v-for="(item, index) in sildeContent" :key="index">
        <a>
          <img :src="item.advertisingImg" alt />
        </a>
      </swiper-slide>
      <div slot="pagination" class="swiper-pagination" />
    </swiper>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: {
    swiper,
    swiperSlide
  },
  props: {
    sildeContent: {
      type: Array,
      default: () => []
    },
    envelope: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      swiperOption: {
        on: {
          click: () => {
            const swiper = this.$refs.swiper.swiper
            const i = swiper.activeIndex
            const link = this.sildeContent[i].advertisingLink
            link && (location.href = link)
          }
        },
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.advertising {
  width: 96%;
  height: 6rem;
  margin: 0 auto;
  margin-top: 0.5rem;
  text-align: center !important;
  a {
    display: inline-block;
    width: 24.88rem;
    height: 6rem;
    img {
      font-size: 0;
      width: 100%;
      height: 100%;
    }
  }
  .envelope {
    background-color: #000;
    height: 6rem;
    border-radius: 0.3rem;
    overflow: hidden;
  }
}
</style>
