<template>
  <main class="info">
    <div class="info-title">联系人信息</div>
    <div class="info-content">
      <div class="info-content-num">订单号：{{props.goodsInfo.orderNo}}</div>
      <div class="info-content-good">
        <div class="info-content-good-img">
          <img :src="props.goodsInfo.imgUrl" alt="商品图" />
        </div>
        <div class="info-content-good-message">
          <div class="info-content-good-message-title">{{props.goodsInfo.title}}</div>
          <div class="info-content-good-message-hd">{{props.goodsInfo.secondTitle}}</div>
          <div class="info-content-good-message-time">{{forDay(props.goodsInfo.payTime)}}</div>
          <div class="info-content-good-message-price">
            <span class="info-content-good-message-price-l">实付：</span>
            <span class="info-content-good-message-price-r">
              <span>￥</span>
              {{props.goodsInfo.payAmount}}
            </span>
          </div>
        </div>
      </div>
      <div class="info-content-concats">
        <span class="info-content-concats-text">联系人：</span>
        <div class="info-content-concats-img">
          <img v-if="props.goodsInfo.headimgUrl" :src="props.goodsInfo.headimgUrl" alt="头像" />
          <img v-else src="~@/assets/img/avatar.png" alt="头像" />
        </div>
        <span class="info-content-concats-text">{{props.goodsInfo.nickname}}</span>
      </div>
      <div class="info-content-mask" v-if="props.goodsInfo.verifyStatus==='2'">
        <img class="info-content-mask-imgCode" src="@/assets/img/verify.png" alt />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

export default defineComponent({
  components: {},
  props: {
    goodsInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const data = reactive({});
    const router = useRouter();
    const back = () => {
      router.push({
        path: '/home',
      });
    };
    const forDay = (val: any) => {
      if (val) {
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
      } else {
        return '--';
      }
    };
    return {
      props,
      data,
      back,
      forDay,
    };
  },
});
</script>

<style lang="scss" scoped>
.info {
  &-title {
    line-height: 15.2vw;
    padding-left: 4vw;
    position: relative;
    font-size: 3.7vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #1d0800;
    &::before {
      position: absolute;
      content: '';
      width: 1.1vw;
      height: 3.7vw;
      background: #fc7125;
      border-radius: 10vw;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  &-content {
    background: #ffffff;
    border-radius: 2.1vw;
    padding: 4.3vw 3vw;
    position: relative;
    &-num {
      font-size: 3.7vw;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #1d0800;
      line-height: 5.3vw;
    }
    &-good {
      display: flex;
      padding: 4.5vw 0;
      border-bottom: 1px solid #ebedf0;
      &-img {
        width: 23.5vw;
        height: 23.5vw;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &-message {
        flex: 1;
        padding-left: 2.7vw;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &-title {
          font-size: 4.3vw;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #1d0800;
          line-height: 5.3vw;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &-hd {
          font-size: 3.2vw;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #95a09f;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-top: 2vw;
        }
        &-time {
          font-size: 2.9vw;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #95a09f;
          margin-top: 3vw;
        }
        &-price {
          margin-top: 2vw;
          &-l {
            font-size: 3.7vw;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #1d0800;
            line-height: 5.3vw;
          }
          &-r {
            span {
              font-size: 3.7vw;
            }
            font-size: 4.3vw;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #fc7125;
            line-height: 5.9vw;
          }
        }
      }
    }
    &-concats {
      display: flex;
      align-items: center;
      margin-top: 4.3vw;
      &-img {
        width: 6.6vw;
        height: 6.6vw;
        border-radius: 10vw;
        overflow: hidden;
        margin-right: 1.6vw;
      }
      &-text {
        font-size: 3.7vw;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1d0800;
        line-height: 5.3vw;
      }
    }
    &-mask {
      width: calc(100% - 6vw);
      height: 28vw;
      background: rgba(255, 255, 255, 0.85);
      position: absolute;
      top: 12vw;
      &-imgCode {
        width: 16.9vw;
        height: 16.9vw;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
