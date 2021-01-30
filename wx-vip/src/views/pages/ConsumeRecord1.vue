<template>
  <div>
    <div class="total-num-header" :style="{ 'background-color': themeColor }">
      <div class="first-div">
        <div>件数</div>
        <div>{{ consumeRecord.buyNumSum }}</div>
      </div>
      <div class="second-div"></div>
      <div class="third-div">
        <div>累计消费</div>
        <div>{{ consumeRecord.buyAmountSum }}</div>
      </div>
    </div>

    <div class="record-list">
      <div class="item" v-for="(item, index) in consumeList" :key="index">
        <ConsumerecordItem :consumeData="item" :orderEvaluate="orderEvaluate" @goConsumeDetails="goConsumeDetails"></ConsumerecordItem>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConsumerecordItem from '../../components/ConsumerecordItem';
export default {
  components: {
    ConsumerecordItem
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData
    })
  },
  data() {
    return {
      consumeRecord: {
        buyNumSum: 0,
        buyAmountSum: 0
      },
      isCustomize: '0',
      consumeList: [],
      orderEvaluate: '0'
    }
  },
  mounted() {
    this.getConsumeRecordList();
  },
  methods: {
    getConsumeRecordList() {
      let params = {
        page: {
          pageNum: 1,
          pageSize: 100
        },
        params: {
          companyKey: this.urlData.companyKey,
          vipCard: this.urlData.memberCard
        }
      }
      this._http({url: '/jop-web/electronicWarranty/getElectronicWarrantyList'}, params).then(res => {
        if(res.data.code === 0) {
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
      return this.urlData.companyKey === '005010_10' && (data.shopName === '水贝一店' || data.shopName === '金千枝罗湖店' || data.shopName === '展厅');
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
  height: calc(100vh - 125px);
  overflow: auto;
  -webkit-overflow-scrolling: auto;
  .item {
    background-color: white;
  }
  .item:not(:first-child) {
    margin-top: 1px;
  }
}
</style>
