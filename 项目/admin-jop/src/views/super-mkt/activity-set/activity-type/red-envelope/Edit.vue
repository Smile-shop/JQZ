<template>
  <div class="Settings">
    <div class="edit-phone-view">
      <div class="view-content">
        <p class="title">{{activeTheme}}</p>
        <div class="banner">
          <img :src="imgName" alt />
        </div>
        <p style="text-align: center;color: #fff;font-size: 12px;">
          活动时间：{{dateValue.startTime}}
          <br />
          至{{dateValue.endTime}}
        </p>
      </div>
    </div>
    <div class="edit-from-view">
      <div class="nav-bar">
        <el-tabs v-model="tabname" @tab-click="handleClick">
          <el-tab-pane label="奖品设置" name="first">
            <GiftSetPage
              :lineSize="10"
              :getDataFunc="getGiftSetDataFuncObj"
              :redEnvelope="true"
              :start="initStart"
              @initGiftList="changeActive"
            ></GiftSetPage>
          </el-tab-pane>

          <el-tab-pane label="基本设置" name="second">
            <BasicSet
              :relatedJMP="isRelatedJMP"
              :probability="probability"
              @changetabName="changetabName"
              @bannerImage="changeImage"
              @dateChange="dateChange"
              @changeActiveTheme="changeActiveTheme"
            ></BasicSet>
          </el-tab-pane>

          <el-tab-pane label="门店设置" name="third">
            <ShopSet :tabname="tabname" @changetabName="changetabName" :relatedJMP="isRelatedJMP"></ShopSet>
          </el-tab-pane>

          <el-tab-pane label="分享设置" name="fourth">
            <ShareSet></ShareSet>
          </el-tab-pane>

          <el-tab-pane label="营销推广" name="five">
            <spread-setPage :getDataFunc="getSpreadSetDataFuncObj"></spread-setPage>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  queryProducts,
  productsSave,
  queryActiveAndJmpGift
} from '@/api/super-mkt/activity-set/nine'
import { queryActive, updateScheme } from '@/api/super-mkt/activity-set/tiger'
import BasicSet from './BasicSet.vue'
import ShopSet from './shopSet.vue'
import ShareSet from './shareSet'
import moment from 'moment'
import GiftSetPage from '@/views/super-mkt/activity-set/activity-type/set-template/active-set/GiftSet'
import SpreadSetPage from '@/views/super-mkt/activity-set/activity-type/set-template/active-set/Spread'
export default {
  components: {
    BasicSet,
    ShopSet,
    ShareSet,
    GiftSetPage,
    SpreadSetPage
  },
  data() {
    return {
      initStart: false, // 是否需要从 0 开始，就是需要谢谢参与
      isRelatedJMP: false, // JMP 关联奖品
      probability: 0, // 中奖概率
      flag: '基本设置', // 触发存储中奖概率
      mark: '门店设置', // 触发查询 JMP
      getGiftSetDataFuncObj: {
        queryProducts,
        productsSave,
        queryActiveAndJmpGift
      },
      getSpreadSetDataFuncObj: {
        queryActive,
        updateScheme
      },
      activeTheme: '',
      tabname: 'first',
      giftList: [],
      imgName:
        'http://www.jqzjop.com/ftp_images/01/game/game_default_banner.png',
      dateValue: {}
    }
  },
  computed: {
    ...mapState({
      singleActiveData: state => state.nines.singleActiveData
    })
  },
  created() {
    this.queryJMPRelated()
  },
  methods: {
    queryJMPRelated() {
      const { id, name } = this.$route.query
      const body = {
        activeId: id,
        activityName: name,
      }
      queryProducts(body).then(res => {
        const mark = 0 // JMP 无关联奖品
        const { data } = res
        const len = data.activePros.length
        if (len > mark) {
          this.isRelatedJMP = true
        }
      })
    },
    // 查看中奖概率
    setQueryProducts() {
      const { id, name } = this.$route.query
      const body = {
        activeId: id,
        activityName: name,
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
        this.queryJMPRelated()
      }
    },
    dateChange(dateValue) {
      this.dateValue = dateValue
    },
    changetabName(name) {
      this.tabname = name
    },
    changeActive(obj) {
      this.giftList = obj
    },
    changeImage(url) {
      this.imgName = url
    },
    changeActiveTheme(val) {
      this.activeTheme = val
    }
  }
}
</script>

<style lang="scss" scoped>
.Settings {
  display: flex;

  .edit-phone-view {
    width: 369px;
    height: 737px;
    min-width: 369px;
    min-height: 737px;
    background-image: url('~@/assets/images/super-crm/mine/test-phone.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;

    .view-content {
      width: 100%;
      height: 100%;
      background: url('~@/assets/images/super-crm/mine/hongbao123.jpg');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;
      width: 83%;
      height: 91%;
      margin: 0 auto;
      margin-top: 20px;
      border-radius: 10px;

      .title {
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #333;
        font-size: 14px;
      }
      .game-view {
        width: 78%;
        margin: 0 auto;
        margin-top: 4px;
        position: relative;

        .play {
          width: 100%;
          height: 270px;

          & > li {
            position: absolute;
            height: 76px;
            width: 30%;
            box-sizing: border-box;
            text-align: center;
            color: #c14600;
            font-size: 13px;
            background-clip: border-box;
            padding-top: 12px;
            overflow: hidden;

            & > img {
              margin-bottom: 3px;
              width: 85%;
              height: 35px;
            }
          }
          & > li:nth-child(1) {
            left: 0%;
          }

          & > li:nth-child(2) {
            left: 34.8%;
          }

          & > li:nth-child(3) {
            left: 67.5%;
          }

          & > li:nth-child(4) {
            left: 67.5%;
            top: 30%;
          }

          & > li:nth-child(5) {
            left: 67.5%;
            top: 60%;
          }

          & > li:nth-child(6) {
            left: 34.8%;
            top: 60%;
          }

          & > li:nth-child(7) {
            left: 0%;
            top: 60%;
          }

          & > li:nth-child(8) {
            left: 0%;
            top: 30%;
          }
        }
      }
      .banner {
        height: 157px;
        width: 100%;

        & > img {
          width: 100%;
          height: 157px;
        }
      }
    }
  }
  .edit-from-view {
    flex: 1;
    font-size: 14px;
    padding-left: 20px;
  }
}
</style>


