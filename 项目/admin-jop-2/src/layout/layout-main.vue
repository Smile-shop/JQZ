<template>
  <div id="layout-main">
    <layout-main-header/>
    <div class="bottom">
      <aside
        v-show="subMenus.length"
        :class="{
          left: true,
          collapsed
        }"
      >
        <ul
          ref="menuElement"
          class="menu"
          @click="openNavCollapse"
        >
          <!-- 一级菜单 -->
          <template
            v-for="item of subMenus"
          >
            <router-link
              v-if="item.node === 'N'"
              :key="item.id"
              :to="item.webUrl"
              custom
              v-slot="{ navigate, isActive }"
            >
              <li
                @click="navigate"
                :class="{
                  'router-link-active': isActive
                }"
                class="link"
              >
                <div class="left">
                  <i
                    :class="['iconfont', item.iconUrl || 'diff']"
                  >
                  </i>
                </div>
                <div class="middle">
                  {{item.name}}
                </div>
              </li>
            </router-link>
            <li
              v-else
              :key="item.id"
              :class="{
                'sub-menus-group': true,
                close: collapsed
              }"
            >
              <div class="title" @click="menuCollapse($event)">
                <div class="left">
                  <i
                    :class="['iconfont', item.iconUrl || 'diff']"
                  >
                  </i>
                </div>
                <div class="middle">
                  {{item.name}}
                </div>
                <div class="right">
                  <i class="iconfont icon-down open"></i>
                  <i class="iconfont icon-up close"></i>
                </div>
              </div>
              <ul
                :style="{
                  height: menuItemHeight(item)
                }"
              >
                <!-- 二级菜单 -->
                <template
                  v-for="item of item.subMenuList"
                >
                  <router-link
                    v-if="item.node === 'N'"
                    :key="item.id"
                    :to="item.webUrl"
                    custom
                    v-slot="{ navigate, isActive }"
                  >
                    <li
                      @click="navigate"
                      class="link"
                      :class="{
                        'router-link-active': isActive
                      }"
                    >
                      {{item.name}}
                    </li>
                  </router-link>
                  <li
                    v-else
                    :key="item.id"
                    class="sub-menus-group"
                  >
                    <div class="title">
                      {{item.name}}
                    </div>
                    <ul class="sub-menus-group">
                      <!-- 三级菜单 -->
                      <template
                        v-for="item of item.subMenuList"
                      >
                        <router-link
                          v-if="item.node === 'N'"
                          :key="item.id"
                          :to="item.webUrl"
                          custom
                          v-slot="{ navigate, isActive }"
                        >
                          <li
                            @click="navigate"
                            class="link"
                            :class="{
                              'router-link-active': isActive
                            }"
                          >
                            {{item.name}}
                          </li>
                        </router-link>
                      </template>
                    </ul>
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ul>
        <div class="collapse-button" @click="navCollapse">
          <i class="iconfont icon-right open"></i>
          <i class="iconfont icon-left close"></i>
        </div>
      </aside>
      <main class="middle">
        <div class="tabs">
          <div
            class="scroll-left button"
            @click="historyTabsScroll('left')"
          >
            <i class="iconfont icon-left"></i>
          </div>
          <ul
            ref="historyTabsElement"
          >
            <router-link
              to="/home"
              custom
              v-slot="{ navigate, isActive }"
            >
              <li
                @click="navigate"
                :class="{
                  'router-link-active': isActive
                }"
              >
                <div class="name">
                  首页
                </div>
              </li>
            </router-link>
            <router-link
              v-for="(item, index) of layout.historyPaths"
              :key="index"
              :to="item.path"
              custom
              v-slot="{ navigate, isActive }"
            >
              <li
                @click="navigate"
                :class="{
                  'router-link-active': isActive
                }"
              >
                <div class="name">
                  {{item.name}}
                </div>
                <div class="close" @click.stop="closeTab(item.path)">
                  <i class="iconfont icon-close"></i>
                </div>
              </li>
            </router-link>
          </ul>
          <div
            class="scroll-right button"
            @click="historyTabsScroll('right')"
          >
            <i class="iconfont icon-right"></i>
          </div>
          <div
            class="close-all button"
            @click="closeAllTabs"
          >
            <i class="iconfont icon-close"></i>
          </div>
        </div>
        <div class="content">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </main>
      <aside
        :class="{
          right: true,
          collapsed: layout.isShowHelp === false
        }"
      >
        <div class="collapse" @click="setLayoutIsShowHelp">
          <i class="iconfont icon-up"></i>
        </div>
        <header>
          <div class="left">
            <i class="iconfont icon-bulb"></i>
            帮助与服务
          </div>
          <div class="right">
            更多
          </div>
        </header>
        <div class="content">
          <router-view name="help"/>
        </div>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  computed,
  watch,
  onUpdated,

} from '@vue/composition-api';
import router from '@/router/index';
import store from '@/store/index';
import LayoutMainHeader from './components/layout-main-header.vue';

export default defineComponent({
  components: {
    LayoutMainHeader,
  },
  setup() {
    // 导航栏折叠
    const collapsed = ref(false);
    const historyTabsElement = ref<HTMLUListElement>();
    const menuElement = ref();
    const { commit } = store;
    const routeMeta = computed(() => router.currentRoute.meta);
    const subMenus = computed(() => {
      return store.state.subMenus;
    });
    const layout = computed(() => {
      return store.state.layout;
    });

    watch(() => store.state.layout.historyPaths, (value) => {
      const { path } = router.currentRoute;
      const index = value.findIndex((value) => {
        return value.path === path;
      })

      if (historyTabsElement.value) {
        historyTabsElement.value.scrollLeft = 130 * (index + 1);
      }
    })

    function menuItemHeight(menuItem: any) {
      let height = 0;

      function calcHeight(subMenus: any[]) {
        subMenus.forEach((value: any) => {
          height += 50;

          if (value.subMenuList.length) {
            calcHeight(value.subMenuList);
          }
        });
      }

      calcHeight(menuItem.subMenuList);

      return `${height}px`;
    }

    // 回退
    function back() {
      router.back();
    }

    // 菜单折叠
    function menuCollapse(event: MouseEvent) {
      const element = event.currentTarget as HTMLLIElement;
      const subMenusGroup = element.closest('.sub-menus-group');

      if (subMenusGroup) {
        subMenusGroup.classList.toggle('close');
      }
    }

    // 导航折叠
    function navCollapse() {
      collapsed.value = !collapsed.value;
    }

    // 切换帮助栏折叠
    function setLayoutIsShowHelp(collapsed: boolean) {
      commit('setLayoutIsShowHelp', !layout.value.isShowHelp);
    }

    // 打开导航栏折叠
    function openNavCollapse() {
      if (collapsed.value) {
        collapsed.value = false;
      }
    }

    // 关闭全部标签
    function closeAllTabs() {
      store.commit('setLayoutHistoryPaths', []);
      router.push('/home');
    }

    // 关闭标签
    function closeTab(path: string) {
      const { historyPaths } = store.state.layout;

      const index = historyPaths.findIndex((value) => {
        return value.path === path;
      })

      historyPaths.splice(index, 1);
      commit('setLayoutHistoryPaths', historyPaths);

      if (historyPaths[index]) {
        router.push(historyPaths[index].path);
      } else if (historyPaths[historyPaths.length - 1]) {
        router.push(historyPaths[historyPaths.length - 1].path);
      } else {
        router.push('/home');
      }
    }

    // 历史标签栏滚动
    function historyTabsScroll(direction: 'left' | 'right') {
      if (historyTabsElement.value) {
        const scrollLeft = historyTabsElement.value.scrollLeft;

        switch (direction) {
          case 'left':
            if (scrollLeft <= 130) {
              historyTabsElement.value.scrollLeft = 0;
            } else {
              const left = scrollLeft - 130;
              const isInteger = Number.isInteger(left / 130);
              if (isInteger) {
                historyTabsElement.value.scrollLeft = left;
              } else {
                historyTabsElement.value.scrollLeft = Number.parseInt(String(left / 130)) * 130;
              }
            }
            break;
          case 'right':
            historyTabsElement.value.scrollLeft = scrollLeft + 130;
            break;
          default:
            break;
        }
      }
    }

    onMounted(() => {
      // console.log(subMenus);
    });

    return {
      subMenus,
      layout,
      collapsed,
      back,
      menuCollapse,
      navCollapse,
      menuElement,
      openNavCollapse,
      routeMeta,
      setLayoutIsShowHelp,
      closeAllTabs,
      closeTab,
      historyTabsElement,
      historyTabsScroll,
      menuItemHeight,
    };
  },
});
</script>

<style lang="scss" scoped>
#layout-main {
  display: grid;
  grid-template-rows: 68px auto;
  gap: 15px;
  overflow-y: auto;
  height: 100vh;
  background-color: #F7F7FC;
  > .bottom {
    position: relative;
    display: flex;
    height: 100%;
    overflow: auto;

    > .left {
      background-color: #FFF;
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100vh - 68px - 15px);
      width: 225px;
      flex-shrink: 0;
      transition: width 0.5s;

      &.collapsed {
        width: 56px;
        overflow: hidden;

        > .collapse-button {
          left: 56px;

          > .close {
            display: none;
          }

          > .open {
            display: unset;
          }
        }
      }

      > .menu {
        width: 225px;
        user-select: none;

        .link {
          margin-right: 40px;
          border-top-right-radius: 25px;
          border-bottom-right-radius: 25px;
          overflow: hidden;

          &.router-link-active {
            background-color: #303A77;
            color: #FFFFFF;
          }
        }

        .sub-menus-group {
          > .title {
            > .right {
              .open {
                display: none;
              }

              .close {
                display: unset;
              }
            }
          }

          &.close {
            > .title {
              > .right {
                .close {
                  display: none;
                }

                .open {
                  display: unset;
                }
              }
            }

            > ul {
              height: 0 !important;
            }
          }
        }

        .link, .sub-menus-group > .title {
          display: flex;
          align-items: center;
          height: 50px;
          cursor: pointer;
          color: #373E4F;

          &:hover:not(.router-link-active) {
            color: #7880AD;
          }

          > .left {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            flex-basis: 56px;

            > .iconfont {
              font-size: 20px;
            }
          }

          > .middle {
            display: flex;
            align-items: center;
            flex-grow: 1;
          }

          > .right {
            display: flex;
            align-items: center;
            flex-basis: 40px;
            flex-shrink: 0;

            > .iconfont {
              font-size: 12px;
            }
          }
        }

        // 一级菜单
        > .sub-menus-group {
          overflow: hidden;

          // 二级菜单
          > ul {
            transition: height 0.4s;

            > .link {
              padding-left: 56px;
            }

            // 三级菜单
            > .sub-menus-group {
              > .title {
                padding-left: 56px;
                color: #7880AD;
              }

              // 四级菜单
              > .sub-menus-group {
                > .link {
                  padding-left: 72px;
                }
              }
            }
          }
        }
      }

      > .collapse-button {
        display: grid;
        grid-template-columns: 12px;
        place-items: center;
        position: absolute;
        left: 224px;
        top: 50%;
        height: 32px;
        cursor: pointer;
        background-color: #FFF;
        transition: left 0.5s;

        > .close {
          display: unset;
        }

        > .open {
          display: none;
        }

        > .iconfont {
          font-size: 12px;
        }
      }
    }

    > .middle {
      display: grid;
      grid-template-rows: 35px auto;
      gap: 15px;
      margin-right: 15px;
      margin-left: 15px;
      flex-grow: 1;
      overflow: hidden;

      > .tabs {
        display: grid;
        grid-template-columns:25px auto 25px 25px;
        gap: 10px;
        user-select: none;

        > .button {
          display: grid;
          place-items: center;
          cursor: pointer;
          background-color: #FFF;
          color: #7880AD;

          &:hover {
            color: #0045FF;
          }
        }

        > ul {
          display: grid;
          overflow: hidden;
          grid-template-columns: repeat(auto-fill, 120px);
          grid-auto-flow: column;
          gap: 10px;

          > li {
            display: grid;
            grid-template-columns: auto 30px;
            background-color: #FFF;
            padding-left: 10px;
            color: #7880AD;
            cursor: pointer;
            width: 110px;

            &.router-link-active {
              color: #0045FF;
            }

            > .name {
              align-self: center;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;

              &:hover {
                color: #0045FF;
              }
            }

            > .close {
              display: grid;
              place-items: center;
              font-size: 12px;
              color: #7880AD;

              &:hover {
                color: #0045FF;
              }
            }
          }
        }
      }

      > .content {
        position: relative;
        overflow-Y: scroll;
        background-color: #FFF;
      }
    }

    > .right {
      display: grid;
      grid-template-rows: 20px max-content auto;
      grid-template-columns: 225px;
      gap: 10px;
      width: 225px;
      flex-shrink: 0;
      background-color: #FFF;
      height: calc(100vh - 68px - 15px);
      overflow-y: auto;
      overflow-x: hidden;
      transition: all 0.5s;

      &.collapsed {
        height: 0;
        width: 0;
      }

      > .collapse {
        display: grid;
        place-items: center;
        cursor: pointer;

        > .iconfont {
          font-size: 12px;
        }
      }

      > header {
        display: grid;
        grid-auto-flow: column;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;

        > .left {
          color: #323233;
        }

        > .right {
          font-size: 12px;
          color: #969799;
        }
      }
    }
  }
}
</style>
