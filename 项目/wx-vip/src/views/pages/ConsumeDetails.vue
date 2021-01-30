<template>
  <div>
    <div class="container">
      <div 
        :style="{ top: divStyle.top + 'px', 
        left: divStyle.left + 'px' }"
        id="container">
        <!-- <img src="../assets/images/dzzbd.jpg" alt="logo"> -->
        <div class="logo">
          <!-- <p>金 百 福</p> -->
        </div>

        <div class="content" v-if="consumeData">
          <div class="header">
            <div class="item">
              <div class="left title">货品保证单</div>
            </div>

            <div class="item">
              <div class="left">{{ consumeData.shopName }}</div>
              <div class="right">单号：{{ consumeData.orderNo }}</div>
            </div>

            <div class="item">
              <div class="left">电话：{{ consumeData.shopPhone }}</div>
              <div class="right">日期：{{ new Date(consumeData.createTime).format('yyyy/MM/dd hh:mm:ss') }}</div>
            </div>

            <div class="item">
              <div class="left">地址：{{ consumeData.shopAddress }}</div>
              <div class="right">经售：{{ consumeData.salesMan }}</div>
            </div>
          </div>

          <div class="body">
            <div class="table-title">
              <div class="num-1">商品编号</div>
              <div class="name">商品名称</div>
              <div class="num-3">数量</div>
              <div class="num-2">证书编号</div>
              <div class="weight-3">总重</div>
              <div class="weight-1">金重（g）</div>
              <div class="weight-2">石重（ct/p）</div>
              <div class="price-1">标价</div>
              <div class="price-2">实售价</div>
            </div>

            <div class="table-content" v-for="(item, index) in consumeData.listElectronicWarrantyDetail" :key="index">
              <div class="table-title" v-if="index < 4">
                <div class="num-1">{{ item.proCode }}</div>
                <div class="name">{{ item.proName }}</div>
                <div class="num-3">1</div>
                <div class="num-2">{{ item.certificateCode }}</div>
                <div class="weight-3">{{ item.saleType != 'LAB' || item.jewelryLargeCategory == 'XQL' ? `${item.sumWeight ? `${item.sumWeight}g` : ''}` : '' }}</div>
                <div class="weight-1">{{ item.saleType != 'LAB' || item.jewelryLargeCategory == 'XQL' ? `${item.goldWeight ? `${item.goldWeight}g` : ''}` : '' }}</div>
                <div class="weight-2">{{ item.saleType != 'LAB' || item.jewelryLargeCategory == 'XQL' ? `${item.stoneWeight ? `${item.stoneWeight}ct` : ''}` : '' }}</div>
                <div class="price-1">¥{{ item.orderType ? `-${item.flagPrice}` : item.flagPrice }}</div>
                <div class="price-2">¥{{ item.orderType ? `-${item.salePrice}` : item.salePrice }}</div>
              </div>
            </div>

            <div v-show="consumeData.listElectronicWarrantyDetail.length > 4">
              <!-- ...... -->
            </div>

            <div class="old-mertails" v-for="(item, index) in consumeData.oldMaterial" :key="index">
              <div v-if="index < 1">
                <div class="name">旧料：{{ item.material }}</div>
                <div class="weight">重量：{{ item.weight }}g</div>
                <div class="price">工费：￥{{ item.handwork }}</div>
                <div class="price-harf">抵扣价：￥{{ item.deduction }}</div>
              </div>
            </div>

            <div v-show="consumeData.oldMaterial.length > 1">
              <!-- ...... -->
            </div>

            <div class="total">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="w-t-1">
                <tr>
                  <td style="text-align:right;padding:10px 0;">总计：</td>
                  <td>{{ consumeData.listElectronicWarrantyDetail.length }}</td>
                  <!-- <td>¥{{ computedSum }}</td> -->
                </tr>
                <tr>
                  <td style="text-align:right">实售金额：</td>
                  <td>¥{{ consumeData.payAmount1 + consumeData.payAmount2 + consumeData.payAmount3 }}</td>
                </tr>
              </table>

            </div>

          </div>

          <div class="footer">
            <div class="zbd-user">
              <p>物料赠品：{{ computedGiftInfo(consumeData.giftInfo) }}</p>
              <span>客户：{{ consumeData.customerName }}</span><span>会员卡：{{ consumeData.vipCard }}</span><span>电话：{{ consumeData.customerPhone }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="zoom-btn">
      <div class="big-btn">
        <i class="vip-v3-iconfont" @click="zoomMethods(0)">&#xe604;</i>
      </div>
      <div class="small-btn">
        <i class="vip-v3-iconfont" @click="zoomMethods(1)">&#xe605;</i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Hammer from "hammerjs";
export default {
  computed: {
    ...mapState({
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData
    }),
    divStyle() {
      return {
        top: this.endPosition.y,
        left: this.endPosition.x
      };
    },
    computedPayType() {
      let payType = '';
      if (this.consumeData.payAmount1*1 > 0) {
        payType += `${this.consumeData.payType1}、`;
      };
      if (this.consumeData.payAmount2*1 > 0) {
        payType += `${this.consumeData.payType2}、`;
      };
      if (this.consumeData.payAmount3*1 > 0) {
        payType += `${this.consumeData.payType3}`;
      }
      return payType;
    },
    computedSum() {
      let sum = 0;
      this.consumeData.listElectronicWarrantyDetail.forEach(val => {
        sum += val.flagPrice;
      });
      this.consumeData.oldMaterial.forEach(val => {
        sum += val.handwork;
        sum -= val.deduction;
      });
      return sum;
    }
  },
  data() {
    return {
      startPosition: {
        x: 0,
        y: 0
      },
      endPosition: {
        x: 0,
        y: 0
      },
      divZoom: [0.2, 0.4, 0.6, 0.8, 1],
      divZoomIndex: 1,
      consumeData: null
    };
  },
  mounted() {
    this.controlDiv();
    let el = document.getElementById("container");
    el.style.transform = "scale(0.4)";
    el.style.transformOrigin = "0 0";
    this.getConsumeDetails(this.$route.query.id);
  },
  methods: {
    computedGiftInfo(list) {
      const giftList = list.map(p => `${p.code} ${p.name} ${p.count}${p.unit ? p.unit : ''}`)
      return giftList.join(' ; ');
    },
    getConsumeDetails(id) {
      let params = {
        companyKey: this.urlData.companyKey,
        vipCard: this.urlData.memberCard,
        orderNo: id
      }
      this._http({url: '/jop-web/electronicWarranty/getElectronicWarrantyInfo'}, params).then(res => {
        if(res.data.code === 0) {
          this.consumeData = res.data.data;
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    zoomMethods(data) {
      if (data) {
        this.divZoomIndex = ++this.divZoomIndex > 4 ? 0 : this.divZoomIndex;
      } else {
        this.divZoomIndex = --this.divZoomIndex < 0 ? 4 : this.divZoomIndex;
      }
      let el = document.getElementById("container");
      el.style.transform = "scale(" + this.divZoom[this.divZoomIndex] + ")";
      el.style.transformOrigin = "0 0";
    },
    controlDiv() {
      let _this = this;

      // 先要对监听的DOM进行一些初始化
      let el = document.getElementById("container");
      let hammer = new Hammer(el);
      // 移动

      hammer.on('panstart panmove panend ', e => {
        switch(e.type) {
          case 'panstart':
            _this.startPosition = _this.endPosition;
            break;
          case 'panmove':
            _this.endPosition = {
              x: e.deltaX + _this.startPosition.x,
              y: e.deltaY + _this.startPosition.y
            };
            break;
          case 'panend':
            _this.startPosition = {
              x: 0,
              y: 0
            }
        }
      });
      
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100vw;
  height: calc(100vh - 75px);
  overflow: auto;
  -webkit-overflow-scrolling: auto;
  #container {
    width: 1000px;
    position: absolute;
    background-color: white;
    .logo {
      width: 100%;
      height: 144px;
      line-height: 144px;
      text-align: center;
      color: white;
      font-size: 48px;
      background: url("../../assets/dzzbd.jpg") no-repeat;
      background-size: 100% 100%;
    }
    .content {
      width: 100%;
      .header {
        width: calc(100% - 60px);
        margin: 30px auto;
        border-bottom: 1px solid black;
        .item {
          display: flex;
          margin-bottom: 16px;
          font-size: 18px;
          .left {
            flex-basis: 40%;
            flex-grow: 1;
          }
          .title {
            font-size: 24px;
          }
          .right {
            flex-basis: 40%;
          }
        }
      }
      .body {
        width: calc(100% - 60px);
        margin: 30px auto 150px auto;
        // .w-t {
        //   font-size: 18px;
        // }
        .total {
          margin-top: 50px;
          width: 300px;
          border-top: 1px solid black;
          float: right;
          .w-t-1 {
            font-size: 18px;
          }
        }
        .table-title {
          width: 100%;
          display: flex;
          font-size: 18px;
          // background-color: gray;
          > div {
            flex-basis: 6%;
            // flex-grow: 1;
            // background-color: red;
          }
          .num-1, .name {
            flex-grow: 2;
          }
          .weight-1, .weight-2 {
            flex-grow: 1.5;
          }
          .num-2 {
            flex-grow: 4;
          }
        }
        .table-content {
          margin-top: 20px;
        }
        .old-mertails {
          width: 100%;
          display: flex;
          font-size: 18px;
          margin-top: 20px;
          .name {
            flex-basis: 40%;
            text-align: center;
            // flex-grow: 1;
          }
          .weight, .price {
            flex-basis: 18%;
          }
          .price-harf {
            flex-basis: 15%;
            flex-grow: 1;
            text-align: right;
          }
        }
      }
      .footer {
        // margin-top: 200px;
        width: calc(100% - 60px);
        margin: 30px auto;
        border-top: 1px solid black;
        .zbd-user {
          margin-top: 24px;
          font-size: 15px;
          p {
            padding-bottom: 20px;
          }
          span {
            padding-right: 30px;
          }
        }
      }
    }
  }
}
.zoom-btn {
  position: fixed;
  bottom: 40px;
  left: calc((100vw - 250px) / 2);
  width: 250px;
  display: flex;
  font-size: 50px;
  .big-btn {
    flex-basis: 45%;
    flex-grow: 1;
    text-align: center;
  }
  .small-btn {
    flex-basis: 45%;
    flex-grow: 1;
    text-align: center;
  }
}
</style>
