<template>
  <div class="item">
    <div class="num">
      <div>{{ consumeData.orderNo }}</div>
      <div>{{ new Date(consumeData.createTime).format('yyyy-MM-dd hh:mm:ss') }}</div>
    </div>
    <div 
      v-if="consumeData.enableEvaluation && orderEvaluate === '1'" 
      class="btn" 
      :style="{'border': `1px solid ${consumeData.evaluationType ? '#cccccc' : themeColor}`, 'color': consumeData.evaluationType ? '#cccccc' : themeColor}" 
      @click="goIsOk">我要评价</div>
    <div class="btn" :style="{'border': `1px solid ${themeColor}`, 'color': themeColor}" @click="goConsumeItem">查看质保单</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: ['consumeData', 'orderEvaluate'],
  computed: {
    ...mapState({
      isCustomize: state => state.consume.isCustomize,
      themeColor: state => state.themeColor
    })
  },
  mounted() {
  },
  methods: {
    goConsumeItem() {
      this.$emit('goConsumeDetails', this.consumeData);
      // let companyKey = this.$store.getters.userInfo.companyKey;
      // let orderNo = this.consumeData.orderNo;
      // let vipCard = this.consumeData.vipCard;
      // let member = this.$store.getters.memberInfo;
      // if(this.isCustomize * 1) {
      //   window.location.href = `${this.baseUrl}/wx_member/others/${companyKey}/vip/warranty/index.html#/?c=${companyKey}&o=${orderNo}&v=${vipCard}&m=${member.level}&n=${member.ableScore}`;
      // } else {
      //   this.$store.dispatch('getConsumeDetails', this.consumeData.orderNo);
      // }
    },
    goIsOk() {
      if(!this.consumeData.evaluationType) {
        if(this.consumeData.shopName && this.consumeData.shopName != '') {
          this.$router.push({
            path: '/evaluation',
            query: {
              n: this.consumeData.shopName,
              v: this.consumeData.orderNo,
              s: this.consumeData.salesMan
            }
          })
        } else {
          this.$toast({
            message: '质保单信息不完整！',
            duration: 1000
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: space-around;
  .num {
    flex-basis: 40%;
    div:first-child {
      font-size: 14px;
      color: #333333;
      line-height: 25px;
    }
    div:last-child {
      font-size: 12px;
      color: #999999;
    }
  }
  .btn {
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    border-radius: 15px;
  }
}
</style>
