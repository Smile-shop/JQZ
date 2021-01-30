<template>
  <div class="player" @contextmenu.prevent>
    <div class="player-content">
      <div class="video-js">
        <video
          id="videoPlayer"
          class="video-js"
          :style="`width: ${options.width}`"
          :controls="options.controls"
          :poster="options.poster"
          :autoplay="options.autoplay"
          :preload="options.preload"
          :width="options.width"
          :height="options.height"
          disablepictureinpicture
          controlslist="nodownload noremoteplayback footbar"
        >
          <source :src="url" type="video/mp4" />
        </video>
        <div class="errorInfo" v-if="showError">
          <i class="el-icon-warning-outline"></i> 视频播放失败
        </div>
        <div class="close">
          <i class="el-icon-close" @click="$router.go(-1)"></i>
        </div>
      </div>
      <div class="player-content-title">{{ item.title }}</div>
      <div class="ul">
        <div class="ul-title">{{ item.category || '超级CRM' }}</div>
        <ul>
          <li
            :id="`ul-li-${index}`"
            @click="change(i)"
            v-for="(i, index) in videoList"
            :key="index"
            :class="acIndex===index ? 'acIndex' : ''"
          >
            <el-image :src="i.poster" class="img">
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <img src="@/assets/images/school-video/bg_default_video.png" alt />
                <!-- <i class="iconfont icon-tupianshibai"></i> -->
              </div>
            </el-image>
            <div class="info">
              <div class="info-title">{{ i.title }}</div>
              <div class="info-desc">{{ i.description }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getCategorylist, clickRecord, query } from '@/api/school-video';
import user from '@/utils/user';
@Component({
  components: {},
})
export default class Player extends Vue {
  player: any = null;
  options = {
    controls: true,
    autoplay: true,
    poster: '',
    preload: 'auto',
    width: '750px',
    height: '500px',
  };
  url: string = '';
  item: any = {};
  videoList: any[] = [];
  acIndex: number = 0;
  showError: boolean = false;
  left: string = '';
  mounted() {
    this.init();
  }
  beforeDestroy() {
    window.removeEventListener('resize', this.autoWidth);
  }
  autoWidth() {
    this.options.width = document.body.offsetWidth * 0.8 + 'px';
  }
  init() {
    const item: any = this.$route.query.item;
    if (item) {
      this.item = JSON.parse(decodeURI(item));
      this.options.poster = this.item.poster;
      this.url = this.item.videoUrl;
      this.getList(this.item.category);
    }
    this.autoWidth();
    window.addEventListener('resize', this.autoWidth);
    this.player = document.querySelector('#videoPlayer');
    this.player.onplay = () => {
      this.clickRecord();
      this.showError = false;
      // this.player.currentTime = '105'
    };
    this.player.ontimeupdate = () => {
      // console.log(this.player.currentTime)
    };
    this.player.onended = () => {
      // alert('音频播放完成');
    };
    this.player.onerror = () => {
      if (navigator.userAgent.indexOf('Firefox') > -1) {
        return false;
      }
      this.showError = true;
    };
  }
  async clickRecord() {
    await clickRecord({
      videoId: this.item.id,
      jopLoginName: user.serverUser.account.loginName,
    });
  }
  change(item?: any) {
    this.player.src = item.videoUrl;
    this.options.poster = item.poster;
    this.player.play();
    this.item.title = item.title;
    this.item.id = item.id;
    this.getIndex();
  }
  getIndex() {
    this.acIndex = this.videoList.findIndex(
      (item: any) => item.id === this.item.id
    );
    this.$nextTick(() => {
      const li: any = document.getElementById(`ul-li-${this.acIndex}`);
      li.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    });
  }
  async getList(category?: string) {
    const res = await query({
      pageSize: 10000,
      pageNum: 1,
      category: category || '超级CRM',
    });
    this.videoList = res.data.list;
    this.videoList.forEach((item: any) => {
      this.$set(item, 'poster', `${item.url}${item.filePath}/${item.cover}`);
      this.$set(
        item,
        'videoUrl',
        `${item.url}${item.filePath}/${item.fileName}`
      );
    });
    this.getIndex();
  }
}
</script>

<style lang="scss" scoped>
.player {
  text-align: center;
  &-content {
    width: 80%;
    display: inline-block;
    text-align: left;
    position: relative;
    margin-top: 20px;
    &-title {
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #303133;
      line-height: 33px;
      margin-top: 20px;
    }
    .errorInfo {
      position: absolute;
      top: 50%;
      color: #fff;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .video-js {
      width: 68%;
      height: 500px;
      background: #000;
      position: relative;
      .close {
        display: none;
        font-size: 28px;
        color: #fff;
        position: absolute;
        right: 7px;
        top: 1px;
        cursor: pointer;
        &:hover {
          display: block;
        }
      }
      &:focus {
        outline: none;
      }
      &:hover + .close {
        display: block;
      }
    }
    .ul {
      position: absolute;
      top: 0px;
      right: 0;
      padding-left: 24px;
      width: 32%;
      height: 500px;
      &-title {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 22px;
      }
      ul {
        overflow: auto;
        height: 478px;
        .acIndex {
          border-radius: 5px;
          background: #ecf5ff;
        }
        li {
          cursor: pointer;
          line-height: 30px;
          display: flex;
          padding: 3px;
          margin-top: 10px;
          &:hover {
            border-radius: 5px;
            background: #ecf5ff;
          }
          .img,
          img {
            width: 130px;
            height: 73.5px;
            border-radius: 5px;
            overflow: hidden;
          }
          .info {
            padding-left: 10px;
            flex: 1;
            &-title {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #303133;
              line-height: 20px;
              display: -webkit-box;
              overflow: hidden;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
            &-desc {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: #666;
              line-height: 17px;
              display: -webkit-box;
              overflow: hidden;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      }
    }
  }
}
</style>
