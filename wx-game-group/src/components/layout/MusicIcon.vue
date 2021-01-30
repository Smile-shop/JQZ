<template>
  <div class="music-root">
    <audio ref="music" loop preload="auto">
      <source src="http://static.jqzjop.com/wx_game_group/music/game-music.mp3" type="audio/ogg" />
      <source src="http://static.jqzjop.com/wx_game_group/music/game-music.mp3" type="audio/mpeg" />
    </audio>
    <i class="open" :class="{'close': stop}" @click="turnon" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      stop: false
    }
  },
  mounted() {
    this.autoPlay()
  },
  methods: {
    autoPlay() {
      var audio = this.$refs.music

      if (window.WeixinJSBridge) {
        // eslint-disable-next-line
        WeixinJSBridge.invoke(
          'getNetworkType',
          {},
          function() {
            audio.play()
          },
          false
        )
      } else {
        document.addEventListener(
          'WeixinJSBridgeReady',
          function() {
            // eslint-disable-next-line
            WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
              audio.play()
            })
          },
          false
        )
      }
      audio.play()
      return false
    },
    turnon() {
      const audio = this.$refs.music
      this.stop = !this.stop
      if (this.stop) {
        sessionStorage.setItem('musicStop', true)
        audio.pause()
      } else {
        sessionStorage.setItem('musicStop', false)
        audio.play()
      }
    }
  },
  beforeDestroy() {
    const status = this.$refs.music
    if (status) {
      this.$refs.music.pause()
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes slide {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.music-root {
  transform: translate3d(0, 0, 0); // 开启3d加速
  position: absolute;
  top: 17vw;
  right: 4vw;
  z-index: 999;
  font-size: 0;
  i {
    display: inline-block;
    width: 7vw;
    height: 7vw;
    animation: slide 10s linear infinite;
  }
  i.open {
    background: url('./images/radio-open.png') no-repeat center/100%;
  }
  i.close {
    background: url('./images/radio-close.png') no-repeat center/100%;
    animation-play-state: paused;
  }
}
</style>
