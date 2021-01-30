<template>
  <div class="dialog">
    <div>到达<span style="color:#ea0315">{{ message }}</span>奖品线</div>
    <div class="small-info"></div>
  </div>
</template>
<script>
export default {
  name: "Dialog",
  data() {
    return {
      message: "",
      duration: 2000
    }
  },
  mounted() {
    setTimeout(() => {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    }, this.duration);
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 228px;
  right: 58px;
  z-index: 6001;
  width: 92px;
  height: 56px;
  border: solid 2px #ffba15;
  background: rgba(250, 250, 250, 0.85);
  border-radius: 50%;
  > div {
    text-align: center;
    font-size: 12px;
    padding: 12px 10px;
  }
  .small-info {
    padding: 0;
    width: 14px;
    height: 8.5px;
    background-color: #da0726;
    border: solid 1.5px #ffba15;
    opacity: 0.8;
    border-radius: 50%;
    margin: 4px 15px;
  }
}
</style>