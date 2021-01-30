<template>
  <article>
    <nav v-if="orderEvaluate === '1'" class="consume-header" :style="{ 'background-color': themeColor }">
      <div class="item">
        <div @click="navIndex = '0'" :style="{'color': navIndex === '0' ? themeColor : '#ffffff', 'background-color': navIndex === '0' ? '#ffffff' : themeColor }">全部</div>
      </div>
      <div class="item">
        <div @click="navIndex = '1'" :style="{'color': navIndex === '1' ? themeColor : '#ffffff', 'background-color': navIndex === '1' ? '#ffffff' : themeColor }">已评价</div>
      </div>
      <div class="item">
        <div @click="navIndex = '2'" :style="{'color': navIndex === '2' ? themeColor : '#ffffff', 'background-color': navIndex === '2' ? '#ffffff' : themeColor }">待评价</div>
      </div>
    </nav>

    <div class="record-list">
      <div class="item" v-for="(item, index) in contentList" :key="index">
        <div class="item-title">
          <div class="icon" :style="{ 'background-color': themeColor }"></div>
          <div class="vipcard">单号：{{item.orderNo}}</div>
          <div class="time">{{item.createTime | datefmt('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>

        <div class="record-details van-hairline--bottom" v-if="computedSPList(item).length > 0">
          <div class="title">销售</div>
          <div class="content" v-for="spItem in computedSPList(item)" :key="spItem.proCode">
            <div class="name">{{spItem.proName | nameFilter}}</div>
            <div class="number">{{computedNum(spItem)}}</div>
            <div class="money">￥{{spItem.orderType ? '-' : ''}}{{spItem.salePrice | moneyfc}}</div>
            <div class="cord">积分{{spItem.orderType ? '-' : ''}}{{spItem.saleIntegral | moneyfc}}</div>
          </div>
        </div>

        <!-- <div class="record-details van-hairline--bottom" v-if="computedSPList(item.listElectronicWarrantyDetail, 1).length > 0 && (isCustomize === '1' || isCustomizeMethods(item))">
          <div class="title">销退</div>
          <div class="content" v-for="spItem in computedSPList(item.listElectronicWarrantyDetail, 1)" :key="spItem.proCode">
            <div class="name">{{spItem.proName | nameFilter}}</div>
            <div class="number">{{computedNum(spItem)}}</div>
            <div class="money">￥{{spItem.salePrice | moneyfc}}</div>
            <div class="cord">积分{{spItem.saleIntegral | moneyfc}}</div>
          </div>
        </div> -->

        <div class="record-details van-hairline--bottom" v-if="computedJLList(item).length > 0">
          <div class="title">旧料</div>
          <div class="content" v-for="jlItem in computedJLList(item)" :key="jlItem.proCode">
            <div class="name">{{jlItem.material | nameFilter}}</div>
            <div class="money">抵扣￥{{jlItem.deduction | moneyfc}}</div>
            <div class="cord">工费￥{{jlItem.handwork | moneyfc}}</div>
          </div>
        </div>

        <div class="record-details van-hairline--bottom" v-if="item.couponInfo && item.couponInfo.length > 0 && (isCustomize === '1' || isCustomizeMethods(item))">
          <div class="yy-detail">{{computedCouponList(item.couponInfo)}}</div>
        </div>

        <div class="record-details-footer">
          <div class="total-money">
            总金额：
            <b :style="{ 'color': themeColor }">￥</b>
            <span :style="{ 'color': themeColor }">{{computedTotal(item) | moneyfc}}</span>
          </div>
          <div class="btn-1" 
            v-if="item.enableEvaluation && orderEvaluate === '1' && !item.evaluationType" 
            :style="{ 'color': themeColor, 'border': `1px solid ${themeColor}` }" 
            @click="goIsOk(item)">去评价</div>
          <div
            v-if="item.enableEvaluation && orderEvaluate === '1' && item.evaluationType" 
            :style="{ 'color': themeColor, 'border': `1px solid ${themeColor}` }" 
            class="btn-3"
            @click="goEvaluationDetails(item)">查看评价</div>  
          <div class="btn-2" :style="{ 'background-color': themeColor }" @click="goConsumeDetails(item)">查看质保单</div>
        </div>

      </div>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'ConsumeRecord',
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
    },
    contentList() {
      switch (this.navIndex) 
      {
      case '1':
        return this.consumeList.filter(p => p.evaluationType === 1);
        break;
      case '2':
        return this.consumeList.filter(p => p.evaluationType === 0);
        break;  
      default:
        return this.consumeList;
      }
    }
  },
  filters: {
    nameFilter(name) {
      return String(name);
    }
  },
  data() {
    return {
      consumeRecord: {
        buyNumSum: 0,
        buyAmountSum: 0
      },
      isCustomize: '0',
      consumeList: [],
      orderEvaluate: '0',
      navIndex: '0'
    }
  },
  activated() {
    this.getConsumeRecordList();
  },
  methods: {
    // 首饰列表
    computedSPList(item) {
      const list = item.listElectronicWarrantyDetail || [];
      if(this.isCustomize === '1' || this.isCustomizeMethods(item)) {
        return list;
      } else {
        return list.filter((p, i) => i < 4);
      }
    },
    // 旧料列表
    computedJLList(item) {
      const list = item.oldMaterial || [];
      if(this.isCustomize === '1' || this.isCustomizeMethods(item)) {
        return list;
      } else {
        return list.filter((p, i) => i < 1);
      }
    },
    // 数量显示
    computedNum(item) {
      if(item.saleType && item.saleType === 'LAB') {
        return '1件';
      } else {
        return item.goldWeight ? `${item.goldWeight.toFixed(2)}g` : '';
      }
    },
    // 优惠
    computedCouponList(list) {
      const totalMoney = list.reduce((acc, cur) => {
        return acc + cur.amount
      }, 0);
      // console.log(totalMoney)
      return `优惠${totalMoney}元`;
      // return list.map(p => p.categoryName).join(',');
    },
    // 计算总金额
    computedTotal(item) {
      return Number(item.payAmount1) + Number(item.payAmount2) + Number(item.payAmount3);
    },
    getConsumeRecordList() {
      let params = {
        page: {
          pageNum: 1,
          pageSize: 100
        },
        params: {
          companyKey: this.user.companyKey,
          vipCard: this.user.memberCard
        }
      }
      this._http({url: '/jop-web/electronicWarrantyNew/getElectronicWarrantyListNew'}, params).then(res => {
        if(res.data.code === 0) {
          // console.log(res.data)
          this.consumeRecord.buyNumSum = res.data.data.buyNumSum || 0;
          this.consumeRecord.buyAmountSum = res.data.data.buyAmountSum || 0;
          let consumeList = res.data.data.result.list ? res.data.data.result.list : [];
          consumeList.sort((a, b) => {
            return new Date(a.createTime).getTime() <= new Date(b.createTime).getTime();
          });
          this.consumeList = consumeList;
          this.isCustomize = res.data.data.isCustomize || '0';
          this.orderEvaluate = res.data.data.orderEvaluate || '0';
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    isCustomizeMethods(data) {
      return this.user.companyKey === '005010_10' && (data.shopName === '水贝一店' || data.shopName === '金千枝罗湖店' || data.shopName === '展厅');
    },
    goConsumeDetails(data) {
      let companyKey = this.urlData.companyKey;
      let orderNo = data.orderNo;
      let vipCard = data.vipCard;
      let member = this.homeMemberData;
      if(this.isCustomize === '1' || this.isCustomizeMethods(data)) {
        window.location.href = `${this.httpUrl}/wx_member/others/${companyKey}/vip/warranty/index.html#/?c=${companyKey}&o=${orderNo}&v=${vipCard}&m=${member.level}&n=${member.ableScore}`;
      } else {
        this.$router.push({
          path: '/consume-details',
          query: {
            id: data.orderNo
          }
        })
      }
    },
    goIsOk(item) {
      if(!item.evaluationType) {
        if(item.shopName && item.shopName != '') {
          this.$router.push({
            path: '/evaluation',
            query: {
              n: item.nameOut,
              v: item.orderNo,
              s: item.salesMan
            }
          })
        } else {
          this.$toast({
            message: '质保单信息不完整！',
            duration: 1000
          })
        }
      }
    },
    goEvaluationDetails(item) {
      this.$router.push({
        path: '/evaluation-record',
        query: {
          o: item.orderNo
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.consume-header {
  display: flex;
  align-items: center;
  height: 37px;
  .item {
    flex-grow: 1;
    color: #ffffff;
    div {
      width: calc(100% - 2px);
      height: 35px;
      line-height: 35px;
      text-align: center;
      margin: 0 auto;
      font-family: PingFang-SC-Medium;
      font-size: 14px;
    }
  }
}
.record-list {
  width: 100%;
  // height: calc(100vh - 106px);
  height: calc(100vh - 54px);
  overflow: auto;
  -webkit-overflow-scrolling: auto;
  .item {
    background-color: white;
    margin-top: 5px;
    .item-title {
      height: 37px;
      background-color: #fdf3f3;
      display: flex;
      align-items: center;
      .icon {
        width: 3px;
        height: 37px;
      }
      .vipcard {
        flex-grow: 1;
        font-family: PingFang-SC-Medium;
        font-size: 14px;
        color: #333333;
        padding-left: 8px;
      }
      .time {
        font-family: PingFang-SC-Medium;
        font-size: 12px;
        color: #999999;
        padding-right: 8px;
      }
    }

    .record-details {
      .title {
        font-size: 12px;
        color: #333333;
        padding: 10px 12px 0 12px;
      }
      .content {
        display: flex;
        height: 28px;
        align-items: center;
        font-size: 12px;
        color: #999999;
        padding: 0 12px;
        .name {
          flex-basis: 40%;
          flex-grow: 1;
        }
        .number {
          flex-basis: 10%;
          flex-grow: 1;
        }
        .money {
          flex-basis: 20%;
          flex-grow: 1;
        }
        .cord {
          flex-basis: 20%;
          flex-grow: 1;
        }
      }
      .yy-detail {
        font-family: PingFang-SC-Medium;
        font-size: 12px;
        color: #333333;
        padding: 12px;
      }
    }
    .record-details-footer {
      display: flex;
      height: 44px;
      align-items: center;
      padding: 0 12px;
      .total-money {
        font-size: 12px;
        color: #333333;
        flex-grow: 1;
        span {
          font-size: 18px;
        }
      }
      .btn-1 {
        width: 60px;
        height: 30px;
        line-height: 28px;
        text-align: center;
        border-radius: 5px;
        font-size: 12px;
        margin-right: 10px;
        box-sizing: border-box;
      }
      .btn-2 {
        width: 75px;
        height: 30px;
        line-height: 28px;
        text-align: center;
        border-radius: 5px;
        color: #ffffff;
        font-size: 12px;
      }
      .btn-3 {
        width: 75px;
        height: 30px;
        line-height: 28px;
        text-align: center;
        border-radius: 5px;
        font-size: 12px;
        margin-right: 10px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
