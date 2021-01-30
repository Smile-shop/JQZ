<template>
  <div class="mouse-and-cat-gif" id="canvas-content">
    <canvas id="canvas">Canvas画板</canvas>
  </div>
</template>

<script>
export default {
  props: ['frame'],
  data() {
    return {
      canvas: null,
      cxt: null,
      pic_index: 0,
      frameTimer: null
    }
  },
  watch: {
    frame(val) {
      this.init(val);
      if (this.frameTimer) {
        window.clearInterval(this.frameTimer);
        this.init(val);
      }
    }
  },
  computed: {
    contentInfo() {
      const homeDiv = document.querySelector('#canvas-content');
      return {
        w: homeDiv.offsetWidth,
        h: homeDiv.offsetHeight
      }
    }
  },
  mounted() {
    this.canvas = document.querySelector('#canvas');
    this.cxt = this.canvas.getContext('2d');
    this.init(this.frame);
  },
  methods: {
    init(frame) {
      this.pic_index = 0;
      // const frameTime = frame.length > 10 ? 20 : 200;
      // this.frameTimer = window.setInterval(() => {
      //   this.drawImg(frame);
      // }, frameTime);
    },
    drawImg(frame) {
      const img = frame[this.pic_index];
      this.cxt.clearRect(0, 0, this.contentInfo.w, this.contentInfo.h);
      this.canvas.width = this.contentInfo.w;
      this.canvas.height = (this.contentInfo.w * img.height) / img.width;
      this.cxt.drawImage(img, 0, 0, this.contentInfo.w, (this.contentInfo.w * img.height) / img.width);
      this.pic_index = this.pic_index >= (frame.length - 1) ? 0 : ++this.pic_index;
    }
  }
}
</script>

<style lang="scss" scoped>
  .mouse-and-cat-gif {
    width: 100%;
    height: 100%;
    > img {
      display: none;
    }
  }
</style>