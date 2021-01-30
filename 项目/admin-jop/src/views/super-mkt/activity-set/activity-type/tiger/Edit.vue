<template>
  <div class="settings">
    <div class="view-mobile">
      <section class="content">
        <h6 class="title">{{baseSetPageData.activeTheme}}</h6>
        <section class="banner">
          <img v-if="baseSetPageData.imgName" :src="baseSetPageData.imgName" alt />
          <img v-else src="~@/assets/images/super-mkt/banner.jpg" alt />
        </section>
        <section class="game-time" v-if="baseSetPageData.beginTime">
          <p>活动时间：{{baseSetPageData.beginTime.split(' ')[0]}} 至 {{baseSetPageData.endTime.split(' ')[0]}}</p>
        </section>
        <section class="game-time" v-else>
          <p>活动时间： 至 </p>
        </section>
        <section class="game-time chance">
          <p>
            今日还有{{baseSetPageData.participateNum}}次抽奖机会
            <span
              v-if="baseSetPageData.isMember === '1'"
            >（每次消耗{{baseSetPageData.consumeIntegral}}积分）</span>
          </p>
        </section>
      </section>
    </div>
    <div class="set-warp">
      <el-tabs v-model="tabname" @tab-click="handleClick">
        <el-tab-pane label="奖品设置" name="first">
          <GiftSetPage :getDataFunc="getGiftSetDataFuncObj" :start="initStart"></GiftSetPage>
        </el-tab-pane>
        <el-tab-pane label="基本设置" name="second">
          <BaseSetPage
            :probability="probability"
            :getDataFunc="getBaseSetDataFuncObj"
            @initBaseSetData="getBaseSetPageData"
          ></BaseSetPage>
        </el-tab-pane>
        <el-tab-pane label="门店设置" name="third">
          <ShopSetPage :getDataFunc="getShopSetDataFuncObj" :relatedJMP="isRelatedJMPGift"></ShopSetPage>
        </el-tab-pane>
        <el-tab-pane label="分享设置" name="fourth">
          <ShareSetPage></ShareSetPage>
        </el-tab-pane>
        <el-tab-pane label="营销推广" name="five">
          <SpreadSetPage :getDataFunc="getSpreadSetDataFuncObj"></SpreadSetPage>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  basicUpdate,
  queryActive,
  queryProducts,
  productsSave,
  queryActiveAndJmpGift,
  queryShopList,
  updateShops,
  updateScheme
} from '@/api/super-mkt/activity-set/tiger'
import BaseSetPage from '../set-template/active-set/BaseSet'
import GiftSetPage from '../set-template/active-set/GiftSet'
import ShopSetPage from '../set-template/active-set/ShopSet'
import ShareSetPage from '../set-template/active-set/ShareSet'
import SpreadSetPage from '../set-template/active-set/Spread'
export default {
  components: {
    BaseSetPage,
    GiftSetPage,
    ShopSetPage,
    ShareSetPage,
    SpreadSetPage
  },
  created() {
    this.queryJMPGift()
  },
  methods: {
    queryJMPGift() {
      const body = {
        activityName: this.$route.query.name,
        activeId: this.$route.query.id
      }
      queryProducts(body).then(res => {
        const len = res.data.activePros.length
        if (len > 0) {
          this.isRelatedJMPGift = true
        }
      })
    },
    getBaseSetPageData(data) {
      this.baseSetPageData = data
      console.log('TCL: getBaseSetPageData -> data', data)
    },
    // 查看中奖概率
    setQueryProducts() {
      const body = {
        activityName: this.$route.query.name,
        activeId: this.$route.query.id
      }
      queryProducts(body)
        .then(res => {
          const { code, msg, data } = res
          const total = data ? data.activePros : []
          let count = 0
          total.map(item => {
            if (item && item.probability) {
              count += item.probability
            }
          })
          this.probability = count
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleClick(tab) {
      const { label } = tab
      const { id } = this.$route.query
      if (label === this.flag) {
        this.setQueryProducts()
      }
      if (label === this.mark) {
        this.queryJMPGift()
      }
    }
  },
  data() {
    return {
      initStart: false, // 是否需要从 0 开始，就是需要谢谢参与
      probability: 0, // 中奖概率
      flag: '基本设置', // 触发存储中奖概率
      mark: '门店设置', // 触发查询 JMP
      isRelatedJMPGift: false, // JMP 关联奖品
      baseSetPageData: {},
      getSpreadSetDataFuncObj: {
        queryActive,
        updateScheme
      },
      getBaseSetDataFuncObj: {
        basicUpdate,
        queryActive
      },
      getGiftSetDataFuncObj: {
        queryProducts,
        productsSave,
        queryActiveAndJmpGift
      },
      getShopSetDataFuncObj: {
        queryShopList,
        updateShops
      },
      tabname: 'first'
    }
  }
}
</script>

<style lang='scss' scoped>
.settings {
  display: flex;
  .view-mobile {
    flex-shrink: 0;
    width: 369px;
    height: 737px;
    position: relative;
    background: url('~@/assets/images/super-crm/mine/test-phone.png') no-repeat
      top center/100%;
    .content {
      position: absolute;
      top: 60px;
      left: 30px;
      margin: auto;
      width: 310px;
      height: 623px;
      border-radius: 5px;
      overflow: hidden;
      background: url('~@/assets/images/super-mkt/lhj-bg.png') no-repeat top
        center/100%;

      .title {
        height: 38px;
        line-height: 38px;
        text-align: center;
      }
      .banner {
        width: 320px;
        height: 125px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .game-time {
        margin-top: 20px;
        font-size: 14px;
        color: #fe4c00;
        text-align: center;
      }
      .chance {
        font-size: 12px;
        color: #fff;
        padding-left: 12px;
        margin-top: 134px;
      }
    }
  }
  .set-warp {
    display: flex;
    margin-left: 20px;
    width: 100%;
    font-size: 14px;
  }
}
</style>
