<template>
  <div id="app">
    <router-view />
    <Confirm ref="Confirm"></Confirm>
  </div>
</template>

<script>
import URL from '@/config/url.js'
import Confirm from 'components/confirm.vue'
// import { Home } from '@/axios/api.js'
// import moment from 'moment'
// import { mapMutations, mapState } from 'vuex'
import { setStorage, getInfoStorage,getLocalStorage } from '@/utils'
import baseUrl from '@/config/config.js'
export default {
  components: { Confirm },
  data() {
    return {
      ActiveList: [],
      baseUrl
    }
  },
  created() {
    this.getUrlQueryData()
    // 测试用请求
    this.debugFunc()
  },

  methods: {
    debugFunc() {
      if(process.env.NODE_ENV != 'production') {
        this._getUrlQueryData()
      }
    },
    getUrlQueryData() {
      // 模拟获取数据参数
      const currentUrl = window.location.href
      const removeParams = currentUrl.split('?c')[0]
      const addParams =
        '?c=test01&o=oYKLK1Upufuv00-lScHnI-g7eCaM&n=！&i=http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2FdDDGcKGeQmbTbU9tq6joE7o3icJsOJB3sGW6qiaD5QLvN4JTnZTGKKdxNl7d5uxJ2y1zVjSba5CrrdPHggbZKnLBwGpEBRImE2%2F132&r=1&m=13691928282&s=13691928282&subscribe=1'
      const { wxUserInfo } = getLocalStorage()
      if (
        process.env.NODE_ENV === 'development' &&
        !currentUrl.includes('?c=') &&
        !wxUserInfo
      ) {
        window.location.href = currentUrl + addParams
      } else {
        // window.location.href = removeParams
         window.location.href = currentUrl + addParams
      }

      // 依据用户数据请求活动数据
      if ('c' in this.$route.query) {
        const query = this.$route.query
        const { o, c, i, m, s, openid, page, subscribe } = query
        // const { o, c, i, p, m, s, openid, page } = query
        const urlData = {
          activeId: '231', // tigger 添加
          openid: o,
          companyKey: c,
          headerImg: i,
          memberCard: m ? m : null,
          phone: s ? s : null,
          page: page || null,
          register_openid: openid,
          subscribe: subscribe || '0',
          localUrl: window.location.origin.concat(`/${URL}/#/`),
          isRegister: '1'
        }

        setStorage.save(JSON.stringify(urlData))
      }
    },
    _getUrlQueryData() {
      const { o, c, i, m, r, shareId, subscribe } = this.$route.query
      // 处理从其他页面跳转过来获取不到基础数据
      const data = getInfoStorage.get() && getInfoStorage.get()
      let urlData = {}
      if (process.env.NODE_ENV === 'production') {
        urlData = {
          activeId: shareId,
          openid: o,
          companyKey: c || data.companyKey ? data.companyKey : '',
          headerImg: i,
          memberCard: m,
          isRegister: r || '1',
          subscribe: subscribe || '0',
          localUrl: `${this.baseUrl}/wx-interface-web/wx/auth?companyKey=${c}&shareId=${shareId}&page=${URL}`
        }
      } else {
        urlData = {
          activeId: '231',
          openid: 'oYKLK1Upufuv00-lScHnI-g7eCaM', // 测试环境 oYKLK1bSz1-L-J2NGZSbswENpM-k、uat 环境 oP6kNs7oHVqIm7MDIX_1C2ejO_Cg
          companyKey: 'test01', // 测试环境 01 、uat 环境 a011
          headerImg:
            'http://thirdwx.qlogo.cn/mmopen/zshZlqTMgm5CmPKOIw0xkXgKPeErhqZdrU2Y2z5TtRtxgU8WOCI9oMkenOGHjmOGF6wLNxjVU97ZRjeOfMWUqEtRCffYEUro/132',
          memberCard: m || 13691928282, // 测试环境 13058058525 、uat 环境 13691928282
          isRegister: '1',
          subscribe: '1',
          localUrl: `${this.baseUrl}/wx-interface-web/wx/auth?companyKey=${c}&shareId=${shareId}&page=${URL}`
        }
      }
      window.sessionStorage.setItem('sessionURLData', JSON.stringify(urlData))
    }
  }
}
</script>

<style lang="scss">
body {
  max-width: 540px;
  min-width: 320px;
  margin: 0 auto;
}

html {
  font-size: 16px;
}

* {
  margin: 0;
  padding: 0;
}

.icon-back:before {
  content: '';
}

.icon-share:before {
  content: '';
}

.swiper-pagination-bullet-active {
  background: #d41010 !important;
}
</style>
