<template>
  <div class="music-btn" @click="play">
    <span :class="isPlaying ? 'playing' : 'close-icon'"></span>
    <audio ref="audio" id="Audio" loop="true" preload="metadata" controls="false">
      <source src="http://static.jqzjop.com/wx_game_group/music/mouse_cat.mp3" />
    </audio>
    <!-- <input type="file" id="input">
    <div @click="play">打卡</div> -->
  </div>
</template>

<script>
import axios from 'axios'
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          console.error('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
export default {
  data() {
    return {
      isPlaying: true,
      source: null,
      bufferLoader: null
    }
  },
  mounted() {
    // this.initPlayAudio();
    // this.init();
    // this.playWebAudio();
    // eslint-disable-next-line
    // wx.ready(() => {
    //   window.alert(12312331)
    //   this.playWebAudio();
    // })
    wx.config({ // eslint-disable-line
      debug: false,
      appId: 'data.appid',
      timestamp: 'data.timestamp',
      nonceStr: 'data.noncestr',
      signature: 'data.signature',
      jsApiList: []
    })
    wx.ready(function() { // eslint-disable-line
      // 在微信的ready中进行播放 不管成功配置与否 都会执行ready
      document.getElementById('Audio').setAttribute('src', 'http://static.jqzjop.com/wx_game_group/music/mouse_cat.mp3');
      document.getElementById('Audio').play();
    })
  },
  methods: {
    playWebAudio() {
      const context = new (window.AudioContext || window.webkitAudioContext);
      this.bufferLoader = new BufferLoader(context, ['/mouse_cat.mp3'], (bufferlist) => {
        this.source = context.createBufferSource();
        this.source.buffer = bufferlist[0];
        this.source.loop = true;
        this.source.connect(context.destination);
        this.isPlaying = true;
        this.source.start(0);
      });
      this.bufferLoader.context.onstatechange = () => {
        console.log(this.bufferLoader.context.state);
      }
      this.bufferLoader.load();
    },
    play() {
      // this.source.start(0);
      this.initPlayAudio();
    },
    init() {
      const that = this;
      const inputElement = document.getElementById("input");
      inputElement.addEventListener("change", handleFiles, false);
      function handleFiles() {
        const selectedFile = document.getElementById('input').files[0];
        console.log(selectedFile)
        var reader = new FileReader();
        reader.onload = function(evt) {
          console.log(evt.target.result);
          var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          that.source = audioCtx.createBufferSource();
          var audioData = evt.target.result;
          audioCtx.decodeAudioData(audioData, function(buffer) {
            that.source.buffer = buffer;

            that.source.connect(audioCtx.destination);
            that.source.loop = true;
          }, function(e){"Error with decoding audio data" + e.err});
        };
        reader.readAsArrayBuffer(selectedFile);
      }
    },
    playAudio() {
      if (this.isPlaying) {
        this.bufferLoader.context.suspend();
      } else {
        this.bufferLoader.context.resume();
      }
      this.isPlaying = !this.isPlaying;
    },
    // 扫码进入默认播放
    scanQrcode() {
      var audio = document.getElementById('Audio');
      audio.play();

      document.addEventListener(
        'WeixinJSBridgeReady',
        function() {
          audio.play()
        },
        false
      )
    },
    // 音乐播放
    initPlayAudio() {
      this.audio = this.$refs.audio;

      this.scanQrcode();

      if (this.audio) {
        if (!this.isPlaying) {
          this.$nextTick(() => {
            this.audio.play();
          })
          this.isPlaying = true;
        } else {
          this.audio.pause();
          this.isPlaying = false;
        }
      }
    }
  },
  destroyed() {
    // this.bufferLoader.context.close();
  }
}
</script>

<style lang="scss" scoped>
  .music-btn {
    width: 36px;
    height: 36px;
    text-align: center;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .5);
    color: #ffffff;
    span {
      display: inline-block;
      margin-top: 5.4px;
      width: 24px;
      height: 24px;
      background: url('~@/assets/images/radio-open.png') no-repeat;
      background-position: 50% 50%;
      background-size: 100% 100%;
      border-radius: 50%;
      overflow: hidden;
    }
    audio {
      display: none;
    }

    .playing {
      animation: turn 8s linear infinite;
    }

    .close-icon {
      background: url('~@/assets/images/radio-close.png') no-repeat;
      background-size: cover;
    }
  }
  @keyframes turn {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>