<template>
  <div class="join-success">
    <div class="wrapper">
      <header>
        <img src="~@/assets/img/login/join.png" alt="登录">
        <div class="describe">
          <div class="enterprise">
            <img src="https://www.baidu.com/img/flexible/logo/pc/result.png" alt="logo">
            您已成功加入金千枝平台
          </div>
          <p>
            点击此处<a href="#">下载[金千枝平台App]</a>使用
          </p>
        </div>
      </header>
      <main>
        <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3602624501,870193918&fm=26&gp=0.jpg" alt="二维码">
        <p>扫码下载金千枝平台App</p>
      </main>
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
.join-success {
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

header > .describe > p > a {
  text-decoration: none;
  color: #0045FF;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

main > img {
  margin-bottom: 20px;
  border: 10px solid #EBEEF5;
  border-radius: 5px;
  height: 130px;
  width: 130px;
}

main > p {
  color: #80869D;
  font-size: 14px;
}

</style>
