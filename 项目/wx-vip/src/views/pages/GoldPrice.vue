<template>
  <div>
    <section class="content">
      <div class="title" :style="titleStyle">
        <div>{{ now }}</div>
      </div>
      
      <div class="price-list">
        <div class="select-name" v-show="!(shopList.length == 1 && shopList[0] == '所有分销商')">
          <SelectField :initData="value" type="select" @select="value = $event" :columnsList="shopList" placeholder="选择门店"></SelectField>
        </div>

        <div class="column" v-show="!(shopList.length == 1 && shopList[0] == '所有分销商')"></div>

        <div class="btn-tab" :style="{ 'background-color': themeColor }">
          <div @click="selectBtn(0)" :style="{ 'background-color': !btnSelected ? themeColor : 'white', 'color': !btnSelected ? 'white' : themeColor }">销售价</div>
          <div @click="selectBtn(1)" :style="{ 'background-color': btnSelected ? themeColor : 'white', 'color': btnSelected ? 'white' : themeColor }">回收价</div>
        </div>
        <div class="list-content">
          <div class="list-item" v-for="(item, index) in infoList" :key="index">
            <div class="shop-name" :style="{ 'color': themeColor }">
              <div class="name-icon" :style="{ 'background-color': themeColor }"></div>
              <div class="name">{{item.brand | nameFilter}}</div>
            </div>
            <div class="gold-detail">
              <div class="detail-title">
                <div>材料成色</div>
                <div>金价(/g)</div>
                <div>工费(/g)</div>
              </div>
              <div class="detail-title detail" v-for="detail in item.dataList" :key="detail.id" :style="{ 'color': themeColor }"> 
                <div>{{detail.category}}</div>
                <div>{{detail | saleFilter(btnSelected)}}</div>
                <div>{{detail.workPrice | moneyFilter}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Picker } from 'vant';
export default {
  components: {
    VanPicker: Picker
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData,
      pageShowInfo: state => state.pageShowInfo
    }),
    titleStyle() {
      let url = this.pageShowInfo.goldPriceImg ? this.pageShowInfo.goldPriceImg : require('../../assets/gold-box-bg-2.jpg');
      return {
        backgroundImage: "url(" + url + ")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
        backgroundSize: '100% 100%'
      }
    },
    infoList() {
      if(this.value) {
        let shopItem = this.allShopList.find(p => p.nameOut == this.value);
        return shopItem ? this.list[shopItem.shopName] : [];
      } else {
        return [];
      }
    }
  },
  data() {
    return {
      value: '',
      timer: null,
      now: new Date().format('yyyy年MM月dd日 hh:mm:ss'),
      btnSelected: 0,
      list: [],
      shopList: [],
      allShopList: []
    }
  },
  filters: {
    moneyFilter(value) {
      value = Number(value);
      return value > 0 ? `${value}` : '--';
    },
    saleFilter(value, type) {
      const money = type ? value.recover_price : value.price;
      return money > 0 ? `${money}` : '--';
    },
    nameFilter(value) {
      return value ? value : '其他';
    }
  },
  mounted() {
    let _this = this;
    this.timer = window.setInterval(function() {
      _this.now = new Date().format('yyyy年MM月dd日 hh:mm:ss')
    }, 1000);
    this.selectBtn(0)
  },
  methods: {
    getGoldPriceNew(type) {
      let data = {
        params: {
          companyKey: this.urlData.companyKey,
          type: type,
          resultType: 2
        }
      }
      this._http({url: '/jop-web/jop/gold_price'}, data).then(res => {
        if(res.data.code === 0) {
          let resData = res.data.data; 
          if(resData) {
            this.allShopList = resData.shopList.map(p => {
              return {
                nameOut: p.nameOut,
                shopName: p.shopName
              }
            });
            this.shopList = resData.shopList.map(p => {
              return p.nameOut;
            });
            if(this.value === '' && this.shopList.length > 0) {
              this.value = this.shopList[0];
            } else if(this.shopList.length === 0) {
              this.value = '';
              // 杨彬要求
              this.$toast({
                message: '该门店未设置今日金价',
                duration: 1000
              })
            }
            this.list = resData.list; 
          } else {
            this.shopList = [];
            this.list = []; 
          }
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    selectBtn(value) {
      this.btnSelected = value;
      this.value = '';
      this.getGoldPriceNew(value);
    }
  },
  destroyed() {
    window.clearInterval(this.timer);
    this.timer = null;
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: calc(100vh - 30px);
  overflow: auto;
  -webkit-overflow-scrolling: auto;
}
.title {
  width: 100%;
  height: 200px;
  color: white;
  font-size: 16px;
  position: relative;
  div {
    font-weight: bold;
    position: absolute;
    bottom: 15px;
    width: 100%;
    text-align: center;
  }
}

.price-list {
  width: 100%;
  height: calc(100vh - 290px);
  padding-top: 15px;
  .select-name {
    width: calc(100% - 50px);
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    border: 1px solid #CCCCCC;
    border-radius: 2.5px;
    overflow: hidden;
    position: relative;
    background-color: white;
    padding: 0 10px;
  }
  .column {
    height: 15px;
  }
  .btn-tab {
    width: 345px;
    margin: 0 auto;
    display: flex;
    padding: 2px;
    border-radius: 5px;
    div {
      flex-basis: 45%;
      flex-grow: 1;
      text-align: center;
      height: 35px;
      line-height: 35px;
      font-size: 12px;
    }
  }
  .list-content {
    width: calc(100% - 30px);
    margin: 5px auto;
    .list-item {
      background-color: #fff;
      padding: 12px 0;
      margin-top: 10px;
      .shop-name {
        font-size: 14px;
        font-weight: bold;
        padding: 0 0 10px 8px;
        position: relative;
        border-bottom: 1px solid #eeeeee;
        .name-icon {
          width: 4px;
          height: 14px;
          display: inline-block;
          border-radius: 2px;
        }
        .name {
          position: absolute;
          top: 0px;
          padding-left: 8px;
          display: inline-block;
          line-height: 15px;
        }
      }
      .gold-detail {
        width: calc(100% - 30px);
        margin: 5px auto;
        .detail-title {
          display: flex;
          color: #666666;
          font-size: 12px;
          > div {
            flex-basis: 30%;
            flex-grow: 1;
            text-align: center;
          }
        }
        .detail {
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
