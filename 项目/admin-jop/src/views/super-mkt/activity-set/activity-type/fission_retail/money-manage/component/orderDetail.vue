<template>
  <div class="order-detail">
    <el-dialog title="支付详情" :visible.sync="dialogOrderVisible" :before-close="handleClose">
      <div class="user">
        <div class="img">
          <img :src="orderDetail.headimgUrl" alt />
        </div>
        <div class="info">
          <div>{{orderDetail.nickName}}</div>
          <div>{{orderDetail.openid}}</div>
        </div>
        <div class="amount">
          <div class="money">{{orderDetail.payAmt ? orderDetail.payAmt + '元' : '——'}}</div>
          <div>支付金额</div>
        </div>
        <div class="pay">
          <div>已支付</div>
          <div>{{orderDetail.successTime}}</div>
        </div>
      </div>
      <el-card
        class="box-card"
        style="margin-top: 10px; border: none; box-shadow: none; -webkit-box-shadow: none;"
      >
        <div class="order">
          <div class="left">
            <div class="top">
              <span>微信支付单号：</span>
              <p class="content">{{orderDetail.payNo}}</p>
            </div>
            <div>
              <span>商户订单号：</span>
              <p class="content">{{orderDetail.orderNo}}</p>
            </div>
          </div>
          <div class="right">
            <div class="top">
              <span>入账手续费：</span>
              <p class="content">{{orderDetail.fee ? orderDetail.fee + '元' : '——'}}</p>
            </div>
            <div>
              <span>实收金额：</span>
              <div class="content">
                <p class="money">
                  {{orderDetail.receiptsAmt}}
                  <span style="text-align: left; color: #303133">元</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 10px;">
        <div class="first-order">
          <div class="left">
            <div class="top">
              <span>一级返现：</span>
              <p class="content">{{orderDetail.oneCommission}}元</p>
            </div>
            <div>
              <span>直接上级：</span>
              <p class="content">{{orderDetail.directSuperiorName}}</p>
            </div>
          </div>
          <div class="line"></div>
          <div class="right">
            <div class="top">
              <span class="first-back">一级返现商户单号：</span>
              <p class="content">{{orderDetail.oneCommissionNo}}</p>
            </div>
            <div>
              <span>一级返现微信付款单号：</span>
              <p class="content">{{orderDetail.oneCommissionWxNo}}</p>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 10px;">
        <div class="second-order">
          <div class="left">
            <div class="top">
              <span>二级返现：</span>
              <p class="content">{{orderDetail.twoCommission}}元</p>
            </div>
            <div>
              <span>间接上级：</span>
              <p class="content">{{orderDetail.indirectSuperiorName}}</p>
            </div>
          </div>
          <div class="line"></div>
          <div class="right">
            <div class="top">
              <span class="second-back">二级返现商户单号：</span>
              <p class="content">{{orderDetail.twoCommissionNo}}</p>
            </div>
            <div>
              <span>二级返现微信付款单号：</span>
              <p class="content">{{orderDetail.twoCommissionWxNo}}</p>
            </div>
          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class OrderDtail extends Vue {
  @Prop() orderDetail!: {};
  @Prop() dialogOrderVisible!: boolean;

  gridData = [];

  private handleClose() {
    this.$emit('update:dialogOrderVisible', false);
  }
}
</script>

<style lang="scss">
.order-detail {
  /deep/ .el-dialog {
    width: 700px;
  }
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #eee;
  }

  /deep/ .el-dialog__body {
    padding-top: 20px;
  }

  .money {
    color: #f00;
  }

  .content {
    display: inline-block !important;
    text-align: left im !important;
  }

  .user {
    display: flex;
    align-items: center;
    height: 71px;
    background-color: rgb(255, 242, 241);
    border-radius: 4px;
    .img {
      margin-left: 30px;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
    }
    .info {
      flex: 4;
    }
    .amount {
      flex: 2;
    }
    .pay {
      flex: 4;
    }
  }

  .order {
    .top {
      margin-bottom: 6px;
    }
    span {
      display: inline-block;
      width: 154px;
    }
    display: flex;
    .left,
    .right {
      display: flex;
      flex-direction: column;
    }
    .left {
      width: 50%;
      span {
        display: inline-block;
        width: 110px;
        text-align: right;
      }
    }
    .right {
      span {
        display: inline-block;
        width: 110px;
        text-align: right;
      }
    }
  }

  .first-order {
    .top {
      margin-bottom: 6px;
    }
    .line {
      width: 1px;
      height: 30px;
      margin-top: 10px;
      margin-right: 10px;
      background-color: #bbb;
    }
    span {
      display: inline-block;
      width: 154px;
      text-align: right;
    }
    display: flex;
    .left,
    .right {
      display: flex;
      flex-direction: column;
    }
    .left {
      width: 50%;
      span {
        display: inline-block;
        width: 110px;
        text-align: right;
      }
    }
    .right {
      .first-back {
        display: inline-block;
        text-align: left;
        width: 130px;
      }
    }
  }

  .second-order {
    .top {
      margin-bottom: 6px;
    }
    .line {
      width: 1px;
      height: 30px;
      margin-top: 10px;
      margin-right: 10px;
      background-color: #bbb;
    }
    span {
      display: inline-block;
      width: 154px;
      text-align: right;
    }
    display: flex;
    .left,
    .right {
      display: flex;
      flex-direction: column;
    }
    .left {
      width: 50%;
      span {
        display: inline-block;
        width: 110px;
        text-align: right;
      }
    }
    .right {
      .second-back {
        display: inline-block;
        text-align: left;
        width: 130px;
      }
    }
  }
}
</style>