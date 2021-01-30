<template>
  <section class="home">
    <!-- 门店 -->
    <div class="service-shop" v-if="servicerList.shopGroup === '1' && loginTicket">
      <div class="service-select" @click="showPop">
        <!-- <van-icon name="shop-o" size="20px" class="icon-style"/> -->
        <img src="../assets/store.png" alt="store" class="icon-style">
        <span class="text" :style="{'color': isSelects ? '#333' : ''}">{{shopName}}</span>
        <span class="arrow-down"  :class="[showSelect ? 'arrow-rotate-up': 'arrow-rotate-down']"></span>
      </div>
      <!-- 门店列表 -->
      <div class="shop-list" v-show="showSelect" v-if="servicerList.shopList">
        <ul class="service-ul" >
          <li
            :class="{'sevice-selected': shopName === item.shopName}"
            v-for="(item, index) in servicerList.shopList"
            :key="index"
            @click="selectShowName(item)">
            {{ item.nameOut || item.shopName }}
            <span v-if="shopName === item.shopName" class="service-ok">
              <van-icon name="success" color="#7ea2ff"/>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div class="shop-pop" v-show="showSelect" @click="closePop"></div>
    <!-- 我的客服顾问 -->
    <div class="self-service" :class="{'self-service-add': servicerList.shopGroup === '1' && loginTicket }">
      <div class="title">我的客服顾问</div>
      <!-- <div class="no-service" v-if="servicerList.selfList.length <= 0">
        <img alt="headerImg" src="../assets/admin-user.png">
        <span>您还未设置专属客服顾问</span>
      </div> -->
      <div class="has-service" v-if="loginTicket && servicerList.selfList[0] && servicerList.onlyService === '1'">
        <div class="servicer-info" @click="pickServicer(servicerList.selfList[0],'0')">
          <img class="headerImg"
            :class="{'gray-img': servicerList.selfList[0].isOnlineKf === '1'}"
            alt="headerImg"
            :src="servicerList.selfList[0].kfHeadimgurl || require('../assets/admin-user.png')">
          <div class="name">
            <!-- 在线 离线 -->
            <div :style="{'color': servicerList.selfList[0].isOnlineKf === '0' ? '' : '#999'}">
              {{servicerList.selfList[0].nick}}
              <span
                class="name-tip"
                :style="{
                  'background-image':
                  servicerList.selfList[0].isOnlineKf === '0' ?
                  '' : 'linear-gradient(#999,#999),linear-gradient(#07c264,#07c264)',
                  'border-color':
                  servicerList.selfList[0].isOnlineKf === '0' ?
                  '' : '#999'}">专属客服</span>
              <!-- <span
                class="name-line"
                :style="{
                  'color':
                  servicerList.selfList[0].isOnlineKf === '0' ?
                  '#7ea2ff' : '#bbb'}">[{{servicerList.selfList[0].isOnlineKf === '0' ? '在' : '离'}}线]</span> -->
            </div>
            <div
              class="service-shop-name"
              :style="{'color': servicerList.selfList[0].isOnlineKf === '0' ? '' : '#999'}"
               v-if="servicerList.shopGroup === '1' || servicerList.shopGroup === '2'">
               服务门店：{{servicerList.selfList[0].nameOut || servicerList.selfList[0].shopName}}
            </div>
            <div class="service-shop-name" v-else></div>
            <!-- 有聊天记录 -->
            <div class="service-contact" v-if="servicerList.selfList[0].texts">
              <div class="chat-content">
                {{ chatContentType(servicerList.selfList[0].texts) }}
                <!-- {{servicerList.selfList[0].texts.match(/jpg|png|gif/i) ? '[图片]' : servicerList.selfList[0].texts.match(/mp3/i) ? '[语音]' : servicerList.selfList[0].texts}} -->
              </div>
              <!-- <span class="chat-time">{{(servicerList.selfList[0].createTime * 1) | datefmt('YYYY-MM-DD HH:mm')}}</span> -->
              <span class="chat-time">{{formatMsgTime(servicerList.selfList[0].createTime)}}</span>
            </div>
            <!-- 无聊天记录 -->
            <div class="service-contact" v-else>
              <img src="../assets/msg.png" alt="msg" class="chat-style" v-if="servicerList.selfList[0].isOnlineKf === '0'">
              <img src="../assets/msg-gray.png" alt="msg" class="chat-style" v-else>
              <span class="contact-span" :style="{'color': servicerList.selfList[0].isOnlineKf === '0' ? '' : '#999'}">点击开始咨询</span>
              <van-icon name="arrow" size="15px" class="chat-arrow" color="#ccc"/>
            </div>
          </div>
          <div class="info" v-if="servicerList.selfList[0].notRead > 0">{{servicerList.selfList[0].notRead}}</div>
        </div>
        <!-- 拨打电话 -->
        <div class="service-phone">
          <!-- <van-icon name="phone-circle-o" size="22px"/> -->
          <img src="../assets/dia-phone.png" alt="msg" class="dia-phone">
          <a :href="`tel:${servicerList.selfList[0].kfPhone}`">拨打电话咨询</a>
        </div>
      </div>
      <!-- 未登录 -->
      <div class="no-login" v-if="!loginTicket">
        <div class="tip">登录后享受更完善服务</div>
        <div class="login-btn"><button @click="goLogin">一键登录</button></div>
      </div>
    </div>

  <!-- 其他客服顾问 -->
    <div class="service-list">
      <div class="service-item" v-for="item in servicerList.list" :key="item.accountId"  @click="pickServicer(item)">
        <img class="headerImg"
          :class="{'gray-img': item.isOnlineKf === '1'}"
          alt="headerImg"
          :src="item.kfHeadimgurl || require('../assets/admin-user.png')">
        <div class="name">
          <div :style="{'color': item.isOnlineKf === '0' ? '' : '#999'}" class="other-service">
            {{item.nick}}
          </div>
          <div
            class="other-shop"
            :style="{'color': item.isOnlineKf === '0' ? '' : '#999'}"
            v-if="servicerList.shopGroup === '1'">
             服务门店：{{item.nameOut || item.shopName}}
          </div>
          <div class="other-shop" v-else></div>
          <!-- 有聊天记录 -->
          <div class="service-contact" v-if="item.texts">
            <div class="chat-content">
              <!-- {{item.texts.match(/jpg|png|gif/i) ? '[图片]': item.texts.match(/mp3/i) ? '[语音]' : item.texts}} -->
              {{ chatContentType(item.texts) }}
            </div>
            <span class="chat-time">{{formatMsgTime(item.createTime)}}</span>
          </div>
          <!-- 无聊天记录 -->
          <div class="service-contact" v-else>
            <img src="../assets/msg.png" alt="msg" class="chat-style" v-if="item.isOnlineKf === '0'">
            <img src="../assets/msg-gray.png" alt="msg" class="chat-style" v-else>
            <span class="contact-span" :style="{'color': item.isOnlineKf === '0' ? '' : '#999'}">点击开始咨询</span>
            <van-icon name="arrow" size="15px" class="chat-arrow" color="#ccc"/>
          </div>
        </div>
        <div class="info" v-if="item.notRead > 0">{{item.notRead}}</div>
      </div>
    </div>
    <!-- loading -->
    <van-loading size="30px" type="spinner" class="v-load" v-if="isLoading">加载中...</van-loading>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from 'vue-property-decorator';
import { State, Getter, Mutation } from 'vuex-class';
import { Toast, Popup, Icon, Loading } from 'vant';
import CommonMixin from '../mixin/CommonMixin';
import { User, Servicer } from '../store/modules/home';
import { getImgUrl, isJSON } from '@/utils/common';
// const io = require('socket.io-client');

import { getUrlKey } from '../../static/functions';
import service from '../common/http';
import wx from 'weixin-js-sdk';
import { productDisplayPropertys } from '@/utils/product-property';

interface ListType {
  [index: number]: string | number;
}

@Component({
  components: {
    VanPopup: Popup,
    VanIcon: Icon,
    VanLoading: Loading
  },
  mixins: [CommonMixin]
})
export default class Home extends Vue {
  @Getter('getClient') public client!: any;
  @Getter('getUser') private user!: User;
  @Mutation('setListDisplayParams')
  private setListDisplayParams!: any;
  @Mutation('setProductInfo')
  private setProductInfo!: any;

  private servicerList = {
    list: [],
    selfList: [],
    shopList: [],
    onlyService: '',
    shopGroup: '',
    isComplain: null
  };
  // 弹出门店选择
  private showSelect: boolean = false;

  // 店名
  private shopName: string = '选择门店';

  // 登录ticket
  private loginTicket: any = '';
   // 样式标识
  private isSelects: boolean = false;
  // 是否显示loading
  private isLoading: boolean = true;
  // 节流时间
  private lastTime: number = Date.now();

  private created() {
    if (getUrlKey('goodsId')) {
      this.getGoodsInfo();
    }
    // 获取登录的ticket值
    if (localStorage.getItem('ticket_' + this.user.companyKey)) {
      this.loginTicket = localStorage.getItem('ticket_' + this.user.companyKey);
      this.getShopList();
    }
    // 获取本地店名和序号
    this.shopName = sessionStorage.getItem('shopName') || '选择门店';
    if (this.shopName) {
       this.selectShowName({shopName: this.shopName});
    } else {
      this.getServicerList();
    }
  }
  private mounted() {
    // 测试，分享功能有冲突
    this.hiddenWXMenuFunction();
    // 移除首屏loading
    const loadElement: any = document.getElementById('loading');
    if (loadElement != null) {
      document.body.removeChild(loadElement);
    }
    // client接收消息
    this.$store.dispatch('clientBindEvent', this.bindClientEvent);
  }

  // 获取显示参数的列表
  private getListDisplayParamsReq() {
    const body = {
      displayMode: 3
    };
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    return new Promise( async (resolve, reject) => {
      try {
        const res = await this.httpServer({ url: '/shop-web/mall/queryDisplayParamsByCategory', headers }, body);
        this.setListDisplayParams(res.data.data);
        resolve(true);
      } catch (error) {
        resolve(error);
      }
    });
  }

  private async getGoodsInfo() {
    await this.getListDisplayParamsReq();
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    const res: any = await this.httpServer(
      { url: '/shop-web/mall/productinfo', headers },
      { code: getUrlKey('goodsId') }
    );
    const { productName, actualPrice, flagPrice, pic_url, code } = res.data.data;
    const body = JSON.stringify({
      productName,
      actualPrice,
      flagPrice: flagPrice ? flagPrice : '',
      info: productDisplayPropertys(res.data.data),
      code,
      pic_url: getImgUrl(pic_url) || 'http://www.jqzjop.com/ftp_images/product404.png',
    });
    this.setProductInfo(body);
    const o = getUrlKey('o');
    const c = getUrlKey('c');
    const i = getUrlKey('i') || require('../assets/admin-user.png');
    const p = getUrlKey('p');
    const r = getUrlKey('r') ;
    const m = getUrlKey('m') || '';
    const s = getUrlKey('s') || '';
    this.$router.replace({ path: '/', query: {o, c, i, p, r, m, s} });
  }

  private hiddenWXMenuFunction() {
    const params = {
      companyKey: this.user.companyKey,
      url: window.location.href.split('#')[0],
      type: 'jsapi'
    };
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey
    };
    this.httpServer({ url: '/jop-web/wxinit/jsapi_ticketSign', baseUrl: this.httpBaseUrl, headers}, params).then((res: any) => {
      if (res.data.code === 0) {
        const wxJsSDKRes = res.data.data;
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: wxJsSDKRes.appid, // 必填，公众号的唯一标识
          timestamp: wxJsSDKRes.timestamp, // 必填，生成签名的时间戳
          nonceStr: wxJsSDKRes.nonceStr, // 必填，生成签名的随机串
          signature: wxJsSDKRes.signature, // 必填，签名
          jsApiList: [
            'hideAllNonBaseMenuItem'
          ] // 必填，需要使用的JS接口列表
        });
        wx.ready(() => {
          wx.hideAllNonBaseMenuItem();
        });
      } else {
        Toast({
          message: res.data.msg,
          duration: 1000
        });
      }
    });
  }

  private bindClientEvent(msg: any) {
    const now = Date.now();
    if (now - this.lastTime > 2000) {
        this.lastTime = now;
        // 返回消息不为确认消息4，也不是ping消息5
        if (msg.msgType !== '4' || msg.msgType !== '5') {
          this.getServicerList();
        }
      }
  }

  // 弹出门店选择列表
  private showPop() {
    this.showSelect = !this.showSelect;
    if (this.showSelect) {
      // 禁止底层内容滚动
      document.body.style.overflowY = 'hidden';
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflowY = 'auto';
    }
  }
  // 选择店名方法
  private selectShowName(name: any) {
    this.shopName = name.shopName;
    this.showSelect = false;
    this.isSelects = true;
    // 调用客服列表
    this.getServicerList();
  }

  // 关闭遮罩层
  private closePop() {
    this.showSelect = false;
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';
  }
  private loginParams() {
    // 存入本地登录所要的参数
    const userLoginInfo = {
      openid: getUrlKey('o'),
      companyKey: getUrlKey('c'),
      headerImg: getUrlKey('i') || require('../assets/admin-user.png'),
      page: getUrlKey('childPage') || getUrlKey('p') || 'login',
      register_openid: getUrlKey('shareId') || '',
      isRegister: getUrlKey('r') || '1',
      memberCard: getUrlKey('m') || '',
      phone: getUrlKey('s') || '',
      localUrl: `${this.httpBaseUrl}/wx-interface-web/wx/auth?companyKey=${getUrlKey('c')}&page=wx_chat_system`,
      transferPage: ''
    };
    localStorage.setItem('urlData', JSON.stringify(userLoginInfo));
  }
  // 登录
  private goLogin() {
    this.loginParams();
    window.location.href = `${this.httpBaseUrl}/login_register/#/?c=${this.user.companyKey}`;
  }

  // 查询门店列表
  private getShopList(): void {
    const params = {
      ticket: this.loginTicket || '',
      openid: this.user.openid,
      companyKey: this.user.companyKey
    };
    this.httpServer({url: '/chat-web/cChat/shopList', headers: params }, params).then((res: any) => {
      if (res.data.code === 0) {
        const shopList = res.data.data && res.data.data.shopinfo ? res.data.data.shopinfo : [];
        shopList.unshift({
          shopName: '全部',
          nameOut: '全部'
        });
        this.$set(this.servicerList, 'shopList', shopList);
      } else {
        Toast({
          message: res.data.msg,
          duration: 1000
        });
      }
    });
  }

  // 获取客服列表
  private getServicerList(): void {
    const params = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      shopName: this.shopName === '全部' || this.shopName === '选择门店' ? '' : this.shopName
    };
    const headers = {
      openid: this.user.openid,
      ticket: this.loginTicket || '',
      companyKey: this.user.companyKey
    };
    this.httpServer({url: '/chat-web/cChat/chatList', headers}, params).then((res: any) => {
      if (res.data.code === 0) {
        this.isLoading = false;
        const servicerList = res.data.data && res.data.data.chatRecords ? res.data.data.chatRecords : [];
        const selfServicerList = res.data.data && res.data.data.bindRecords ? res.data.data.bindRecords : [];
        const onlyService = res.data.data && res.data.data.onlyService ? res.data.data.onlyService : '';
        const shopGroup = res.data.data && res.data.data.shopGroup ? res.data.data.shopGroup : '';
        const isComplain = res.data.data && res.data.data.isComplain ? res.data.data.isComplain : null;
        this.$set(this.servicerList, 'list', servicerList);
        this.$set(this.servicerList, 'selfList', selfServicerList);
        this.$set(this.servicerList, 'onlyService', onlyService);
        this.$set(this.servicerList, 'shopGroup', shopGroup);
        this.$set(this.servicerList, 'isComplain', isComplain);
        if (params.shopName) {
          sessionStorage.setItem('shopName', params.shopName);
        }
        // 是否有专属客服，有专属客服直接跳转到聊天页面
        if (this.servicerList.selfList.length > 0 && this.servicerList.shopGroup === '2') {
          const accountId = (this.servicerList.selfList[0] as any).accountId;
          const nameOut = (this.servicerList.selfList[0] as any).nameOut;
          this.$router.push({
            path: '/about',
            query: {
              accountId,
              nameOut
            }
          });
        }
      } else {
        Toast({
          message: res.data.msg,
          duration: 1000
        });
      }
    });
  }

// 跳转对话页面
  private async pickServicer(servicer: Servicer, isOnlyServe: string) {
    // let topic: string = '';
    // if (!servicer.topic) {
    //   const params = {
    //     openid: this.user.openid,
    //     companyKey: this.user.companyKey,
    //     accountId: servicer.accountId
    //   };
    //   topic = await this.publishTopic(params);
    // } else {
    //   topic = servicer.topic;
    // }
    this.$store.dispatch('setServicer', {
      accountId: servicer.accountId || '',
      kfHeadimgurl: servicer.kfHeadimgurl || require('../assets/admin-user.png'),
      kfAccount: servicer.kfAccount || '',
      nick: servicer.nick || '',
      isOnline: servicer.isOnlineKf || '1',
      kfPhone: servicer.kfPhone || '',
      clerkId: servicer.clerkId || '',
      shopName: servicer.shopName || '',
    });
    // 如果未登录 存入登录参数
    if (!this.loginTicket) {
      this.loginParams();
    }
    this.$router.push({
      path: '/about',
      query: {
        shopName: this.servicerList.shopGroup === '0' || this.servicerList.shopGroup === '1' || this.servicerList.shopGroup === '2' ? servicer.shopName : '',
        nameOut: this.servicerList.shopGroup === '0' || this.servicerList.shopGroup === '1' || this.servicerList.shopGroup === '2' ? servicer.nameOut : '',
        isOnline: servicer.isOnlineKf || '',
        onlyService: isOnlyServe || '',
        accountId: servicer.accountId,
      }
    });
  }
  private publishTopic(params: object): any {
    return new Promise((resolve: any) => {
      this.httpServer({url: '/chat-web/cChat/pubscribe'}, params).then((res: any) => {
        if (res.data.code) {
          Toast({
            message: res.data.msg,
            duration: 1000
          });
        }
        resolve(res.data.data.topic || '');
      });
    });
  }

// 设为专属客服
  private setSelfServicer(accountId: string) {
    const params = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      accountId
    };
    this.httpServer({url: '/chat-web/cChat/chatBind'}, params).then((res: any) => {
      if (res.data.code === 0) {
        this.getServicerList();
      } else {
        Toast({
          message: res.data.msg,
          duration: 1000
        });
      }
    });
  }

  private chatContentType(text: string) {
    if (!isJSON(text) && text.match(/jpg|png|gif/i)) {
      return '[图片]';
    } else if (text.match(/mp3/i)) {
      return '[语音]';
    } else if (isJSON(text)) {
      return '[商品卡]';
    } else {
      return text;
    }
  }



  private destroyed() {
    this.$store.dispatch('removeBindClientEvent', this.bindClientEvent);
  }

  // 时间格式化几分钟前、几小时前
  private formatMsgTime(timespan: any) {
    const dateTime = new Date(timespan);
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const day = dateTime.getDate();
    const hour = dateTime.getHours();
    let minute: any = dateTime.getMinutes();
    const second = dateTime.getSeconds();
    const now = new Date();
    const nowNew = now.getTime();
    let milliseconds: number = 0;
    let  timeSpanStr: any;

    milliseconds = nowNew - timespan;
    if (minute === 0) {
      minute = '00';
    }

    if (milliseconds <= 1000 * 60 * 1) {
      timeSpanStr = '刚刚';
    } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
      timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
    } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
    } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
    } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
      timeSpanStr = year + '-' + month + '-' + day;
    } else {
      timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    }
    return timeSpanStr;
  }

}
</script>

<style lang="less">
.home {
  overflow: auto;
  // height: calc(100vh - 45px);
  height: calc(100vh);
  .v-load{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    margin: auto;
  }
  .shop-pop{
    width: 100%;
    height: 91%;
    top: 9%;
    left: 0;
    position: absolute;
    background: #000;
    opacity: .5;
    z-index: 9;
  }
  .service-shop{
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    z-index: 99;
    background: #f2f2f2;
    .service-select{
      width: 345px;
      height: 40px;
      background-image: linear-gradient(
        #ffffff,
        #ffffff),
      linear-gradient(
        #f5f5f5,
        #f5f5f5);
      background-blend-mode: normal,
        normal;
      border-radius: 5px;
      margin: 10px auto;
      display: flex;
      align-items: center;
      position: relative;
      .icon-style{
        padding-left: 13px;
        width: 18px;
      }
      .text{
        font-size: 14px;
        color: #999;
        font-family: PingFang-SC-Medium;
        padding-left: 7px;
      }
      .arrow-down{
        width: 0;
        height: 0;
        border-top: 6px solid #999;
        border-right: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 6px solid transparent;
        position: absolute;
        right: 18px;
        top: 16px;
      }
      .arrow-rotate-up{
        transform: rotate(180deg);
        transition: transform 0.3s;
      }
      .arrow-rotate-down{
        transform: rotate(0deg);
        transition: transform 0.3s;
      }
    }
    .van-overlay,.van-popup--top{
      top: 15%;
    }
    .service-ul{
      background: #fff;
      height: 100%;
      li{
        font-family: PingFang-SC-Medium;
        color: #666;
        font-size: 14px;
        padding: 16px;
        border-bottom: 1px solid #ddd;
        &.sevice-selected{
          color: #7ea2ff;
        }
        .service-ok{
          float: right;
        }
      }
    }
    @keyframes pop {
      from {
        top: 4%;
      }
      to{
        top: 60px;
      }
    }
    .shop-pop{
      width: 100%;
      height: 84%;
      top: 16%;
      left: 0;
      position: absolute;
      background: #000;
      opacity: .5;
      z-index: 99;
    }
    .shop-list{
      width: 100%;
      position: fixed;
      top: 60px;
      left: 0;
      right: auto;
      bottom: auto;
      background: #fff;
      z-index: 999;
      animation: pop .5s;
      height: 428px;
      overflow: scroll;
    }
  }
  .title {
    font-family: PingFang-SC-Regular;
    font-size: 16px;
    color: #333333;
    height: 45px;
    line-height: 45px;
    padding-left: 12px;
    background-color: #ffffff;
  }
  .no-login{
    border-top: 1px solid #ddd;
    padding: 16px 0;
    background: #fff;
    .tip{
      font-size: 14px;
      color: #999;
      font-family: PingFang-SC-Medium;
      text-align: center;
    }
    .login-btn{
      text-align: center;
      margin-top: 5px;
      button{
        width: 160px;
        height: 40px;
        outline: none;
        color: #fff;
        border: none;
        background-image: linear-gradient(
        #7ea2ff,
        #7ea2ff),
        linear-gradient(
          #f5f5f5,
          #f5f5f5);
          font-size: 16px;
          border-radius: 5px;
          letter-spacing: 2px;
      }
    }
  }
  .info {
    font-family: PingFang-SC-Regular;
    font-size: 14px;
    color: #ffffff;
    background-color: #f24040;
    padding: 2px 6px;
    border-radius: 100%;
    transform: scale(.8);
    float: right;
    clear: both;
    position: absolute;
    top: 4px;
    left: 6px;
    min-width: 18px;
    min-height: 18px;
    line-height: 18px;
    text-align: center;
    padding: 2px;
    z-index: 99;
  }
  .self-service-add{
    margin-top: 60px;
  }
  .self-service {
    width: 100vw;
    .no-service {
      margin-top: 1px;
      background-color: #ffffff;
      height: 105px;
      display: flex;
      align-items: center;
      img {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        margin: 0 15px;
      }
      span {
        font-family: PingFang-SC-Regular;
        font-size: 18px;
        color: #333333;
      }
    }
    .has-service {
      margin-top: 1px;
      background-color: #ffffff;
      padding: 12px 0;
      position: relative;
      .servicer-info {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ddd;
        img.headerImg {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          margin: 0 15px;
        }
        .gray-img{
          -webkit-filter: grayscale(90%);
          -moz-filter: grayscale(100%);
          -ms-filter: grayscale(100%);
          -o-filter: grayscale(100%);
            filter: grayscale(100%);
            filter: gray;
        }
        .name {
          font-family: PingFang-SC-Regular;
          font-size: 18px;
          color: #333333;
          flex-basis: 71%;
          .name-tip{
            font-size: 11px;
            color: #fafaff;
            padding: 2px 4px;
            border: solid 1px #7ea2ff;
            border-radius: 3px;
            background-image: linear-gradient(
            #7ea2ff,
            #7ea2ff),
            linear-gradient(
              #07c264,
              #07c264);
              margin-left: 4px;
          }
          .name-line{
            float: right;
            font-family: PingFang-SC-Medium;
            color: #bbb;
            font-size: 12px;
            margin-top: 4px;
          }
          div:last-child {
            font-family: PingFang-SC-Regular;
            font-size: 14px;
            color: #666666;
            padding: 0 0 12px 0;
          }
          .service-shop-name{
            font-family: PingFang-SC-Medium;
            font-size: 12px;
            color: #666;
            margin: 4px 0;
            width: 270px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            min-height: 17px;
          }
          .service-contact{
            display: flex;
            align-items: center;
            position: relative;
            .chat-style{
              width: 14px;
            }
            span.contact-span{
              font-family: PingFang-SC-Medium;
              font-size: 12px;
              color: #7ea2ff;
              margin-left: 4px;
            }
            .chat-arrow{
              position: absolute;
              right: 2px;
            }
            .chat-content{
              font-family: PingFang-SC-Medium;
              font-size: 12px;
              color: #999;
              width: 190px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .chat-time{
              position: absolute;
              right: 0;
              color: #999;
              font-size: 12px;
            }
          }
        }

      }
      .service-phone{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px 0 2px;
        .dia-phone{
          width: 16px;
        }
        a{
          font-family: PingFang-SC-Medium;
          font-size: 14px;
          color: #333;
          padding-left: 4px;
        }
      }
      .service-btn {
        display: flex;
        justify-content: space-around;
        div, a {
          width: 162px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          font-family: PingFang-SC-Regular;
          font-size: 15px;
          border-radius: 5px;
        }
        a {
          border: solid 1px #dddddd;
          box-sizing: border-box;
          color: #333333;
        }
        div {
          background-color: #79a5ff;
          color: #ffffff;
        }
      }
    }
  }
  .service-list {
    width: 100vw;
    margin-top: 5px;
    .service-item {
      display: flex;
      align-items: center;
      // height: 74px;
      background-color: #ffffff;
      margin-top: 1px;
      padding: 12px 0;
      position: relative;
      img.headerImg {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        margin: 0 12px;
      }
      .gray-img{
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
          filter: grayscale(100%);
          filter: gray;
        }
      .name {
        font-family: PingFang-SC-Regular;
        font-size: 15px;
        color: #333333;
        flex-basis: 71%;
        .other-service{
          font-size: 16px;
          span{
            float: right;
            font-size: 12px;
            margin-top: 4px;
          }
        }
        .other-shop{
          font-family: PingFang-SC-Medium;
          font-size: 12px;
          color: #666;
          margin: 4px 0;
          width: 270px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          min-height: 17px;
        }
        .service-contact{
            display: flex;
            align-items: center;
            position: relative;
            .chat-style{
              width: 14px;
            }
            span{
              font-family: PingFang-SC-Medium;
              font-size: 12px;
              color: #7ea2ff;
              margin-left: 4px;
            }
            .chat-arrow{
              position: absolute;
              right: 2px;
            }
            .chat-content{
              font-family: PingFang-SC-Medium;
              font-size: 12px;
              color: #999;
              width: 190px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .chat-time{
              position: absolute;
              right: 0;
              font-size: 12px;
              color: #999;
            }
        }
        div:last-child {
          font-family: PingFang-SC-Regular;
          font-size: 12px;
          color: #666666;
        }
      }
      .number {
        .btn {
          width: 90px;
          height: 23px;
          border-radius: 5px;
          border: solid 1px #79a5ff;
          box-sizing: border-box;
          color: #79a5ff;
          font-family: PingFang-SC-Regular;
          font-size: 12px;
          margin-top: 28px;
          text-align: center;
          line-height: 23px;
        }
      }
    }
  }
}
</style>
