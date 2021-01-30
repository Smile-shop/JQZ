<template>
  <preview-container
    :title="data.title"
  >
    <div
      class="preview"
      ref="preview"
    >
      <header>
        <div class="left">
          <i class="iconfont icon-zuo"></i>
        </div>
        <div class="middle">
          {{data.title}}
        </div>
        <div class="right">

        </div>
      </header>
      <section class="container">
        <div class="search-box">
          <input type="text" placeholder="搜索">
          <i class="iconfont icon-sousuo"></i>
        </div>
        <div class="sale-box">
          <header>
            <div class="left">
              <i class="iconfont icon-iconfuxing_lipin"></i>
              <span>
                新年特惠
              </span>
            </div>
            <div class="right">
              <span>
                更多
              </span>
              <i class="iconfont icon-you"></i>
            </div>
          </header>
          <div class="content">
            <div class="count-down">
              <span>
                距开始还剩
              </span>
              <span class="number">
                1
              </span>
              天
              <span class="number">
                2
              </span>
              小时
              <span class="number">
                10
              </span>
              分
              <span class="number">
                20
              </span>
              秒
            </div>
            <div class="product-list">
              <product-card
                v-for="(item, index) of 2"
                :key="index"
                :data="data"
              />
            </div>
          </div>
        </div>
        <div class="activity-box">
          <header>
            <div class="left">
              店庆大促
            </div>
            <div class="right">
              <span>
                更多
              </span>
              <i class="iconfont icon-you"></i>
            </div>
          </header>
          <div class="content">
            <div class="product-list">
              <product-card
                v-for="(item, index) of 2"
                :key="index"
                :data="data"
              />
            </div>
          </div>
        </div>
        <div class="product-box">
          <header>
            <div class="left">
              所有商品
            </div>
            <div class="right">
              <span>
                更多
              </span>
              <i class="iconfont icon-you"></i>
            </div>
          </header>
          <div class="content">
            <div class="product-list">
              <product-card
                v-for="(item, index) of data.showNumber"
                :key="index"
                :data="data"
              />
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div>
          <i class="iconfont icon-gongneng"></i>
          分类
        </div>
        <div
          class="active"
        >
          <i class="iconfont icon-shouye1"></i>
          首页
        </div>
        <div>
          <i class="iconfont icon-wode1"></i>
          我的
        </div>
      </footer>
    </div>
  </preview-container>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import PreviewContainer from '@/components/PreviewContainer.vue';
import ProductCard from './components/ProductCard.vue';

@Component({
  components: {
    PreviewContainer,
    ProductCard
  }
})
export default class Preview extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  data!: any;

  @Watch('data', {
    deep: true
  })
  watchData(value: any) {
    this.setThemeColor(value);
  }

  mounted() {
    this.setThemeColor(this.data);
  }

  setThemeColor(options: any) {
    const {
      activityBackgroundColor,
      activityFontColor,
      themeColor
    } = options

    const previewEelement = this.$refs.preview;

    if (previewEelement instanceof Element) {
      (previewEelement as HTMLDivElement).style.setProperty('--theme-color', themeColor);
      (previewEelement as HTMLDivElement).style.setProperty('--sale-background-color', activityBackgroundColor);
      (previewEelement as HTMLDivElement).style.setProperty('--sale-font-color', activityFontColor);
    }
  }
}
</script>

<style lang="scss" scoped>
.preview {
  height: 100%;
  overflow: scroll;
  padding-bottom: 50px;

  --theme-color: rgb(225, 47, 48);
  --sale-background-color: rgb(225, 47, 48);
  --sale-font-color: #fff283;

  & > header {
    position: sticky;
    top: 0;
    z-index: var(--zindex-sticky);
    display: flex;
    padding: 14px 12px;
    border-bottom: 1px solid #f5f5f5;
    background-color: #fff;

    > .left {
      flex-basis: 40px;
      color: var(--theme-color);
    }

    > .middle {
      flex-grow: 1;
      text-align: center;
      font-size: 18px;
      color: #333333;
    }

    > .right {
      flex-basis: 40px;
    }
  }

  & > .container {
    display: flex;
    flex-direction: column;
    overflow: hidden auto;

    > .search-box {
      display: flex;
      align-items: center;
      position: relative;
      padding: 4px 12px;

      > input {
        flex-grow: 1;
        border: 1px solid #f5f5f5;
        padding: 12px 9px;
      }

      > .iconfont {
        position: absolute;
        right: 30px;
        font-size: 19px;
        color: var(--theme-color);
      }
    }

    > .sale-box {
      > header {
        display: flex;
        justify-content: space-between;
        padding: 14px;
        background-color: var(--sale-background-color);

        > .left {
          color: var(--sale-font-color);
        }

        > .right {
          color: var(--sale-font-color);
        }
      }

      > .content {
        border: 5px solid var(--sale-background-color);
        border-top: 0;

        > .count-down {
          padding: 10px;
          font-size: 12px;
          color: #666666;

          .number {
            display: inline-block;
            border-radius: 3px;
            width: 18px;
            height: 18px;
            text-align: center;
            color: #ffffff;
            background-color: #333333;
          }
        }

        > .product-list {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
      }
    }

    > .activity-box {
      padding: 10px 7px;

      > header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        > .left {
          border-left: 4px solid var(--theme-color);
          padding-left: 10px;
          font-size: 16px;
          color: var(--theme-color);
        }

        > .right {
          color: #666666;
        }
      }

      > .content {
        > .product-list {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
      }
    }

    > .product-box {
      padding: 10px 7px;

      > header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        > .left {
          border-left: 4px solid var(--theme-color);
          padding-left: 10px;
          font-size: 16px;
          color: var(--theme-color);
        }

        > .right {
          color: #666666;
        }
      }

      > .content {
        > .product-list {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
      }
    }
  }

  & > footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 44px;
    z-index: var(--zindex-fixed);
    display: flex;
    border-top: 1px solid #f5f5f5;
    background-color: #ffffff;

    & > div {
      position: relative;
      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      color: #333333;

      & > .iconfont {
        font-size: 22px;
        margin-right: 5px;
      }

      &.active {
        background: var(--theme-color);
        color: #fff;
      }

      .badge {
        position: absolute;
        left: 55%;
        border-radius: 20px;
        padding: 2px 5px;
        line-height: 1;
        font-size: 15px;
        background-color: var(--theme-color);
        color: #fff;
      }
    }
  }
}
</style>


