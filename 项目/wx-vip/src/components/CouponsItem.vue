 <template>
  <div>
    <div @click="goDetails(listItem)" class="coupons-item">
      <div class="item-left" :style="{ 'background-color': computedItemStatus(listItem).color }">
        <div>{{ parseCouponType(listItem.couponType) }}</div>
      </div>
      <img class="stamp" src="../assets/stamp.png" alt="stamp">
      <div class="item-center" :style="backgroundImg(listItem)">
        <!-- 现金券 -->
        <div v-if="listItem.couponType == 'YHQ'" class="item-title" :style="{'color': computedItemStatus(listItem).color}">
          ¥<span class="value">{{listItem.val}}</span><span class="name">{{listItem.name}}</span>
        </div>
        <!-- 随机券 -->
        <div v-else-if="listItem.couponType == 'SJQ'" class="item-title" :style="{'color': computedItemStatus(listItem).color}">
          ¥
          <span class="value">
            <span
              v-if="listItem.is_receive == 0"
            >
              {{listItem.val}}-{{listItem.randMax}}
            </span>
            <span
              v-else
            >
              {{listItem.val}}
            </span>
          </span>
          <span class="name">
            {{listItem.name}}
          </span>
        </div>
        <!-- 折扣券 -->
        <div v-else-if="listItem.couponType == 'ZKQ'" class="item-title discount" :style="{'color': computedItemStatus(listItem).color}">
          <span class="value">{{(listItem.val * 10).toFixed(1)}}</span>
          <span class="unit">
            折
          </span>
          <span class="name">{{listItem.name}}</span>
        </div>
        <!-- 礼品券 -->
        <div v-else-if="listItem.couponType == 'LPQ'" class="item-title gift" :style="{'color': computedItemStatus(listItem).color}">
          <span class="value">{{listItem.val}}</span>
          <span class="unit">
            件
          </span>
          <span class="name">{{listItem.name}}</span>
        </div>
        <div class="item-intro" :style="{'color': computedItemStatus(listItem).color}">{{listItem.details}}</div>
        <div class="item-intro">适用门店：{{listItem.nameOut || listItem.shopName}}</div>
        <div class="item-intro">{{listItem | timeFilter(type)}}</div>
        <div class="show-qr" @click.stop="showQr(listItem)" v-if="computedItemStatus(listItem).name == '可用' && type != 5" :style="{'color': computedItemStatus(listItem).color}">
          <i class="vip-v3-iconfont vip-v3-icon-tubiaozhizuomoban" style="font-size:25px"></i>
          <div>去使用</div>
        </div>
      </div>
      <div
        class="item-right"
        @click.stop="receive"
        v-if="computedItemStatus(listItem).name != '可用' && computedItemStatus(listItem).name != '不可用'"
        :style="{ 'border-left': `1px dashed ${computedItemStatus(listItem).color}`, 'color': computedItemStatus(listItem).color }">
        {{computedItemStatus(listItem).name}}
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import Toast from './Toast';
export default {
  props: ['type', 'listItem'],
  components: {
    Toast
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData
    }),
    data() {
      return {
        phone: this.listItem.code,
        id: this.listItem.couponId
      }
    }
  },
  data() {
    return {
      toastShow: false,
      isReceived: true
    }
  },
  filters: {
    timeFilter(data, type) {
      if (type == 2) {
        return `使用时间：${new Date(data.usedTime).format('yyyy-MM-dd')}`;
      } else {
        if (data.get_enable) {
          return data.available_day == 0 ? '有效期：今天' : `有效期：领取后${data.available_day}日内`;
        } else {
          return `有效期：${new Date(data.startTime).format('yyyy-MM-dd')} - ${new Date(data.endTime).format('yyyy-MM-dd')}`;
        }
      }
    }
  },
  methods: {
    parseCouponType(couponType) {
      switch (couponType) {
        case 'YHQ':
          return '现金券'
        case 'SJQ':
          return '随机券'
        case 'ZKQ':
          return '折扣券'
        case 'LPQ':
          return '礼品券'
        default:
          return ''
      }
    },
    backgroundImg(item) {
      if (this.computedItemStatus(item).name == '不可用') {
        return {
          background: "url(" + require('../assets/yhq-bg.png') + ") no-repeat right bottom",
          backgroundSize: '100% 100%'
        }
      }
    },
    computedItemStatus(item) {
      // 判断是否领取
      if (item.id) {
        return {
          name: item.count > 0 ? '领取' : '已抢光',
          color: item.count > 0 ? this.themeColor : '#cccccc'
        }
      } else {
        // 判断是否使用
        if (item.recordStatus === 1) {
          return {
            name: '已使用',
            color: '#cccccc'
          }
        } else {
          // 判断是否过期
          const isOutTime = item.endTime < new Date().getTime();
          if (isOutTime) {
            return {
              name: '已过期',
              color: '#cccccc'
            }
          } else {
            return {
              name: item.enable ? '可用' : '不可用',
              color: item.enable ? this.themeColor : '#cccccc'
            }
          }
        }
      }
    },
    goDetails(item) {
      if (this.type != 5 && this.computedItemStatus(item).name != '已抢光' && this.computedItemStatus(item).name != '已过期') {
        this.$store.commit('couponDetails', item);
        this.$router.push({
          path: '/cpsdtl'
        })
      }
    },
    receive() {
      if (this.listItem.count && this.listItem.count > 0 && !this.listItem.is_receive) {
        let params = {
          card_no: this.homeMemberData.cardNum,
          companyKey: this.urlData.companyKey,
          id: this.listItem.id,
          specialId: this.listItem.specialId
        }
        this._http({url: '/jop-web/coupon/get'}, params).then(res => {
          if(res.data.code === 0) {
            this.$toast({
              message: '领取成功！',
              duration: 1000
            })
            this.$emit('getCouponItem');
            // 处理首页未领取的优惠券
            this.$store.dispatch('getHomeMemberIndex', {
              companyKey: this.urlData.companyKey,
              openid: this.urlData.openid
            });
            if (this.type == 5) {
              this.$store.commit('couponDetails', res.data.data);
            }
          } else {
            this.$toast({
              message: res.data.msg,
              duration: 1000
            })
          }
        })
      }
    },
    showQr(data) {
      this.$emit('showQr', data);
    }
  }
}
</script>

<style lang="less" scoped>
.coupons-item {
  width: calc(100% - 15px);
  margin: 10px auto 0 auto;
  display: flex;
  align-items: center;
  position: relative;
  background-color: #ffffff;
  .stamp {
    position: absolute;
    left: 28.5px;
    width: 10px;
    height: 120px;
  }
  .item-left {
    width: 31px;
    font-size: 14px;
    word-wrap: break-word;
    text-align: center;
    color: white;
    word-wrap: break-word;
    letter-spacing: 10px;
    display: flex;
    align-items: center;
    height: 120px;
    div {
      width: 31px;
      padding: 0 7.5px;
    }
  }
  .item-center {
    flex-basis: 50%;
    flex-grow: 1;
    height: 120px;
    overflow: hidden;
    position: relative;

    .item-title {
      font-size: 12px;
      color: #666666;
      padding: 8px 0 5px 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 40px;
      
      .value {
        font-size: 30px;
        font-weight: bold;
        padding: 0 5px;
      }
      .name {
        color: #666666;
        padding-left: 5px;
      }

      &.discount, &.gift {
        .value {
          padding-right: 0;
        }

        .unit {
          font-size: 10px;
        }
      }
    }
    .item-intro {
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 2px 15px;
      color: #666666;
    }
    .show-qr {
      position: absolute;
      right: 10px;
      top: 15px;
      text-align: center;
      font-size: 20px;
      > div {
        font-size: 10px;
        transform: scale(.6);
        transform-origin: 50% 0;
      }
    }
  }
  .item-right {
    width: 40px;
    height: 100px;
    font-size: 14px;
    font-weight: bold;
    word-wrap: break-word;
    text-align: center;
    word-wrap: break-word;
    letter-spacing: 6.5px;
    display: flex;
    align-items: center;
  }
}
</style>
