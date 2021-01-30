<template>
  <article
    class="base-layout"
  >
    <header
      v-if="isShowHeader"
    >
      <div
        v-if="isShowBack"
        class="back"
        @click="historyBack"
      >
        <i class="iconfont icon-fanhui"></i>
      </div>
      <div
        v-if="title"
        class="title"
        :class="{
          loginHidden: !isShowHeaderLogin
        }"
      >
        {{title}}
      </div>
      <div
        v-else
        class="search"
        :class="{
          loginHidden: !isShowHeaderLogin
        }"
      >
        <input
          type="text"
          placeholder="请输入关键字"
        >
        <i class="iconfont icon-sousuo"></i>
      </div>
    </header>
    <main
      :class="{
        headerHidden: !isShowHeader,
        headerFooter: !isShowFooter,
      }"
    >
      <slot></slot>
    </main>
    <footer
      v-if="isShowFooter"
    >
      <router-link
        to="/home"
        class="active"
      >
        <i class="iconfont icon-shouye1"></i>
        首页
      </router-link>
      <a
        href="javascript:;"
        @click="advancedQueryShowHandle"
      >
        <i class="iconfont icon-sousuo"></i>
        高级查询
      </a>
      <router-link
        to="/shopping-trolley"
      >
        <i class="iconfont icon-gouwuche"></i>
        购物车
        <badge
          count="1"
          top="0rem"
        />
      </router-link>
      <router-link
        to="/user"
      >
        <i class="iconfont icon-wode1"></i>
        用户中心
      </router-link>
    </footer>
    <the-advanced-query
      v-model="isShowAdvancedQuery"
    />
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import TheAdvancedQuery from '@/components/the-advanced-query.vue';
import Badge from '@/components/base-badge.vue';

@Component({
  components: {
    TheAdvancedQuery,
    Badge,
  },
})
export default class BaseLayout extends Vue {
  // 是否显示底部
  @Prop({
    required: false,
    default: true,
  })
  private isShowFooter!: boolean;

  // 是否显示头部
  @Prop({
    required: false,
    default: true,
  })
  private isShowHeader!: boolean;

  // 是否显示头部登录按钮
  @Prop({
    required: false,
    default: false,
  })
  private isShowHeaderLogin!: boolean;

  // 是否显示头部返回按钮
  @Prop({
    required: false,
    default: true,
  })
  private isShowBack!: boolean;

  // 页面标题
  @Prop({
    required: false,
  })
  private title!: string;

  // 是否显示高级查询
  private isShowAdvancedQuery: boolean = false;

  // 历史后退
  private historyBack() {
    this.$router.back();
  }

  // 高级查询显示处理
  private advancedQueryShowHandle() {
    this.isShowAdvancedQuery = !this.isShowAdvancedQuery;
  }
}
</script>

<style lang="scss" scoped>
.base-layout {
  display: grid;
  grid-template-rows: 5.5rem auto 5.5rem;
  grid-auto-flow: row;
  grid-auto-rows: 0;
  height: 100vh;
  width: 100vw;

  // 头部
  & > header {
    display: grid;
    grid-template-columns: 3rem auto 4.5rem;
    grid-auto-flow: column;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    padding: .9rem 1.5rem;
    background-color: #fff;

    // 返回
    & > .back {
      & > .iconfont {
        font-size: 2rem;
        color: var(--color-theme);
      }
    }

    // 标题
    & > .title {
      text-align: center;
      font-size: 2.3rem;
      color: #333333;
      padding-right: 3rem;

      &.loginHidden {
        grid-column: 2 / 4;
      }
    }

    // 搜错栏
    & > .search {
      position: relative;
      display: grid;
      grid-auto-flow: column;
      align-self: stretch;

      &.loginHidden {
        grid-column: 2 / 4;
      }

      & > input {
        background-color: #f5f5f5;
        border: none;
        border-radius: .6rem;
        padding: 0 1.2rem 0 .6rem;
        font-size: 1.5rem;
      }

      & > .iconfont {
        position: absolute;
        right: 1.1rem;
        align-self: center;
        font-size: 2.2rem;
        color: var(--color-theme);
      }
    }

    & > .login {
      justify-self: end;
      font-size: 1.8rem;
      color: var(--color-theme);
    }
  }

  & > main {
    display: grid;
    grid-template-rows: auto;
    background-color: #f5f5f5;
    overflow-y: scroll;
    overflow-x: hidden;

    &.headerHidden {
      grid-column: 1 / 2;
      grid-row: 1/ 3
    }

    &.headerFooter {
      grid-column: 1 / 2;
      grid-row: 2/ 4
    }
  }

  & > footer {
    display: grid;
    grid-auto-columns: 1fr;
    justify-content: space-around;
    align-items: center;
    grid-auto-flow: column;
    background-color: #fff;

    & > a {
      position: relative;
      display: grid;
      grid-row-gap: .5rem;
      justify-items: center;
      font-size: 1.5rem;
      color: #333333;

      & > .iconfont {
        font-size: 2.2rem;
      }

      &.router-link-active {
        color: var(--color-theme);
      }
    }
  }
}
</style>