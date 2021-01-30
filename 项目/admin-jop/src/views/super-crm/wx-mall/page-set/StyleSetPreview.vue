<template>
  <preview-container
    :title="data.title"
  >
    <div
      class="preview"
      ref="preview"
    >
      <header>
        <div
          class="logo"
        >
          <img
            v-if="data.logoUrl"
            :src="data.logoUrl"
            alt="logo"
          >
        </div>
        <div class="input-box">
          <input
            type="text"
            placeholder="请输入关键字"
          >
          <i
            class="iconfont el-icon-search"
          >
          </i>
        </div>
        <div
          class="user"
        >
          登录
        </div>
      </header>
      <section class="container">
        <header class="banner">
          <el-carousel
            height="136px"
            indicator-position="none"
          >
            <el-carousel-item
              v-for="(item, index) in carouselList"
              :key="index"
            >
              <img
                :src="item.imgURL"
                alt="图片"
              >
            </el-carousel-item>
          </el-carousel>
        </header>
        <section class="sale">
          <section
            class="sale-item"
          >
            <div
              class="title"
            >
              <div class="line"></div>
              <div class="text">
                国庆狂欢特卖
              </div>
              <div class="line"></div>
            </div>
            <div
              class="info"
            >
              <div class="left">
                距开始还剩 20 天 10 小时 20 分 30 秒
              </div>
              <div
                class="right"
              >
                更多
              </div>
            </div>
            <div
              class="product-list"
            >
              <figure
                v-for="item in 3"
                :key="item"
                class="product-list-column-item"
              >
                <div
                  class="img"
                >
                  <img :src="previewProductImageUrl" alt="图片">
                </div>
                <div class="info">
                  <div class="name">
                    金Au750钻石戒指
                  </div>
                  <div class="detail">
                    <div>
                      金重：3.22g
                    </div>
                    <div>
                      主石：0.32ct
                    </div>
                  </div>
                  <div class="price">
                    <div class="price-current sale">￥10000</div>
                    <div class="price-original">￥16000</div>
                  </div>
                </div>
                <div
                  class="shopping-cart-add"
                >
                  <i class="iconfont el-icon-shopping-cart-full"></i>
                </div>
              </figure>
            </div>
          </section>
        </section>
        <section class="product-all">
          <header>
            <div class="left">
              <i class="iconfont icon-zanshi"></i>
              所有商品
            </div>
            <div
              class="right"
            >
              更多
            </div>
          </header>
          <section class="product-list">
            <figure
              v-for="item in 5"
              :key="item"
              class="product-list-column-item"
            >
              <div
                class="img"
              >
                <img :src="previewProductImageUrl" alt="图片">
              </div>
              <div class="info">
                <div class="name">
                  金Au750钻石戒指
                </div>
                <div class="detail">
                  <div>
                    金重：3.22g
                  </div>
                  <div>
                    主石：0.32ct
                  </div>
                </div>
                <div class="price">
                  <div class="price-current sale">￥10000</div>
                  <div class="price-original">￥16000</div>
                </div>
              </div>
              <div
                class="activity-name"
              >
                国庆狂欢
              </div>
              <div
                class="shopping-cart-add"
              >
                <i class="iconfont el-icon-shopping-cart-full"></i>
              </div>
            </figure>
          </section>
          <footer>
            查看所有商品
          </footer>
        </section>
      </section>
      <footer>
        <div
          class="active"
        >
          <i class="iconfont icon-shouye1"></i>
          首页
        </div>
        <div>
          <i class="iconfont icon-sousuo"></i>
          找款式
        </div>
        <div>
          <i class="iconfont icon-gouwuche"></i>
          购物车
          <div
            class="badge"
          >
            3
          </div>
        </div>
        <div>
          <i class="iconfont icon-wode1"></i>
          用户中心
        </div>
      </footer>
    </div>
  </preview-container>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import PreviewContainer from '@/components/PreviewContainer.vue';

@Component({
  components: {
    PreviewContainer
  }
})
export default class Preview extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  data!: any;

  previewProductImageUrl: string = require('@/assets/images/super-crm/wx-mall/diamond-ring.jpg');
  carouselList: any[] = [];

  mounted() {
    this.setThemeColor(this.data.themeColor);
  }

  @Watch('data.themeColor')
  watchData(value: any) {
    this.setThemeColor(value);
  }

  @Watch('data.carouselTableData')
  watchCarouselTableData(value: any) {
    console.log(value);
    this.carouselList = value.filter((item: any) => {
      return item.isShow;
    })
  }

  setThemeColor(color: string) {
    const previewEelement = this.$refs.preview;

    if (previewEelement instanceof Element) {
      (previewEelement as HTMLDivElement).style.setProperty('--theme-color', color);
    }
  }
}
</script>

<style lang="scss" scoped>
.preview {
  height: 100%;
  overflow: scroll;
  --theme-color: rgb(225, 47, 48);
  padding-bottom: 50px;

  & > header {
    position: sticky;
    top: 0;
    z-index: var(--zindex-sticky);
    display: flex;
    padding: 6px 12px;
    background-color: var(--theme-color);

    & > .logo {
      margin-right: 10px;
      border-radius: 3px;
      height: 65px;
      width: 65px;
      background-color: #fff;

      > img {
        height: 100%;
        width: 100%;
        object-fit: contain;
        object-position: center center;
      }
    }

    & > .input-box {
      position: relative;
      display: flex;
      flex-grow: 1;
      align-self: center;
      margin-right: 10px;

      & > input {
        flex-grow: 1;
        border: none;
        border-radius: 3px;
        padding: 13px 10px;
        font-size: 15px;
      }

      & > .iconfont {
        position: absolute;
        align-self: center;
        right: 12px;
        font-size: 22px;
        color: var(--theme-color);
      }
    }

    & > .user {
      align-self: center;
      font-size: 16px;
      color: #fff;
    }
  }

  & > .container {
    display: flex;
    flex-direction: column;
    overflow: hidden auto;

    .product-list-column-item {
      position: relative;
      margin: 0;
      display: grid;
      align-content: start;
      background-color: #fff;

      > .img {
        > img {
          height: 230px;
          width: auto;
          object-fit: cover;
          object-position: center center;
        }
      }

      & > .info {
        display: grid;
        align-content: start;
        grid-row-gap: 6px;
        padding: 7px;

        & > .name {
          font-size: 15px;
          color: #333333;
        }

        & > .detail {
          display: grid;
          grid-auto-flow: column;
          justify-content: start;
          grid-column-gap: 13px;
          font-size: 13px;
          color: #999999;
        }

        & > .price {
          display: grid;
          grid-auto-flow: column;
          justify-content: space-between;
          align-items: center;

          & > .price-current {
            font-size: 16px;
            color: var(--theme-color);

            &::first-letter {
              font-size: 12px;
            }

            &.sale {
              padding: 4px 9px;
              border-radius: 15px;
              color: #fff;
              background: var(--theme-color);
            }
          }

          & > .price-original {
            text-decoration: line-through;
            font-size: 15px;
            color: #bbbbbb;
          }
        }
      }


      & > .activity-name {
        position: absolute;
        left: 0;
        top: 13px;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
        padding: 6px;
        font-size: 11px;
        color: #fff;
        background-color: var(--theme-color);
      }

      & > .shopping-cart-add {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 4px;
        top: 12px;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        color: #fff;
        background-color: var(--theme-color);
      }
    }

    & > header {
      height: 170px;
      background: #fff;

      & .banner-img {
        height: 170px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #fff;
      }
    }

    & > .sale {
      padding: 0 13px;
      background: #fff;

      & > .sale-item {
        display: grid;
        grid-row-gap: 16px;

        & > .title {
          display: grid;
          grid-template-columns: auto max-content auto;
          grid-column-gap: 12px;
          align-items: center;
          padding-top: 13px;

          & > .line {
            height: 3px;
            background-color: var(--theme-color);
          }

          & > .text {
            font-size: 16px;
            font-weight: bold;
            color: var(--theme-color);
          }
        }

        & > .info {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          color: #666666;

          > .left {
            font-size: 12px;
            color: #666666;
          }

          & > .right {
            color: #999999;
          }
        }

        & > .product-list {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 200px;
          grid-column-gap: 11px;
          overflow: auto hidden;
        }
      }
    }

    .product-all {

      & > header {
        display: grid;
        align-items: center;
        justify-content: space-between;
        grid-auto-flow: column;
        padding: 15px;

        & > .left {
          font-size: 20px;
          color: var(--theme-color);
        }

        & > .right {
          font-size: 15px;
          color: #999999;
        }
      }

      & > .product-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 5px;
      }

      & > footer {
        margin-top: 5px;
        margin-bottom: 5px;
        padding: 14px;
        text-align: center;
        font-size: 18px;
        color: var(--theme-color);
        background-color: #fff;
      }
    }
  }

  & > footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--zindex-fixed);
    display: flex;
    justify-content: space-between;
    padding: 6px 45px;
    background-color: #ffffff;

    & > div {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 15px;
      color: #333333;

      & > .iconfont {
        font-size: 22px;
      }

      &.active {
        color: var(--theme-color);
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


