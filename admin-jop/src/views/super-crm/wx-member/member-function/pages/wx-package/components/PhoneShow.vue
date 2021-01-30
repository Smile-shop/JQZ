<template>
  <div class="phone-show">
    <div class="phone">
      <div class="phone-content" v-if="!type">
        <div class="package-header" :style="{ 'background': backgroundPicUrl(data.background_pic_url) }">
          <div class="header-title">
            <div class="logo">
              <img :src="data.logo_url" alt="logo" v-if="data.logo_url">
              <div class="upload-logo" v-else>LOGO</div>
            </div>
            <div class="name">
              <p>{{ data.brand_name }}</p>
              <p>{{ data.title }}</p>
            </div>
            <div class="qr">
              <img src="~@/assets/images/super-crm/wx-member/card-ewm.png" alt="二维码">
            </div>
          </div>
          <div class="card-num">01598632478</div>
        </div>

        <div class="package-top-info">
          <div class="item" v-show="data.supply_bonus == '1'">
            <p>积分</p>
            <p>{{ data.init_increase_bonus }}</p>
          </div>
          <div class="row" v-show="data.supply_bonus == '1' && data.topInfo1.infoShow"></div>
          <div class="item" v-show="data.topInfo1.infoShow">
            <p>{{ data.topInfo1 | topInfoNameFilter }}</p>
            <p>查看</p>
          </div>
          <div class="row" v-show="data.topInfo2.infoShow"></div>
          <div class="item" v-show="data.topInfo2.infoShow">
            <p>{{ data.topInfo2 | topInfoNameFilter }}</p>
            <p>查看</p>
          </div>
        </div>

        <div class="package-center-info" v-show="data.centerInfo.center">
          <div>{{data.centerInfo.center_title}}</div>
          <div>{{data.centerInfo.center_sub_title}}</div>
        </div>

        <div class="package-bottom-info">
          <div class="item" v-show="data.bottomInfo1.infoShow">
            <div>{{ data.bottomInfo1.name }}</div>
            <div>{{ data.bottomInfo1.title }}</div>
          </div>
          <div class="item" v-show="data.bottomInfo2.infoShow">
            <div>{{ data.bottomInfo2.name }}</div>
            <div>{{ data.bottomInfo2.title }}</div>
          </div>
          <div class="item" v-show="data.bottomInfo3.infoShow">
            <div>{{ data.bottomInfo3.name }}</div>
            <div>{{ data.bottomInfo3.title }}</div>
          </div>
          <div class="item">
            <div>会员卡详情</div>
            <div></div>
          </div>
          <div class="item">
            <div>公众号</div>
            <div></div>
          </div> 
        </div>

      </div>

      <div class="phone-content" v-else>
        <div class="member-card-details-header">
          会员卡详情
        </div>
        <div class="item-details">
          <div>特权说明</div>
          <div>
            <p>每消费{{ data.detailsInfo.cost_money_unit | moneyFilter }}元，赠送{{ data.detailsInfo.increase_bonus }}积分</p>
            <p>每次赠送上限{{ data.detailsInfo.max_increase_bonus }}积分</p>
            <p>每使用{{ data.detailsInfo.cost_bonus_unit }}积分，抵扣{{ data.detailsInfo.reduce_money | moneyFilter }}元</p>
            <p>订单满{{ data.detailsInfo.least_money_to_use_bonus | moneyFilter }}元可用积分抵扣</p>
            <p>单笔使用上限{{ data.detailsInfo.max_reduce_bonus }}积分</p>
            <p>{{ data.detailsInfo.prerogative }}</p>
          </div>
        </div>

        <div class="item-details">
          <div>有效日期</div>
          <div>
            <p>永久有效</p>
          </div>
        </div>

        <div class="item-details">
          <div>电话</div>
          <div>
            <p class="color-green">{{ data.detailsInfo.service_phone }}</p>
          </div>
        </div>

        <div class="item-details">
          <div>使用须知</div>
          <div>
            <p>{{ data.detailsInfo.description }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  filters: {
    topInfoNameFilter(value: any) {
      if (value.topInfoName == '-1') {
        return value.name;
      }
      if (value.topInfoName == 'FIELD_NAME_TYPE_LEVEL') {
        return '等级';
      }
      if (value.topInfoName == 'FIELD_NAME_TYPE_COUPON') {
        return '优惠券';
      }
    },
    moneyFilter(value: any) {
      return (value / 100).toFixed(2)
    }
  }
})
export default class PhoneShow extends Vue {
  @Prop()
  data: any
  @Prop()
  type: any
  private backgroundPicUrl(url: any) {
    if (url) {
      return `url(${url}) 100% 100% no-repeat`;
    } else {
      return `red`;
    }
  }
}
</script>

<style lang="scss" scoped>
.phone-show {
  width: 100%;
  .phone {
    width: 314px;
    height: 625px;
    margin: 18px auto 0 auto;
    background-image: url('~@/assets/images/super-crm/wx-member/test-phone.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    .phone-content {
      position: absolute;
      top: 60px;
      left: 40px;
      width: 232px;
      height: 510px;
      overflow-y: auto;
      overflow-x: hidden;
      .package-header {
        width: 100%;
        height: 128px;
        border-radius: 10px;
        .header-title {
          display: flex;
          .logo {
            margin: 8px;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            border: 1px solid white;
            overflow: hidden;
            text-align: center;
            line-height: 40px;
            img {
              width: 40px;
            }
          }
          .upload-logo {
            background-color: gold;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 20px;
          }
          .name {
            flex-basis: 40%;
            flex-grow: 1;
            color: white;
            padding-top: 10px;
          }
          .qr {
            width: 50px;
            text-align: right;
            padding: 10px 12px;
            img {
              width: 20px;
            }
          }
        }
        .card-num {
          position: relative;
          top: 45px;
          left: 12px;
          color: white;
        }
      }
      .package-top-info {
        display: flex;
        padding-top: 10px;
        font-size: 12px;
        .item {
          flex-basis: 30%;
          flex-grow: 1;
          text-align: center;
          p:first-child {
            height: 20px;
            font-size: 14px;
          }
          p:last-child {
            height: 20px;
            color: #78b86e;
          }
        }
        .row {
          border-right: 1px solid #999999;
          height: 40px;
        }
      }
      .package-center-info {
        font-size: 12px;
        div:first-child {
          border: 1px solid #78b86e;
          border-radius: 5px;
          width: 120px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-size: 14px;
          color: #78b86e;
          margin: 5px auto;
        }
        div:last-child {
          text-align: center;
        }
      }
      .package-bottom-info {
        margin-top: 10px;
        border-top: 1px solid #999999;
        font-size: 13px;
        .item {
          border-bottom: 1px solid #999999;
          display: flex;
          height: 42px;
          align-items: center;
          div {
            flex-basis: 40%;
            flex-grow: 1;
          }
          div:last-child {
            text-align: right;
            color: #999999;
            font-size: 12px;
          }
        }
      }
      .member-card-details-header {
        width: 100%;
        border-bottom: 1px solid #dddddd;
        font-size: 16px;
        padding: 2px 8px;
        font-weight: bold;
      }
      .item-details {
        display: flex;
        padding: 8px;
        font-size: 14px;
        div:first-child {
          width: 80px;
          color: #999999;
        }
        div:last-child {
          flex-basis: 50%;
          flex-grow: 1;
          p {
            padding-bottom: 5px;
          }
          .color-green {
            color: #78b86e;
          }
        }
      }
    }
  }
}
</style>


