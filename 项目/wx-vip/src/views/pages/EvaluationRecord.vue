<template>
  <article class="evaluation-list">
    <section class="record-list" v-if="item">
      <div class="title van-hairline--bottom">
        <div>质保单号：{{item.orderNo}}</div>
        <div v-if="item.credit*1 > 0">评价积分:<span :style="{'color': themeColor}">+{{item.credit}}</span></div>
      </div>

      <div class="content">
        <div class="shop">
          <div class="name"><span :style="{'color': themeColor}">{{item.salesConsultant}}</span> ({{item.nameOut || item.shopName}})</div>
          <div>{{item.createdTime | datefmt('YYYY-MM-DD')}}</div>
        </div>

        <div class="num" :style="{'color': themeColor}" v-for="evaluationItem in item.evaluate" :key="evaluationItem.categoryId">
          <span>{{evaluationItem.category}}</span>
          <i v-for="ite in evaluationItem.score * 1" :key="ite" class="vip-v3-iconfont icon-star">&#xe607;</i>
          <i v-for="ite in 5 - evaluationItem.score * 1" :key="ite" class="vip-v3-iconfont icon-star" style="color:#d1d1d1">&#xe607;</i>
        </div>

        <div class="con">{{item.details}}</div>
      </div>
    </section>

    <div class="gopage-btn" @click="goDetails" :style="{'background-color': themeColor}">查看所有评价</div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      item: null
    }
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
  mounted() {
    if(this.$route.query.o) {
      this.getQueryList(this.$route.query.o);
    }
  },
  methods: {
    getQueryList(orderNo) {
      let params = {
        pageNum: 1,
        pageSize: 10,
        orderNo,
        memberNumber: this.user.memberCard
      }
      this._http({url: '/jop-web/evaluation/queryRecord'}, params).then(res => {
        if(res.data.code === 0) {
          this.item = res.data.data.list[0] || null;
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    goDetails() {
      this.$router.push({
        path: '/evaluation-list'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.evaluation-list {
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
  .gopage-btn {
    width: 150px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #ffffff;
    border-radius: 5px;
    margin: 15px auto;
  }
}
</style>