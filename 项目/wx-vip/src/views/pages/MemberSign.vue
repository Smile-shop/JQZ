<template>
  <div>
    <div class="content">
      <div class="sign-header">
        <div class="sign-btn-big">
          <div class="sign-btn" v-if="!isSign" @click="goSign">立即签到</div>
          <div class="sign-btn signed" v-else>已签到</div>
        </div>
        <div class="sign-day-num">
          <div class="sign-day">已连续签到{{ signData.continuityNum }}天</div>
          <div class="sign-day-all">累计签到{{ signData.totalNum }}天</div>
        </div>
      </div>

      <div class="sign-intro">
        <div class="header">签到说明：</div>
        <div class="content-intro" v-html="dayInfo"></div>
      </div>

      <div class="calender-content">
        <div class="calender-header">
          <div class="header-left" @click="changMonth(-1)">
            <i class="vip-v3-iconfont">&#xe602;</i>
          </div>
          <div class="header-center">
            {{ showYearMonth }}
          </div>
          <div class="header-right" @click="changMonth(1)">
            <i class="vip-v3-iconfont">&#xe603;</i>
          </div>
        </div>

        <div class="calender-content">
          <div class="calender-content-header">
            <div v-for="item in weeks" :key="item">{{ item }}</div>
          </div>
          <div class="calender-day" v-for="(item, index) in monthDay" :key="index">
            <div v-for="(day, dayIndex) in item" :key="dayIndex" class="calender-day-row">
              <div :class="{ 'is-today': day.isToday, 'signed-day': day.isSign }">{{ day.dayNum }}</div>
            </div>
          </div>
        </div>
      </div>
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
    }),
    showYearMonth() {
      return `${this.drawMonth.getFullYear()}年${this.drawMonth.getMonth() + 1 > 9 ? this.drawMonth.getMonth() + 1 : `0${this.drawMonth.getMonth() + 1}`}月`
    },
    vuexGetter() {
      return this.$store.getters;
    },
		dayInfo() {
			return this.htmlDecodeByRegExp(this.signData.content);
    },
    user() {
      const userStr = window.localStorage.getItem('urlData');
      if(userStr) {
        return JSON.parse(userStr);
      }
    }
  },
  data() {
    return {
      weeks: ["日", "一", "二", "三", "四", "五", "六"],
      monthDay: [],
      drawMonth: new Date(),
      signData: {
        continuityNum: 0,
        totalNum: 0,
        signList: [],
        content: '',
        istoday: 0
      },
      timer: null,
      isSign: false
    }
  },
  mounted() {
    let today = new Date();
    this.drawMonth = today;
    this.getMemberSign(today);
  },
  methods: {
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
    drawCalender(today, signDay, drawMonth) {
      let drawThisMonth = new Date(drawMonth.setDate(1));
      let monthFirstDayWeek = drawThisMonth.getDay();
      let year = drawThisMonth.getFullYear();
      let month = drawThisMonth.getMonth();

      let signDayList = [];
      signDay.forEach(p => {
        signDayList.push(p.getDate());
      });

      let m_days = new Array(31, 28 + this.is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
      let tr_str = Math.ceil((m_days[month] + monthFirstDayWeek) / 7);

      let col = [];
      for (let i = 0; i < tr_str; i++) {
        let row = [];
        for (let j = 0; j < 7; j++) {
          let idx = i * 7 + j;
          let date_str = idx - monthFirstDayWeek + 1;
          if(date_str <= 0 || date_str > m_days[month]) {
            row.push({
              dayNum: '',
              isToday: year === today.getFullYear() && month === today.getMonth() && date_str === today.getDate(),
              isSign: signDayList.includes(date_str)
            });
          } else {
            row.push({
              dayNum: date_str,
              isToday: year === today.getFullYear() && month === today.getMonth() && date_str === today.getDate(),
              isSign: signDayList.includes(date_str)
            });
          }
        }
        col.push(row);
      };
      this.monthDay = col;
    },
    is_leap(year) {
      return (year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : ( year % 4 == 0 ? 1 : 0));
    },
    changMonth(val) {
      let now = this.drawMonth;
      now.setMonth(now.getMonth() + val)
      this.drawMonth = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`);
      this.getMemberSign(now);
    },
    getMemberSign(monthOn) {
      let params = {
        companyKey: this.user.companyKey,
        cardNum: this.user.memberCard,
        phone: this.user.phone,
        month: monthOn.format('yyyy-MM')
      }
      this._http({url: '/jop-web/wxSign/getWxSign'}, params).then(res => {
        if(res.data.code == 0) {
          if(res.data.data) {
            let data = res.data.data;
            this.signData = {
              continuityNum: data.continuityNum ? data.continuityNum : 0,
              totalNum: data.totalNum ? data.totalNum : 0,
              signList: data.days ? JSON.parse(data.days) : [],
              content: data.content ? data.content : '',
            }
          } else {
            this.signData = {
              continuityNum: 0,
              totalNum: 0,
              signList: [],
              content: '',
            }
          }
          this.isSign = res.data.data.istoday && res.data.data.istoday === 1;
          let signDay = [];
          this.signData.signList.forEach(item => {
            signDay.push(new Date(monthOn.setDate(item)))
          })
          this.drawCalender(new Date(), signDay, monthOn);
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    goSign() {
      if(this.timer) {
        // this.$store.dispatch('poupShow', {
        //   data: '您签到过于频繁，请稍后重试！',
        //   time: 1
        // })
      } else {
        this.timer = window.setTimeout(function() {
          window.clearTimeout(this.timer);
          this.timer = null;
        }, 5000);
        let params = {
          companyKey: this.user.companyKey,
          cardNum: this.user.memberCard,
          phone: this.user.phone,
          openid: this.user.openid
        }
        this._http({url: '/jop-web/wxSign/postWxSign'}, params).then(res => {
          if (res.data.code == 0) {
            window.clearTimeout(this.timer);
            this.timer = null;
            this.isSign = true;
            this.getMemberSign(this.drawMonth);
            // 处理首页信息
            this.$store.dispatch('getHomeMemberIndex', {
              companyKey: this.user.companyKey,
              openid: this.user.openid
            });
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
};
</script>


<style lang="less" scoped>
.content {
  width: 100%;
  // height: calc(100vh - 75px);
  height: calc(100vh - 30px);
  background-color: #f5f5f5;
  overflow: auto;
  -webkit-overflow-scrolling: auto;
  .sign-header {
    width: 100%;
    height: 96px;
    background: linear-gradient(to top, #838dac, #a9a9c1);
    background: -moz-linear-gradient(to top, #838dac, #a9a9c1);
    background: -webkit-linear-gradient(to top, #838dac, #a9a9c1);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .sign-btn-big {
      width: 150px;
      height: 40px;
      // border-radius: 110px;
      display: flex;
      justify-content: center;
      align-items: center;
      .sign-btn {
        background-color: #ffcc41;
        width: 150px;
        height: 40px;
        line-height: 36px;
        text-align: center;
        font-size: 16px;
        color: #ffffff;
        border-radius: 20px;
        margin: 0 auto;
      }
      .signed {
        background-color: #efefef;
        color: #999999;
      }
    }
    .sign-day-num {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      font-size: 12px;
      .sign-day {
        padding: 11.5px 9px;
        color: white;
      }
      .sign-day-all {
        text-align: right;
        padding: 11.5px 9px;
        color: white;
        flex-basis: 50%;
        flex-grow: 1;
      }
    }
  }

  .sign-intro {
    width: calc(100vw - 20px);
    margin: 5px auto;
    background-color: #ffffff;
    border-radius: 2.5px;
    .header {
      font-size: 14px;
      font-weight: bold;
      padding: 6px;
      color: #d88400;
    }
    .content-intro {
      font-size: 12.5px;
      color: #666666;
      line-height: 21px;
      padding: 0 6px 6px 6px;
      color: #d88400;
    }
  }

  .calender-content {
    width: 100%;
    .calender-header {
      width: 100%;
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      .header-left {
        width: 25px;
        text-align: center;
        font-size: 16px;
      }
      .header-center {
        font-size: 15px;
        padding: 0 30px;
      }
      .header-right {
        width: 25px;
        text-align: center;
        font-size: 16px;
      }
    }
    .calender-content {
      width: calc(100vw - 20px);
      margin: 0 auto;
      background-color: #ffffff;
      .calender-content-header {
        display: flex;
        align-items: center;
        height: 42px;
        border-bottom: 1px solid #f5f5f5;
        div {
          flex-basis: 10%;
          flex-grow: 1;
          text-align: center;
          font-size: 15px;
          color: #666666;
        }
      }
      .calender-day {
        display: flex;
        align-items: center;
        height: 50px;
        .calender-day-row {
          flex-basis: 10%;
          flex-grow: 1;
          text-align: center;
          font-size: 15px;
          div {
            width: 37.5px;
            height: 37.5px;
            line-height: 37.5px;
            margin: 0 auto;
            color: #666666;
          }
          .signed-day {
            background: url(../../assets/qd-bg.png) no-repeat;
            background-size: 100% 100%;
            color: white;
          }
          .is-today {
            border: 1.5px solid #ffd96b;
            border-radius: 50%;
          }
        }
      }
    }
  }
  
}
</style>
