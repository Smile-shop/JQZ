<template>
  <div v-show="model.show">
    <div class="mask">
      <img :src="img" alt="not-found">
      <div class="title">{{ model.msg }}</div>
      <!-- <div class="methods">请联系售后人员：0755-89819966</div> -->
      <div class="support">金千枝平台提供技术支持</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  computed: {
    img() {
      return require(`../assets/${ this.model.img }.png`);
    }
  }
}
</script>


<style lang="less" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  height: 100vh;
  width: 100vw;
  z-index: 3000;
  text-align: center;
  img {
    width: 335px;
    height: 131px;
    margin-top: 70px;
  }
  .title {
    font-size: 24px;
    padding-top: 38.5px;
    color: #333333;
  }
  .methods {
    font-size: 18px;
    color: #666666;
    padding-top: 16.5px;
  }
  .support {
    font-size: 12px;
    color: #999999;
    padding-top: 35px;
    // font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;
    // font-family: tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
    font-family: "Arial";
  }
}
</style>

