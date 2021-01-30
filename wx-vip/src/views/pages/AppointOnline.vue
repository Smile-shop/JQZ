<template>
  <div class="appoint-online">
    <!-- <Header :nav-title="'在线预约'"></Header> -->
    <nav class="nav-tab" :style="{'background-color': themeColor}">
      <div class="tab-item" @click="navIndex = '1'" :style="{'background-color': navIndex === '1' ? themeColor : '#ffffff', 'color': navIndex === '1' ? '#ffffff' : themeColor}">我要预约</div>
      <div class="tab-item" @click="navIndex = '2'" :style="{'background-color': navIndex === '2' ? themeColor : '#ffffff', 'color': navIndex === '2' ? '#ffffff' : themeColor}">预约记录</div>
    </nav>
    <div class="appoint-list" v-if="navIndex === '1'">
      <div class="appoint-item" v-for="item in appointList" :key="item.id">
        <div class="title" :style="{'color': themeColor}">{{item.title}}</div>
        <div class="content" v-html="computedContent(item.content)"></div>
        <div class="footer">
          <div class="item">门店：<span>{{item.nameOut}}</span></div>
          <div class="btn" @click="toAppointOnline(item)" :style="{'background-color': themeColor}">我要预约</div>
        </div>
      </div>
      <div class="load-more" v-if="total > appointList.length" @click="loadMore('1')">加载更多...</div>
    </div>

    <div class="appoint-list" v-else>
      <div class="appoint-item" @click="getAppointDetail(item)" v-for="item in appointRecordList" :key="item.id">
        <div class="item-header">
          <div class="time" :style="{'color': themeColor}">
            <i class="vip-v3-iconfont">&#xe7c9;</i>
            {{ new Date(item.reservation_time).format("yyyy-MM-dd hh:mm") }}
          </div>
          <i class="vip-v3-iconfont more-icon">&#xe603;</i>
        </div>
        <div class="item-body">
          <div class="item">预约项目：<span>{{ item.title }}</span></div>
          <div class="item">预约门店：<span>{{ item.nameOut }}</span></div>
        </div>
      </div>
      <div class="load-more" v-if="total1 > appointRecordList.length" @click="loadMore('2')">加载更多...</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from "../../components/Header";
export default {
  components: {
    Header
  },
  data() {
    return {
      navIndex: '1',
      appointList: [],
      pageNum: 1,
      total: 0,
      appointRecordList: [],
      pageNum1: 1,
      total1: 0
    };
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
    if (this.$route.query.navIndex) {
      this.navIndex = this.$route.query.navIndex;
    }
    this.getAppointList(this.pageNum);
    this.getAppointRecord(this.pageNum1)
  },
  methods: {
    computedContent(str) {
      const content = str ? this.htmlDecodeByRegExp(str) : '';
      const simpleCon = content.replace(/<img.*?>/g, ''); // 去除img标签
      return simpleCon.length > 50 ? `${simpleCon.slice(0, 50)}...`: simpleCon;
    },
    /*2.用正则表达式实现html解码*/
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
    getAppointList(pageNum) {
      const params = {
        page: {
          pageNum,
          pageSize: 20
        },
        params: {
          companyKey: this.urlData.companyKey
        }
      }
      this._http({url: '/jop-web/wxReservationNew/lookProject'}, params).then(res => {
        if(res.data.code === 0) {
          const resData = res.data.data;
          if (resData) {
            if (pageNum === 1) {
              this.appointList = resData.list ? resData.list : [];
            } else {
              this.appointList = this.appointList.concat(resData.list);
            }
            this.total = resData.total ? resData.total : 0;
          } else {
            this.appointList = [];
            this.total = 0
          }
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    toAppointOnline(item) {
      this.$router.push({
        path: '/to-app-online',
        query: {
          id: item.id
        }
      })
    },
    loadMore(type) {
      if (type === '1') {
        this.getAppointList(++this.pageNum);
      } else {
        this.getAppointRecord(++this.pageNum1);
      }
    },
    getAppointRecord(pageNum) {
      let params = {
        params: {
          companyKey: this.urlData.companyKey,
          card_no: this.urlData.memberCard
        },
        page: {
          pageSize: 20,
          pageNum
        }
      }
      this._http({url: '/jop-web/wxReservationNew/getRecord'}, params).then(res => {
        if(res.data.code === 0) {
          const resData = res.data.data;
          if (resData) {
            if (pageNum === 1) {
              this.appointRecordList = resData.list ? resData.list : [];
            } else {
              this.appointRecordList = this.appointRecordList.concat(resData.list);
            }
            this.total1 = resData.total ? resData.total : 0;
          } else {
            this.appointRecordList = [];
            this.total1 = 0
          }        
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    getAppointDetail(item) {
      this.$router.push({
        path: '/appoint-detail',
        query: {
          id: item.id
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.appoint-online {
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
  .appoint-list {
    // height: calc(100vh - 125px);
    height: calc(100vh - 80px);
    padding: 0 12.5px;
    overflow: auto;
    .appoint-item {
      width: 350px;
      background-color: #ffffff;
      margin-bottom: 10px;
      border-radius: 5px;
      .title {
        font-size: 14px;
        padding: 13px 11px 0 11px;
      }
      .content {
        font-size: 12px;
        color: #999999;
        padding: 7px 11px;
      }
      .footer {
        border-top: 1px solid #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        padding: 0 11px;
        .item {
          flex-grow: 1;
          font-size: 12px;
          color: #999999;
          span {
            color: #333333;
          }
        }
        .btn {
          width: 64px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 2px;
          color: #ffffff;
          font-size: 12px;
        }
      }
      .item-header {
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: space-between;
        padding: 0 11px;
        border-bottom: 1px solid #f5f5f5;
        .time {
          font-size: 14px;
          i {
            font-size: 16px;
            margin-right: 5px;
          }
        }
        .more-icon {
          color: #cccccc;
        }
      }
      .item-body {
        padding: 11px;
        .item {
          font-size: 14px;
          color: #999999;
          span {
            color: #333333;
          }
        }
        .item:last-child {
          margin-top: 8px;
        }
      }
    }
    .load-more {
      text-align: center;
      font-size: 12px;
      color: #333333;
    }
  }
}
</style>
