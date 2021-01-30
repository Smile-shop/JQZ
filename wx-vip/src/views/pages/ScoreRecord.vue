<template>
  <div>
    <div class="total-num-header" :style="{ 'background-color': themeColor }">
      <div class="first-div" v-if="isTotalScore === '1'">
        <div>累计积分</div>
        <div>{{ totalUnScore }}</div>
      </div>
      <div class="second-div" v-if="isAbleScore === '1' && isTotalScore === '1'"></div>
      <div class="third-div" v-if="isAbleScore === '1'">
        <div>可用积分</div>
        <div>{{ ableScore }}</div>
      </div>
    </div>

    <div class="record-list">
      <div v-if="tinviteScore" class="invite">
        邀请好友送积分（每日最高可得{{tinviteScore}}分）
      </div>
      <div class="item" v-for="(item, index) in dataList" :key="index">
        <ScorerecordItem :data="item"></ScorerecordItem>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ScorerecordItem from '../../components/ScorerecordItem';
export default {
  components: {
    ScorerecordItem
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      isAbleScore: state => state.pageShowInfo.isAbleScore,
      isTotalScore: state => state.pageShowInfo.isTotalScore,
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
      totalUnScore: 0,
      ableScore: 0,
      dataList: [],
      tinviteScore: 0,
    }
  },
  mounted() {
    // this.$store.dispatch('getScoreRecord');
    this.getScoreRecordList();
  },
  methods: {
    getScoreRecordList() {
      let params = {
        openid: this.user.openid,
        companyKey: this.user.companyKey,
        cardCode: this.user.memberCard
      }
      this._http({url: '/jop-web/wxCredit/wxCreditInfo'}, params).then(res => {
        if(res.data.code === 0) {
          this.totalUnScore = res.data.data.score.totalUnScore || 0;
          this.ableScore = res.data.data.score.ableScore || 0;
          this.dataList = res.data.data.detail || [];
          this.tinviteScore = res.data.data.tinviteScore || 0;
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.total-num-header {
  display: flex;
  align-items: center;
  .first-div, .third-div {
    flex-basis: 30%;
    flex-grow: 1;
    text-align: center;
    color: white;
    font-size: 14px;
    height: 50px;
    div {
      padding-top: 4px;
    }
  }
  .second-div {
    width: 0;
    border-left: 1px solid white;
    height: 40px;
    background-color: white;
  }
}
.record-list {
  width: 100%;
  // height: calc(100vh - 125px);
  height: calc(100vh - 54px);
  overflow: auto;
  -webkit-overflow-scrolling: auto;

  > .invite {
    text-align: center;
    padding: 5px;
  }

  .item {
    background-color: white;
  }
  .item:not(:first-child) {
    margin-top: 1px;
  }
}
</style>
