<template>
  <div class="recommendation">
    <header />
    <div
      v-show="!envelope"
      v-if="detail.integralIsShow === '1' && detail.smallIsShow ==='1'"
      class="btns"
    >
      <h3 class="slogan btn" :class="{'active': active1}" @click="getGiftList()">
        <i class="iconfont icon-jinbiduihuan" />
        <span>积分兑好礼</span>
      </h3>
      <h3 class="slogan btn" :class="{'active': active2}" @click="getGiftList()">
        <i class="iconfont icon-gouwuche" />
        <span>商城精选</span>
      </h3>
    </div>

    <div
      v-show="envelope"
      v-if="detail.integralIsShow === '1' && detail.smallIsShow ==='1'"
      class="btns"
    >
      <h3 class="envelope btn" :class="{'actives': active1}" @click="getGiftList()">
        <i class="iconfont icon-jinbiduihuan" />
        <span>积分兑好礼</span>
      </h3>
      <h3 class="envelope btn" :class="{'actives': active2}" @click="getGiftList()">
        <i class="iconfont icon-gouwuche" />
        <span>商城精选</span>
      </h3>
    </div>

    <h3
      v-else-if="detail.integralIsShow === '1' || detail.smallIsShow === '1'"
      class="envelope"
      :class="{'active': active1}"
    >
      <i class="iconfont icon-jinbiduihuan" />
      <span v-if="detail.integralIsShow === '1'">积分兑好礼</span>
      <span v-if="detail.smallIsShow === '1'">商城精选</span>
    </h3>
    <product-list
      v-show="!envelope"
      v-if="detail.integralIsShow === '1' || detail.smallIsShow==='1'"
      :list="productList"
      :select="select"
    />
    <envelope-list
      v-show="envelope"
      v-if="detail.integralIsShow === '1' || detail.smallIsShow==='1'"
      :list="productList"
      :select="select"
    />
  </div>
</template>

<script>
import baseUrl from '@/config/config.js'
import { getLocalStorage } from '@/utils/local-storage'
import { productList, scoreProductList } from '@/axios/tiger'
import ProductList from './ProductList'
import EnvelopeList from './EnvelopeList'
export default {
  components: {
    ProductList,
    EnvelopeList
  },
  props: {
    detail: {
      type: Object,
      default: () => {}
    },
    envelope: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      select: 1,
      active1: true,
      active2: false,
      productList: []
    }
  },
  watch: {
    'detail.integralIsShow': {
      handler: function(newVal) {
        if (newVal === '1') {
          this._getScoreProductList()
        } else {
          if (this.detail.smallIsShow === '1') {
            this._getProductList()
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    async _getScoreProductList() {
      const ck = getLocalStorage().companyKey
      const { data } = await scoreProductList({ pageSize: 6 })
      data.list.forEach(item => {
        item.pic_url = `${baseUrl}/jop-wx-web/op/showimage?companyKey=${ck}&imgname=${item.pic_url}&alias=gift`
      })
      this.productList = data.list
    },
    async _getProductList() {
      const ck = getLocalStorage().companyKey
      const { data } = await productList({ pageSize: 4 })
      data.list.forEach(item => {
        item.pic_url = `${baseUrl}/jop-wx-web/op/showimage?companyKey=${ck}&imgname=${item.pic_url}&alias=Jewel`
      })
      this.productList = data.list
    },
    getGiftList() {
      if (this.active1) {
        this.select = 2
        this.active1 = false
        this.active2 = true
        this._getProductList()
      } else {
        this.select = 1
        this.active2 = false
        this.active1 = true
        this._getScoreProductList()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.recommendation {
  h3.active {
    background: #bd3234 !important;
    color: #fff !important;
    &::after {
      border-width: 1rem 1rem 0 1rem;
      border-color: #bd3234 transparent transparent transparent !important;
    }
  }
  h3.actives {
    background-color: rgb(255, 23, 56) !important;
    color: #fff;
    &::after {
      border-width: 1rem 1rem 0 1rem;
      border-color: rgb(255, 23, 56) transparent transparent transparent !important;
    }
  }
  .btns {
    display: flex;
    .btn {
      width: px2rem(345);
      height: px2rem(88);
    }
  }
  header {
    margin: 0 auto;
    width: 47vw;
    height: 8.5vw;
    margin-top: 0.8rem;
    background: url('./images/recommendation-header.png') no-repeat center/100%;
  }
  h3.slogan::after {
    position: absolute;
    bottom: -0.5rem;
    left: calc(50% - 1rem);
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent transparent transparent transparent;
  }
  h3.slogan {
    position: relative;
    font-size: 3.9vw;
    width: 46vw;
    height: 11.5vw;
    line-height: 11.5vw;
    border-radius: 44px;
    opacity: 0.8;
    background: #e23c3f;
    margin: 0 auto;
    margin-top: 0.8rem;
    margin-bottom: 1rem;
    color: #fff;
    text-align: center;
    i {
      font-size: 1.4rem;
      padding-right: 5px;
      vertical-align: middle;
    }
  }
  h3.envelope::after {
    position: absolute;
    bottom: -0.5rem;
    left: calc(50% - 1rem);
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent transparent transparent transparent;
  }
  h3.envelope {
    position: relative;
    font-size: 3.9vw;
    width: 46vw;
    height: 11.5vw;
    line-height: 11.5vw;
    border-radius: 44px;
    opacity: 0.8;
    background: #e23c3f;
    margin: 0 auto;
    margin-top: 0.8rem;
    margin-bottom: 1rem;
    color: #fff;
    text-align: center;
    i {
      font-size: 1.4rem;
      padding-right: 5px;
      vertical-align: middle;
    }
  }
}
</style>
