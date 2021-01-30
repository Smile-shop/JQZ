<template>
  <aside class="menu-list">
    <div class="app-list">
      <router-link
        :to="item.path"
        class="app-list-item"
        v-for="item in appList"
        :key="item.appCode"
        @click.native="toAppPage(item)"
      >
        <i :class="['iconfont', item.icon]"></i>
        {{item.appName}}
      </router-link>
    </div>
    <div class="app-menu" v-if="menuList.length" v-show="isFold">
      <dl v-for="item in menuList" :key="item.appCode" >
        <div class="addSecond" v-if="!item.appHidden">
        <dt
          v-if="item.children && item.children.length > 0"
        >
          {{item.appName}}
        </dt>
        <router-link
          v-else
          tag="dd"
          :to="item.path"
        >
          {{item.appName}}
        </router-link>
        <router-link
          tag="dd"
          :to="isFreeMember === 1 && menuItem.appName === '优惠券设置' || isFreeMember === 1 && menuItem.appName === '连单券' || isFreeMember === 1 && menuItem.appName === '在线预约' ? 'null' : menuItem.path"
          v-for="menuItem in item.children"
          :key="menuItem.appCode"
        >
          {{menuItem.appName}}
        </router-link>
        </div>
        <div v-else class="addSecond">
          <router-link tag="dd" :to="item.path" >{{item.appName}}</router-link>
        </div>
      </dl>
    </div>
    <div v-if="menuList.length" class="control-icon" @click="isFold = !isFold">
      <i class="el-icon-caret-left" v-if="isFold"></i>
      <i class="el-icon-caret-right" v-else></i>
    </div>
  </aside>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import {State} from 'vuex-class';
import user from '@/utils/user';

@Component({
})
export default class MenuList extends Vue {
  @State('permission')
  permission: any;
  @State('moduleRouteMeta')
  moduleRouteMeta: any;

  private isFreeMember = null; // 是否免费身份标识
  private isFold: boolean = true;
  private isShowChildMenu: boolean = true;
  private appList = [];
  private moduleOtherName = [
    {name: '超级CRM', oString: 'superCRM'},
    {name: '超级MKT', oString: 'superMKT'},
    {name: '超级APP', oString: 'superAPP'},
    {name: '云展厅', oString: 'cloudShowroom'},
    {name: '系统设置', oString: 'systemSet'},
    {name: '裂变分销', oString: 'fission'},
    {name: '预存有礼', oString: 'prestore'},
  ]

  /* @Watch('isFold', {
    immediate: true
  })
  watchIsFold(val: boolean) {
    if (val) {
      document.body.style.paddingLeft = '160px';
    } else {
      document.body.style.paddingLeft = '0';
    }
  } */

  @Watch('moduleRouteMeta.moduleName')
  onModuleChanged(val: string, oldVal: string) {
    this.initAppList();
  }

  get menuList() {
    const currentPath = this.$route.path;
    const item: any = this.appList.find((p: any) => currentPath.includes(p.path));
    if (item) {
      return item.children;
    }
    return [];
  }

  mounted() {
    this.initAppList();
    this.isFreeMember = user.serverUser.isFreeMember;
  }

  private initAppList() {
    const currentModule: any = this.moduleOtherName.find(p => {
      return p.name === this.moduleRouteMeta.moduleName
    });
    if (currentModule) {
      this.appList = this.permission[currentModule.oString].children.filter((item: any) => {
        return !item.hidden;
      });
    }
  }

  // 菜单标题点击
  private onMenuTitleClick(item: any) {
    console.log(item);
  }

  // 前往页面
  private toAppPage(item: any) {
    const childrenRoute: any[] = [];
    const {children} = item;

    if (Array.isArray(children)) {
      children.forEach(item => {
        const {children} = item;

        if (item.path && !(Array.isArray(children) && children.length)) {
          childrenRoute.push(item);
        } else if (Array.isArray(children)) {
          children.forEach((item) => {
            childrenRoute.push(item);
          })
        }
      })

      for (const iterator of childrenRoute) {
        if (iterator.canAccess) {
          this.$router.push(iterator.path);

          return iterator.path;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-list {
  display: flex;
  flex-shrink: 0;
  background: #6699ff;
  position: relative;

  > .app-list {
    width: 100px;
    height: calc(100vh - 60px);
    overflow: auto;

    > .app-list-item {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100px;
      color: #ffffff;
      font-size: 14px;

      &.router-link-active {
        background-color: #5a7bc0;
      }

      > .iconfont {
        margin-bottom: 14px;
        font-size: 33px;
      }
    }
  }

  > .app-menu {
    width: 160px;
    background-color: #eaedf1;
    height: calc(100vh - 60px);
    overflow: auto;
    > dl {
      > .addSecond {
        > dt {
          padding: 15px 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        > dd {
          padding: 10px 20px 10px 25px;
          font-size: 14px;
          cursor: pointer;

          &.router-link-active {
            background-color: #fff;
          }
        }
      }
    }
  }

  > .control-icon {
    position: absolute;
    right: -16px;
    top: calc((100vh / 2) - 30px);
    width: 16px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #eaedf1;
    color: #6699ff;
    cursor: pointer;
  }
  > .control-icon:hover {
    opacity: .8;
  }

  .fission {
    padding: 10px 20px 10px 25px;
    font-size: 14px;
    cursor: pointer;
      &.router-link-active {
        background-color: #fff;
      }
  }
}
</style>
