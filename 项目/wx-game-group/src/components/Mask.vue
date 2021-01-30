<template>
  <div ref="mask" class="mask" @click="$emit('maskClick')">
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    isFixed: Boolean
  },
  watch: {
    isFixed(newVal) {
      this.stopBodyScroll(newVal)
    }
  },
  methods: {
    stopBodyScroll(isFixed) {
      if (isFixed) {
        this.$refs.mask.addEventListener('touchmove', function(event) {
          event.preventDefault()
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/rem.scss';
.mask {
  z-index: 999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
