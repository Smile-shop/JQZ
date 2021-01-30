<template>
  <header class="layout-main-header">
    <div class="left">
      <router-link to="/home" custom v-slot="{ navigate }">
        <h1
          @click="navigate"
        >
          <img src="~@/assets/img/logo/logo.png" alt="logo">
        </h1>
      </router-link>
    </div>
    <div class="middle">
      <ul class="menu">
        <router-link
          v-for="item of menus"
          :key="item.id"
          :to="item.webUrl"
          custom
          v-slot="{ navigate, isActive }"
        >
          <li
            :class="{
              'router-link-active': isActive
            }"
            @click="navigate"
          >
            {{item.name}}
          </li>
        </router-link>
      </ul>
    </div>
    <div class="right">
      <div @click.stop class="notification">
        <a-badge dot>
          <i class="iconfont icon-bell" @click="setIsShowNotification"></i>
        </a-badge>
        <div v-show="data.isShowNotification" class="notification-content">
          <header>
            <div
              class="notification"
              :class="{
                active: data.notificationType === 'notification'
              }"
              @click="switchNotification('notification')"
            >
              <a-badge dot>
                通知
              </a-badge>
            </div>
            <div
              class="announcement"
              :class="{
                active: data.notificationType === 'announcement'
              }"
              @click="switchNotification('announcement')"
            >
              <a-badge dot>
                系统公告
              </a-badge>
            </div>
          </header>
          <div class="content">
            <div v-show="data.notificationType === 'notification'" class="notification">
              <a-empty />
              <ul>
                <li>
                </li>
              </ul>
            </div>
            <div v-show="data.notificationType === 'announcement'" class="announcement">
              <a-empty />
              <ul>
                <li>
                </li>
              </ul>
            </div>
          </div>
          <footer>
            <div class="read">
              全部已读
            </div>
            <div class="more">
              加载更多
            </div>
          </footer>
        </div>
      </div>
      <div class="help-collapse" @click="setLayoutIsShowHelp">
        <i class="iconfont icon-question-circle"></i>
      </div>
      <a-dropdown class="dropdown">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <a-avatar size="small" icon="user" />
          <span>
            {{user.name}}
          </span>
          <i class="iconfont icon-down"></i>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <router-link to="/user/info">
                用户中心
              </router-link>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="logoutHandle">
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </header>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  computed,
  watch,
} from '@vue/composition-api';
import router from '@/router/index';
import store from '@/store/index';
import { logout } from '@/api/user/index';

export default defineComponent({
  setup() {
    const { state, commit } = store;
    const data = reactive({
      isShowNotification: false,
      notificationType: 'notification'
    });
    const menus = computed(() => {
      return state.menus;
    });
    const user = computed(() => {
      return state.user;
    });
    const layout = computed(() => {
      return state.layout;
    });

    // 切换通知
    function switchNotification(type: string) {
      data.notificationType = type;
    }

    // 注销登录
    async function logoutHandle() {
      const body = '';

      const res = await logout(body);
      localStorage.removeItem('token');
      router.push('/');
    }

    // 切换帮助栏折叠
    function setLayoutIsShowHelp() {
      commit('setLayoutIsShowHelp', !store.state.layout.isShowHelp);
    }

    // 切换帮助栏折叠
    function setIsShowNotification() {
      data.isShowNotification = !data.isShowNotification;
    }

    // document添加点击后隐藏通知的事件
    function documentAddHideDialogEvnet() {
      function hide() {
        data.isShowNotification = false;
      }

      document.documentElement.addEventListener('click', hide);
    }

    onMounted(() => {
      documentAddHideDialogEvnet();
    });

    return {
      data,
      logoutHandle,
      setLayoutIsShowHelp,
      menus,
      user,
      layout,
      setIsShowNotification,
      switchNotification,
    };
  },
});
</script>

<style lang="scss" scoped>
.layout-main-header {
  display: grid;
  grid-template-columns: 224px auto max-content;
  gap: 10px;
  background-color: #181F47;
  -webkit-user-select: none;

  > .left {
    display: grid;

    > h1 {
      display: grid;
      place-items: center;
      width: 224px;
      margin-bottom: 0;

      > img {
        height: 30px;
        width: auto;
      }
    }
  }

  > .middle {
    display: grid;

    > .menu {
      display: grid;
      grid-auto-flow: column;
      justify-content: start;
      gap: 30px;
      margin: 0;

      > li {
        display: grid;
        place-items: center;
        position: relative;
        cursor: pointer;
        color: #C2C8E7;

        &:hover {
          color: #FFFFFF;
        }

        &.router-link-active {
          color: #FFFFFF;

          &::after {
            position: absolute;
            display: block;
            left:  calc(50% - 15px);
            bottom: 13px;
            width: 30px;
            height: 2px;
            background-color: #FFF;
            content: '';
          }
        }
      }
    }
  }

  > .right {
    display: grid;
    grid-auto-flow: column;
    justify-content: end;
    align-items: center;
    gap: 30px;
    padding: 0 25px;

    > .notification {
      position: relative;

      > .notification-content {
        z-index: var(--zindex-dropdown);
        position: fixed;
        right: 60px;
        top: 70px;
        width: 250px;
        background-color: #FFF;
        box-shadow: 0px 2px 24px 0px rgba(200, 201, 204, 0.5);

        > header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 50px;
          color: #263446;

          > div {
            display: grid;
            place-items: center;
            cursor: pointer;
            border-bottom: 1px solid #EBEEF5;

            &.active {
              border-bottom: 1px solid #0045FF;
            }
          }
        }

        > .content {
          overflow-y: auto;
          height: 400px;

          .ant-empty {
            padding: 20px;
          }

          > div {
            > ul {
              > li {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 13px;
                color: #263446;
                cursor: pointer;
              }
            }
          }

        }

        > footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 50px;
          color: #263446;
          border-top: 1px solid #EBEEF5;

          > div {
            display: grid;
            place-items: center;
            cursor: pointer;

            &.more {
              color: #0045FF;
            }
          }
        }
      }
    }

    .iconfont {
      cursor: pointer;
      color: rgba(255, 255, 255, 0.65);
      font-size: 18px;

      &:hover {
        color: #FFF;
      }
    }

    > .dropdown {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.65);

      &:hover {
        color: #FFF;
      }

      > *:not(:last-child) {
        margin-right: 5px;
      }

      .iconfont {
        font-size: 14px;
      }
    }
  }
}
</style>
