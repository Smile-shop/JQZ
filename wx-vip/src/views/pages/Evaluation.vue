<template>
  <div>
    <!-- <Header :nav-title="'满意度调研'" :nav-title-right="'我的评价'" @headerRightClick="goAppointRecord"></Header> -->
    <nav class="nav-tab" :style="{'background-color': themeColor}">
      <div class="tab-item" @click="navIndex = '1'" :style="{'background-color': navIndex === '1' ? themeColor : '#ffffff', 'color': navIndex === '1' ? '#ffffff' : themeColor}">我要评价</div>
      <div class="tab-item" @click="navIndex = '2'" :style="{'background-color': navIndex === '2' ? themeColor : '#ffffff', 'color': navIndex === '2' ? '#ffffff' : themeColor}">评价记录</div>
    </nav>
    <div class="evaluation-content" v-if="navIndex === '1'">
      <div class="select">
        <!-- <SelectField v-if="isConsume_shop" :initData="evaluationParams.store" type="select" @select="evaluationParams.store = $event" :columnsList="shopList" placeholder="请选择门店"></SelectField> -->
        <SelectField v-if="isConsume_shop" :initData="evaluationParams.store" type="select" @select="shopSelect" :columnsList="shopList" placeholder="请选择门店"></SelectField>
        <div class="select-div" v-else>{{evaluationParams.store}}</div>
      </div>
      <div class="column"></div>
      <div class="select">
        <SelectField v-if="isConsume_saler" :initData="evaluationParams.man" type="select" @select="evaluationParams.man = $event" :columnsList="employeeList" placeholder="请选择珠宝顾问"></SelectField>
        <div class="select-div" v-else>{{evaluationParams.man}}</div>
      </div>
      <div class="star-title" :style="{ 'color': themeColor }">
        满意度等级
      </div>

      <div class="evaluation-list" v-for="(item, index) in evaluationList" :key="index">
        <div class="header">{{ item.name }}</div>
        <div class="body">
          <van-rate v-model="item.score" icon="star" void-icon="star" :color="themeColor" void-color="#d1d1d1"/>
        </div>
        <div class="footer">
          {{['非常不满意', '不满意', '一般', '满意', '非常满意'][item.score - 1]}}
        </div>
      </div>

      <div class="star-title" :style="{ 'color': themeColor }">
        评价详情
      </div>

      <div class="evaluation-details">
        <textarea v-model="evaluationParams.details" @blur="blur"></textarea>
      </div>

      <div class="evaluation-btn" v-if="evaluationBtnDisabled" :style="{ 'background-color': themeColor }" @click="submitEvaluation">
        提交评价
      </div>
      <div class="evaluation-btn" v-else>提交中...</div>
    </div>
    <div class="evaluation-content" v-else>
      <EvaluationList></EvaluationList>
    </div>

    <div class="submit-success-con" v-if="isSuccess">
      <div class="content">
        <article class="van-hairline--bottom">
          <img src="../../assets/gou.png" alt="gou">
          <div>评价成功</div>
          <div class="info" v-if="scoreData*1">恭喜您获得<span :style="{ 'color': themeColor }">{{scoreData}}</span>积分</div>
        </article>
        <footer :style="{ 'color': themeColor }" @click="goAppointRecord">我知道了</footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Header from "../../components/Header";
import EvaluationList from "./EvaluationList";
import { Rate } from 'vant';
import { getUrlParam } from "@/utils/functions";
export default {
  components: {
    Header,
    VanRate: Rate,
    EvaluationList
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData
    }),
    user() {
      const userStr = window.localStorage.getItem('urlData');
      if(userStr) {
        return JSON.parse(userStr);
      }
    }
  },
  data() {
    return {
      evaluationList: [],
      evaluationParams: {
        store: '',
        man: '',
        details: ''
      },
      isConsume_shop: true,
      isConsume_saler: true,
      shopList: [],
      employeeList: [],
      evaluationBtnDisabled: true,
      isSuccess: false,
      scoreData: null,
      shopListRes: [],
      navIndex: '1'
    }
  },
  mounted() {
    this.init();
    // 邀请满意度评价
    const sessionUrlData = window.sessionStorage.getItem('urlParams');
    const clerkName = getUrlParam('clerkName', sessionUrlData);
    const shopName = getUrlParam('shopName', sessionUrlData);
    if (clerkName && shopName) {
      this.isConsume_shop = false;
      this.isConsume_saler = false;
      this.evaluationParams.store = shopName;
      this.evaluationParams.man = clerkName;
      this.getWXEvaluationShopList();
      return false;
    }
    if(this.$route.query.v) {
      this.isConsume_shop = false;
      this.evaluationParams.store = this.$route.query.n;
      if(this.$route.query.s) {
        this.evaluationParams.man = this.$route.query.s;
        this.isConsume_saler = false;
        this.getWXEvaluationShopList();
      } else {
        this.isConsume_saler = true;
        this.evaluationParams.man = '';
        this.getWXEvaluationShopList(1);
      }
    } else {
      this.isConsume_shop = true;
      this.isConsume_saler = true;
      this.getWXEvaluationShopList();
    }
  },
  methods: {
    blur(e) {
      e.target.scrollIntoView(false);
    },
    init() {
      this._http({url: '/jop-web/evaluation/querySettings'}, {}).then(res => {
        if (res.data.code === 0) {
          const customzie = res.data.data.customCategory.customzie || [];
          const defaultItem = res.data.data.customCategory.default || [];
          const list = defaultItem.concat(customzie);
          this.evaluationList = list.filter(p => p.check === '1').map(p => {
            return {
              name: p.name,
              id: p.id,
              score: 5
            }
          })
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    goAppointRecord() {
      this.$router.push({
        path: "/evaluation-list"
      });
    },
    shopSelect(data) {
      this.evaluationParams.store = data;
      this.$set(this.evaluationParams, 'man', '');
      this.pickStore();
    },
    getWXEvaluationShopList(type) {
      let params = {
        companyKey: this.user.companyKey,
        showStatus: '1',
        evaluationStatus: '1'
      }
      this.shopList = [];
      this._http({url: '/jop-web/jop/getWxShopList'}, params).then(res => {
        if(res.data.code === 0) {
          this.shopListRes = res.data.data.list || [];
          if(res.data.data && res.data.data.list) {
            this.shopList = res.data.data.list.map(p => {
              return p.nameOut;
            })
          }
          if(type) {
            this.pickStore();
          }
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    pickStore() {
      let shop = this.shopListRes.find(p => p.nameOut === this.evaluationParams.store);
      let params = {
        companyKey: this.user.companyKey,
        shopName: shop.shopName
      }
      this._http({url: '/jop-web/evaluation/employee'}, params).then(res => {
        if(res.data.code === 0) {
          let list = res.data.data ? res.data.data : [];
          this.employeeList = list.map(p => {
            return p.name
          })
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    submitEvaluation() {
      if(this.evaluationParams.store == '') {
        this.$toast({
          message: '请选择门店！',
          duration: 1000
        })
        return;
      };
      if(this.evaluationParams.man == '') {
        this.$toast({
          message: '请选择珠宝顾问！',
          duration: 1000
        })
        return;
      };
      if(this.evaluationIndex == 0) {
        this.$toast({
          message: '请填写满意度！',
          duration: 1000
        })
        return;
      };
      this.evaluationBtnDisabled = false;
      const shop = this.shopListRes.find(p => p.nameOut === this.evaluationParams.store);
      const params = {
        companyKey: this.user.companyKey,
        shopName: shop ? shop.shopName : this.evaluationParams.store,
        memberNumber: this.homeMemberData.cardNum,
        memberName: this.homeMemberData.name,
        salesConsultant: this.evaluationParams.man,
        details: this.evaluationParams.details,
        orderNo: this.$route.query.v ? this.$route.query.v : null,
        openid: this.user.openid,
        evaluate: this.evaluationList,
        score: 0
      }
      this._http({url: '/jop-web/evaluation/submit'}, params).then(res => {
        this.evaluationBtnDisabled = true;
        if(res.data.code === 0) {
          this.isSuccess = true;
          this.scoreData = res.data.data || null;
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>


<style lang="less" scoped>
.nav-tab {
  width: 300px;
  height: 35px;
  margin: 10px auto;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .tab-item {
    width: 148px;
    height: 33px;
    line-height: 31px;
    text-align: center;
    flex-shrink: 0;
  }
  .tab-item:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .tab-item:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}
.evaluation-content {
  .select {
    width: calc(100% - 20px);
    margin: 0px auto;
    overflow: hidden;
    position: relative;
    height: 45px;
    .select-div {
      height: 45px;
      line-height: 45px;
    }
  }
  .column {
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
  }
  .star-title {
    background-color: white;
    height: 43px;
    line-height: 43px;
    padding: 0 12px;
    font-size: 16px;
  }
  .evaluation-list {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    height: 40px;
    align-items: center;
    .header {
      width: 120px;
      font-size: 14px;
      padding-left: 15px;
      color: #787878;
    }
    .footer {
      padding-left: 15px;
      color: #787878;
      font-size: 12px;
    }
  }
  .evaluation-details {
    width: calc(100% - 24px);
    margin: 12px auto;
    background-color: white;
    text-align: center;
    border-radius: 5px;
    textarea {
      width: calc(100% - 21px);
      height: 100px;
      margin: 10px 0;
      font-size: 12px;
    }
  }
  .evaluation-btn {
    width: 150px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 15px;
    color: white;
    background-color: gray;
    border-radius: 5px;
    margin: 10px auto;
  }
}
.submit-success-con {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    width: 315px;
    height: 168px;
    background-color: #ffffff;
    border-radius: 5px;
    article {
      text-align: center;
      height: 125px;
      img {
        width: 50px;
        margin: 15px 0 5px 0;
      }
      div {
        font-family: PingFang-SC-Bold;
        font-size: 18px;
        color: #333333;
        font-weight: bold;
      }
      .info {
        font-family: PingFang-SC-Medium;
        font-size: 12px;
        font-weight: normal;
        color: #999999;
        padding-top: 5px;
      }
    }
    footer {
      text-align: center;
      font-family: PingFang-SC-Medium;
      font-size: 16px;
      padding: 12px 0;
    }
  }
}
</style>
