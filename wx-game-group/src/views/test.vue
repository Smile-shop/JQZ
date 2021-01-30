<template>
  <section>
    <!-- <div class="camera">
      <div class="space">
        <div class="box">
          <div class="img" v-for="item in 100" :key="item">
          </div>
        </div>
      </div>
    </div> -->
    <canvas id="glcanvas" width="640" height="480">
      Your browser doesn't appear to support the HTML5 <code>&lt;canvas&gt;</code> element.
    </canvas>
  </section>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  mounted() {
    this.main();
  },
  methods: {
    main() {
      const canvas = document.querySelector("#glcanvas");
      // Initialize the GL context
      const gl = canvas.getContext("webgl");

      // Only continue if WebGL is available and working
      if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
      }

      // Set clear color to black, fully opaque
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      // Clear the color buffer with specified clear color
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }
}
</script>

<style lang="scss" scoped>
  #glcanvas {
    border: 1px solid red;
  }
  // .camera {
  //   width: 100vw;
  //   height: 100vh;
  //   perspective-origin: center center;
  //   perspective: 100px;
  // }
  // .space {
  //   width: 100%;
  //   height: 100%;
  //   transform-style: preserve-3d;
  // }
  // .box {
  //   width: 100vw;
  //   height: 100vh;
  //   margin: 0 auto;
  //   background: #069;
  //   // transform: translateX(50px) translateY(50px);
  //   transform: rotateX(25deg);
  //   transform-origin: center bottom;
  // }
  // .img {
  //   text-align: center;
  //   > img {
  //     transform: rotateX(335deg);
  //   }
  // }
</style>
