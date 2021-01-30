<template>
  <div class="envelope-list">
    <div v-for="(item, index) in list" :key="index" class="product-item">
      <ul>
        <li class="pic" @click="toDetailPage(item.code)">
          <img
            v-if="item.pic_url.includes('imgname=&')"
            src="./images/no-images-mid.png"
            alt="product"
          />
          <img v-else :src="item.pic_url" alt="product" />
        </li>
        <li class="name">{{ item.productName }}</li>
        <li class="integral">
          <span v-if="item.price">{{ item.price }}&nbsp;元</span>
          <span v-else>{{ item.onlineIntegral }}&nbsp;积分</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import baseUrl from '@/config/config.js'
import { getLocalStorage } from '@/utils/local-storage'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    select: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      userInfo: getLocalStorage()
    }
  },
  methods: {
    toDetailPage(code) {
      if (code) {
        let url = ''
        if (this.select === 1) {
          url = `${baseUrl}/wx-interface-web/wx/auth?v=${Date.now()}&companyKey=${
            this.userInfo.companyKey
          }&page=wx_point_mall&childPage={"path":"/product-detail","query":{"id":"${code}"}}`
        } else {
          url = `${baseUrl}/wx-interface-web/wx/auth?v=${Date.now()}&companyKey=${
            this.userInfo.companyKey
          }&page=wx_mall&childPage={"path":"/home/product-detail/${code}"}`
        }
        location.href = encodeURI(url)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/rem.scss';
.envelope-list {
  overflow: hidden;
}

.product-item {
  display: inline-block;
  width: 47%;
  height: 59vw;
  margin-left: 0.5rem;
  margin-bottom: 0.4rem;
  border-radius: 0.3rem;
  overflow: hidden;
  .pic {
    font-size: 0;
    width: 100%;
    height: 46.5vw;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .name,
  .integral {
    padding-top: 1vw;
    font-size: 3.8vw;
    padding-left: 2.5vw;
    color: #333;
    background: #fff;
  }
  .integral {
    color: #ca3638;
    padding-bottom: 4px;
    span {
      // font-size: px2rem(28);
      font-size: 3.8vw;
      color: #ca3638;
    }
  }
}
</style>
