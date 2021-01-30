<template>
  <div class="loading" v-show="visible">
    <div class="loading-mask">
      <div class="loading-outter">
        <div class="loading-ring"></div>
        <div class="loading-text">{{ text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: true
    }
  },
  created() {}
}
</script>


<style lang="stylus" scoped>
.loading {
  transition: opacity 0.3s linear;
  width: 100%;
  height: 100%;
  position: fixed;
  display: block;
  text-align: center;
  top: 0;
  background-color: transparent; // 背景透明
  z-index: 10;

  &:after {
    content: '';
    display: inline-block;
  }
}

.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-outter {
  display: inline-block;
  vertical-align: middle;
  border-radius: 0.5rem;
  height: 16vw;
  width: 42vw;
  line-height: 11vw;
  padding-top: 5px;
}

.loading-ring {
  width: 9vw;
  height: 9vw;
  background-image: url('../../assets/images/loading.gif');
  background-size: cover;
  margin: 0 auto;
}

.loading-text {
  text-align: left;
  color: #fff;
  font-size: 3vw;
  font-family: sans-serif;
  line-height: 0.75rem;
  padding-left: 0.85rem;
  padding-right: 0.26rem;
  margin-top: 3px;
  text-align: center;
}

.loading-enter, .loading-leave-active {
  opacity: 0;
}
</style>
