<template>
  <base-layout
    :isShowFooter="true"
    :isShowHeader="true"
    :isShowHeaderLogin="false"
    title="个人信息"
  >
    <article
      v-if="fieldAvailable"
      id="user-info"
    >
      <ul>
        <li>
          <label>
            头像
          </label>
          <img
            :src="headPortrait"
            alt="头像"
          >
        </li>
        <li
          v-if="fieldAvailable.phone && fieldAvailable.phone.isShow === '1'"
        >
          <label>
            手机号
          </label>
          <input
            v-model="userInfo.phone"
            readonly
            type="text"
          >
        </li>
        <li
          v-if="fieldAvailable.branchShop && fieldAvailable.branchShop.isShow === '1'"
          @click="pickerShowHandle('shop')"
        >
          <label>
            分店
          </label>
          <input
            v-model="userInfo.branchShop"
            type="text"
            placeholder="请选择分店"
            readonly
          >
          <i class="iconfont icon-you"></i>
        </li>
        <li
          v-if="fieldAvailable.saler && fieldAvailable.saler.isShow === '1'"
          @click="pickerShowHandle('shopAssistant')"
        >
          <label>
            店员
          </label>
          <input
            v-model="userInfo.saler"
            type="text"
            placeholder="请选择店员"
            readonly
          >
          <i class="iconfont icon-you"></i>
        </li>
        <li
          v-if="fieldAvailable.brand && fieldAvailable.brand.isShow === '1'"
          @click="pickerShowHandle('brand')"
        >
          <label>
            品牌
          </label>
          <input
            v-model="userInfo.brand"
            type="text"
            placeholder="请选择品牌"
            readonly
          >
          <i class="iconfont icon-you"></i>
        </li>
        <li
          v-if="fieldAvailable.name && fieldAvailable.name.isShow === '1'"
        >
          <label>
            姓名
          </label>
          <input
            v-model="userInfo.name"
            type="text"
            placeholder="请输入姓名"
          >
        </li>
        <li
          v-if="fieldAvailable.sex && fieldAvailable.sex.isShow === '1'"
          @click="pickerShowHandle('gender')"
        >
          <label>
            性别
          </label>
          <input
            v-model="userInfo.sex"
            type="text"
            placeholder="请选择性别"
            readonly
          >
          <i class="iconfont icon-you"></i>
        </li>
        <li
          v-if="fieldAvailable.birthDay && fieldAvailable.birthDay.isShow === '1'"
           @click="datePickerShowHandle('birthday')"
        >
          <label>
            生日
          </label>
          <input
            v-model="userInfo.birthDay"
            type="text"
            placeholder="请选择生日"
            readonly
          >
          <i class="iconfont icon-you"></i>
        </li>
        <li
          v-if="fieldAvailable.merryDay && fieldAvailable.merryDay.isShow === '1'"
          @click="datePickerShowHandle('weddingDay')"
        >
          <label>
            结婚日期
          </label>
          <input
            v-model="userInfo.merryDay"
            type="text"
            placeholder="请选择结婚日期"
            readonly
          >
          <i class="iconfont icon-you"></i>
        </li>
        <li
          v-if="fieldAvailable.tel && fieldAvailable.tel.isShow === '1'"
        >
          <label>
            电话
          </label>
          <input
            v-model="userInfo.tel"
            type="text"
            placeholder="请输入电话"
          >
        </li>
        <li
          v-if="fieldAvailable.eMail && fieldAvailable.eMail.isShow === '1'"
        >
          <label>
            邮箱
          </label>
          <input
            v-model="userInfo.eMail"
            type="email"
            placeholder="请输入邮箱"
          >
        </li>
        <li
          v-if="fieldAvailable.qqNum && fieldAvailable.qqNum.isShow === '1'"
        >
          <label>
            QQ
          </label>
          <input
            v-model="userInfo.qqNum"
            type="number"
            placeholder="请输入QQ"
          >
        </li>
        <li
          v-if="fieldAvailable.idCard && fieldAvailable.idCard.isShow === '1'"
        >
          <label>
            身份证
          </label>
          <input
            v-model="userInfo.idCard"
            type="text"
            placeholder="请输入身份证"
          >
        </li>
        <!-- <li>
          <label>
            省市
          </label>
          <input
            v-model="userInfo.address"
            type="text"
            placeholder="请选择区域"
          >
          <i class="iconfont icon-you"></i>
        </li> -->
        <li
          v-if="fieldAvailable.address && fieldAvailable.address.isShow === '1'"
        >
          <label>
            地址
          </label>
          <input
            v-model="userInfo.address"
            type="text"
            placeholder="请输入详细地址"
          >
        </li>
        <li
          v-if="fieldAvailable.fax && fieldAvailable.fax.isShow === '1'"
        >
          <label>
            传真
          </label>
          <input
            v-model="userInfo.fax"
            type="text"
            placeholder="请输入传真"
          >
        </li>
        <li
          v-if="fieldAvailable.education && fieldAvailable.education.isShow === '1'"
        >
          <label>
            学历
          </label>
          <input
            v-model="userInfo.education"
            type="text"
            placeholder="请输入学历"
          >
        </li>
        <li
          v-if="fieldAvailable.work && fieldAvailable.work.isShow === '1'"
        >
          <label>
            职业
          </label>
          <input
            v-model="userInfo.work"
            type="text"
            placeholder="请输入职业"
          >
        </li>
      </ul>
      <the-button-submit
        button-text="保存"
        @click="submitSave"
      />
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
    </article>
  </base-layout>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import BaseLayout from '@/layouts/base-layout.vue';
import TheButtonSubmit from '@/components/the-button-submit.vue';
import {getLocalStorage} from '@/utils/local-storage';
import {httpReq} from '@/utils/http-req';
import {Toast, Picker, Popup, DatetimePicker} from 'vant';
import {dateYMD} from '@/filters/format-date';
import {
  userInfoReq,
  userInfoCompleteReq,
} from '@/serves/user';

import {
  shopAssistantReq,
  registerFieldReq,
} from '@/serves/login';

@Component({
  components: {
    BaseLayout,
    TheButtonSubmit,
    Picker,
    Popup,
    DatetimePicker,
  },
  filters: {
    dateYMD,
  },
})
export default class UserInfo extends Vue {
  // 用户信息
  private userInfo: any = {};

  // 分店名称
  private shopNames: any[] = [];

  // 品牌
  private brands: any[] = [];

  // 选择器数据
  private pickerAPI: any = {
    'columns': [],
    'show-toolbar': true,
  };

  // 是否显示选择器
  private isShowSelect: boolean = false;

  // 当前显示的选择器Key
  private pickerKeyCurrent: any = '';

  // 是否显示时间选择器
  private isShowDatetimePicker: boolean = false;

  // 当前显示的日期Key
  private pickerKeyDateCurrent: any = '';

  // 日期初始化
  private dayInit: Date = new Date();

  // 可用字段
  private fieldAvailable: any = null;

  // 头像
  get headPortrait(): string {
    const localStorageData = getLocalStorage();
    const {wxUserInfo} = localStorageData;

    if (wxUserInfo) {
      return wxUserInfo.headerImg;
    } else {
      return '';
    }
  }

  private mounted() {
    this.userInfoSelect();
    this.availableFieldSelect();
  }

  // 控制显示时间选择器
  private datePickerShowHandle(key: string): void {
    this.isShowDatetimePicker = true;
    this.pickerKeyDateCurrent = key;
  }

  // 时间选择器确认
  private dateTimePickerConfirm(value: Date): void {
    const key: any = this.pickerKeyDateCurrent;

    switch (key) {
      case 'birthday':
        this.$set(this.userInfo, 'birthDay', dateYMD(value));
        break;
      case 'weddingDay':
        this.$set(this.userInfo, 'merryDay', dateYMD(value));
        break;
      default:
        console.warn('没有匹配的key');
        break;
    }

    this.isShowDatetimePicker = false;
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
        this.shopNames = data.shopNames ? JSON.parse(data.shopNames) : [];
        this.brands = data.brands ? JSON.parse(data.brands) : [];
        resolve(data);
      }).catch(reason => {
        reject(reason);
      });
    });
  }

  // 选择器确认
  private selectConfirm(value: string): void {
    const key: any = this.pickerKeyCurrent;

    switch (key) {
      case 'shopAssistant':
        this.$set(this.userInfo, 'saler', value);
        break;
      case 'shop':
        this.$set(this.userInfo, 'branchShop', value);
        break;
      case 'brand':
        this.$set(this.userInfo, 'brand', value);
        break;
      case 'gender':
        this.$set(this.userInfo, 'sex', value);
        break;
      default:
        console.warn('没有匹配的key');
        break;
    }
    this.isShowSelect = false;
  }

  // 控制显示选择器
  private pickerShowHandle(key: string): void {
    this.pickerAPI.columns = [];
    let columns: any[] = [];

    // 设置当前选择的key
    this.pickerKeyCurrent = key;
    this.isShowSelect = true;

    switch (key) {
      // 性别
      case 'gender':
        columns = ['男', '女'];
        this.pickerAPI.columns = columns;
        break;
      // 门店
      case 'shop':
        columns = [];
        this.shopNames.forEach((value, index) => {
          columns.push(value.shopName);
        });
        this.pickerAPI.columns = columns;
        break;
      // 品牌
      case 'brand':
        columns = [];
        this.brands.forEach((value, index) => {
          columns.push(value.brand);
        });
        this.pickerAPI.columns = columns;
        break;
      // 店员
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

  // 查询用户信息
  private userInfoSelect(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const {wxUserInfo} = getLocalStorage();
      const body = {
        companyKey: wxUserInfo!.companyKey,
        openid: wxUserInfo!.openid,
      };

      userInfoReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(userInfoReq);
      Toast.loading('查询中...');
      httpRes.then(data => {
        const {ableScore, totalScore, cardNum, level} = data.wxMemberInfo;
        interface RegistersItems {
          id: string;
          name: string;
          isShow: '0' | '1';
        }

        const params: RegistersItems[] =  data.params;
        const fieldAvailable: {[key: string]: RegistersItems} = {};
        Toast.clear();
        this.userInfo = data.wxMemberInfo;
        this.userInfo.birthDay = dateYMD(this.userInfo.birthDay);
        this.userInfo.merryDay = dateYMD(this.userInfo.merryDay);

        params.forEach((item: any, index) => {
          fieldAvailable[JSON.parse(item).name] = JSON.parse(item);
        });

        this.fieldAvailable = fieldAvailable;
        window.localStorage.setItem('memberCard', cardNum);
        resolve(data);
      }).catch(reason => {
        Toast(reason);
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
        branchShop: this.userInfo.branchShop,
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

  // 提交保存
  private submitSave(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const {wxUserInfo} = getLocalStorage();
      const userInfo = this.userInfo;
      let body: any = {
        companyKey: wxUserInfo!.companyKey,
        openid: wxUserInfo!.openid,
      };

      const userInfoJSON = JSON.stringify(userInfo);

      body = Object.assign(JSON.parse(userInfoJSON), body);

      body.merryDay = new Date(body.merryDay).getTime();
      body.birthDay = new Date(body.birthDay).getTime();

      userInfoCompleteReq.requestInit.body = JSON.stringify(body);
      Toast.loading('正在提交...');
      const httpRes = httpReq(userInfoCompleteReq);
      httpRes.then(data => {
        Toast.success('修改成功');
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }
}
</script>

<style lang="scss" scoped>
#user-info {
  width: 100%;
  height: 100%;

  & > ul {
    display: flex;
    flex-direction: column;

    & > li {
      display: flex;
      justify-content: space-between;
      flex-basis: 5.6rem;
      border-bottom: 1px solid #f5f5f5;
      padding: 0 1.5rem;
      background-color: #fff;
      font-size: 1.8rem;

      &:first-of-type {
        flex-basis: 7.5rem;

        & > img {
          align-self: center;
          height: 5rem;
          width: 5rem;
        }
      }

      &:last-of-type {
        margin-bottom: none;
      }

      & > label {
        flex-basis: 9rem;
        align-self: center;
        margin-right: 1rem;
        color: #333333;
      }

      & > input {
        flex-grow: 1;
        border: none;
      }

      & > .iconfont {
        align-self: center;
      }
    }
  }
}
</style>