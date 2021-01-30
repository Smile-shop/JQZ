<template>
  <base-layout
    :isShowFooter="true"
    :isShowHeader="true"
    :isShowHeaderLogin="false"
    title="修改密码"
  >
    <form
      id="password-edit"
    >
      <base-input
        placeholder="旧密码"
        type="text"
        icon="icon-mima1"
        class="mobileNumber"
      >
      </base-input>
      <base-input
        placeholder="新密码"
        type="password"
        icon="icon-mima1"
        class="mobileNumber"
      >
      </base-input>
      <base-input
        placeholder="确认密码"
        type="password"
        icon="icon-mima1"
        class="mobileNumber"
      >
      </base-input>
      <button class="submit-button">确认修改</button>
    </form>
  </base-layout>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import BaseLayout from '@/layouts/base-layout.vue';
import BaseInput from '@/components/base-input.vue';

@Component({
  components: {
    BaseLayout,
    BaseInput,
  },
})
export default class UserEditPassword extends Vue {
}
</script>

<style lang="scss" scoped>
#password-edit {
  display: grid;
  grid-template-rows: repeat(3, 5.5rem);
  grid-row-gap: 1.3rem;
  align-content: start;
  padding: 2rem;

  & > .submit-button {
    margin-top: 1rem;
    height: 5.5rem;
    border: none;
    border-radius: .6rem;
    background-color: var(--color-theme);
    font-size: 2.3rem;
    color: #fff;
  }
}
</style>