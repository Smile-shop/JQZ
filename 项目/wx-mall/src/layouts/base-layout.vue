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
          v-model="productSearchOptions.keyword"
          type="text"
          placeholder="请输入关键字"
          @keydown.enter="searchHanlde"
        >
        <i
          class="iconfont icon-sousuo"
          @click="searchHanlde"
        >
        </i>
      </div>
      <router-link
        v-if="isShowHeaderLogin"
        tag="div"
        class="login"
        to="/"
      >
        登录
      </router-link>
    </header>
    <main
      :class="{
        headerHidden: !isShowHeader,
        footerHidden: !isShowFooter && !customFooter,
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
        找款式
      </a>
      <router-link
        to="/shopping-trolley"
      >
        <i class="iconfont icon-gouwuche"></i>
        购物车
        <badge
          v-if="shoppingCartCount && !isShoppingCartListClick"
          :count="shoppingCartCount"
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
      @search="searchHanlde"
    />
    <service/>
  </article>
</template>

<script lang="ts">
// vue
import {Vue, Component, Prop, Watch, Emit} from 'vue-property-decorator';
import {Mutation, State} from 'vuex-class';

// 组件
import TheAdvancedQuery from '@/components/the-advanced-query.vue';
import Badge from '@/components/base-badge.vue';
import Service from '@/components/service.vue';

@Component({
  components: {
    TheAdvancedQuery,
    Badge,
    Service,
  },
})
export default class BaseLayout extends Vue {
  // 是否显示底部
  @Prop({
    required: false,
    default: true,
  })
  private isShowFooter!: boolean;

  // 是否自定义底部
  @Prop({
    required: false,
    default: false,
  })
  private customFooter!: boolean;

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

  // 背景颜色
  @Prop({
    required: false,
    default: 'gray',
  })
  private bgColor!: string;

  @State('productSearchOptions')
  private productSearchOptions!: any;

  @State('shoppingCartCount')
  private shoppingCartCount!: number;

  @State('isShoppingCartListClick')
  private isShoppingCartListClick!: boolean;

  // 是否显示高级查询
  private isShowAdvancedQuery: boolean = false;

  private mounted() {
    this.bgColorSet();
  }

  // 设置背景
  private bgColorSet() {
    switch (this.bgColor) {
      case 'white':
        document.body.style.backgroundColor = '#fff';
        break;
      case 'gray':
        document.body.style.backgroundColor = '#f5f5f5';
        break;
      default:
        break;
    }
  }

  // 历史后退
  private historyBack() {
    this.$router.back();
  }

  // 高级查询显示处理
  private advancedQueryShowHandle() {
    this.isShowAdvancedQuery = !this.isShowAdvancedQuery;
  }

  // 搜索处理
  private searchHanlde() {
    this.$router.push('/home/query-result');
    this.$emit('search');
  }
}
</script>

<style lang="scss" scoped>
.base-layout {
  // 头部
  & > header {
    position: sticky;
    left: 0;
    right: 0;
    top: 0;
    height: 5.5rem;
    z-index: var(--zindex-sticky);
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    padding: .9rem 1.5rem;
    background-color: #fff;

    // 返回
    & > .back {
      margin-right: 1.3rem;

      & > .iconfont {
        font-size: 2rem;
        color: var(--color-theme);
      }
    }

    // 标题
    & > .title {
      flex-grow: 1;
      text-align: center;
      margin-right: 3.3rem;
      font-size: 2.3rem;
      color: #333333;
    }

    // 搜索栏
    & > .search {
      position: relative;
      display: flex;
      flex-grow: 1;
      align-self: stretch;

      & > input {
        flex-grow: 1;
        background-color: #f5f5f5;
        border: none;
        border-radius: .6rem;
        padding: .6rem;
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
  }

  & > main {
    padding-bottom: 5rem;

    /* &.headerHidden {
    } */

    &.footerHidden {
      padding-bottom: 0;
    }
  }

  & > footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--zindex-fixed);
    display: flex;
    justify-content: space-between;
    padding: .6rem 4.5rem;
    background-color: #ffffff;

    & > a {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
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