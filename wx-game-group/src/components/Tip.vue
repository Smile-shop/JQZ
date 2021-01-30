
<template>
  <div class="fromTip" v-show="showFlag">
    <div class="tipBox">{{tiptext}}</div>
  </div>
</template>

<script>
export default {
  props: {
    tiptext: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
      clearTimeout(this.timer3)
      this.timer3 = setTimeout(() => {
        this.hide()
      }, 2000)
    },
    hide() {
      this.showFlag = false
    }
  }
}
</script>
<style lang='stylus' scoped>
.fromTip {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0);

  .tipBox {
    min-width: 50.7vw;
    height: 10.7vw;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 1.3vw;
    color: #fff;
    line-height: 10.7vw;
    font-size: 3.2vw;
    padding: 0 4vw;
  }
}
</style>