<template>
  <base-layout
    :isShowFooter="false"
    :isShowHeaderLogin="false"
    title="注册"
  >
    <main
      id="login-register"
    >
      <form
        v-if="fieldAvailable"
      >
        <!-- 门店 -->
        <base-select
          v-if="fieldAvailable.branchShop.isShow === '1'"
          v-model="shop"
          :placeholder="fieldAvailable.branchShop.id"
          :required="fieldAvailable.branchShop.isWrite === '1'"
          icon="icon-mendian"
          @click="pickerShowHandle('shop')"
        >
        </base-select>
        <!-- 店员 -->
        <base-select
          v-if="fieldAvailable.saler.isShow === '1'"
          v-model="shopAssistant"
          :placeholder="fieldAvailable.saler.id"
          :required="fieldAvailable.saler.isWrite === '1'"
          icon="icon-06_huiyuanguanli"
          @click="pickerShowHandle('shopAssistant')"
        >
        </base-select>
        <!-- 手机号 -->
        <base-input
          v-if="fieldAvailable.phone.isShow === '1'"
          v-model="mobileNumber"
          :placeholder="fieldAvailable.phone.id"
          :required="fieldAvailable.phone.isWrite === '1'"
          type="text"
          icon="icon-shouji"
          class="mobileNumber"
        >
        </base-input>
        <!-- 姓名 -->
        <base-input
          v-if="fieldAvailable.name.isShow === '1'"
          v-model="name"
          :placeholder="fieldAvailable.name.id"
          :required="fieldAvailable.name.isWrite === '1'"
          type="text"
          icon="icon-06_huiyuanguanli"
        >
        </base-input>
        <!-- 身份证 -->
        <base-input
          v-if="fieldAvailable.idCard.isShow === '1'"
          v-model="IDCards"
          :placeholder="fieldAvailable.idCard.id"
          :required="fieldAvailable.idCard.isWrite === '1'"
          type="text"
          icon="icon-cardid"
        >
        </base-input>
        <!-- 性别 -->
        <base-select
          v-if="fieldAvailable.sex.isShow === '1'"
          v-model="gender"
          :placeholder="fieldAvailable.sex.id"
          :required="fieldAvailable.sex.isWrite === '1'"
          icon="icon-xingbie"
          @click="pickerShowHandle('gender')"
        >
        </base-select>
        <!-- 生日 -->
        <base-select
          v-if="fieldAvailable.birthDay.isShow === '1'"
          v-model="birthday"
          :placeholder="fieldAvailable.birthDay.id"
          :required="fieldAvailable.birthDay.isWrite === '1'"
          icon="icon-hunjia"
          type="date"
          @click="datePickerShowHandle('birthday')"
        >
        </base-select>
        <!-- 结婚日期 -->
        <base-select
          v-if="fieldAvailable.merryDay.isShow === '1'"
          v-model="weddingDay"
          :placeholder="fieldAvailable.merryDay.id"
          :required="fieldAvailable.merryDay.isWrite === '1'"
          icon="icon-hunjia"
          type="date"
          @click="datePickerShowHandle('weddingDay')"
        >
        </base-select>
        <!-- 省市 -->
        <base-select
          v-if="fieldAvailable.address.isShow === '1'"
          v-model="provinceCity"
          placeholder="省市"
          :required="fieldAvailable.address.isWrite === '1'"
          icon="icon-dingwei"
          @click="isShowAddressPicker = true"
        >
        </base-select>
        <!-- 街道 -->
        <base-input
          v-if="fieldAvailable.address.isShow === '1'"
          v-model="street"
          placeholder="街道"
          :required="fieldAvailable.address.isWrite === '1'"
          type="text"
          icon="icon-dingwei"
        >
        </base-input>
        <!-- 传真 -->
        <base-input
          v-if="fieldAvailable.fax.isShow === '1'"
          v-model="fax"
          :placeholder="fieldAvailable.fax.id"
          :required="fieldAvailable.fax.isWrite === '1'"
          type="text"
          icon="icon-chuanzhen"
        >
        </base-input>
        <!-- 邮件 -->
        <base-input
          v-if="fieldAvailable.eMail.isShow === '1'"
          v-model="email"
          :placeholder="fieldAvailable.eMail.id"
          :required="fieldAvailable.eMail.isWrite === '1'"
          type="text"
          icon="icon-youxiang"
        >
        </base-input>
        <!-- 学历 -->
        <base-input
          v-if="fieldAvailable.education.isShow === '1'"
          v-model="educationBackground"
          :placeholder="fieldAvailable.education.id"
          :required="fieldAvailable.education.isWrite === '1'"
          type="text"
          icon="icon-8xueli"
        >
        </base-input>
        <!-- 电话号码 -->
        <base-input
          v-if="fieldAvailable.tel.isShow === '1'"
          v-model="phoneNumber"
          :placeholder="fieldAvailable.tel.id"
          :required="fieldAvailable.tel.isWrite === '1'"
          type="text"
          icon="icon-group48"
        >
        </base-input>
        <!-- 品牌 -->
        <base-select
          v-if="fieldAvailable.brand.isShow === '1'"
          v-model="brand"
          :placeholder="fieldAvailable.brand.id"
          :required="fieldAvailable.brand.isWrite === '1'"
          type="text"
          icon="icon-zuanshi_o"
          @click="pickerShowHandle('brand')"
        >
        </base-select>
        <!-- 职业 -->
        <base-input
          v-if="fieldAvailable.work.isShow === '1'"
          v-model="job"
          :placeholder="fieldAvailable.work.id"
          :required="fieldAvailable.work.isWrite === '1'"
          type="text"
          icon="icon-zhiye"
        >
        </base-input>
        <!-- QQ -->
        <base-input
          v-if="fieldAvailable.qqNum.isShow === '1'"
          v-model="QQ"
          :placeholder="fieldAvailable.qqNum.id"
          :required="fieldAvailable.qqNum.isWrite === '1'"
          type="text"
          icon="icon-aui-icon-qq"
        >
        </base-input>
        <!-- 密码 -->
        <base-input
          v-if="fieldAvailable.cardPwd.isShow === '1'"
          v-model="password"
          :placeholder="fieldAvailable.cardPwd.id"
          :required="fieldAvailable.cardPwd.isWrite === '1'"
          :type="passwordInputType"
          icon="icon-mima1"
          class="password"
        >
          <i
            :class="{
              'switch-show-button': true,
              'iconfont': true,
              'icon-yanjing': this.passwordInputType === 'password',
              'icon-biyan': this.passwordInputType === 'text',
            }"
            @click="passwordTypeSwitch"
          >
          </i>
        </base-input>
        <!-- 确认密码 -->
        <base-input
          v-if="fieldAvailable.cardPwd.isShow === '1'"
          v-model="passwordConfirm"
          placeholder="请再次输入密码"
          :required="fieldAvailable.cardPwd.isWrite === '1'"
          :type="passwordInputType"
          icon="icon-mima1"
          class="password"
        >
          <i
            :class="{
              'switch-show-button': true,
              'iconfont': true,
              'icon-yanjing': this.passwordInputType === 'password',
              'icon-biyan': this.passwordInputType === 'text',
            }"
            @click="passwordTypeSwitch"
          >
          </i>
        </base-input>
        <base-input
          v-model="pictureCode"
          placeholder="图形验证码"
          :required="true"
          type="text"
          icon="icon-yanzhengma"
          class="picture-code"
        >
          <img
            style="-webkit-user-select: none;"
            :src="picVerificationCodeUrl"
            @click="randomNumber = Math.random()"
          >
        </base-input>
        <base-input
          v-model="messageCode"
          placeholder="短信验证码"
          :required="true"
          type="number"
          icon="icon-mima1"
          class="message-code"
        >
          <span
            v-if="canSendMessage"
            class="get-code"
            @click="verificationCodePhoneHandle"
          >
            获取验证码
          </span>
          <span
            v-else
            class="count-down"
          >
            {{phoneMessageInterval}}
          </span>
        </base-input>
        <button
          class="enter-button"
          @click.prevent="registerSubmit"
        >
          立即注册
        </button>
      </form>
      <Popup
        v-model="isShowSelect"
        position="bottom"
      >
        <picker
          :show-toolbar="pickerAPI['show-toolbar']"
          :columns="pickerAPI.columns"
          ref="picker"
          @confirm="selectConfirm"
          @cancel="isShowSelect = false"
        />
      </Popup>
      <popup
        v-model="isShowDatetimePicker"
        position="bottom"
      >
        <datetime-picker
          v-model="dayInit"
          type="date"
          :min-date="new Date('1/1/1900')"
          :max-date="new Date()"
          @confirm="dateTimePickerConfirm"
          @cancel="isShowDatetimePicker = false"
        />
      </popup>
      <popup
        v-model="isShowAddressPicker"
        position="bottom"
      >
        <vant-area
          :area-list="areaList"
          @confirm="addressPickerConfirm"
          @cancel="isShowAddressPicker = false"
        />
      </popup>
    </main>
  </base-layout>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import BaseLayout from '@/layouts/base-layout.vue';
import BaseInput from '@/components/base-input.vue';
import BaseSelect from '@/components/base-select.vue';
import {PasswordInputType} from './typings';
import {State, Getter, Action, Mutation, namespace} from 'vuex-class';
import {httpReq} from '@/utils/http-req';
import {Toast, Picker, Popup, DatetimePicker, Area} from 'vant';
import areaList from '@/assets/js/area';
import {getLocalStorage} from '@/utils/local-storage';

import {
  registerFieldReq,
  registerReq,
  shopAssistantReq,
  verificationCodeReqUrlPic,
  verificationCodePhoneReq,
} from '@/serves/login';

@Component({
  components: {
    BaseLayout,
    BaseInput,
    BaseSelect,
    Picker,
    Popup,
    DatetimePicker,
    vantArea: Area,
  },
})
export default class LoginRegister extends Vue {
  // 可用字段
  private fieldAvailable: any = null;
  // 分店名称
  private shopNames: any[] = [];
  // 品牌
  private brands: any[] = [];
  // 分店
  private shop: string = '';
  // 店员
  private shopAssistant: string = '';
  // 手机号
  private mobileNumber: string = '';
  // 姓名
  private name: string = '';
  // 身份证号码
  private IDCards: string = '';
  // 性别
  private gender: string = '';
  // 生日
  private birthday: string = '';
  // 结婚日期
  private weddingDay: string | number = '';
  // 日期初始化
  private dayInit: Date = new Date();
  // 省市区
  private provinceCity: string = '';
  // 街道
  private street: string = '';
  // 传真
  private fax: string = '';
  // 邮件
  private email: string = '';
  // 学历
  private educationBackground: string = '';
  // 电话
  private phoneNumber: string = '';
  // 品牌
  private brand: string = '';
  // 职业
  private job: string = '';
  // qq
  private QQ: string = '';
  // 密码
  private password: string = '';
  // 确认密码
  private passwordConfirm: string = '';
  // 密码输入框类型
  private passwordInputType: PasswordInputType = 'password';
  // 图形验证码
  private pictureCode: string = '';
  // 短信验证码
  private messageCode: string = '';
  // 选择器数据
  private pickerAPI: any = {
    'columns': [],
    'show-toolbar': true,
  };
  // 是否显示选择器
  private isShowSelect: boolean = false;
  // 当前显示的选择器Key
  private pickerKeyCurrent: any = '';
  // 当前显示的日期Key
  private pickerKeyDateCurrent: any = '';
  // 是否显示时间选择器
  private isShowDatetimePicker: boolean = false;
  // 是否显示地址选择器
  private isShowAddressPicker: boolean = false;
  // 城市信息列表
  private areaList = areaList;
  // 随机数
  private randomNumber: number = Math.random();
  // 短信间隔时间
  private phoneMessageInterval: number = 10;
  // 是否发送短信
  private canSendMessage: boolean = true;
  // 短信间隔时间定时器
  private phoneMessageIntervalTimer!: null | number;

  private mounted() {
    this.availableFieldSelect();
  }

  // 密码类型切换
  private passwordTypeSwitch(type: PasswordInputType) {
    this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
  }

  // 查询需要显示的注册字段
  private availableFieldSelect(): Promise<any> {
    interface RegistersItems {
      id: string;
      name: string;
      isShow: '0' | '1';
    }

    return new Promise((resolve, reject) => {
      const {wxUserInfo} = getLocalStorage();
      const body = {
        companyKey: wxUserInfo!.companyKey,
        openid: wxUserInfo!.openid,
      };

      registerFieldReq.requestInit.body = JSON.stringify(body);

      const httpRes = httpReq(registerFieldReq);
      httpRes.then(data => {
        const registers: RegistersItems[] = data.registers;
        const fieldAvailable: {[key: string]: RegistersItems} = {};

        this.shopNames = data.shopNames ? JSON.parse(data.shopNames) : [];
        this.brands = data.brands ? JSON.parse(data.brands) : [];

        registers.forEach((item, index) => {
          fieldAvailable[item.name] = item;
        });

        this.fieldAvailable = fieldAvailable;
        resolve(data);
      }).catch(reason => {
        reject(reason);
      });
    });
  }

  // 店员查询
  private shopAssistantSelect(): Promise<any> {
    return new Promise((resolve, reject) => {
      const {wxUserInfo} = getLocalStorage();

      const body = {
        companyKey: wxUserInfo!.companyKey,
        branchShop: this.shop,
      };

      shopAssistantReq.requestInit.body = JSON.stringify(body);

      const httpRes = httpReq(shopAssistantReq);
      httpRes.then(data => {
        resolve(JSON.parse(data.sales));
      }).catch(reason => {
        reject(reason);
      });
    });
  }

  // 控制显示选择器
  private pickerShowHandle(key: string) {
    this.pickerAPI.columns = [];
    let columns: any[] = [];

    // 设置当前选择的key
    this.pickerKeyCurrent = key;
    this.isShowSelect = true;

    switch (key) {
      case 'gender':
        columns = ['男', '女'];
        this.pickerAPI.columns = columns;
        break;
      case 'shop':
        columns = [];
        this.shopNames.forEach((value, index) => {
          columns.push(value.shopName);
        });
        this.pickerAPI.columns = columns;
        break;
      case 'brand':
        columns = [];
        this.brands.forEach((value, index) => {
          columns.push(value.brand);
        });
        this.pickerAPI.columns = columns;
        break;
      case 'shopAssistant':
        columns = [];
        this.shopAssistantSelect().then((value: any[]) => {
          value.forEach((item, index) => {
            columns.push(item.saler);
          });
          this.pickerAPI.columns = columns;
        });
        break;
    }
    this.pickerAPI.columns = columns;
  }

  // 图形验证码地址
  get picVerificationCodeUrl(): string {
    const url: URL = new URL(verificationCodeReqUrlPic);
    const {wxUserInfo} = getLocalStorage();
    url.searchParams.append('openid', wxUserInfo!.openid);

    return url.toString().concat('?', String(this.randomNumber));
  }

  // 控制显示时间选择器
  private datePickerShowHandle(key: string) {
    this.isShowDatetimePicker = true;
    this.pickerKeyDateCurrent = key;
  }

  // 提交注册
  private registerSubmit(): Promise<any> {
    return new Promise((resolve, reject) => {
      const inputPattern = this.inputPattern('normal');
      let isInputPatternSuccess = true;

      for (const [key, value] of Object.entries(inputPattern)) {
        if (!value!.isTrue) {
          isInputPatternSuccess = false;
          Toast(value!.errorMessage);
          reject(value!.errorMessage);
          break;
        }
      }

      if (isInputPatternSuccess) {
        const {wxUserInfo} = getLocalStorage();

        const body = {
          companyKey: wxUserInfo!.companyKey,
          openid: wxUserInfo!.openid,
          phone: this.mobileNumber, // 手机号
          memberNum: this.mobileNumber, // 会员编号。使用phone的值
          cardNum: this.mobileNumber, // 会员卡号。使用phone的值
          validateCode: this.pictureCode, // 图形验证码
          messageCode: this.messageCode, // 短信验证码
          cardPwd: this.password, // 密码
          cardPwd2: this.passwordConfirm, // 确认密码
          name: this.name, // 姓名
          sex: this.gender, // 男或女
          birthDay: this.birthday, // 生日
          idCard: this.IDCards, // 身份正号
          merryDay: this.weddingDay, // 结婚日期
          address: this.provinceCity.concat(this.street), // 地址
          eMail: this.email, // 邮箱
          tel: this.phoneNumber, // 电话
          fax: this.fax, // 传真
          work: this.job, // 职业
          education: this.educationBackground, // 学历
          qqNum: this.QQ, // qq
          branchShop: this.shop, // 门店
          saler: this.shopAssistant, // 店员
          brand: this.brand, // 品牌
        };

        registerReq.requestInit.body = JSON.stringify(body);

        const httpRes = httpReq(registerReq);
        httpRes.then(data => {
          resolve(JSON.parse(data.sales));
        }).catch(reason => {
          reject(reason);
        });
      }
    });
  }

  // 选择器确认
  private selectConfirm(value: string) {
    const key: any = this.pickerKeyCurrent;
    (this as any)[key] = value;
    this.isShowSelect = false;
  }

  // 时间选择器确认
  private dateTimePickerConfirm(value: Date) {
    const key: any = this.pickerKeyDateCurrent;
    (this as any)[key] = new Date(value).getTime();
    this.isShowDatetimePicker = false;
  }

  // 地址选择器确认
  private addressPickerConfirm(value: any[]) {
    let address = '';
    value.forEach((valueItems, index) => {
      address += valueItems.name;
    });

    this.provinceCity = address;
    this.isShowAddressPicker = false;
  }

  // 检测输入是否正确
  private inputPattern(loginType: 'normal' | 'verificationCode') {
    const mobileNumberRegExp = /^1[34578]\d{9}$/;

    const mobileNumber = {
      isTrue: mobileNumberRegExp.test(this.mobileNumber),
      errorMessage: '请输入正确的手机号码',
    };

    const cardNumber = {
      isTrue: this.mobileNumber !== '',
      errorMessage: '请输入卡号',
    };

    const password = {
      isTrue: this.mobileNumber !== '',
      errorMessage: '请输入密码',
    };

    const pictureCode = {
      isTrue: this.pictureCode !== '',
      errorMessage: '请输入图形验证码',
    };

    const messageCode = {
      isTrue: this.messageCode !== '',
      errorMessage: '请输入短信验证码',
    };

    switch (loginType) {
      case 'normal':
        return {
          mobileNumber,
          password,
          pictureCode,
        };
      case 'verificationCode':
        return {
          mobileNumber,
          pictureCode,
        };
    }
  }

  // 发送手机验证码
  private verificationCodePhoneHandle() {
    return new Promise((resolve, reject) => {
      const {wxUserInfo} = getLocalStorage();

      if (this.canSendMessage) {
        const {companyKey, openid} = wxUserInfo!;
        const {requestInit} = verificationCodePhoneReq;

        requestInit.body = JSON.stringify({
          companyKey,
          openid,
          phone: this.mobileNumber,
          validateCode: this.pictureCode,
          type: '2',
        });

        const inputPattern = this.inputPattern('verificationCode');
        let isInputPatternSuccess = true;

        for (const [key, value] of Object.entries(inputPattern)) {
          if (!value!.isTrue) {
            isInputPatternSuccess = false;
            Toast(value!.errorMessage);
            reject(value!.errorMessage);
            break;
          }
        }

        if (isInputPatternSuccess) {
          this.canSendMessage = false;
          this.phoneMessageIntervalTimer = setInterval(() => {
            if (this.phoneMessageInterval > 0) {
              this.phoneMessageInterval--;
            } else {
              this.canSendMessage = true;
              this.phoneMessageInterval = 10;
              clearInterval(this.phoneMessageIntervalTimer as number);
            }
          }, 1000);

          const httpRes = httpReq(verificationCodePhoneReq);
          httpRes.then(data => {
            Toast('发送成功,请注意查收');
            resolve(data);
          }).catch(reason => {
            Toast(reason);
            reject(reason);
          });
        }
      }
    });
  }
}
</script>

<style lang="scss" scoped>
#login-register {
  & > form {
    display: grid;
    grid-row-gap: 1.3rem;
    grid-auto-flow: row;
    grid-auto-rows: 5.5rem;
    padding: 2.6rem 3.8rem;

    & > .password {
      & .switch-show-button {
        font-size: 2.5rem;
        color: #999999;
      }
    }

    & > .picture-code {
      & img {
        max-width: 11rem;
        height: auto;
      }
    }

    & > .message-code {
      & .get-code {
        color: var(--color-theme);
        font-size: 1.8rem;
      }

      & .count-down {
        color: #999999;
        font-size: 1.8rem;
      }
    }

    & > .enter-button {
      margin-top: 1rem;
      height: 5.5rem;
      border: none;
      border-radius: .3rem;
      background-color: var(--color-theme);
      font-size: 2.3rem;
      color: #fff;
    }
  }
}
</style>