<template>
  <section class="poup-content">
    <section class="content">
      <header class="poup-header">
        <slot name="header"></slot>
      </header>
      <section class="poup-body">
        <slot name="body"></slot>
      </section>
      <footer class="poup-footer">
        <slot name="footer">
          <div class="btn-left van-hairline--top  van-hairline--right" @click="btnClick('Cencal')">取消</div>
          <div class="btn-right van-hairline--top" @click="btnClick('Ok')">确定</div>
        </slot>
      </footer>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Poup extends Vue {
  private btnClick(type: string) {
    this.$emit(`poupBtn${type}`);
  }
}
</script>

<style lang="less" scoped>
.poup-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    background-color: #ffffff;
    width: 290px;
    border-radius: 5px;
    .poup-body {
      padding: 30px 20px;
      font-family: PingFang-SC-Regular;
      font-size: 15px;
      color: #333333;
    }
    .poup-footer {
      display: flex;
      .btn-left {
        flex-basis: 50%;
        text-align: center;
        font-family: PingFang-SC-Regular;
        font-size: 15px;
        color: #333333;
        height: 44px;
        line-height: 44px;
      }
      .btn-right {
        flex-basis: 50%;
        text-align: center;
        font-family: PingFang-SC-Regular;
        font-size: 15px;
        color: #79a5ff;
        height: 44px;
        line-height: 44px;
      }
    }
  }
}
</style>
