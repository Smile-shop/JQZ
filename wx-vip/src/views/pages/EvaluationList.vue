<template>
  <article class="evaluation-record-list">
    <section class="record-list" v-for="item in recordList" :key="item.evaluateId">
      <div class="title van-hairline--bottom" v-if="item.orderNo">
        <div>质保单号：{{item.orderNo}}</div>
        <div v-if="item.credit * 1 > 0">评价积分:<span :style="{'color': themeColor}">+{{item.credit}}</span></div>
      </div>

      <div class="content">
        <div class="shop">
          <div class="name"><span :style="{'color': themeColor}">{{item.salesConsultant}}</span> ({{item.nameOut || item.shopName}})</div>
          <div>{{item.createdTime | datefmt('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>

        <div class="num" :style="{'color': themeColor}" v-for="evaluationItem in item.evaluate" :key="evaluationItem.categoryId">
          <span>{{evaluationItem.category}}</span>
          <i v-for="ite in 5" :key="ite">
            <i class="vip-v3-iconfont icon-star" :style="{'color': ite > evaluationItem.score * 1 ? '#d1d1d1' : ''}">&#xe607;</i>
          </i>  
        </div>

        <div class="con">{{item.detail}}</div>
      </div>
    </section>
  </article>
</template>

<script>
import { mapState } from 'vuex';
export default {
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
      recordList: []
    }
  },
  mounted() {
    this.getEvaluationList();
  },
  methods: {
    getEvaluationList() {
      let params = {
        pageNum: 1,
        pageSize: 100,
        memberNumber: this.user.memberCard
      }
      this._http({url: '/jop-web/evaluation/queryRecord'}, params).then(res => {
        if(res.data.code === 0) {
          this.recordList = res.data.data && res.data.data.list || [];
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
.evaluation-record-list {
  .record-list {
    margin-top: 5px;
    background-color: #ffffff;
    .title {
      display: flex;
      align-items: center;
      height: 37px;
      justify-content: space-between;
      padding: 0 12px;
      font-size: 12px;
      color: #333333;
    }
    .content {
      .shop {
        display: flex;
        align-items: center;
        padding: 0 12px;
        height: 28px;
        justify-content: space-between;
        font-size: 12px;
        color: #999999;
        .name {
          color: #333333;
        }
      }
      .num {
        display: inline-block;
        width: 170px;
        font-size: 12px;
        > span {
          color: #999999;
          display: inline-block;
          width: 80px;
          padding-left: 12px;
        }
      }
      .con {
        padding: 12px;
        font-size: 12px;
        color: #666666;
      }
    }
  }
}
</style>
