<template>
  <div id="buy-form">
    <div class="step">
      <div class="step-item active">
        <div class="step-item-number">
          <i class="iconfont icon-checked"></i>
        </div>
        <span>
          购买活动
        </span>
      </div>
      <div class="step-item active">
        <div class="step-line"></div>
        <div class="step-item-number">
          2
        </div>
        <span>
          填写信息
        </span>
      </div>
      <div class="step-item">
        <div class="step-line"></div>
        <div class="step-item-number">
          3
        </div>
        <span>
          查看凭证
        </span>
      </div>
    </div>
    <div class="commodity">
      <img :src="home.imgUrl" alt="图片">
      <div class="props">
        <div class="name">
          {{home.title}}
        </div>
        <div class="detail">
          {{home.secondTitle}}
        </div>
        <div class="date-time">
          {{home.purchasedTime}}
        </div>
        <div class="price">
          实付：
          <span class="price-number">
            ￥{{home.goodsPrice}}
          </span>
        </div>
      </div>
    </div>
    <div class="form-container">
      <header>
        <i class="iconfont icon-xinxi"></i>
        填写信息
      </header>
      <form ref="formElement" @blur="scrollIntoView">
        <template
          v-for="(item, index) of form.formInputVoList"
          :key="index"
        >
          <!-- 手机 -->
          <template
            v-if="item.inputType == 1"
          >
            <div class="form-item">
              <label>
                <i v-if="item.isMust" class="iconfont icon-xinghao">
                </i>
                {{item.name}}
              </label>
              <input v-model.trim="item.value" type="number" :placeholder="item.tips">
            </div>
            <template
              v-if="home.isAuth == 1"
            >
              <div class="form-item" >
                <label>
                  <i class="iconfont icon-xinghao"></i>
                  图形验证码
                </label>
                <input v-model.trim="form.validateCode" type="text">
                <div @click="getImageVerificationCode" class="type">
                  <img :src="imageVerificationCodeUrl" alt="验证码">
                </div>
              </div>
              <div
                class="form-item"
              >
                <label>
                  <i class="iconfont icon-xinghao">
                  </i>
                  短信验证码
                </label>
                <input v-model.trim="form.messageCode" type="text">
                <div class="type">
                  <button
                    v-if="phoneMessage.canSend"
                    @click.prevent="getPhoneMessage"
                  >
                    获取验证码
                  </button>
                  <span
                    v-else
                  >
                    {{phoneMessage.countDown}}
                  </span>
                </div>
              </div>
            </template>
          </template>
          <!-- 门店 -->
          <div
            v-if="item.inputType == 2"
            @click="onShopSelect(item)"
            class="form-item"
          >
            <label>
              <i v-if="item.isMust" class="iconfont icon-xinghao">
              </i>
              {{item.name}}
            </label>
            <input v-model.trim="item.value2" readonly type="text" :placeholder="item.tips">
            <div class="type">
              <i class="iconfont icon-gengduo1"></i>
            </div>
          </div>
          <!-- 姓名 -->
          <div
            v-if="item.inputType == 3"
            class="form-item"
          >
            <label>
              <i v-if="item.isMust" class="iconfont icon-xinghao">
              </i>
              {{item.name}}
            </label>
            <input v-model.trim="item.value" type="text" :placeholder="item.tips">
          </div>
          <!-- 单行文本 -->
          <div
            v-if="item.inputType == 4"
            class="form-item"
          >
            <label>
              <i v-if="item.isMust" class="iconfont icon-xinghao">
              </i>
              {{item.name}}
            </label>
            <input v-model.trim="item.value" type="text" :placeholder="item.tips">
          </div>
          <!-- 身份证 -->
          <div
            v-if="item.inputType == 5"
            class="form-item"
          >
            <label>
              <i v-if="item.isMust" class="iconfont icon-xinghao">
              </i>
              {{item.name}}
            </label>
            <input v-model.trim="item.value" type="text" :placeholder="item.tips">
          </div>
          <div
            v-if="item.inputType == 6"
            @click="onSelect(item)"
            class="form-item"
          >
            <label>
              <i v-if="item.isMust" class="iconfont icon-xinghao">
              </i>
              {{item.name}}
            </label>
            <input v-model="item.value" readonly type="text" :placeholder="item.tips">
            <div class="type">
              <i class="iconfont icon-gengduo1"></i>
            </div>
          </div>
        </template>
        <div class="control">
          <button @click.prevent="onSubmit">
            填好啦～ 查看购买凭证
          </button>
        </div>
      </form>
    </div>
    <app-home-button/>
    <app-message-box
      :message="messageBox.message"
      v-model="messageBox.isShow"
      @affirm="messageBox.onAffirm"
    />
    <app-select-store
      :list="shops.list"
      :checkedValue="shops.checkedValue"
      :isShowDistance="isShowDistance"
      v-model:isShow="shops.isShow"
      @change="shops.onChange"
    />
    <app-select
      :list="select.list"
      :checkedValue="select.checkedValue"
      v-model:isShow="select.isShow"
      @change="select.onChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, h, render, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import AppSelectStore from '@/components/app-select-store.vue';
import AppMessageBox from '@/components/app-message-box.vue';
import AppHomeButton from '@/components/app-home-button.vue';
import AppSelect from '@/components/app-select.vue';
import { directRegist, getExchangeFormInfo, imageVerificationCode, shopinfo, sendPhoneMsg } from "@/api";
import { useStore } from 'vuex';
import appMessage from '@/utils/app-message';

export default defineComponent({
  components: {
    AppSelectStore,
    AppMessageBox,
    AppHomeButton,
    AppSelect,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const imageVerificationCodeUrl = ref('');
    const query = computed(() => store.state.query);
    const home = computed(() => store.state.home);
    const user = computed(() => store.state.user);
    const phoneMessage = reactive({
      canSend: true,
      countDown: 60,
    });
    const form = reactive<{
      formInputVoList: any[];
      messageCode: string;
      validateCode: string;
    }>({
      formInputVoList: [],
      messageCode: '',
      validateCode: '',
    })
    // 门店信息
    const shops = reactive<{
      onChange: ((value: string) => any);
      list: any[];
      isShow: boolean;
      checkedValue: string;
    }>({
      onChange: () => null,
      isShow: false,
      checkedValue: '',
      list: [],
    });
    // 是否显示距离
    const isShowDistance = ref(false);
    // 选项列表
    const select = reactive<{
      onChange: ((value: string) => any);
      list: any[];
      isShow: boolean;
      checkedValue: string;
    }>({
      onChange: () => null,
      isShow: false,
      checkedValue: '',
      list: [],
    })
    // 对话框
    const messageBox = reactive<{
      onAffirm: ((value: string) => any);
      message: string;
      isShow: boolean;
    }>({
      onAffirm: () => null,
      message: '确定提交吗',
      isShow: false,
    })

    // 验证
    function validate() {
      console.log(form.formInputVoList)
      for (const item of form.formInputVoList) {
        const { isMust, value, inputType, name } = item;
        if (isMust) {
          if (value == '') {
            appMessage(`请填写${name}`);
            return false;
          }

          switch (inputType) {
            // 手机
            case '1':
              if (/^1\d{10}$/.test(value) == false) {
                appMessage(`请填写正确的${name}`);
                return false;
              }
              break;
            // 姓名
            case '3':
              if (/^\D+$/.test(value) == false) {
                appMessage(`请填写正确的${name}`);
                return false;
              }
              break;
            // 身份证
            case '5':
              if (/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) == false) {
                appMessage(`请填写正确的${name}`);
                return false;
              }
              break;
            default:
              break;
          }
        }
      }

      if (home.value.isAuth == 1) {
        if (form.messageCode == '') {
          appMessage(`请填写短信验证码`);
          return false;
        }

        if (form.validateCode == '') {
          appMessage(`请填写图形验证码`);
          return false;
        }
      }

      return true;
    }

    // 提交
    async function submit() {
      const body = form;

      try {
        const res = await directRegist(body);
        router.push({
          path: '/verification'
        });
      } catch (error) {
        console.warn(error);
      }
    }

    // 提交
    async function onSubmit() {
      if (validate()) {
        messageBox.message = '确定要提交吗';
        messageBox.isShow = true;
        messageBox.onAffirm = submit;
      }
    }

    // 选择器
    function onSelect(item: any) {
      select.list = item.valueList;
      select.isShow = true;
      select.checkedValue = item.value;
      select.onChange = (value: string) => {
        item.value = value;
      }
    }

    // 获取门店信息
    async function getShops(location: any = {}) {
      const body = {
        ...location
      };

      try {
        const res = await shopinfo(body);
        res.forEach((value: any) => {
          const {
            distant
          } = value;

          if (distant) {
            if (distant > 1000) {
              value.distant = `${(distant / 1000).toFixed(1)}公里`;
            } else {
              value.distant = `${distant.toFixed(1)}米`
            }
          } else {
            value.distant = '未知';
          }
        });

        shops.list = res;
      } catch (error) {
        console.warn(error);
      }
    }

    // 门店选择器
    function onShopSelect(item: any) {
      if (shops.list.length == 0) {
        window.wx.getLocation({
          type: 'wgs84',
          success(res: any) {
            const { latitude, longitude } = res;
            isShowDistance.value = true;
            getShops({
              latitude,
              longitude
            });
          },
          fail(err: any) {
            console.warn(err);
            isShowDistance.value = false;
            getShops();
          },
          cancel(err: any) {
            console.warn(err);
            isShowDistance.value = false;
            getShops();
          },
          complete() {
            shops.isShow = true;
            shops.checkedValue = item.value;
            shops.onChange = (value: any) => {
              item.value = value.shopName;
              item.value2 = value.nameOut;
            }
          }
        });
      } else {
        shops.isShow = true;
        shops.checkedValue = item.value;
        shops.onChange = (value: any) => {
          item.value = value.shopName;
          item.value2 = value.nameOut;
        }
      }
    }

    // 获取表单设置信息
    async function getFormSet() {
      const body = {};

      try {
        const res = await getExchangeFormInfo(body);
        if (res) {
          res.forEach((value: any) => {
            value.value = '';
            value.value2 = '';
          })
          form.formInputVoList = res;
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (error) {
        console.warn(error);
        return Promise.reject(error);
      }
    }

    // 获取图形验证码
    async function getImageVerificationCode() {
      const body = {};

      try {
        const res = await imageVerificationCode(body);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        imageVerificationCodeUrl.value = url;
      } catch (error) {
        console.warn(error);
      }
    }

    // 短信倒计时
    async function startPhoneMessageCountDown() {
      setTimeout(() => {
        if (phoneMessage.countDown <= 0) {
          phoneMessage.countDown = 60;
          phoneMessage.canSend = true;
        } else {
          phoneMessage.countDown--
          startPhoneMessageCountDown();
        }
      }, 1000);
    }

    // 获取短信
    async function getPhoneMessage() {
      const phone = form.formInputVoList.find((value) => {
        return value.inputType == '1'
      });

      if (phone.value == '') {
        appMessage('请输入手机号');
        return;
      }

      if (form.validateCode == '') {
        appMessage('请输入图形验证码');
        return;
      }

      const body = {
        companyKey: query.value.companyKey,
        openid: user.value.userId,
        phone: phone.value,
        validateCode: form.validateCode,
        type: '4',
      };

      try {
        phoneMessage.canSend = false;
        const res = await sendPhoneMsg(body);
        startPhoneMessageCountDown();
        appMessage('短信已发送');
      } catch (error) {
        phoneMessage.canSend = true;
        console.warn(error);
      }
    }

    // 兼容ios表单填写后无法归位的bug
    const formElement = ref<HTMLFormElement>();
    function inputAddScrollIntoView() {
      if (formElement.value) {
        const inputs = formElement.value.querySelectorAll('input');

        for (const item of inputs.values()) {
          item.onblur = (ev) => {
            item.scrollIntoView();
          }
        }
      }
    }

    async function init() {
      getImageVerificationCode();
      await getFormSet();
      inputAddScrollIntoView();
    }

    onMounted(() => {
      init();
    })

    return {
      onSubmit,
      onSelect,
      shops,
      select,
      messageBox,
      submit,
      form,
      home,
      getImageVerificationCode,
      imageVerificationCodeUrl,
      getPhoneMessage,
      onShopSelect,
      phoneMessage,
      formElement,
      isShowDistance,
    }
  }
})
</script>

<style lang="scss" scoped>
#buy-form {
  padding: 4vw;
  background: #F7F7F7;
  min-height: 100vh;

  > .step {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3vw;
    background: #FFFFFF;
    border-radius: 2vw;
    padding: 4vw 10vw;

    > .step-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 3.7vw;
      color: #9D9595;
      width: 16vw;

      &.active {
        color: #1D0800;

        > .step-item-number {
          background: #FC7125;
        }

        > .step-line {
          background: #FC7125;
        }
      }

      > .step-item-number {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 3.5vw;
        border-radius: 50%;
        width: 5.5vw;
        height: 5.5vw;
        background: #9D9595;
        color: #FFF;
        font-size: 3.2vw;
      }

      > .step-line {
        position: absolute;
        top: 2.6vw;
        right: 10vw;
        height: 2px;
        width: 23vw;
        background: #9D9595;
      }
    }
  }

  > .commodity {
    display: flex;
    background: #FFFFFF;
    margin-bottom: 3vw;
    border-radius: 2vw;
    padding: 2.7vw;

    > img {
      object-position: center center;
      object-fit: cover;
      margin-right: 2.7vw;
      width: 23.5vw;
      height: 23.5vw;
    }

    > .props {
      > .name {
        margin-bottom: 2.5vw;
        width: 60vw;
        font-size: 4.3vw;
        color: #1D0800;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      > .detail {
        width: 60vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.5;
        margin-bottom: 2.5vw;
        font-size: 3.2vw;
        color: #95A09F;
      }

      > .date-time {
        margin-bottom: 4vw;
        font-size: 2.9vw;
        color: #95A09F;
      }

      > .price {
        font-size: 3.7vw;
        color: #1D0800;

        > .price-number {
          font-size: 4.3vw;
          color: #FC7125;
        }
      }
    }
  }

  > .form-container {
    padding: 5.5vw 3vw;
    background: #FFFFFF;
    border-radius: 2vw;

    > header {
      display: flex;
      align-items: center;
      margin-bottom: 3vw;
      font-size: 3.7vw;
      color: #1D0800;

      > .iconfont {
        margin-right: 2vw;
        color: #FC7125;
        font-size: 5vw;
      }
    }

    > form {
      > .form-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3vw 0;
        border-bottom: 1px solid #EBEDF0;

        > label {
          width: 25vw;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          font-size: 3.7vw;
          margin-right: 3vw;
          color: #9D9595;
          padding-left: 4vw;

          > .iconfont {
            margin-left: -4vw;
            width: 4vw;
            font-size: 2.5vw;
            color: #FF0000;
          }
        }

        > input {
          outline: none;
          border: none;
          margin-right: 3vw;
          height: 8vw;
          min-width: 0;
          flex-grow: 1;
          font-size: 3.7vw;

          &::placeholder {
            color: #CBC7C7;
          }
        }

        > .type {
          flex-shrink: 0;
          font-size: 3.2vw;
          color: #9D9595;

          > button {
            background: none;
            border: none;
            white-space: normal;
            font-size: 3.2vw;
            color: #FC7125;
          }

          > .iconfont {
            color: #B3B8C1;
            font-size: 4vw;
          }

          > img {
            width: 28vw;
            height: 8vw;
          }
        }
      }

      > .control {
        padding: 0 5vw;
        display: flex;
        margin-top: 8vw;

        > button {
          flex-grow: 1;
          border: none;
          padding: 2.7vw;
          background: #FC7125;
          border-radius: 5.3vw;
          font-size: 3.7vw;
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>
