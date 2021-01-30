<template>
  <div class="container">
    <div class="poup-mask" v-show="model"></div>
    <div class="poup-content" v-show="model">
      <div class="header">
        <div class="title">{{ title }}</div>
        <div class="close" @click="closeModel">
          <i class="vip-v3-iconfont">&#xe606;</i>
        </div>
      </div>

      <div class="body" v-if="type == 1">
        <div class="content" v-html="htmlDecodeByRegExp(data.content)"></div>
      </div>

      <div class="body" v-if="type == 2">
        <div>请出示条码给营业员扫描</div>
        <div class="barcode">
          <img id="barcode2">
        </div>
        <div>
          <img class="qr" :src="qrcodeImg" alt="二维码">
        </div>
      </div>

      <div class="body" v-if="type == 3">
        <div class="barcode qrcode-global">
          <img :id="`barcode_3`" class="barcode-img">
        </div>
        <div class="qrcode qrcode-global">
          <canvas id="canvas-qr"></canvas>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import QRious from 'qrious';
import '../../public/static/JsBarcode.all.js';
export default {
  components: {
  },
  props: {
    type: {
      type: Number,
      required: true
    },
    model: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    data: {
      type: Object
    },
    qrcodeImg: {
      type: String
    }
  },
  data() {
    return {
      qrcode: null
    }
  },
  computed: {
    img() {
      if (this.logoImg == '') {
        return require('../assets/no-upload.gif');
      } else {
        return this.logoImg;
      }
    }
  },
  mounted() {
  },
  methods: {
    showQrCode(data) {
      const params = {
        element: document.getElementById('canvas-qr'),
        value: data,
        size: 244
      }
      this.qrcode = new QRious(params);
    },
    showJsBarcode(id, data) {
      // 生成条形码
      JsBarcode(id, `${data}`, {
        format: "CODE128",
        displayValue: true,
        width: 2,
        height: 70,
        textPosition: "bottom",
        textAlign: "center",
        fontSize: 24
      });
    },
    closeModel() {
      this.$emit('close');
    },
    /*2.用正则表达式实现html解码*/
    htmlDecodeByRegExp: function(str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&amp;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "'");
      s = s.replace(/&quot;/g, '"');
      return s;
    },
  }
}
</script>


<style lang="less" scoped>
@containerWidth: 340px;
.container {
  width: 100%;
  .poup-mask, .poup-content {
    position: fixed;
    left: 0;
    width: 100vw;
  }
  .poup-mask {
    height: 100vh;
    top: 0;
    background-color: black;
    z-index: 5000;
    opacity: .5;
  }
  .poup-content {
    z-index: 5001;
    width: @containerWidth;
    left: calc((100vw - @containerWidth) / 2);
    top: 50px;
    .header {
      display: flex;
      background-color: #F5F5F5;
      height: 40px;
      line-height: 40px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      .title {
        font-size: 14px;
        font-weight: bold;
        flex-basis: 50%;
        flex-grow: 1;
        padding-left: 10px;
      }
      .close {
        width: 40px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .body {
      background-color: white;
      // height: 100%;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      padding-bottom: 15px;
      font-size: 14px;
      min-height: 60%;
      max-height: 100%;
      div {
        text-align: center;
        font-size: 14px;
        padding-top: 15px;
        .qr {
          width: 200px;
        }
        .barcode {
          text-align: center;
        }
      }
      .content {
        width: calc(100% - 20px);
        height: 300px;
        overflow: auto;
        -webkit-overflow-scrolling: auto;
        margin: 0 auto;
        text-align: left;
      }
      .qrcode {
        width: 100%;
        #qrcode_3 {
          margin: 10px auto;
          width: 260px;
          text-align: center;
        }
      }
    }
  }
}
</style>

