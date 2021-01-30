<template>
  <div class="inivate-code-content">
    <div class="title" :style="{ 'color': themeColor }">什么是邀请码 ?</div>
    <p class="content">邀请码即邀请好友进行注册的唯一编码，好友通过您的邀请码进行注册后将与您永久绑定关联，您除了邀请可获得积分外，好友后期积分增加您亦可获得相应比例的积分</p>
    <div class="column"></div>
    <div class="title" :style="{ 'color': themeColor }">邀请码怎么用 ?</div>
    <p class="content-1">1.好友关注本店公众号后进行注册会员时，提醒填写您的专属邀请码。</p>
    <div class="img"><img src="../../assets/yqm-pic-1.png" alt="phone"></div>
    <p class="content-1">2.点击右上角将注册链接分享给好友微信，好友注册成功将与您永久绑定。</p>
    <div class="img"><img src="../../assets/yqm-pic-2.png" alt="phone"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      themeColor: state => state.themeColor
    })
  }
}
</script>


<style lang="less" scoped>
.inivate-code-content {
  width: 100%;
  .title {
    font-size: 21px;
    font-weight: bold;
    text-align: center;
    background-color: white;
    padding-top: 8px;
  }
  .content {
    text-indent: 2em;
  }
  .content, .content-1 {
    padding: 12px 15px;
    font-size: 12px;
    color: #666666;
    background-color: white;
  }
  .column {
    height: 12px;
  }
  .img {
    text-align: center;
    background-color: white;
    img {
      width: 75%;
    }
  }
}
</style>

