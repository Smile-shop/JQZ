<template>
  <div>
    <!-- <Header :nav-title="'个人信息'" :nav-title-right="pageShowInfo.isUpdate === '1' ? '完善资料' : ''" @headerRightClick="goUpdate"></Header> -->
    <nav class="nav-tab" :style="{'background-color': themeColor}">
      <div class="tab-item" @click="navIndex = '1'" :style="{'background-color': navIndex === '1' ? themeColor : '#ffffff', 'color': navIndex === '1' ? '#ffffff' : themeColor}">个人信息</div>
      <div class="tab-item" @click="navIndex = '2'" :style="{'background-color': navIndex === '2' ? themeColor : '#ffffff', 'color': navIndex === '2' ? '#ffffff' : themeColor}">完善资料</div>
    </nav>
    <div class="content" v-if="navIndex === '1'">
      <div class="barcode">
        <div>会员卡条形码</div>
        <img id="barcode_5">
      </div>

      <div v-if="personalInfo">
        <div class="invite-code-content" v-if="personalItemShow('inviteCode')">
          <div class="code-intro">
            <span>我的邀请码</span><span class="iconfont" @click="$router.push({path: '/code-intro'})">？</span>
            <!-- <x-icon class="iconfont" type="ios-help-outline" @click="$router.push({path: '/code-intro'})" size="20"></x-icon> -->
          </div>
          <div class="inite-code" :style="{ 'color': themeColor }">{{ personalInfo.inviteCode }}</div>
        </div>

        <div class="info-list">
          <div class="list-item" v-if="personalItemShow('phone')">
            <div class="item-header">手机号：{{ phone }}</div>
            <div class="item-footer">
              <i class="vip-v3-iconfont" @click="toClose('phone', false)" v-if="phoneClose">&#xe60b;</i>
              <i class="vip-v3-iconfont" @click="toClose('phone', true)" v-else>&#xe601;</i>
            </div>
          </div>

          <div class="list-item" v-if="personalItemShow('name')">
            <div class="item-header">姓名：{{ personalInfo.name }}</div>
          </div>

          <div class="list-item" v-if="personalItemShow('sex')">
            <div class="item-header">性别：{{ personalInfo.sex }}</div>
          </div>

          <div class="list-item" v-if="personalItemShow('birthDay')">
            <div class="item-header">生日：{{ personalInfo.birthDay | datefmt2}}</div>
          </div>

          <div class="list-item" v-if="personalItemShow('idCard')">
            <div class="item-header">证件号：{{ idCard }}</div>
            <div class="item-footer">
              <i class="vip-v3-iconfont" @click="toClose('idCard', false)" v-if="idCardClose">&#xe60b;</i>
              <i class="vip-v3-iconfont" @click="toClose('idCard', true)" v-else>&#xe601;</i>
            </div>
          </div>

          <div class="list-item" v-if="personalItemShow('merryDay')">
            <div class="item-header">结婚日期：{{ personalInfo.merryDay | datefmt2}}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('address')">
            <div class="item-header">地址：{{ personalInfo.address }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('eMail')">
            <div class="item-header">邮箱：{{ personalInfo.eMail }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('tel')">
            <div class="item-header">电话：{{ personalInfo.tel }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('fax')">
            <div class="item-header">传真：{{ personalInfo.fax }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('work')">
            <div class="item-header">职业：{{ personalInfo.work }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('education')">
            <div class="item-header">学历：{{ personalInfo.education }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('qqNum')">
            <div class="item-header">QQ：{{ personalInfo.qqNum }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('brand')">
            <div class="item-header">品牌：{{ personalInfo.brand }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('branchShop')">
            <div class="item-header">发卡点：{{ personalInfo.branchShop }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('saler')">
            <div class="item-header">店员：{{ personalInfo.saler }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('customerType')">
            <div class="item-header">客户类型：{{ personalInfo.customerType }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('payCount')">
            <div class="item-header">消费次数：{{ personalInfo.payCount }}</div>
          </div>
          <div class="list-item" v-if="personalItemShow('payLastDay')">
            <div class="item-header">最后消费日期：{{ personalInfo.payLastDay | datefmt('YYYY-MM-DD') }}</div>
          </div>

        </div>
      </div>
    </div>

    <div class="content" v-else>
      <UpdateInfo></UpdateInfo>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Icon } from 'vant';
import Header from '../../components/Header';
import UpdateInfo from './UpdateInfo';
import '../../../public/static/JsBarcode.all.js';
export default {
  components: {
    Header,
    VanIcon: Icon,
    UpdateInfo
  },
  data() {
    return {
      phoneClose: false,
      idCardClose: false,
      personalInfo: null,
      personalShowItemList: [],
      navIndex: '1'
    }
  },
  computed: {
    ...mapState({
      pageShowInfo: state => state.pageShowInfo,
      themeColor: state => state.themeColor,
      urlData: state => state.urlData
    }),
    phone() {
      let phone = this.personalInfo.phone ? this.personalInfo.phone : '';
      return this.phoneClose ? phone : `${phone}`.replace(/^(.{3})(?:\d+)(.{4})$/,"$1****$2");
    },
    idCard() {
      let idCard = this.personalInfo.idCard ? this.personalInfo.idCard : '';
      return this.idCardClose ? idCard : `${idCard}`.replace(/^(.{0})(?:\d+)(.{0})$/,"$1****$2");
    },
    user() {
      const userStr = window.localStorage.getItem('urlData');
      if(userStr) {
        return JSON.parse(userStr);
      }
    }
  },
  mounted() {
    if (this.$route.query.type) {
      this.navIndex = '2';
    }
    this.getWXMemberInfo();
  },
  methods: {
    getWXMemberInfo() {
      let params = {
        openid: this.user.openid,
        companyKey: this.user.companyKey
      };
      this._http({url: '/jop-web/wxMemberInfo/wxMemberInfo'}, params).then(res => {
        if(res.data.code === 0) {
          this.personalInfo = res.data.data.wxMemberInfo || null;
          this.personalShowItemList = res.data.data.params || [];
          this.drawJsBarcode(this.personalInfo.cardNum || this.personalInfo.phone)
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    personalItemShow(data) {
      let item = this.personalShowItemList.find(p => {
        return `${p.name}`.includes(data);
      })
      if(item) {
        return item.isShow == '1';
      } else {
        return false;
      }
    },
    drawJsBarcode(data) {
      // 生成条形码
      JsBarcode("#barcode_5", `${data}`, {
        displayValue: false,
        width: 2,
        height: 80
      });
    },
    goUpdate() {
      if(this.pageShowInfo.isUpdate === '1') {
        this.$router.push({
          path: '/up-info'
        })
      }
    },
    toClose(name, close) {
      if(name == 'phone') {
        this.phoneClose = close;
        return
      };
      if(name == 'idCard') {
        this.idCardClose = close;
        return
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nav-tab {
  width: 300px;
  height: 35px;
  margin: 10px auto;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .tab-item {
    width: 148px;
    height: 33px;
    line-height: 31px;
    text-align: center;
    flex-shrink: 0;
  }
  .tab-item:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .tab-item:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}
.content {
  width: 100%;
  height: calc(100vh - 80px);
  background-color: white;
  overflow: auto;
  -webkit-overflow-scrolling: auto;
  .barcode {
    width: 100%;
    text-align: center;
    z-index: 1000;
    div {
      font-size: 12px;
    }
  }
  .invite-code-content {
    z-index: 2000;
    margin-top: -10px;
    .code-intro {
      text-align: center;
      font-size: 12px;
      color: #333333;
      .iconfont {
        padding-left: 4px;
        color: #e6e6e6;
        vertical-align: middle;
        border: 1px solid #e6e6e6;
        display: inline-block;
        width: 11px;
        height: 15px;
        line-height: 15px;
        border-radius: 50%;
        margin-left: 8px;
      }
      span {
        vertical-align: middle;
      }
    }
    .inite-code {
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      margin-top: -5px;
      z-index: 1000;
    }
  }
  .info-list {
    width: 100%;
    .list-item {
      border-bottom: 1px solid #EEEEEE;
      display: flex;
      align-items: center;
      height: 38px;
      font-size: 12px;
      color: #666666;
      .item-header {
        flex-basis: 50%;
        flex-grow: 1;
        padding-left: 10px;
      }
      .item-footer {
        width: 40px;
        text-align: center;
      }
    }
  }
}
</style>
