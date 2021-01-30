<template>
  <main class="complaint-feedback-detail">
    <div class="complaint-feedback-detail-top">
      <div>{{ data.title }}</div>
      <div>{{ data.titleDesc }}</div>
    </div>
    <div class="complaint-feedback-detail-mid">
      <div class="complaint-feedback-detail-mid-input">
        <label for="name" class="complaint-feedback-detail-mid-input-l">姓名</label>
        <div class="complaint-feedback-detail-mid-input-r">
          <input
            id="name"
            maxlength="11"
            v-model="data.formData.userName"
            type="text"
            placeholder="您的姓名"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="complaint-feedback-detail-mid-input">
        <label for="phone" class="complaint-feedback-detail-mid-input-l">手机号码</label>
        <div class="complaint-feedback-detail-mid-input-r">
          <input
            id="phone"
            maxlength="11"
            type="text"
            placeholder="请填写您的手机号码"
            v-model="data.formData.phone"
            autocomplete="off"
          />
        </div>
      </div>
    </div>
    <div class="complaint-feedback-detail-bottom">
      <div class="complaint-feedback-detail-bottom-textarea">
        <textarea
          maxlength="200"
          placeholder="请描述您的意见"
          cols="30"
          v-model="data.formData.detail"
          rows="12"
        ></textarea>
        <span
          class="complaint-feedback-detail-bottom-textarea-text"
        >{{ data.formData.detail.length }} / 200</span>
      </div>
      <button class="complaint-feedback-detail-bottom-btn" @click="submit">提 交</button>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import message from '@/utils/app-message';
import { addFeedback } from '@/api';
import { useStore } from 'vuex';
export default defineComponent({
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      formData: {
        userName: '',
        phone: '',
        detail: '',
      },
      title: '欺诈/虚假',
      titleDesc: '商家信息欺诈',
    });
    onMounted(() => {
      data.titleDesc =
        route.query.type === '奖励未到账'
          ? '商家宣传的奖励未到账'
          : (route.query.type as string);
      data.title =
        data.titleDesc === '商家信息欺诈'
          ? '欺诈/虚假'
          : data.titleDesc === '商家宣传的奖励未到账'
          ? '奖励未到账'
          : data.titleDesc === '商品与描述不符'
          ? '商品'
          : '意见';
    });
    const submit = async () => {
      const reg = /^1[3456789]\d{9}$/;
      if (data.formData.phone && !reg.test(data.formData.phone)) {
        return message('请填写正确的手机号码');
      }
      if (data.formData.detail.length < 5) {
        return message('反馈详情至少输入5个字符');
      }
      const form = {
        companyKey: store.state.query.companyKey,
        distributionId: store.state.query.distributionId,
        nickName: store.state.user.nickname,
        type:
          data.titleDesc === '商家宣传的奖励未到账'
            ? '奖励未到账'
            : data.titleDesc,
      };
      const submitForm = Object.assign({}, form, data.formData);
      try {
        const res: any = await addFeedback(submitForm);
        router.push({
          path: '/complaint-success',
        });
      } catch (error) {
        console.log(error);
      }
    };
    return {
      data,
      submit,
    };
  },
});
</script>

<style lang="scss" scoped>
.complaint-feedback-detail {
  background: #fff;
  height: 100vh;
  padding: 0 4vw;
  &-top {
    margin-top: 8.3vw;
    text-align: center;
    div {
      &:nth-child(1) {
        font-size: 4.3vw;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1d0800;
        line-height: 8.9vw;
      }
      &:nth-child(2) {
        font-size: 3.7vw;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #9d9595;
        line-height: 5.3vw;
      }
    }
  }
  &-mid {
    margin-top: 6.7vw;
    &-input {
      display: flex;
      height: 11.7vw;
      align-items: center;
      border-bottom: 1px solid #ebedf0;
      &-l {
        width: 18vw;
        font-size: 3.7vw;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #9d9595;
      }
      &-r {
        flex: 1;
        padding-left: 4vw;
        input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 3.7vw;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #1d0800;
          line-height: 5.3vw;
        }
      }
    }
  }
  &-bottom {
    margin-top: 5.3vw;
    text-align: center;
    &-textarea {
      position: relative;
      textarea {
        background: #f7f7f7;
        border: none;
        outline: none;
        width: 100%;
        font-size: 3.7vw;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1d0800;
        padding: 3vw;
        resize: none;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
      }
      &-text {
        position: absolute;
        bottom: 1vw;
        right: 1vw;
        font-size: 2.7vw;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #9d9595;
        line-height: 5.3vw;
        background: #f7f7f7;
        border-radius: 2px;
        padding: 2px;
      }
    }
    &-btn {
      font-size: 3.7vw;
      margin-top: 13.3vw;
      width: 73.1vw;
      height: 10.7vw;
      background: #03c160;
      border-radius: 1.1vw;
      border: none;
      outline: none;
      color: #fff;
    }
  }
  textarea::-webkit-input-placeholder, input::-webkit-input-placeholder {
    color:#CBC7C7;
  }
  textarea::-webkit-input-placeholder, input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color:#CBC7C7;
  }
  textarea::-webkit-input-placeholder, input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color:#CBC7C7;
  }
  textarea::-webkit-input-placeholder, input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color:#CBC7C7;
  }
}
</style>
