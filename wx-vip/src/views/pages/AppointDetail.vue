<template>
  <div class="appoint-detail" v-if="detailData">
    <div class="item">
      <div>预约时间</div>
      <div :style="{'color': themeColor}">{{new Date(detailData.reservation_time).format("yyyy-MM-dd hh:mm")}}</div>
    </div>
    <div class="item">
      <div>预约项目</div>
      <div>{{detailData.title}}</div>
    </div>
    <div class="item">
      <div>预约门店</div>
      <div>{{detailData.shopName}}</div>
    </div>
    <div class="detail">
      <div class="title">预约内容</div>
      <div v-html="computedContent(detailData.content)"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData
    })
  },
  data() {
    return {
      detailData: null
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getAppointDetail(this.$route.query.id);
    }
  },
  methods: {
    htmlDecodeByRegExp: function(str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&amp;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "'");
      s = s.replace(/&quot;/g, '"');
      return s;
    },
    computedContent(str) {
      return this.htmlDecodeByRegExp(str);
    },
    getAppointDetail(id) {
      const params = {
        companyKey: this.urlData.companyKey,
        card_no: this.urlData.memberCard,
        id
      }
      this._http({url: '/jop-web/wxReservationNew/getRecordDetail'}, params).then(res => {
        if(res.data.code === 0) {
          this.detailData = res.data.data || null;       
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
.appoint-detail {
  height: calc(100vh - 75px);
  overflow: auto;
  .item {
    height: 44px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f5f5f5;
    padding: 0 12px;
    font-size: 14px;
    color: #333333;
    > div:last-child {
      color: #999999;
    }
  }
  .detail {
    background-color: #ffffff;
    border-top: 1px solid #f5f5f5;
    padding: 12px;
    .title {
      font-size: 14px;
      padding-bottom: 12px;
    }
  }
}
</style>
