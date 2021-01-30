<template>
  <div class="join-fail">
    <div class="wrapper">
      <header>
        <img src="~@/assets/img/login/join.png" alt="登录">
      </header>
      <main>
        <h3>
          操作失败
        </h3>
        <h4>
          您的手机号码未绑定该企业
        </h4>
        <p>
          您可联系企业管理员确认以下事宜：
        </p>
        <p>
          1. 是否已录入您的资料与手机号码？
        </p>
        <p>
          2. 是否录入了正确的手机号码？
        </p>
      </main>
      <footer>
        <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3602624501,870193918&fm=26&gp=0.jpg" alt="二维码">
        <p>扫码<a href="#">下载[金千枝平台App]</a>查看行业资讯</p>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
export default defineComponent({
  setup() {
    return {
    };
  },
});
</script>

<style lang="scss" scoped>
.join-fail {
  display: flex;
  justify-content: center;
  padding: 50px 20px;
}

.wrapper {
  flex-basis: 400px;
  max-width: 500px;
}

header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

header > img {
  margin-bottom: 30px;
  width: 163px;
  height: auto;
}

header > .describe {
  margin-bottom: 60px;
}

header > .describe > .enterprise {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #000;
}

header > .describe > .enterprise > img {
  height: auto;
  width: 50px;
  margin-right: 15px;
}

header > .describe > p {
  text-align: center;
  color: #80869D;
  font-size: 14px;
}

main {
  margin-bottom: 30px;
  text-align: center;
}

main > h3 {
  margin-bottom: 15px;
  font-size: 32px;
  color: #E1163F;
}

main > h4 {
  margin-bottom: 20px;
  font-size: 16px;
  color: #E1163F;
}

main > p {
  margin-bottom: 10px;
  font-size: 14px;
  color: #80869D;
}

footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

footer > img {
  margin-bottom: 20px;
  border: 10px solid #EBEEF5;
  border-radius: 5px;
  height: 130px;
  width: 130px;
}

footer > p {
  color: #80869D;
  font-size: 14px;
}

footer > p > a {
  text-decoration: none;
  color: #0045FF;
}
</style>
