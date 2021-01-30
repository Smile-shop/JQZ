<template>
  <div v-show="show" class="share-qr-root">
    <self-mask :is-fixed="show" @maskClick="$emit('update:show', false)">
      <div class="mask-content">
        <div class="content">
          <div class="notice">
            <p>温馨提示</p>
            <p class="text">请长按识别二维码并关注公众号后参与游戏</p>
          </div>
          <div class="qrcode">
            <slot>
              <img src="../layout/images/qrcode.png" alt="qr" />
            </slot>
          </div>
        </div>
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

<style lang="scss" scoped>
@import 'assets/rem.scss';
.share-qr-root {
  .mask-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      background: #fff;
      width: 80vw;
      text-align: center;
      border-radius: 0.3rem;
      .notice {
        color: #333;
        font-size: 1.21333rem;
        font-weight: 700;
        margin-top: 1rem;
        .text {
          font-size: 3.5vw;
          font-weight: normal;
          color: #666;
          padding: 0.8rem 0;
        }
      }
      .qrcode {
        img {
          width: 9.98667rem;
          height: 9.98667rem;
        }
      }
    }
  }
}
</style>
