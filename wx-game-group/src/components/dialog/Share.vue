<template>
  <div v-show="show" class="shart-root">
    <self-mask :is-fixed="show" @maskClick="$emit('update:show', false)">
      <div class="share-wrap">
        <i/>
      </div>
    </self-mask>
  </div>
</template>

<script>
import SelfMask from '@/components/Mask'
export default {
  components: {
    SelfMask
  },
  props: {
    show: {
      type: Boolean
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/rem.scss';
.share-wrap {
  position: fixed;
  top: px2rem(34);
  right: px2rem(20);
  font-size: px2rem(28);
  color: #fff;
  overflow: hidden;
  i {
    float: right;
    width: px2rem(328);
    height: px2rem(222);
    background: url('../layout/images/share-bg.png') no-repeat center/100%;
  }
}
</style>
