<template>
  <div class="QRLayer" v-show="showQR">
    <div class="QRcode-box">
      <div>
        <p class="title">
          你可将 “
          <span class="name">{{ ActiveName }}</span>” 通过以下方式发布出去
        </p> 
        <i class="close" @click="$emit('update:showQR', false)"></i>
      </div>
      <div class="QRcode-view">
        <div class="QRimg">
          <div class="QRcode">
            <canvas id="canvas-qr"></canvas>
            <p>
              <span>微信扫一扫</span>
              <a class="downloadQR" ref="downloadQR" href download>下载二维码</a>
            </p>
          </div>
        </div>
        <div class="copyLink">
          <div>
            <p style="font-size:18px;color:#333;">活动网址</p>
            <div class="Linkview">
              <input class="LinkVule" ref="Link" :value="LinkValue" />
              <span class="copyBtn" @click="copyText">复制</span>
            </div>
            <p style="font-size:13px;color:#ddd;">可将链接复制到公众号</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRious from 'qrious'
export default {
  watch: {
    showQR(show) {
      if (show) {
        const canvas = document.getElementById('canvas-qr')
        const params = {
          element: canvas,
          value: this.LinkValue,
          size: 219
        }
        const qRious = new QRious(params)
        const imgSrc = canvas.toDataURL('image/png')
        this.$refs.downloadQR.setAttribute('href', imgSrc)
      }
    }
  },
  props: {
    ActiveName: {
      type: String
    },
    showQR: {
      type: true
    },
    LinkValue: {
      type: String
    }
  },
  methods: {
    copyText() {
      const Link = this.$refs.Link
      Link.select()
      document.execCommand('Copy')
      this.$message({
        message: '恭喜你，这是一条成功消息',
        type: 'success'
      })
    }
  }
}
</script>

<style lang=scss scoped>
.QRLayer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.65);

  .close {
    position: absolute;
    top: 20px;
    right: 30px;
    width: 25px;
    height: 25px;
    background-image: url('~@/assets/images/super-crm/mine/close.png');
    background-repeat: no-repeat;
    background-size: 100%;
  }
  .QRcode-box {
    width: 768px;
    height: 396px;
    margin: 0 auto;
    background: #fff;
    margin-top: 171px;
    position: relative;
    padding-top: 30px;
    .title {
      font-size: 24px;
      text-align: center;
      margin: 30px 0px;
      .name {
        color: #6699ff;
      }
    }
    .QRcode-view {
      width: 100%;
      display: flex;

      & > div {
        flex: 1;
      }
      .QRimg {
        border-right: 1px solid #ddd;

        .QRcode {
          width: 219px;
          height: 219px;
          margin: 0 auto;
        }
        .downloadQR {
          color: #6699ff;
          float: right;
        }
      }
      .copyLink {
        display: flex;
        justify-content: center;
        align-items: center;

        .Linkview {
          width: 263px;
          height: 45px;
          border: 1px solid #ddd;
          margin: 10px;
          border-radius: 8px;
          font-size: 16px;
          background: rgba(0, 0, 0, 0);
          margin-left: -1px;
          display: flex;

          .LinkVule {
            height: 43px;
            width: 200px;
            vertical-align: middle;
            flex: 1;
            border: none;
            outline: none;
          }
          .copyBtn {
            display: inline-block;
            height: 45px;
            line-height: 45px;
            border-left: 1px solid #ddd;
            padding-left: 10px;
            width: 50px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
