<template>
  <page-wrapper>
    <a-form-model
      ref="formModel"
      :model="data.form"
      :rules="data.rules"
      style="width:600px"
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 14 }"
    >
      <a-form-model-item
        label="原密码"
        prop="oldPwd"
      >
        <a-input
          type="password"
          placeholder="请输入原密码"
          v-model="data.form.oldPwd"
        />
      </a-form-model-item>
      <a-form-model-item
        label="新密码"
        prop="newPwd"
      >
        <a-input
          type="password"
          placeholder="请输入新密码"
          v-model="data.form.newPwd"
        />
      </a-form-model-item>
      <a-form-model-item
        label="确认新密码"
        prop="confirmPwd"
      >
        <a-input
          type="password"
          placeholder="请再次输入新密码"
          v-model="data.form.confirmPwd"
        />
      </a-form-model-item>
      <a-form-model-item
        label="图形验证码"
        prop="captcha"
        class="verification-code"
      >
        <a-input
          placeholder="请输入图形验证码"
          v-model="data.form.captcha"
        />
        <img :src="data.verificationCode" alt="验证码" @click="getVerificationCode">
      </a-form-model-item>
      <a-form-model-item
        :wrapper-col="{ span: 24, offset: 6 }"
      >
        <a-button @click="submitForm" type="primary">
          提交
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref, onMounted } from '@vue/composition-api';
import { updateCurUserPwd, captcha } from '@/api/user';
import { message } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const data = reactive({
      form: {
        confirmPwd: '',
        newPwd: '',
        oldPwd: '',
        captcha: '',
      },
      rules: {
        oldPwd: [
          {
            required: true,
            message: '请输入该字段',
            trigger: 'blur',
          },
        ],
        newPwd: [
          {
            required: true,
            message: '请输入该字段',
            trigger: 'blur',
          },
        ],
        captcha: [
          {
            required: true,
            message: '请输入该字段',
            trigger: 'blur',
          },
        ],
        confirmPwd: [
          {
            required: true,
            message: '请输入该字段',
            trigger: 'blur',
          },
        ],
      },
      verificationCode: '',
    });
    const formModel = ref();

    // 提交表单
    async function submitForm() {
      await formModel.value.validate();
      const body = {
        ...data.form,
      };
      await updateCurUserPwd(body);
      formModel.value.resetFields();
      message.warning('密码修改成功');
    }

    // 获取验证码
    async function getVerificationCode() {
      const body = '';
      const res: Response = await captcha(body);
      const blob = await res.blob();
      const fileReader = new FileReader();
      const file = new File([blob], '二维码', {
        type: 'image/jpeg'
      })
      fileReader.onload = (res) => {
        data.verificationCode = fileReader.result as string;
      }
      fileReader.readAsDataURL(file);
    }

    onMounted(() => {
      getVerificationCode();
    })

    return {
      data,
      formModel,
      submitForm,
      getVerificationCode,
    };
  },
});
</script>

<style lang="scss" scoped>
.verification-code {
  ::v-deep .ant-form-item-children {
    display: grid;
    grid-template-columns: auto 150px;
    gap: 20px;

    > img {
      cursor: pointer;
      height: 32px;
      width: auto;
    }
  }
}
</style>
