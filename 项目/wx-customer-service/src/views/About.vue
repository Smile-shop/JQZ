<template>
  <section class="about">
    <div class="session-content" :style="{'height': computedHeadHeight()}">
      <!-- <div class="load-more" @click="loadMore" v-if="chatHistoryList.length > 0">加载更多...</div> -->
      <!-- 查看更多聊天记录 -->
      <div class="content-more" @click="loadMore" :class="{'content-more2': shopName === ''}">
        <template v-if="chatHistoryList.length > 0 && chatHistoryList.length < contentTotal ">
          <van-icon name="underway" size="15px" color="#7aa4ff" />
          <span>查看更多聊天记录</span>
        </template>
      </div>
      <!-- 投诉 -->
      <div
        v-if="complainOrNot"
        class="chat-complaint-name-box"
      >投诉：{{nameOut || shopName }} — {{ servicer.nick }}</div>
      <!-- 专属客服在线||离线样式 -->
      <div class="chat-online" v-else>
        <div class="chat-name">
          <span :style="{color: isOnline ? '' : '#999'}">{{servicer.nick}}</span>
          <span
            class="chat-kefu"
            v-if="isKefu"
            :style="{
              'background-image': isOnline ? '' : 'linear-gradient(#999,#999),linear-gradient(#07c264,#07c264)',
              'border-color': isOnline ? '' : '#999'
          }"
          >专属客服</span>
          <!-- <span :style="{color: isOnline ? '' : '#999'}">[{{isOnline ?'在':'离'}}线]</span> -->
          <!-- 投诉 -->
          <div
            class="chat-box"
            v-if="shopGroup === '2' && isComplain ==='1' && shopName && clerkName"
            :class="{'chat-box-top' : shopName }"
            @click="goComplaint"
          >投诉</div>
          <div v-else></div>
        </div>
        <div
          class="chat-shop"
          v-if="shopName"
          @click="isClickShopName = !isClickShopName"
          :style="{'white-space': isClickShopName ? 'inherit':''}"
        >所属门店：{{nameOut || shopName}}</div>
      </div>
      <!-- 聊天内容 -->
      <div
        class="session-item"
        :id="`chat_session_${index}`"
        v-for="(item, index) in chatHistoryList"
        :key="index"
        style="opacity: 1"
      >
        <div class="item" :class="[item.from === 'b_002' ? 'servicer' : 'selfer']">
          <div
            class="time"
            v-show="computedTime(index)"
          >{{(item.createTime * 1) | datefmt('YYYY-MM-DD HH:mm')}}</div>
          <div class="item-content">
            <img class="header-img" :src="headerImgUrl(item)" />
            <div class="content" v-if="item.msgType === 'text'">{{item.data}}</div>
            <div class="send-img" @click="showImg(item)" v-if="item.msgType === 'image'">
              <img :src="imgUrlComputed(item.data)" alt="send-img" />
            </div>
            <div class="content info" @click="showGoods(item)" v-if="item.msgType === 'goodId'">
              <div id="info-img-box">
                <img
                  class="info-img"
                  :src="item.goodInfo.pic_url"
                  onerror="this.src='http://www.jqzjop.com/ftp_images/product404.png'"
                  alt
                />
              </div>
              <div class="info-message">
                <div class="info-message-price">
                  <span class="info-message-price-l">￥{{item.goodInfo.actualPrice}}</span>
                  <del
                    class="info-message-price-r"
                    v-if="item.goodInfo.flagPrice"
                  >￥{{item.goodInfo.flagPrice}}</del>
                </div>
                <div class="info-message-title">{{item.goodInfo.productName}}</div>
                <div class="info-message-tag">
                  <div
                    class="info-message-tag-item"
                    v-for="(i, index) in item.goodInfo.info"
                    :key="index"
                  >{{i.name}}: {{i.value}}{{i.unit}}</div>
                </div>
              </div>
            </div>
            <!-- 语音 -->
            <div
              class="content yy"
              @click="playAudio(item)"
              :style="{'width': computedYYWidth(item)}"
              :class="{ 'self-yy': item.from === 'c_001' }"
              v-if="item.msgType === 'voice'"
            >
              <span v-if="item.from === 'c_001'" class="yy-long-time">{{voiceTime(item.time)}}''</span>
              <img
                v-if="voiceLocalId === item.id"
                class="yy-img"
                src="../assets/item-speaking.gif"
                alt="yy"
              />
              <img v-else class="yy-img" src="../assets/yy-icon.png" alt="yy" />
              <span v-if="item.from !== 'c_001'" class="yy-long-time">{{voiceTime(item.time)}}''</span>
            </div>
            <!-- 发送消息中or失败图标 -->
            <div class="message-info" v-if="item.sendingImgShow">
              <img
                class="sending-img"
                v-if="item.isSendingOk"
                src="../assets/sending.png"
                alt="send-photo"
              />
              <span v-else>
                <img
                  v-if="!connectError"
                  @click="resend(item)"
                  src="../assets/send-fail.png"
                  alt="send-photo"
                />
                <img v-else src="../assets/not-resend.png" alt="send-photo" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-input">
      <!-- websocket连接出错 -->
      <div class="connect-fail" v-if="connectError">
        <div class="fail-icon">!</div>
        <div class="fail-text">当前网络不稳定，请检查网络环境或刷新</div>
        <div v-if="connectLoading">
          <van-loading type="spinner" color="#ED6060" />
        </div>
        <div v-else class="fail-reload-btn" @click="reConnect">刷新</div>
      </div>
      <!-- 游客登录 -->
      <div class="visitor-login" v-if="!loginTicket" @click="goLogin">
        <img src="../assets/dl.png" alt="dl.png" class="dl-img" />
        <span class="visitor-text">点此处登录享受更完善服务</span>
      </div>
      <div class="footer-input-content" v-if="!connectError">
        <div
          class="btn-function-yy"
          @click="isSpeak = !isSpeak, faceShow = false, messageInfoModal = false"
        >
          <div v-if="isSpeak" class="yy-img">
            <img src="../assets/yy-icon@2x.png" alt="more" />
          </div>
          <div v-else class="yy-img">
            <img src="../assets/input-key@2x.png" alt="more" />
          </div>
        </div>
        <div class="input">
          <!-- <input
            id="messageInput"
            refs="messageInput"
            v-if="isSpeak"
            type="text"
            v-model="value"
            maxlength="200"
            @focus="messageInfoModal = false"
            @input="inputChange"
          @blur="blur">-->
          <input
            id="messageInput"
            refs="messageInput"
            v-if="isSpeak"
            type="text"
            v-model="value"
            maxlength="200"
            @focus="stopKeyborad"
            @input="inputChange"
            @blur="blur"
            @click="closeBorad"
          />
          <div class="yy-btn" v-else @touchstart="getVoiceSource" @touchend="getVoiceSourceOver">
            <div class="speak-btn" v-if="isSpeakOver">按住 说话</div>
            <div class="over-btn" v-else>松开 结束</div>
          </div>
        </div>
        <!-- 表情文字聊天切换 -->
        <div class="btn-function btn-face" @click="faceContent">
          <img src="../assets/smile@2x.png" alt="more" />
        </div>
        <div class="btn" v-if="inputValueHas" :class="{'btn-disabled': servicer.isOnline === '2'}">
          <div @mousedown.stop="send('text')">发送</div>
        </div>
        <div class="btn-function last-btn" v-else @click="popImg">
          <img src="../assets/add@2x.png" alt="more" />
        </div>
      </div>
      <div class="message-info-content" v-if="messageInfoModal">
        <div class="item">
          <div class="img">
            <img src="../assets/send-img.png" alt="send-photo" />
          </div>
          <div class="name">发送图片</div>
          <!-- <div id="input-content"></div> -->
          <input type="file" ref="filElem" @change="getFile" accept="image/*" />
        </div>
        <a class="item" :href="`tel:${servicer.kfPhone}`">
          <div class="img">
            <img src="../assets/phone.png" alt="send-photo" />
          </div>
          <div class="name">呼叫客服</div>
        </a>
      </div>
      <!-- 表情列表 -->
      <div class="message-info-content" v-show="faceShow">
        <div
          class="face-content"
          @click="getBrow(item)"
          v-for="(item, index) in faceList"
          :key="index"
        >{{item}}</div>
      </div>
      <div class="message-info-content" v-show="false">
        <audio id="audioSave" controls autoplay="false" preload="metadata"></audio>
      </div>
    </div>
    <!-- 查看图片 -->
    <van-popup v-model="popupShow" position="top" :overlay="true" @closed="closeOverlay">
      <section class="popup-content" @click="popupShow = false">
        <img
          :src="compressImg"
          alt="send-img"
          @touchstart="gotouchstart"
          @touchmove="gotouchmove"
          @touchend="gotouchend"
        />
      </section>
      <div class="popup-downLoad">
        <span v-if="!isLookImage" @click="goOriginImage(popupImgSrc)" class="imgOrigin">查看原图</span>
        <span
          v-else-if="isLookImage && i > 0 && i < 100 && !isComplete"
          class="imgOrigin"
        >{{imgOrgText}}%</span>
        <span
          v-else-if="isLookImage && isComplete"
          class="imgOrigin"
          v-show="isComplete"
        >{{imgOrgText}}</span>
        <img src="../assets/download.png" alt="download.png" @click="downLoadFun" class="popup-img" />
      </div>
    </van-popup>

    <section class="speaking-content" v-if="!isSpeakOver">
      <img src="../assets/speaking.gif" alt="speaking" />
      <div style="min-height:28px">
        <span v-show="recordVoiceTime >= 25">{{ 30 - recordVoiceTime }}s</span>
      </div>
      <div>说话中...</div>
    </section>
    <!-- 投诉弹窗 -->
    <div class="dialog-complaint-box">
      <van-dialog v-model="showComplaint" class="complaint-wrapper" :show-confirm-button="false">
        <div class="complaint-img">
          <img src="@/assets/kefu.png" alt />
        </div>
        <div class="dialog-complaint">
          <p class="dialog-complaint-name">尊敬的客户</p>
          <p class="complaint-question">请问您有什么问题投诉？</p>
          <div class="complaint-confirm complaint-button">
            <button @click="okDialog">我有问题要投诉</button>
          </div>
          <div class="complaint-cancel complaint-button">
            <button @click="cancelDialog">手滑~点错了</button>
          </div>
        </div>
      </van-dialog>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { State, Getter, Mutation } from 'vuex-class';
import { User, Servicer } from '../store/modules/home';
import { Toast, Popup, Icon, Loading } from 'vant';
import CommonMixin from '../mixin/CommonMixin';
import wx from 'weixin-js-sdk';
import { getUrlKey } from '../../static/functions';
import { isJSON } from '@/utils/common';
const appEmojisData = require('../../static/emojis.json');

import { v4 as uuidv4 } from 'uuid';

@Component({
  components: {
    VanPopup: Popup,
    VanIcon: Icon,
    VanLoading: Loading,
  },
  mixins: [CommonMixin],
})
export default class About extends Vue {
  @Getter('getServicer') public servicer!: Servicer;
  @Getter('getUser') public user!: User;
  @Getter('getClient') public client!: any;
  @Getter('getConnectError') public connectError!: boolean;
  @Getter('getConnectLoading') public connectLoading!: boolean;
  @Getter('getProductInfo') public productInfo!: any;
  @Mutation('setProductInfo')
  private setProductInfo!: any;

  @Prop({ default: false })
  private complainOrNot!: boolean;

  private isSpeak: boolean = true;
  private isSpeakOver: boolean = true;
  private lastRecorderNumber: number = 0;
  private popupShow: boolean = false;
  private popupImgSrc: string = '';
  private showComplaint: boolean = false; // 投诉弹窗
  // 压缩图片
  private compressImg: string = '';
  private sendingImgShow: boolean = false;
  private isSendingOk: boolean = true;
  private chatHistoryList: any[] = [];
  private value: string = '';
  private inputTimer: any;
  private inputValueHas: boolean = false;
  private messageInfoModal: boolean = false;
  private recorder: any = null;
  // 录音时长
  private recordVoiceTime: number = 0;
  private recordVoiceTimer: any = null;
  // 是否在线
  private isOnline: boolean = true;
  // 店铺名
  private shopName: any = '';
  private nameOut: any = '';
  private nameOutUrl: any = '';
  // 是否是专属客服
  private isKefu: boolean = false;
  // 是否是游客
  private isVisitor: boolean = true;
  // 聊天内容总数
  private contentTotal: string = '0';
  // 是否有clerkName
  private clerkName: string = '';
  // 登录ticket
  private loginTicket: any = '';
  // 聊天图片大小
  private imageSize: any = 3;
  // 聊天图片加载进度
  private imgProgress: number = 0;
  // 是否点击查看原图
  private isLookImage: boolean = false;
  // 查看原图进度初始图
  private i: number = 0;
  // 进度文字提示
  private imgOrgText: string = '';
  // 进度是否已完成
  private isComplete: boolean = false;
  // 是否点击店铺名
  private isClickShopName: boolean = false;

  // 正在播放的语音id
  private voiceLocalId: string | number = '';
  // 表情展示
  private faceShow: boolean = false;
  // 长按定时器
  private timeOutEvent: any = 0;
  // 长按定时器标识
  private timeNumber: number = 0;
  private faceList: any = [];

  private pageNum: number = 1;

  private imgUrl: any = require('@/assets/phone.png');
  private isComplain: string = ''; // 是否开启投诉 1开启 0 关闭
  private shopGroup: string = '';

  // 是否授权完成
  private isAuthorization: boolean = false;

  private created() {
    console.log(window.location.href);
    // 获取登录的ticket值
    if (localStorage.getItem('ticket_' + this.user.companyKey)) {
      this.loginTicket = localStorage.getItem('ticket_' + this.user.companyKey);
    }
  }
  private async mounted() {
    console.log(
      '首次请求消息详情',
      this.servicer.accountId,
      this.complainOrNot,
      this.servicer.accountId && !this.complainOrNot
    );
    const accountId: any = this.$route.query.accountId;
    if (this.servicer.accountId && !this.complainOrNot) {
      this.$route.meta.titleName = `客服-${this.servicer.nick}`;
      // 获取会话历史记录
      await this.getHistorySession();
      if (isJSON(this.productInfo)) {
        this.sentGoodsInfo();
        this.setProductInfo(null);
      }
    } else if (accountId) {
      this.getServicerInfo(accountId);
    }
    // client接收消息
    this.$store.dispatch('clientBindEvent', this.acceptMessage);
    this.getWeixinJDK();
    // 获取url店铺名
    if (this.$route.query.shopName) {
      this.shopName = this.$route.query.shopName;
    }
    if (this.$route.query.nameOut) {
      this.nameOutUrl = this.$route.query.nameOut;
    }
    // 获取url是否是在线
    if (this.$route.query.isOnline) {
      const isOnline: any = this.$route.query.isOnline;
      this.isOnline = isOnline === '0';
    }
    // 获取url是否是专属客服
    if (this.$route.query.onlyService) {
      const isOnlyS: any = this.$route.query.onlyService;
      this.isKefu = isOnlyS === '0';
    }
    // 获取url是否开启投诉
    // if (this.$route.query.isComplain) {
    //   const isComplain: any = this.$route.query.isComplain;
    //   this.isComplain = isComplain;
    // }
    // 获取url是否有门店
    // if (this.$route.query.shopGroup) {
    //   const shopGroup: any = this.$route.query.shopGroup;
    //   this.shopGroup = shopGroup;
    // }
    // 获取url是否有门店
    if (this.$route.query.clerkName) {
      const clerkName: any = this.$route.query.clerkName;
      this.clerkName = clerkName;
    }
    // 点击空白关闭表情列表弹出
    const eleDiv: any = document.querySelector('.session-content');
    eleDiv.addEventListener('click', () => {
      if (this.faceShow) {
        this.faceShow = false;
        this.faceList = [];
      }
      if (this.messageInfoModal) {
        this.messageInfoModal = false;
      }
    });
  }
  private loginParams() {
    if (!JSON.parse(localStorage.getItem('urlData') as any)) {
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
        localUrl: `${
          this.httpBaseUrl
        }/wx-interface-web/wx/auth?companyKey=${getUrlKey(
          'c'
        )}&page=wx_chat_system`,
        transferPage: '',
      };
      localStorage.setItem('urlData', JSON.stringify(userLoginInfo));
    }
  }
  private showGoods(item: any) {
    this.loginParams();
    window.location.href = `${window.VUE_APP_BASE_API}/wx-mall/#/home/product-detail/${item.goodInfo.code}`;
  }
  private sentGoodsInfo() {
    const message = {
      from: 'c_001',
      to: 'b_002',
      data: this.productInfo,
      goodInfo: JSON.parse(this.productInfo),
      createTime: Date.now(),
      msgType: 'goodId',
      sendingImgShow: true,
      isSendingOk: true,
      id: uuidv4().replace(/[-]/g, '').trim(),
    };
    this.send('goodId', message);
  }

  // 图片路径
  private imgUrlComputed(url: any) {
    if (!url) {
      return '';
    }
    if (typeof url === 'string') {
      return url;
    } else {
      return URL.createObjectURL(url);
    }
  }
  // 用户刷新重连
  private reConnect() {
    this.$store.dispatch('reConnectClient');
  }
  // 查询客服信息
  private getServicerInfo(accountId: string) {
    const params = {
      accountId,
    };
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    this.httpServer({ url: '/chat-web/c/chat/findkf', headers }, params).then(
      (res: any) => {
        if (res.data.code === 0) {
          const servicer = res.data.data;
          this.$store.dispatch('setServicer', {
            accountId: servicer.accountId || '',
            kfHeadimgurl:
              servicer.kfHeadimgurl || require('../assets/admin-user.png'),
            kfAccount: servicer.kfAccount || '',
            nick: servicer.nick || '',
            isOnline: servicer.isOnlineKf || '1',
            kfPhone: servicer.kfPhone || '',
            clerkId: servicer.clerkId || '',
            shopName: servicer.shopName || '',
          });
          this.shopName = servicer.shopName;
          // this.nameOut = servicer.nameOut || this.nameOutUrl || servicer.shopName;
          this.nameOut =
            this.nameOutUrl || servicer.nameOut || servicer.shopName;
          this.clerkName = servicer.clerkName;
          this.isComplain = servicer.wxCustomerSet.isComplain;
          this.shopGroup = servicer.wxCustomerSet.shopGroup;
          console.log('这里需要去请求历史消息咯');
          // 获取会话历史记录
          this.getHistorySession();
        } else {
          Toast({
            message: res.data.msg,
            duration: 1000,
          });
          const that: any = this;
          setTimeout(() => {
            that.$router.go(-1);
          }, 1000);
        }
      }
    );
  }
  // 投诉弹窗
  private goComplaint() {
    this.showComplaint = true;
  }
  // 关闭投诉弹窗
  private cancelDialog() {
    this.showComplaint = false;
  }
  // 投诉通道
  private okDialog() {
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    const params = {
      shopName: this.shopName,
    };
    this.httpServer(
      { url: '/chat-web/cChat/complainShopManager', headers },
      params
    )
      .then((res: any) => {
        if (res.data.code === 0) {
          if (res.data.data.bindRecords) {
            this.$router.push({
              path: '/complain',
              query: {
                accountId: res.data.data.bindRecords.accountId,
                complainAccountId: this.servicer.accountId,
              },
            });
          } else {
            this.showComplaint = false;
            Toast({
              message: '该导购暂无店长管理，无法投诉',
              duration: 1000,
            });
          }
        } else {
          this.showComplaint = false;
          Toast({
            message: res.data.msg,
            duration: 1000,
          });
        }
      })
      .catch((err: any) => {
        this.showComplaint = false;
        Toast({
          message: '请求出错',
          duration: 1000,
        });
      });
  }
  // 点击下载方法
  private downLoadFun() {
    Toast({
      message: '请长按保存到手机相册',
      duration: 2000,
    });
  }
  // 登录
  private goLogin() {
    this.loginParams();
    // 存入本地登录所要的参数
    const getLogin: any = localStorage.getItem('urlData');
    const getParms = JSON.parse(getLogin);
    getParms.localUrl = `${this.httpBaseUrl}/wx-interface-web/wx/auth?companyKey=${getParms.companyKey}&page=wx_chat_system&childPage=about`;
    localStorage.setItem('urlData', JSON.stringify(getParms));
    console.log(this.httpBaseUrl, '跳转地址');
    window.location.href = `${this.httpBaseUrl}/login_register/#/?c=${this.user.companyKey}&childPage=about`;
  }
  // 查看原图方法
  private originImage(url: string) {
    return new Promise((resolve, reject) => {
      let timer: any;
      this.isLookImage = true;
      if (this.i < 100) {
        timer = setInterval(() => {
          this.imgProgress = this.i;
          this.isComplete = false;
          this.imgOrgText = this.i.toString();
          this.i++;
          if (this.i >= 100) {
            this.isComplete = true;
            this.imgOrgText = '已完成';
            clearInterval(timer);
            this.i = 0;
            setTimeout(() => {
              this.isComplete = false;
            }, 1000);
          }
        }, 8);
      }
      const timer2 = setTimeout(() => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          resolve(img);
          clearInterval(timer);
        };
        img.onerror = () => {
          this.isLookImage = false;
          reject();
        };
      }, 1000);
    });
  }
  private goOriginImage(url: string) {
    this.originImage(url).then((res: any) => {
      this.compressImg = this.popupImgSrc;
    });
  }
  // 下载图片方法
  private getUrlBase64(url: string) {
    return new Promise((resolve) => {
      let canvas: any = document.createElement('canvas');
      const ctx: any = canvas.getContext('2d');
      const img = new Image();
      img.setAttribute('crossOrigin', 'Anonymous');
      img.src = url;
      img.onload = () => {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const dataURL = canvas.toDataURL('image/jpeg', 1);
        canvas = null;
        resolve(dataURL);
      };
      img.onerror = () => {
        Toast({
          message: '图片下载失败',
          duration: 1000,
        });
      };
    });
  }
  // 调用下载图片方法
  private download(url: string) {
    this.getUrlBase64(url).then((base64: string) => {
      const link: any = document.createElement('a');
      const blob = this.dataURLtoBlob(base64);
      const objUrl = URL.createObjectURL(blob);
      // 截取图片名称
      const imgPath = url.substring(url.lastIndexOf('/'));
      link.download = imgPath;
      link.href = objUrl;
      link.click();
      window.URL.revokeObjectURL(objUrl);
      Toast({
        message: '已保存到手机相册',
        duration: 1000,
      });
    });
  }
  // Base64转Blob方法
  private dataURLtoBlob(dataurl: string) {
    const arr: any = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  // 关闭图片遮罩层
  private closeOverlay() {
    this.isLookImage = false;
  }
  // 图片长按事件
  private gotouchstart(e: any) {
    clearTimeout(this.timeOutEvent);
    this.timeNumber = 0;
    this.timeOutEvent = 0;
    this.timeOutEvent = setTimeout(() => {
      this.popupShow = true;
      this.timeNumber = 1;
    }, 500);
  }
  // 手释放,如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
  private gotouchend(e: any) {
    if (this.timeNumber === 1) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
    clearTimeout(this.timeOutEvent);
  }
  // 如果手指有移动，则取消所有事件,此时说明用户只是要移动而不是长按
  private gotouchmove(e: any) {
    clearTimeout(this.timeOutEvent);
    this.timeOutEvent = 0;
  }
  private faceContent() {
    this.messageInfoModal = false;
    this.faceShow = !this.faceShow;
    this.isSpeak = true;
    if (this.faceShow) {
      for (const i of Object.keys(appEmojisData)) {
        this.faceList.push(appEmojisData[i].char);
      }
      // 获取文本输入框焦点
      this.$nextTick(() => {
        const messageInput: any = document.getElementById('messageInput');
        const browserClient = /(iPhone|iPad|iPod|iOS)/i.test(
          navigator.userAgent
        );
        if (!browserClient) {
          messageInput.focus();
        }
      });
      // 聊天内容滚到底部
      this.scrollToBottom();
    } else {
      this.faceList = [];
    }
  }
  // 聊天内容滚动到最底部
  private scrollToBottom() {
    const divElem: any = document.getElementsByClassName('session-content');
    const div: any = divElem[0].lastChild;
    setTimeout(() => {
      div.scrollIntoView({ behaviord: 'smooth', block: 'end' });
    }, 20);
  }
  // 文本焦点阻止键盘弹出
  private stopKeyborad(e: any) {
    this.messageInfoModal = false;
    const messageInput: any = document.getElementById('messageInput');
    const browserClient = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    if (this.faceShow) {
      if (!browserClient) {
        messageInput.setAttribute('readonly', 'readonly');
        setTimeout(() => {
          messageInput.removeAttribute('readonly');
        }, 200);
      } else {
        // 解决ios输入框被软键盘挡住的方法
        const bodyEle: any = document.body;
        const h: any = bodyEle.clientHeight;
        setTimeout(() => {
          window.scrollTo(0, h);
        }, 10);
      }
    } else {
      // 文字输入框聊天记录滚动到底部
      if (!browserClient) {
        setTimeout(() => {
          this.scrollToBottom();
        }, 500);
      }
    }
  }
  // 点击关闭表情列表
  private closeBorad() {
    const browserClient = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    if (!browserClient) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 500);
    }
    if (this.faceShow) {
      this.faceShow = false;
      this.faceList = [];
    }
  }

  private getBrow(item: any) {
    this.value += item;
    this.inputValueHas = true;
    const messageInput: any = document.getElementById('messageInput');
    const browserClient = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    if (!browserClient) {
      messageInput.focus();
    }
  }

  // 点击加号弹出发送图片，呼叫客服
  private popImg() {
    this.messageInfoModal = !this.messageInfoModal;
    this.faceShow = false;
    this.faceList = [];
    // 聊天内容滚到底部
    this.scrollToBottom();
  }
  // 语音长度
  private computedYYWidth(item: any) {
    const long: number = Math.round(item.time / 1000);
    if (long <= 5) {
      return '50px';
    } else if (long > 30) {
      return '220px';
    } else {
      return `${7.5 * (long - 5) + 40}px`;
    }
  }
  // 聊天内容外层设置样式
  private computedHeadHeight() {
    if (!this.loginTicket && !this.faceShow && !this.messageInfoModal) {
      return 'calc(100vh - 120px)';
    }
    if (this.faceShow && this.loginTicket && !this.messageInfoModal) {
      return 'calc(100vh - 264px)';
    }
    if (this.faceShow && !this.loginTicket && !this.messageInfoModal) {
      return 'calc(100vh - 320px)';
    }
    if (this.loginTicket && this.messageInfoModal && !this.faceShow) {
      return 'calc(100vh - 185px)';
    }
    if (!this.loginTicket && this.messageInfoModal && !this.faceShow) {
      return 'calc(100vh - 245px)';
    }
  }
  // 语音时长
  private voiceTime(time: number) {
    // 0秒语音强转化为1s
    return Math.round(time / 1000) > 60 ? 60 : Math.round(time / 1000) === 0 ? 1 : Math.round(time / 1000);
  }

  private getWxAppid() {
    const params = {
      companyKey: this.user.companyKey,
    };
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    return new Promise((resolve: any) => {
      this.httpServer(
        {
          url: '/jop-web/wxMember/wxCompanyExplain',
          baseUrl: this.httpBaseUrl,
          headers,
        },
        params
      ).then((res: any) => {
        if (res.data.code === 0) {
          resolve(res.data.data);
        } else {
          Toast({
            message: res.data.msg,
            duration: 1000,
          });
        }
      });
    });
  }

  private getWxJsSDK() {
    const params = {
      companyKey: this.user.companyKey,
      url: window.location.href.split('#')[0],
      type: 'jsapi',
    };
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    return new Promise((resolve: any) => {
      this.httpServer(
        {
          url: '/jop-web/wxinit/jsapi_ticketSign',
          baseUrl: this.httpBaseUrl,
          headers,
        },
        params
      ).then((res: any) => {
        if (res.data.code === 0) {
          resolve(res.data.data);
        } else {
          Toast({
            message: res.data.msg,
            duration: 1000,
          });
        }
      });
    });
  }

  private getWeixinJDK() {
    Promise.all([this.getWxAppid(), this.getWxJsSDK()])
      .then((res: any) => {
        const appid = res[0].appid;
        const wxJsSDKRes = res[1];
        console.log(
          '配置数据',
          `appid, ${appid}, timestamp: ${wxJsSDKRes.timestamp}, nonceStr: ${wxJsSDKRes.nonceStr}, signature: ${wxJsSDKRes.signature}`
        );
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appid, // 必填，公众号的唯一标识
          timestamp: wxJsSDKRes.timestamp, // 必填，生成签名的时间戳
          nonceStr: wxJsSDKRes.nonceStr, // 必填，生成签名的随机串
          signature: wxJsSDKRes.signature, // 必填，签名
          jsApiList: [
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'onVoicePlayEnd',
            'uploadVoice',
          ], // 必填，需要使用的JS接口列表
        });
        wx.ready(() => {
          this.isAuthorization = true;
          wx.startRecord({
            success: () => {
              console.log('开始录音授权');
              // 可能是测试代码先注释掉
              // Toast({
              //   message: '正在检查录音功能...',
              //   duration: 1000
              // });
              setTimeout(() => {
                wx.stopRecord({
                  success: () => {
                    console.log('授权录音结束');
                  },
                });
              }, 500);
            },
            fail: () => {
              console.log('后期会失败么');
              if (!this.isAuthorization) {
                this.isAuthorization = false;
              }
            },
          });
        });
        wx.error(() => {
          console.log('出错了么？');
          this.isAuthorization = false;
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  private blur(e: any) {
    // e.target.scrollIntoView({block: 'center', inline: 'center'});
    e.target.scrollIntoView(false);
  }

  private inputChange() {
    this.inputValueHas = this.value !== '';
  }

  private headerImgUrl(item: any) {
    return item.from === 'b_002' ? item.kfHeadimgurl : this.user.headerImg;
    // return item.from === 'b_002' ? this.servicer.kfHeadimgurl : this.user.headerImg;
  }

  private computedTime(index: number) {
    if (index > 0) {
      return (
        this.chatHistoryList[index].createTime -
          this.chatHistoryList[index - 1].createTime >
        5 * 60 * 1000
      );
    }
    return true;
  }

  private showImg(item: any) {
    if (item.data) {
      // if (!this.isLookImage) {
      //   this.compressImg = item.compressImg;
      // }
      this.compressImg = this.imgUrlComputed(item.data);
      this.popupImgSrc = item.data;
      this.popupShow = true;
    }
  }

  // private getVoiceSource() {
  //   this.isSpeakOver = false;
  //   if (this.recorder != null) {
  //     this.recorder.close();
  //   }
  //   Recorder.get((rec: any) => {
  //     this.recorder = rec;
  //     this.recorder.start();
  //     setTimeout(() => {
  //       if (!this.isSpeakOver) {
  //         this.isSpeakOver = true;
  //         this.recorder.stop();
  //         const audioBlob = this.recorder.getBlob();
  //         console.log(audioBlob);
  //         // const src = window.URL.createObjectURL(audioBlob);
  //         this.sendVoice(audioBlob);
  //       }
  //     }, 30 * 1000);
  //   });
  // }
  // private getVoiceSourceOver() {
  //   this.isSpeakOver = true;
  //   this.recorder.stop();
  //   const audioBlob = this.recorder.getBlob();
  //   console.log(audioBlob);
  //   this.sendVoice(audioBlob);
  // }

  // private sendVoice(blob: any) {
  //   const src = window.URL.createObjectURL(blob);
  //   const message = {
  //     from: 'c_001',
  //     to: 'b_002',
  //     data: src,
  //     time: Date.now(),
  //     msgType: 'voice',
  //     id: null
  //   };
  //   this.chatHistoryList.push(message);
  //   this.$nextTick(function() {
  //     this.sessionToBottom();
  //   });
  //   const params = new FormData();
  //   params.append('openid', this.user.openid);
  //   params.append('companyKey', this.user.companyKey);
  //   params.append('accountId', this.servicer.accountId);
  //   params.append('headimgurl', this.user.headerImg);
  //   params.append('kfAccount', this.servicer.kfAccount);
  //   params.append('nickName', this.user.nick);
  //   params.append('file', blob);
  //   params.append('msgType', 'voice');
  //   this.httpServer({ url: '/chat-web/cChat/sendChatFile' }, params).then((res: any) => {
  //     if (res.data.code === 0) {
  //       console.log(res);
  //     } else {
  //       Toast({
  //         message: res.data.msg,
  //         duration: 1000
  //       });
  //     }
  //   });
  // }
  private setRecordVoiceTimer() {
    if (this.recordVoiceTime >= 30) {
      this.getVoiceSourceOver(1);
    } else {
      this.recordVoiceTime += 1;
    }
  }

  private getVoiceSource() {
    if (!this.isAuthorization) {
      window.alert('您未授权');
      return false;
    }
    // 如果有语音在播放，先关闭。
    this.closeVoice();
    this.isSpeakOver = false;
    this.lastRecorderNumber++;
    wx.startRecord({
      success: () => {
        console.log('startRecord');
        this.lastRecorderNumber--;
        if (this.lastRecorderNumber > 0) {
          return;
        }
        if (this.isSpeakOver) {
          wx.stopRecord({
            success: (res: any) => {
              console.log('stop-startRecord');
              Toast({
                message: '网络不稳定，请重新录入啊',
                duration: 1000,
              });
            },
          });
        } else {
          this.recordVoiceTime = 0;
          // 设置60s定时器
          this.recordVoiceTimer = window.setInterval(() => {
            this.setRecordVoiceTimer();
          }, 1000);
        }
      },
      fail: () => {
        this.isSpeakOver = true;
        // window.alert('wx.startRecord: 授权失败, 请重试');
      },
    });
    wx.onVoiceRecordEnd({
      // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete: (res: any) => {
        console.log(res, 'onVoiceRecordEnd');
        this.isSpeakOver = true;
        const localId = res.localId;
        if (!localId) {
          Toast({
            message: '网络不稳定，请重新录音',
            duration: 1000,
          });
          return false;
        }
        // 录音时长
        const voiceTime = this.recordVoiceTime * 1000;
        this.uploadWXVoice(localId, voiceTime);
        this.recordVoiceTime = 0;
        if (this.recordVoiceTimer) {
          window.clearInterval(this.recordVoiceTimer);
          this.recordVoiceTimer = null;
        }
      },
    });
  }

  private getVoiceSourceOver(type: number) {
    if (type !== 1 && this.recordVoiceTime >= 30) {
      console.log('超时');
      return false;
    }
    this.isSpeakOver = true;
    const voiceTime = this.recordVoiceTime * 1000;
    if (this.recordVoiceTimer) {
      window.clearInterval(this.recordVoiceTimer);
      this.recordVoiceTimer = null;
    }
    wx.stopRecord({
      success: (res: any) => {
        console.log(res, 'stopRecord');
        const localId = res.localId;
        // 录音时长
        if (localId) {
          this.uploadWXVoice(localId, voiceTime);
        } else {
          Toast({
            message: '网络不稳定，请重新录入',
            duration: 1000,
          });
        }
      },
    });
  }

  private uploadWXVoice(localId: any, voiceTime: number) {
    this.lastRecorderNumber = 0;
    wx.uploadVoice({
      localId, // 需要上传的音频的本地ID，由stopRecord接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: (res: any) => {
        console.log(res, 'uploadVoice');
        const message = {
          from: 'c_001',
          to: 'b_002',
          data: localId,
          createTime: Date.now(),
          msgType: 'voice',
          time: voiceTime,
          id: uuidv4().replace(/[-]/g, '').trim(),
          sendingImgShow: true,
          isSendingOk: true,
          serverId: res.serverId, // 返回音频的服务器端ID
        };
        this.chatHistoryList.push(message);
        this.$nextTick(() => {
          this.sessionToBottom();
        });
        this.sendVoice(message);
      },
    });
  }

  private sendVoice(message: any) {
    const params = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      accountId: this.servicer.accountId,
      headimgurl: this.user.headerImg,
      kfAccount: this.servicer.kfAccount,
      nickName: this.user.nick,
      media_id: message.serverId,
      msgType: 'voice',
      time: message.time,
      msgId: message.id,
      clerkId: this.servicer.clerkId,
      shopName: this.servicer.shopName,
      complainAccountId: '',
    };
    if (this.complainOrNot) {
      const complainAccountId: any = this.$route.query.complainAccountId;
      params.complainAccountId = complainAccountId;
    }
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    this.messageSended('/chat-web/c/chat/sendChatWx', headers, params, message);
  }

  private msgType(type: number) {
    const data = {
      4: 'confirm',
      5: 'text',
      6: 'image',
      7: 'voice',
      8: 'video',
    };
    return (data as any)[type];
  }

  private addImgUrl(data: any) {
    const params = data;
    const img = this.chatHistoryList[0];
    params.kfHeadimgurl =
      params.from === 'b_002'
        ? img.kfHeadimgurl || this.user.headerImg
        : this.user.headerImg;
    return params;
  }

  private acceptMessage(message: any) {
    console.log('日志', message);
    // 判断是否为当前客服的消息
    if (message.senderId === this.servicer.accountId) {
      const data = {
        to: 'c_001',
        from: 'b_002',
        data: message.content,
        createTime: message.createTime,
        msgType: this.msgType(message.msgType),
        id: message.msgId,
        time: message.time,
        fileRead: '0',
        compressImg: message.compressImg,
      };
      this.chatHistoryList.push(this.addImgUrl(data));
      this.$nextTick(() => {
        this.sessionToBottom();
      });
      this.messageConfirm(data.id, 1);
    }
  }

  private messageConfirm(msgId: number, status: number) {
    const params = {
      msgId,
      status,
    };
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    this.httpServer(
      { url: '/chat-web/c/chat/updatestatus', headers },
      params
    ).then((res: any) => {
      if (res.data.code === 0) {
        console.log(res);
      } else {
        Toast({
          message: res.data.msg,
          duration: 1000,
        });
      }
    });
  }

  private resend(message: any) {
    const i = this.chatHistoryList.findIndex((p: any) => p.id === message.id);
    if (i > -1) {
      // 先删除之前发送的消息
      this.chatHistoryList.splice(i, 1);
      // 重置信息状态，后再次发送
      message.sendingImgShow = true;
      message.isSendingOk = true;
      this.chatHistoryList.push(message);
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      if (message.msgType === 'text') {
        this.sendText(message);
      }
      if (message.msgType === 'image') {
        this.uploadImg(message);
      }
      if (message.msgType === 'voice') {
        this.sendVoice(message);
      }
    }
  }

  // private clientInit() {
  //   this.client.on(`${this.servicer.topic}`, (data: any) => {
  //     const message = JSON.parse(data.data);
  //     Object.defineProperty(message, 'id', {
  //       value: Date.now(),
  //       enumerable: true,
  //       writable: false
  //     });
  //     if (message.msgType === 'voice') {
  //       Object.defineProperty(message, 'fileRead', {
  //         value: '0',
  //         enumerable: true,
  //         writable: true
  //       });
  //     }
  //     this.chatHistoryList.push(message);
  //     this.$nextTick(function() {
  //       this.sessionToBottom();
  //     });
  //   });
  // }

  // private subscribe() {
  //   if (!this.servicer.topic) {
  //     Toast({
  //       message: '消息主题为空！',
  //       duration: 1000
  //     });
  //     return;
  //   }
  //   const params = {
  //     topic: this.servicer.topic
  //   };
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('post', `${this.nodeBaseUrl}/subscribe`);
  //   // xhr.open('post', `http://www.jqzcloud.com/subscribe`);
  //   xhr.setRequestHeader('content-type', 'application/json');
  //   xhr.send(JSON.stringify(params));
  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState === 4 && xhr.status === 200) {
  //       const responseData = JSON.parse(xhr.responseText);
  //       this.onSubscribeSuccess();
  //     }
  //   };
  // }
  // private onSubscribeSuccess() {
  //   const params = {
  //     openid: this.user.openid,
  //     companyKey: this.user.companyKey,
  //     accountId: this.servicer.accountId
  //   };
  //   this.httpServer({url: '/chat-web/cChat/subscribe'}, params).then((res: any) => {
  //     if (res.data.code === 0) {
  //       console.log(res);
  //     } else {
  //       Toast({
  //         message: res.data.msg,
  //         duration: 1000
  //       });
  //     }
  //   });
  // }

  private closeVoice() {
    if (this.recordVoiceTimer) {
      window.clearInterval(this.recordVoiceTimer);
    }
    if (this.voiceLocalId) {
      const item: any = this.chatHistoryList.find(
        (p: any) => p.id === this.voiceLocalId
      );
      console.log(item, 'closeVoice');
      if (item.serverId) {
        wx.pauseVoice({
          localId: item.data, // 需要暂停的音频的本地ID，由stopRecord接口获得
        });
        wx.stopVoice({
          localId: item.data,
        });
      } else {
        const audio: HTMLElement | any = document.getElementById('audioSave');
        audio.pause();
      }
      this.voiceLocalId = '';
    }
  }

  private playAudio(item: any) {
    this.closeVoice();
    this.voiceLocalId = item.id;
    // 根据item对象中是否有serverId，判断是否为后台返回数据
    if (item.serverId) {
      wx.playVoice({ localId: item.data });
      wx.onVoicePlayEnd({
        success: (res: any) => {
          // 关闭播放状态
          this.voiceLocalId = '';
        },
      });
    } else {
      const audio: HTMLElement | any = document.getElementById('audioSave');
      const u = window.navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        audio.src = item.data;
      } else {
        audio.src = item.data;
        audio.play();
      }
      // 预计时间后关闭正在播放的状态
      setTimeout(() => {
        this.voiceLocalId = '';
      }, item.time);
      const index = this.chatHistoryList.findIndex(
        (p: any) => p.id === item.id
      );
      if (this.chatHistoryList[index].fileRead === '0') {
        // 更新语音状态
        const playItem = {
          creatTime: item.creatTime,
          data: item.data,
          fileRead: '1',
          from: item.from,
          id: item.id,
          msgType: item.msgType,
          time: item.time,
          to: item.to,
        };
        this.$set(this.chatHistoryList, index, playItem);
        this.voiceFileReaded(item.id);
      }
    }
    // const audio: HTMLElement | any = document.getElementById('audioSave');
    // if (item.data && audio) {
    //   const audioId = item.id;
    //   this.voiceLocalId = audioId;
    //   if (item.serverId) {
    //     wx.playVoice({localId: item.data});
    //     wx.onVoicePlayEnd({
    //       success: (res: any) => {
    //         this.voiceLocalId = '';
    //       }
    //     });
    //   } else {
    //     const u = window.navigator.userAgent;
    //     if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    //       audio.src = item.data;
    //     } else {
    //       audio.src = item.data;
    //       audio.play();
    //     }
    //     const playItem = {
    //       creatTime: item.creatTime,
    //       data: item.data,
    //       fileRead: '1',
    //       from: item.from,
    //       id: item.id,
    //       msgType: item.msgType,
    //       time: item.time,
    //       to: item.to
    //     };
    //     const index = this.chatHistoryList.findIndex((p: any) => p.id === playItem.id);
    //     this.$set(this.chatHistoryList, index, playItem);
    //     setTimeout(() => {
    //       this.voiceLocalId = '';
    //     }, item.time);
    //     const params = {
    //       id: audioId
    //     };
    //     const headers = {
    //       openid: this.user.openid,
    //       companyKey: this.user.companyKey,
    //       ticket: this.loginTicket
    //     };
    //     this.httpServer({url: '/chat-web/cChat/fileRead', headers}, params).then((res: any) => {
    //       if (res.data.code === 0) {
    //         console.log(audioId);
    //       } else {
    //         Toast({
    //           message: res.data.msg,
    //           duration: 1000
    //         });
    //       }
    //     });
    //   }
    // }
  }
  // 返回语音已播放
  private voiceFileReaded(id: any) {
    const params = {
      id,
    };
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    this.httpServer({ url: '/chat-web/cChat/fileRead', headers }, params).then(
      (res: any) => {
        if (res.data.code === 0) {
          console.log(id);
        } else {
          Toast({
            message: res.data.msg,
            duration: 1000,
          });
        }
      }
    );
  }
  // 加载更多
  private loadMore() {
    this.getHistorySession(this.pageNum);
  }
  private getHistorySession(pageNum?: number) {
    console.log('请求历史消息');
    const params = {
      params: {
        openid: this.user.openid,
        companyKey: this.user.companyKey,
        accountId: this.servicer.accountId,
      },
      page: {
        pageSize: 10,
        pageNum: pageNum ? pageNum : 1,
      },
    };
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    return new Promise((resolve, reject) => {
      this.httpServer(
        { url: '/chat-web/cChat/chatDetail', headers },
        params
      ).then((res: any) => {
        if (res.data.code === 0) {
          const list = res.data.data.list.map((p: any) => {
            const goodInfo =
              p.msgType === 'goodId' && p.texts ? JSON.parse(p.texts) : {};
            return {
              from: p.opercode,
              to: '',
              data: p.texts,
              createTime: p.createTime,
              msgType: p.msgType,
              id: p.msgId,
              time: p.time,
              fileRead: p.fileRead,
              isOnlineKf: p.isOnlineKf,
              compressImg: p.compressImg,
              kfHeadimgurl: p.kfHeadimgurl,
              imgId: p.id,
              accountId: p.accountId,
              goodInfo,
            };
          });
          const customerId = this.chatHistoryList.length
            ? this.chatHistoryList[0].accountId
            : '';
          const transList: any = [];
          list.map((item: any) => {
            console.log('获取id', item.accountId, '---', customerId);
            if (item.accountId === customerId || !customerId) {
              transList.push(item);
            }
          });
          this.contentTotal = res.data.data.total;
          const totalList = [...this.chatHistoryList, ...transList];
          const hash = {};
          this.chatHistoryList = totalList.reduceRight((acc: any, cur: any) => {
            if (!(hash as any)[cur.imgId]) {
              (hash as any)[cur.imgId] = true;
              acc.push(cur);
            }
            return acc;
          }, []);
          this.chatHistoryList = this.chatHistoryList.sort(
            (a: any, b: any) => a.createTime - b.createTime
          );
          let isEle: boolean = true;
          // 判断数据小于后台返回的总数据时进行 pageNum ++
          if (this.chatHistoryList.length < res.data.data.total) {
            this.pageNum++;
            isEle = true;
          } else {
            isEle = false;
          }
          // this.chatHistoryList = list;
          this.$nextTick(() => {
            // 获取聊天内容的最后一个子元素
            const divElem: any = document.getElementsByClassName(
              'session-content'
            );
            const div: any = divElem[0].lastChild;
            // const eleDoc: any = document.querySelectorAll('.session-item');
            let eleDoc: any = null;
            if (document.querySelectorAll('.session-item')) {
              eleDoc = document.querySelectorAll('.session-item');
            }
            if (res.data.data.total <= 10) {
              if (div && this.pageNum === 1) {
                // 先执行第一次
                this.toBottomFun(div, eleDoc, 20);
                // 执行第二次，防止图片没有滑动到底部
                this.toBottomFun(div, eleDoc, 500);
              }
            } else {
              if (div && this.pageNum === 2 && isEle) {
                this.toBottomFun(div, eleDoc, 20);
                this.toBottomFun(div, eleDoc, 500);
              }
            }
          });
          resolve(true);
        } else {
          Toast({
            message: res.data.msg,
            duration: 1000,
          });
        }
      });
    });
  }
  // 到底部
  private toBottomFun(div: any, eleDoc: any, time: number) {
    const clearT = setTimeout(() => {
      div.scrollIntoView({ behaviord: 'smooth', block: 'end' });
      eleDoc.forEach((ele: any) => {
        ele.style.opacity = 1;
      });
    }, time);
  }
  private sessionToBottom(type?: string) {
    if (type) {
      // 防止商品卡发送不会回到底部
      const divId: string = `chat_session_${this.chatHistoryList.length - 1}`;
      const div: any = document.getElementById(divId);
      let eleDoc: any = null;
      if (document.querySelectorAll('.session-item')) {
        eleDoc = document.querySelectorAll('.session-item');
      }
      this.toBottomFun(div, eleDoc, 500);
    } else {
      const divId: string = `chat_session_${this.chatHistoryList.length - 1}`;
      const div: any = document.getElementById(divId);
      if (div) {
        div.scrollIntoView({ behaviord: 'smooth', block: 'end' });
      }
    }
  }
  private send(msgType: string, msg?: any) {
    let value: any = '';
    let id: string = '';
    if (msg) {
      value = msg.data;
      id = msg.id;
    } else {
      value = this.value;
      id = uuidv4().replace(/[-]/g, '').trim();
    }
    if (value.match(/^[ ]*$/)) {
      Toast({
        message: '不能发送空白消息',
        duration: 1000,
      });
      return;
    }
    const mess = {
      from: 'c_001',
      to: 'b_002',
      data: value.trim(),
      createTime: Date.now(),
      msgType,
      sendingImgShow: true,
      isSendingOk: true,
      id,
    };
    const message = msgType === 'goodId' ? Object.assign({}, mess, msg) : mess;
    this.chatHistoryList.push(message);
    this.$nextTick(() => {
      this.sessionToBottom(msgType === 'goodId' ? 'goosId' : '');
    });
    this.sendText(message);
  }

  private sendText(message: any) {
    const params = {
      accountId: this.servicer.accountId,
      headimgurl: this.user.headerImg,
      kfAccount: this.servicer.kfAccount,
      nickName: this.user.nick,
      texts: message.data,
      msgType: message.msgType,
      msgId: message.id,
      clerkId: this.servicer.clerkId,
      shopName: this.servicer.shopName,
      complainAccountId: '',
    };
    if (this.complainOrNot) {
      const complainAccountId: any = this.$route.query.complainAccountId;
      params.complainAccountId = complainAccountId;
    }
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
    };
    this.messageSended('/chat-web/c/chat/sendChat', headers, params, message);
  }

  private uploadImg(message: any, blob?: any) {
    const params = new FormData();
    params.append('openid', this.user.openid);
    params.append('companyKey', this.user.companyKey);
    params.append('accountId', this.servicer.accountId);
    params.append('headimgurl', this.user.headerImg);
    params.append('kfAccount', this.servicer.kfAccount);
    params.append('nickName', this.user.nick);
    params.append('file', blob || message.data);
    params.append('msgId', message.id);
    params.append('clerkId', this.servicer.clerkId);
    params.append('shopName', this.servicer.shopName);
    params.append('msgType', 'image');
    if (this.complainOrNot) {
      const complainAccountId: any = this.$route.query.complainAccountId;
      params.append('complainAccountId', complainAccountId);
    }
    const headers = {
      openid: this.user.openid,
      companyKey: this.user.companyKey,
      ticket: this.loginTicket,
    };
    this.messageSended(
      '/chat-web/c/chat/sendChatFile',
      headers,
      params,
      message
    );
  }

  private messageSended(url: string, headers: any, params: any, message: any) {
    this.httpServer({ url, headers }, params)
      .then((res: any) => {
        if (res.data.code === 0) {
          this.value = '';
          this.inputValueHas = this.value !== '';
          this.updateMsgStatus(message, '0');
        } else {
          this.updateMsgStatus(message, '1');
          Toast({
            message: res.data.msg,
            duration: 1000,
          });
        }
      })
      .catch((err) => {
        this.updateMsgStatus(message, '1');
      });
  }

  private updateMsgStatus(msg: any, status: string) {
    const i = this.chatHistoryList.findIndex((p: any) => p.id === msg.id);
    if (status === '0') {
      msg.sendingImgShow = false;
      this.$set(this.chatHistoryList, i, msg);
    } else {
      msg.isSendingOk = false;
      this.$set(this.chatHistoryList, i, msg);
    }
  }

  private uploadClick() {
    (this as any).$refs.filElem.dispatchEvent(new MouseEvent('click'));
  }

  // private reduceImg(imgUrl: any) {
  //   const img: any = new Image();
  //   // 缩放图片需要的canvas
  //   const canvas: any = document.createElement('canvas');
  //   const context: any = canvas.getContext('2d');
  //   // 设置图片跨域访问
  //   // img.setAttribute('crossOrigin', 'Anonymous');
  //   // base64地址图片加载完毕后
  //   img.onload = () => {
  //     // 图片原始尺寸
  //     const originWidth = img.width;
  //     const originHeight = img.height;
  //     // 最大尺寸限制
  //     const maxWidth = 800;
  //     const maxHeight = 800;
  //     // 目标尺寸
  //     let targetWidth = originWidth;
  //     let targetHeight = originHeight;
  //     // 图片尺寸超过100x100的限制
  //     if (originWidth > maxWidth || originHeight > maxHeight) {
  //       if (originWidth / originHeight > maxWidth / maxHeight) {
  //         // 更宽，按照宽度限定尺寸
  //         targetWidth = maxWidth;
  //         targetHeight = Math.round(maxWidth * (originHeight / originWidth));
  //       } else {
  //         targetHeight = maxHeight;
  //         targetWidth = Math.round(maxHeight * (originWidth / originHeight));
  //       }
  //     }
  //     // canvas对图片进行缩放
  //     canvas.width = targetWidth;
  //     canvas.height = targetHeight;
  //     // 清除画布
  //     context.clearRect(0, 0, targetWidth, targetHeight);
  //     // 图片压缩
  //     context.drawImage(img, 0, 0, targetWidth, targetHeight);
  //     // 生成base64
  //     const imgBase64 = canvas.toDataURL('image/png');
  //     // console.log(imgBase64);
  //     const message = {
  //       from: 'c_001',
  //       to: 'b_002',
  //       data: imgBase64,
  //       createTime: Date.now(),
  //       msgType: 'image',
  //       sendingImgShow: true,
  //       isSendingOk: true,
  //       id: null
  //     };
  //     this.chatHistoryList.push(message);
  //     this.$nextTick(function() {
  //       this.sessionToBottom();
  //     });
  //     // const imgBlob = this.convertBase64UrlToBlob(imgBase64);
  //     // console.log(imgBlob);
  //     // this.uploadImg(imgBlob);
  //     // this.send('image', imgBase64);
  //   };
  //   img.src = imgUrl;
  // }

  // 图片格式转换  base64转blob
  private convertBase64UrlToBlob(urlData: any, type: string) {
    const bytes: string = window.atob(urlData.split(',')[1]);
    // 去掉url的头，并转换为byte
    // 处理异常,将ascii码小于0的转换为大于0
    const ab: ArrayBuffer = new ArrayBuffer(bytes.length);
    const ia: Uint8Array = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type });
  }

  private getFile(event: any) {
    // 选择的文件对象
    let file: any = null;
    const reader: any = new FileReader();
    file = event.target.files[0];
    // 选择的文件是图片
    if (file.type.indexOf('image') === 0) {
      // reader.readAsDataURL(file);
      reader.readAsArrayBuffer(file);
    }
    reader.onload = () => {
      const imgBase64 = reader.result;
      // const imgBlob = this.convertBase64UrlToBlob(imgBase64, file.type);
      const imgBlob = new Blob([imgBase64], { type: file.type });
      const message = {
        from: 'c_001',
        to: 'b_002',
        data: imgBlob,
        createTime: Date.now(),
        msgType: 'image',
        sendingImgShow: true,
        isSendingOk: true,
        id: uuidv4().replace(/[-]/g, '').trim(),
      };
      this.chatHistoryList.push(message);
      this.$nextTick(() => {
        this.sessionToBottom('image');
        this.messageInfoModal = false;
        // this.scrollToBottom();
      });
      this.uploadImg(message, imgBlob);
    };
  }

  private destroyed() {
    this.closeVoice();
    // 将client上绑定的事件删去
    this.$store.dispatch('removeBindClientEvent', this.acceptMessage);
  }
}
</script>

<style lang="less">
@keyframes upload {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes upload {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.about {
  // height: calc(100vh - 44px);
  height: calc(100vh);
  position: relative;
  .session-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: calc(100vh - 58px);
    overflow: auto;
    .load-more {
      text-align: center;
      font-family: PingFang-SC-Regular;
      font-size: 12px;
      color: #999999;
      padding: 16px 0;
      margin-top: 68px;
    }
    .chat-online {
      background-image: linear-gradient(#ffffff, #ffffff),
        linear-gradient(#f2f2f2, #f2f2f2);
      border-left: 4px solid #7aa4ff;
      padding: 10px 0 10px 18px;
      position: fixed;
      // top: 44px;
      top: 0;
      width: 100%;
      border-top: 1px solid #ddd;
      z-index: 99;
      .chat-name {
        font-family: PingFang-SC-Medium;
        display: flex;
        align-items: center;
        span:nth-child(1) {
          font-size: 16px;
          color: #333;
        }
        span.chat-kefu {
          background-image: linear-gradient(#7ea2ff, #7ea2ff),
            linear-gradient(#07c264, #07c264);
          font-size: 11px;
          color: #fafaff;
          border-radius: 2px;
          border: 1px solid #7ea2ff;
          padding: 2px 4px;
          margin: 0 4px;
        }
        span:last-child {
          font-size: 14px;
          color: #7ea2ff;
          margin-left: 6px;
        }
        .chat-box {
          position: absolute;
          right: 34px;
          top: 8px;
          font-size: 12px;
          color: #ed6060;
          padding: 6px;
        }
        .chat-box-top {
          top: 18px;
        }
      }
      .chat-shop {
        font-size: 12px;
        color: #999999;
        margin-top: 8px;
        max-width: 320px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .chat-complaint-name-box {
      position: fixed;
      box-sizing: border-box;
      width: 100%;
      padding: 12px 20px;
      background: #fff;
      color: #ed6060;
      font-weight: 400;
      font-size: 12px;
      z-index: 99;
      top: 0;
    }
    .session-item {
      padding-bottom: 8px;
      .item {
        .time {
          font-family: PingFang-SC-Regular;
          font-size: 12px;
          color: #999999;
          text-align: center;
          padding: 16px 0;
        }
        .item-content {
          display: flex;
          .header-img {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            margin: 0 15px;
          }
          .content {
            max-width: 202px;
            font-family: PingFang-SC-Regular;
            font-size: 14px;
            color: #333333;
            padding: 15px;
            border-radius: 12px;
            letter-spacing: 1px;
            word-break: break-all;
          }
          .yy {
            min-width: 40px;
            font-size: 0;
            display: table;
            vertical-align: middle;
            .yy-img {
              width: 15px;
            }
            .yy-long-time {
              font-size: 15px;
              display: table-cell;
              vertical-align: middle;
            }
          }
          .self-yy {
            text-align: right;
            img {
              transform: rotate(180deg);
            }
          }
          .send-img {
            max-width: 150px;
            img {
              max-width: 100%;
              border-radius: 12px;
            }
          }
          .message-info {
            font-size: 0;
            display: flex;
            align-items: center;
            width: 30px;
            img {
              width: 18px;
            }
            .sending-img {
              animation: upload 1s linear 0s infinite;
              -webkit-animation: upload 2s linear 0s infinite;
            }
          }
        }
      }
      .servicer {
        .item-content {
          .content {
            background-color: #ffffff;
            position: relative;
          }
          .content:before {
            content: '';
            width: 14px;
            height: 14px;
            position: absolute;
            left: -12px;
            top: 8px;
            background: #ffffff;
            background: radial-gradient(
                circle at bottom left,
                transparent 14px,
                #ffffff 0
              )
              bottom left;
          }
          .un-read:after {
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 50%;
            position: absolute;
            right: -24px;
            top: 18px;
            background: red;
          }
        }
      }
      .selfer {
        .item-content {
          flex-direction: row-reverse;
          .content {
            background-color: #79a5ff;
            position: relative;
            color: #ffffff;
          }
          .content:after {
            content: '';
            width: 14px;
            height: 14px;
            position: absolute;
            right: -12px;
            top: 8px;
            background: #79a5ff;
            background: radial-gradient(
                circle at bottom right,
                transparent 14px,
                #79a5ff 0
              )
              bottom right;
          }
          .info {
            max-width: 232px;
            background-color: #ffffff;
            position: relative;
            color: #000;
            font-size: 16px;
            padding: 0;
            overflow: hidden;
            z-index: 10;
            #info-img-box {
              width: 232px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            &-img {
              max-width: 232px;
              height: 232px;
            }
            &-message {
              padding: 7px 15px 15px 15px;
              &-price {
                &-l {
                  font-size: 16px;
                  font-family: PingFangTC-Medium, PingFangTC;
                  font-weight: 500;
                  color: #fe6f31;
                }
                &-r {
                  font-size: 11px;
                  font-family: PingFangTC-Regular, PingFangTC;
                  font-weight: 400;
                  color: #8b8b8b;
                  margin-left: 11px;
                }
              }
              &-title {
                font-size: 16px;
                font-family: PingFangTC-Regular, PingFangTC;
                font-weight: 400;
                color: #000000;
                line-height: 30px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              &-tag {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                font-size: 10px;
                font-family: PingFangTC-Regular, PingFangTC;
                font-weight: 400;
                color: #8b8b8b;
                line-height: 17px;

                &-item {
                  line-height: 1.5;
                  overflow-x: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
            &:after {
              content: '';
              width: 14px;
              height: 14px;
              position: absolute;
              right: -12px;
              top: 8px;
              background: transparent;
            }
          }
          // .message-info {
          //   background-color: red;
          //   width: 50px;
          // }
        }
      }
    }
    // 查看更多聊天记录
    .content-more {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 80px;
      span {
        font-size: 12px;
        color: #7aa4ff;
        margin-left: 4px;
      }
    }
    .content-more2 {
      margin-top: 60px;
    }
  }
  .footer-input {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    background-color: #ffffff;
    .connect-fail {
      background-color: #feeded;
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 12px;
      color: #999999;
      .fail-icon {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background-color: #ed6060;
        border-radius: 50%;
        color: #fff;
        font-size: 16px;
      }
      .fail-reload-btn {
        width: 68px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 24px;
        border: 1px solid #ed6060;
        font-size: 10px;
        color: #ed6060;
      }
    }
    .visitor-login {
      padding: 15px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: linear-gradient(#fafaff, #fafaff),
        linear-gradient(#e8e8e8, #e8e8e8);
      .visitor-text {
        font-size: 14px;
        color: #7ea2ff;
        margin-left: 4px;
      }
      .dl-img {
        width: 18px;
        margin-right: 3px;
      }
    }
    .footer-input-content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 54px;
      text-align: center;
      .btn-function-yy {
        width: 46px;
        .yy-img {
          width: 20px;
          margin: 0 auto;
          height: 34px;
          line-height: 34px;
          text-align: center;
          font-size: 0;
          img {
            width: 25px;
            vertical-align: middle;
          }
        }
        .input-img {
          width: 25px;
          border-radius: 50%;
          margin-top: 6px;
        }
      }
      .input {
        width: 260px;
        height: 34px;
        border-radius: 5px;
        border: solid 1px #dddddd;
        background-color: #fafafa;
        display: flex;
        justify-content: center;
        text-align: center;
        input {
          font-family: PingFang-SC-Regular;
          font-size: 14px;
          color: #333333;
          width: 90%;
          border: none;
          background-color: #fafafa;
          outline: none;
          display: block;
        }
        .yy-btn {
          width: 100%;
          height: 34px;
          line-height: 34px;
          font-size: 15px;
          border-radius: 5px;
          .speak-btn {
            border-radius: 5px;
            background-color: #fafafa;
            font-family: PingFang-SC-Regular;
            font-size: 15px;
            color: #333333;
          }
          .over-btn {
            border-radius: 5px;
            background-color: #f0f0f0;
            font-family: PingFang-SC-Regular;
            font-size: 15px;
            color: #333333;
          }
        }
      }
      .btn {
        width: 60px;
        div {
          width: 50px;
          margin: 0 auto;
          height: 34px;
          line-height: 34px;
          text-align: center;
          background-color: #79a5ff;
          border-radius: 5px;
          color: #ffffff;
          font-family: PingFang-SC-Regular;
          font-size: 14px;
          color: #ffffff;
        }
      }
      .btn-function {
        width: 34px;
        margin: 0 auto;
        height: 34px;
        line-height: 34px;
        text-align: center;
        font-size: 0;
        img {
          width: 25px;
          vertical-align: middle;
        }
      }
      .btn-face {
        margin-left: 6px;
      }
      .last-btn {
        margin-right: 10px;
      }
      .btn-disabled {
        background-color: gray;
      }
    }
    .message-info-content {
      max-height: 180px;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 25%;
        text-align: center;
        padding: 12px 0;
        position: relative;
        .img {
          width: 60px;
          text-align: center;
          height: 60px;
          font-size: 0;
          line-height: 60px;
          background-color: #fafafa;
          border-radius: 5px;
          margin: 0 auto;
          img {
            width: 32px;
            vertical-align: middle;
          }
        }
        .name {
          font-family: PingFang-SC-Regular;
          font-size: 12px;
          color: #666666;
          padding: 8px 0;
        }
        //  @click="uploadClick"
        input[type='file'] {
          position: absolute;
          left: 14px;
          top: 10px;
          width: 60px;
          height: 60px;
          opacity: 0;
        }
      }
      .face-content {
        flex-basis: 12%;
        flex-grow: 1;
        text-align: center;
        padding: 10px 0;
        font-size: 24px;
      }
    }
  }
  .popup-content {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    background-color: black;
    font-size: 0;
    position: relative;
    justify-content: center;
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
  .popup-downLoad {
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 60px;
    height: 40px;
    span {
      color: #fff;
      font-size: 14px;
      padding: 10px 20px;
      border-radius: 5px;
      background: rgba(15, 15, 15, 0.5);
      min-width: 100px;
      text-align: center;
      min-height: 20px;
    }
    .popup-img {
      position: absolute;
      right: 26px;
      padding: 10px;
      background: rgba(15, 15, 15, 0.5);
      border-radius: 5px;
      width: 20px;
    }
  }
  .speaking-content {
    position: fixed;
    left: calc(50vw - 110px);
    top: calc(50vh - 105px);
    z-index: 5000;
    width: 220px;
    height: 210px;
    text-align: center;
    background-color: rgba(15, 15, 15, 0.5);
    border-radius: 5px;
    color: #ffffff;
    font-family: PingFang-SC-Medium;
    font-size: 16px;
    img {
      width: 130px;
      margin: 20px 0 10px 0;
    }
  }
  .dialog-complaint-box {
    .complaint-wrapper {
      border-radius: 12px;
      overflow: inherit;
      .van-dialog__content {
        position: relative;
        .complaint-img {
          position: absolute;
          z-index: 9999;
          top: -78px;
          width: 100%;
          text-align: center;
          img {
            width: 43%;
            height: 43%;
          }
        }
      }
    }
    .dialog-complaint {
      padding: 44px 27px;
      .dialog-complaint-name,
      .complaint-question {
        text-align: center;
        margin-bottom: 10px;
        font-size: 16px;
        color: #333333;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      .complaint-button {
        text-align: center;
        margin-top: 18px;
        button {
          width: 220px;
          height: 40px;
          background: #5f8ff6;
          border-radius: 4px;
          color: #fff;
          font-weight: 400;
          border: none;
          outline: none;
        }
      }
      .complaint-confirm {
        margin-top: 30px;
        button {
          background: #5f8ff6;
        }
      }
      .complaint-cancel {
        button {
          background: #f2f2f2;
          color: #333;
        }
      }
    }
  }
}
</style>
