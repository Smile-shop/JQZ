<template>
  <div>
    <!-- <Header :nav-title="'在线预约'" :nav-title-right="'预约记录'" @headerRightClick="goAppointRecord"></Header> -->
    <div class="content">
      <div class="appoint-show" v-html="contentAppoint"></div>

      <div class="appoint-input">
        <div class="title" :style="{ 'color': themeColor }">请填写您的预约资料</div>

        <div class="login-list-item">
          <div class="header">验证码：</div>
          <div class="validate-input body">
            <div class="input-input">
              <InputField :maxLength="'8'" v-model="appointModal.smsCode" placeholder="验证码"></InputField>
            </div>
            <div class="input-click">
              <div :style="{ 'background-color': themeColor }" v-if="sendForTimeout.show" @click="sendMsg"> 
                <!-- 发送验证码 -->
                <span>发送验证码</span>
              </div>
              <div class="time-out" v-else>
                <span>{{ sendForTimeout.time }}s...</span>
              </div>
            </div>
          </div>
        </div>

        <div class="login-list-item">
          <div class="header">预约门店：</div>
          <div class="input body" v-if="appointShop === '所有分销商'">
            <SelectField :initData="shop" @select="shop = $event" :columnsList="shopListArr" placeholder="请选择门店"></SelectField>
          </div>
          <div class="input body disabled-item" v-else>
            <div class="shop-name-appoint">{{shop}}</div>
          </div>
        </div>

        <div class="login-list-item">
          <div class="header">预约时间：</div>
          <div class="input body">
            <SelectField :initData="appointModal.reservation_time" :minDate="timeMin" :maxDate="timeMax" type="datetime" @select="appointModal.reservation_time = $event" placeholder="请选择时间"></SelectField>
          </div>
        </div>

        <div class="login-list-item">
          <div class="header">到店人：</div>
          <div class="input body">
            <InputField :maxLength="'6'" v-model="appointModal.username" placeholder="到店人姓名"></InputField>
          </div>
        </div>

        <div class="login-list-item">
          <div class="header">联系方式：</div>
          <div class="input body">
            <InputField :maxLength="'11'" v-model="appointModal.mobile" placeholder="到店人联系方式"></InputField>
          </div>
        </div>
        
        <div class="login-list-item">
          <div class="header">微信号：</div>
          <div class="input body">
            <InputField v-model="appointModal.wx" placeholder="请输入您的微信号(选填)"></InputField>
          </div>
        </div>


        <div class="content-header">{{urlData.companyKey == '00539701' ? '婚纱摄影' : '预约内容'}}：</div>
        <div class="login-list-item">
          <div class="input-textarea">
            <div @blur="blur" tabindex="0" id="textarea" class="textarea" contenteditable="true" v-html="inputDiv.content">
            </div>
            <div class="upload">
              <i class="vip-v3-iconfont icon">&#xe702;</i>
              插入图片
              <input type="file" name="file" id="file" accept="image/png, image/jpg, image/jpeg" @change="uploadImg">
            </div>
          </div>
          
        </div>

        <div class="login-list-item" v-if="submitBtnDisabled">
          <div class="login-btn" :style="{ 'background-color': themeColor }" @click="addNewAppoint">提交</div>
        </div>

        <div class="login-list-item" v-else>
          <div class="login-btn">提交中...</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from "../../components/Header";
export default {
  components: {
    Header
  },
  data() {
    return {
      appointModal: {
        shopName: "",
        username: "",
        mobile: "",
        smsCode: "",
        reservation_time: "",
        wx: "",
        content: "",
      },
      inputDiv: {
        photo: [],
        content: ""
      },
      contentAppoint: '',
      appointShop: '',
      nameOut: '',
      appointTitle: '',
      appointId: '',
      timer: null,
      sendForTimeout: {
        show: true,
        time: 60
      },
      submitBtnDisabled: true,
      enableSms: null,
      shopList: [],
      shop: ''
    };
  },
  computed: {
    ...mapState({
      themeColor: state => state.themeColor,
      homeMemberData: state => state.homeMemberData,
      urlData: state => state.urlData
    }),
    timeMax() {
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return new Date(`${year + 2}/${month}/${day}`);
    },
    timeMin() {
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return new Date(`${year}/${month}/${day}`);
    },
    shopListArr() {
      return this.shopList.map(p => p.nameOut);
    }
  },
  mounted() {
    this.appointModal.username = this.homeMemberData.name || '';
    this.appointModal.mobile = this.homeMemberData.phone || '';
    this.getAppointIndex(this.$route.query.id);
  },
  methods: {
    blur(e) {
      // window.scroll(0, 0);
      e.target.scrollIntoView({block: 'center', inline: 'center'});
    },
    getAppointIndex(id) {
      let params = {
        companyKey: this.urlData.companyKey,
        id
      }
      this._http({url: '/jop-web/wxReservationNew/getProjectDetail'}, params).then(res => {
        if(res.data.code == 0 && res.data.data) {
          const resData = res.data.data;
          this.contentAppoint = this.htmlDecodeByRegExp(resData.content ? resData.content : '');
          this.appointShop = resData.shopName;
          this.nameOut = resData.nameOut;
          if (resData.shopName === '所有分销商') {
            this.shop = resData.shopList[0].nameOut;
            this.shopList = resData.shopList;
          } else {
            this.shop = resData.nameOut;
          }
          this.appointTitle = resData.title;
          this.appointId = resData.id;
          this.enableSms = resData.enableSms;
        } else {
          this.$toast({
            message: '客户未开启在线预约！',
            duration: 1000
          })
          window.setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        }
      })
    },
    goAppointRecord() {
      this.$router.push({
        path: "/app-online",
        query: {
          navIndex: '2'
        }
      });
    },
    sendMsg() {
      let params = {
        companyKey: this.urlData.companyKey,
        card_no: this.urlData.memberCard,
        mobile: this.urlData.phone
      }
      this.timerMethods();
      this._http({url: '/jop-web/jop/sendVerifyCode'}, params).then(res => {
        if(res.data.code !== 0) {
          this.clearTimerMethods()
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    timerMethods() {
      this.sendForTimeout.show = false;
      this.timer = window.setInterval(() => {
        if(this.sendForTimeout.time > 0) {
          this.sendForTimeout.time -= 1;
        } else {
          this.clearTimerMethods();
        }
      }, 1000)
    },
    clearTimerMethods() {
      window.clearInterval(this.timer);
      this.timer = null;
      this.sendForTimeout.time = 60;
      this.sendForTimeout.show = true;
    },
    /*1.用正则表达式实现html转码*/
    htmlEncodeByRegExp(str) {
      let s = "";
      if (str.length == 0) return "";
      s = str.replace(/&/g, "&amp;");
      s = s.replace(/</g, "&lt;");
      s = s.replace(/>/g, "&gt;");
      s = s.replace(/ /g, "&nbsp;");
      s = s.replace(/\'/g, "&#39;");
      s = s.replace(/\"/g, "&quot;");
      return s;
    },
    /*2.用正则表达式实现html解码*/
    htmlDecodeByRegExp: function(str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&amp;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "'");
      s = s.replace(/&quot;/g, '"');
      return s;
    },
    addNewAppoint() {
      if(this.appointModal.smsCode === '') {
        this.$toast({
          message: '验证码不能为空！',
          duration: 1000
        })
        return;
      };
      if(this.appointModal.reservation_time === '') {
        this.$toast({
          message: '预约时间不能为空！',
          duration: 1000
        })
        return;
      };
      if (this.appointShop === '所有分销商') {
        this.appointModal.shopName = this.shopList.find(p => p.nameOut === this.shop).shopName;
      } else {
        this.appointModal.shopName = this.appointShop;
      }
      const content = this.getInputDivContent();
      this.appointModal.content = this.htmlEncodeByRegExp(content);
      const params = {
        companyKey: this.urlData.companyKey,
        card_no: this.urlData.memberCard,
        mobile: this.appointModal.mobile,
        username: this.appointModal.username,
        shopName: this.appointModal.shopName,
        reservation_time: `${this.appointModal.reservation_time}:00`,
        smsCode: this.appointModal.smsCode,
        content: this.appointModal.content,
        title: this.appointTitle,
        wxNo: this.appointModal.wx,
        openId: this.urlData.openid,
        enableSms: this.enableSms,
        projectId: this.$route.query.id
      }
      this.submitBtnDisabled = false;
      this._http({url: '/jop-web/wxReservationNew/add'}, params).then(res => {
        this.submitBtnDisabled = true;
        if(res.data.code === 0) {
          this.$toast({
            message: '预约成功！',
            duration: 1000
          })
          window.setTimeout(() => {
            this.$router.push({
              path: '/app-online',
              query: {
                navIndex: '2'
              }
            });
          }, 1000);
        } else {
          this.$toast({
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    uploadImg(e) {
      let file = e.target.files[0];
      if(file) {
        var rFilter = /^(image\/jpeg|image\/png|image\/jpg)$/i; // 检查图片格式  
        if (!rFilter.test(file.type)) {  
          //showMyTips("请选择jpeg、png格式的图片", false);
          this.$toast({
            message: '图片格式有误！',
            duration: 1000
          })
          return;  
        }
        if(file.size > 2*1000*1000) {
          this.$toast({
            message: '图片不能大于2M！',
            duration: 1000
          })
          return; 
        }
        let params = new FormData();
        params.append("file", file);
        params.append("companyKey", this.urlData.companyKey);
        params.append("alias", "appoint");
        this._http({url: '/jop-web/file/upload'}, params).then(res => {
          if (res.data.code == 0) {
            this.inputDiv.photo.push(res.data.data.url);
            this.inputDiv.content = `${this.getInputDivContent()}<br/><img style="min-width:100%" src="${
              res.data.data.url
            }" alt="图片">`;
          } else {
            this.$toast({
              message: '上传失败！',
              duration: 1000
            })
          }
        })
      }
    },
    getInputDivContent() {
      let inputDiv = document.getElementById("textarea");
      return inputDiv.innerHTML;
    }
  },
  destroyed() {
    this.clearTimerMethods();
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  // height: calc(100vh - 75px);
  height: calc(100vh - 30px);
  overflow: auto;
  -webkit-overflow-scrolling: auto;
  .appoint-show {
    background-color: white;
    padding: 6px 10px;
    font-size: 14px;
  }
  .appoint-input {
    width: 100%;
    margin-top: 15px;
    background-color: white;
    .title {
      font-size: 14px;
      font-weight: bold;
      padding: 12px 0 5px 12px;
    }
    .content-header {
      width: 90px;
      text-align: right;
      margin-top: 10px;
      color: #333333;
      font-size: 14px;
    }
    .login-list-item {
      width: 100%;
      display: flex;
      align-items: center;
      .header {
        font-size: 14px;
        width: 90px;
        text-align: right;
        margin-top: 10px;
        color: #333333;
      }
      .body {
        width: calc(100% - 100px);
        margin-top: 10px;
        font-size: 14px;
        height: 38px;
        line-height: 20px;
        display: flex;
        align-items: center;
        .shop-name-appoint {
          padding-left: 8px;
          font-size: 14px;
          color: #999999;
        }
      }
      .input {
        background-color: white;
        border: 1px solid #cccccc;
        border-radius: 2.5px;
        height: 38px;
        line-height: 20px;
        font-size: 14px;
      }
      .disabled-item {
        background-color: #dddddd;
      }
      .input-textarea {
        width: calc(100% - 20px);
        height: 105px;
        background-color: white;
        border: 1px solid #cccccc;
        border-radius: 2.5px;
        margin: 10px auto 0px auto;
        text-align: center;
        .textarea {
          width: calc(100% - 20px);
          height: 110px;
          font-size: 14px;
          margin: 7.5px auto;
          border-bottom: 1px solid #cccccc;
          text-align: left;
          overflow: auto;
          -webkit-overflow-scrolling: auto;
          border: 0;
          outline: none;
          img {
            width: 50px;
          }
        }
        .upload {
          font-size: 14px;
          position: relative;
          .icon {
            font-size: 17.5px;
            padding-right: 6px;
            color: #1ca5fb;
          }
          #file {
            position: absolute;
            left: 0;
            opacity: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
      .login-btn {
        width: calc(100% - 20px);
        margin: 60px auto 10px auto;
        height: 38px;
        line-height: 38px;
        text-align: center;
        color: white;
        font-size: 16px;
        border-radius: 2.5px;
        background-color: gray;
      }
      .validate-input {
        display: flex;
        .input-input {
          width: 140px;
          background-color: white;
          border-radius: 2.5px;
          border: 1px solid #cccccc;
          padding-left: 1px;
          height: 38px;
          line-height: 20px;
          font-size: 14px;
        }
        .input-click {
          flex-basis: 20%;
          flex-grow: 1;
          padding-left: 20px;
          div {
            color: white;
            border-radius: 2.5px;
            text-align: center;
            font-size: 14px;
            height: 38px;
            line-height: 38px;
            background-color: grey;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
