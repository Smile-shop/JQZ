<template>
  <div>
    <section class="content">
      <div class="title" :style="titleStyle">
        <!-- <p>{{ companyName }}</p> -->
        <div>{{ now }}</div>
      </div>
      
      <div class="price-list">
        <div class="select-name" v-show="!(shopList.length == 1 && shopList[0] == '所有分销商')">
          <!-- <select v-model="value">
            <option v-for="(item, index) in shopList" :key="index">{{ item }}</option>
          </select> -->
          <SelectField :initData="value" type="select" @select="value = $event" :columnsList="shopList" placeholder="选择门店"></SelectField>
        </div>

        <div class="column" v-show="!(shopList.length == 1 && shopList[0] == '所有分销商')"></div>

        <div class="list">
          <div class="btn-tab" :style="{ 'background-color': themeColor }">
            <div @click="selectBtn(0)" :style="{ 'background-color': btnSelected ? themeColor : 'white', 'color': btnSelected ? 'white' : themeColor }">销售价</div>
            <div @click="selectBtn(1)" :style="{ 'background-color': !btnSelected ? themeColor : 'white', 'color': !btnSelected ? 'white' : themeColor }">回收价</div>
          </div>
          <div class="item-title">
            <div>材料成色</div>
            <div>品牌</div>
            <div>金价(/g)</div>
            <div>工费(/g)</div>
          </div>
        </div>  
        <div class="list-content">
          <div class="list" v-for="(item, index) in infoList" :key="index">  
            <div class="item">
              <div>{{ item.category }}</div>
              <div>
                <div>{{ item.brand }}</div>
              </div>
              <div v-if="!btnSelected">
                <div>{{ item.price | moneyFilter }}</div>
              </div>
              <div v-else>
                <div>{{ item.recover_price | moneyFilter }}</div>
              </div>
              <div>
                <div>{{ item.workPrice | moneyFilter }}</div>
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
        // background: "url(" + url + ") top left 100% 100% no-repeat",
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
          resultType: 1
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
  // height: calc(100vh - 75px);
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
  // margin: 30px auto;
  // display: flex;
  // -webkit-display: flex;
  // flex-direction: column;
  // -webkit-flex-direction: column;
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
    select {
      border: none;
      width: 98%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      border-radius: 2.5px;
      color: #666666;
      outline: none;
      background: url("../../assets/r-icon.png") no-repeat right center;
      background-size: 15px 15px;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
    .option {
      color: #666666;
      font-size: 14px;
      background-color: red;
    }
  }
  .column {
    height: 15px;
  }
  .list {
    background-color: white;
    width: calc(100% - 30px);
    margin: 0 auto;
    .btn-tab {
      display: flex;
      padding: 2.5px;
      div {
        flex-basis: 45%;
        flex-grow: 1;
        text-align: center;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
      }
    }
    .item-title {
      display: flex;
      width: calc(100% - 30px);
      margin: 0 auto;
      div:not(:nth-of-type(2)) {
        flex-basis: 20%;
        flex-grow: 1;
        text-align: center;
        padding: 7.5px;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #cccccc;
      }
      div:nth-of-type(2) {
        flex-basis: 15%;
        text-align: center;
        padding: 7.5px;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #cccccc;
      }
    }
    .item {
      display: flex;
      align-items: center;
      width: calc(100% - 30px);
      margin: 0 auto;
      div:not(:nth-of-type(2)) {
        flex-basis: 20%;
        flex-grow: 1;
        text-align: center;
        padding: 5px 7.5px;
        font-size: 12px;
      }
      div:nth-of-type(2) {
        flex-basis: 15%;
        text-align: center;
        padding: 5px 7.5px;
        font-size: 12px;
      }
    }
  }
}
</style>
