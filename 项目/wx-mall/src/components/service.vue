<template>
  <div
    v-if="isShow"
    tag="div"
    class="service"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @touchend="onTouchend"
    @click="onClick"
  >
    <i class="iconfont icon-weikefu"></i>
    客服
    <!-- <span
      class="close"
      @click="close"
      @touchmove="onCloseTouchMove"
    >
      <i class="iconfont icon-guanbi"></i>
    </span>-->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import {
  VUE_APP_BASE_URL,
  VUE_APP_IMG_BASE_URL
} from '@/config/global-var';
import {getLocalStorage} from '@/utils/local-storage';

@Component({})
export default class Service extends Vue {
  @State('servicesPermission')
  servicesPermission!: null | any[];

  isShow = false;

  mounted() {
    this.setIsShow();
  }

  setIsShow() {
    if (this.servicesPermission) {
      const { meta } = this.$route;
      const { servicesPermissionName } = meta;

      const servicesPermissionFilter = this.servicesPermission.find(
        (item: any, index: number) => {
          return item.name === servicesPermissionName;
        }
      );

      if (servicesPermissionFilter) {
        this.isShow = servicesPermissionFilter.enable == 1 ? true : false;
      } else {
        this.isShow = false;
      }
    } else {
      this.isShow = false;
    }
  }

  onTouchstart(event: TouchEvent) {
    event.stopPropagation();
  }

  onTouchmove(event: TouchEvent) {
    event.preventDefault();
    event.stopPropagation();

    const { changedTouches, target } = event;
    const divEl: HTMLDivElement = <HTMLDivElement> target;
    const divElRect = divEl.getBoundingClientRect();
    const {
      clientHeight,
      clientWidth,
    } = document.documentElement as HTMLElement;
    const { top, left, right, bottom, width, height } = divElRect;
    const { clientX, clientY } = changedTouches[0];

    const offsetTop = clientY - top;
    const offsetLeft = clientX - left;
    let moveTop = clientY - height / 2;
    let moveLeft = clientX - width / 2;

    if (moveTop < 20) {
      moveTop = 20;
    }

    if (moveTop > clientHeight - height - 20) {
      moveTop = clientHeight - height - 20;
    }

    if (moveLeft < 20) {
      moveLeft = 20;
    }

    if (moveLeft > clientWidth - width - 20) {
      moveLeft = clientWidth - width - 20;
    }

    divEl.style.top = `${moveTop}px`;
    divEl.style.left = `${moveLeft}px`;
    divEl.style.right = 'unset';
    divEl.style.bottom = 'unset';
  }

  close(event: MouseEvent) {
    event.stopPropagation();
    this.isShow = false;
  }

  onCloseTouchMove(event: MouseEvent) {
    event.stopPropagation();
  }

  onTouchend(event: TouchEvent) {
    event.stopPropagation();
  }

  onClick() {
    const { id: goodsId } = this.$route.params;
    const localStorageData = getLocalStorage();
    const {wxUserInfo} = localStorageData;
    if (wxUserInfo) {
      window.location.href = `${VUE_APP_BASE_URL}/wx-interface-web/wx/auth?companyKey=${wxUserInfo.companyKey}&page=wx_chat_system${goodsId ? `&goodsId=${goodsId}` : ''}`;
    }
    // this.$router.push({
    //   path: '/iframe',
    //   query: {
    //     type: 'service',
    //     goodsId,
    //   },
    // });
  }

  @Watch('$route')
  watchRouter(route) {
    this.setIsShow();
  }

  @Watch('servicesPermission')
  watchServicesPermission() {
    this.setIsShow();
  }
}
</script>

<style lang="scss" scoped>
.service {
  z-index: var(--zindex-fixed);
  position: fixed;
  display: flex;
  align-items: center;
  border-radius: 6vw;
  padding: 3vw 5vw;
  bottom: 20vw;
  right: 5vw;
  font-size: 3.2vw;
  color: #fff;
  background-color: var(--color-theme);

  > .iconfont {
    margin-right: 1.2vw;
    font-size: 6vw;
  }

  .close {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    right: 0;
    top: -3vw;
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid var(--color-theme);
    height: 6vw;
    width: 6vw;

    > .iconfont {
      font-size: 2.5vw;
      color: var(--color-theme);
    }
  }
}
</style>


