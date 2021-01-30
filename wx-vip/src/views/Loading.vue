<template>
  <div class="loading">
    <div class="content">
      <div class="circle">
        <div class="line">
          <div></div>
          <div></div>
        </div>
        <div class="line">
          <div></div>
          <div></div>
        </div>
        <div class="line">
          <div></div>
          <div></div>
        </div>
        <div class="line">
          <div></div>
          <div></div>
        </div>
        <div class="line">
          <div></div>
          <div></div>
        </div>
        <div class="line">
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="mode"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.loading {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  .content {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    position: relative;
    .circle {
      position: absolute;
      left: calc((100vw - 60px) / 2);
      top: calc((100vh - 60px) / 2);
      width: 60px;
      height: 60px;
      // background-color: red;
      .line {
        width: 60px;
        height: 4px;
        position: absolute;
        top: 28px;
        left: 0;
        display: flex;
        div {
          display: inline-block;
          height: 4px;
          flex-basis: 50%;
          flex-grow: 1;
          background-color: #ebebeb;
          border-radius: 2px;
        }
      }
      .line:nth-child(2) {
        transform: rotate(30deg);
        -webkit-transform: rotate(30deg);
      }
      .line:nth-child(3) {
        transform: rotate(60deg);
        -webkit-transform: rotate(60deg);
      }
      .line:nth-child(4) {
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
      }
      .line:nth-child(5) {
        transform: rotate(120deg);
        -webkit-transform: rotate(120deg);
      }
      .line:nth-child(6) {
        transform: rotate(150deg);
        -webkit-transform: rotate(150deg);
      }



      .line:nth-child(1) {
        div:first-child {
          animation: load 1.2s linear 0s infinite;
          -webkit-animation: load 1.2s linear 0s infinite;
        }
        div:last-child {
          animation: load 1.2s linear 0.6s infinite;
          -webkit-animation: load 1.2s linear 0.6s infinite;
        }
      }
      .line:nth-child(2) {
        div:first-child {
          animation: load 1.2s linear 0.1s infinite;
          -webkit-animation: load 1.2s linear 0.1s infinite;
        }
        div:last-child {
          animation: load 1.2s linear 0.7s infinite;
          -webkit-animation: load 1.2s linear 0.7s infinite;
        }
      }
      .line:nth-child(3) {
        div:first-child {
          animation: load 1.2s linear 0.2s infinite;
          -webkit-animation: load 1.2s linear 0.2s infinite;
        }
        div:last-child {
          animation: load 1.2s linear 0.8s infinite;
          -webkit-animation: load 1.2s linear 0.8s infinite;
        }
      }
      .line:nth-child(4) {
        div:first-child {
          animation: load 1.2s linear 0.3s infinite;
          -webkit-animation: load 1.2s linear 0.3s infinite;
        }
        div:last-child {
          animation: load 1.2s linear 0.9s infinite;
          -webkit-animation: load 1.2s linear 0.9s infinite;
        }
      }
      .line:nth-child(5) {
        div:first-child {
          animation: load 1.2s linear 0.4s infinite;
          -webkit-animation: load 1.2s linear 0.4s infinite;
        }
        div:last-child {
          animation: load 1.2s linear 1.0s infinite;
          -webkit-animation: load 1.2s linear 1.0s infinite;
        }
      }
      .line:nth-child(6) {
        div:first-child {
          animation: load 1.2s linear 0.5s infinite;
          -webkit-animation: load 1.2s linear 0.5s infinite;
        }
        div:last-child {
          animation: load 1.2s linear 1.1s infinite;
          -webkit-animation: load 1.2s linear 1.1s infinite;
        }
      }
    }
    .mode {
      position: absolute;
      left: calc((100vw - 30px) / 2);
      top: calc((100vh - 30px) / 2);
      width: 30px;
      height: 30px;
      border-radius: 15px;
      background-color: #ffffff;
    }
  }
}
@keyframes load {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes load {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>


