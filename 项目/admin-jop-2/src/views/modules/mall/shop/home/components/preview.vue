<template>
  <div class="preview">
    <header>
      微商城
    </header>
    <main>
      <section class="carousel">
        <a-carousel autoplay>
          <div
            v-for="item of componentsData.carousel"
            :key="item.id"
          >
            <img :src="item.imgUrl" alt="轮播图">
          </div>
        </a-carousel>
      </section>
      <section class="nav">
        <ul>
          <li
            v-for="item of componentsData.nav"
            :key="item.id"
          >
            <img
              :src="item.imgUrl"
              alt="图片"
            >
            <span>
              {{item.title}}
            </span>
          </li>
        </ul>
      </section>
      <section
        v-show="componentsData.homeRecommendOne.info.visible === 'Y'"
        class="recommend"
      >
        <header>
          <div class="left">
            <img src="~@/assets/img/modules/mall/hot.png" alt="图片">
            <span>
              {{componentsData.homeRecommendOne.info.title}}
            </span>
          </div>
          <div class="right">
            <span>
              更多
            </span>
            <img src="~@/assets/img/modules/mall/more.png" alt="图片">
          </div>
        </header>
        <section class="banner">
          <img :src="componentsData.homeRecommendOne.info.imgUrl" alt="图片">
        </section>
        <section class="products">
          <ul>
            <li
              v-for="item of componentsData.homeRecommendOne.list"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="图片">
              <p class="name">
                {{item.title}}
              </p>
              <p class="price">
                ¥5000.00
              </p>
            </li>
          </ul>
        </section>
      </section>
      <section
        v-show="componentsData.homeRecommendTwo.info.visible === 'Y'"
        class="recommend"
      >
        <header>
          <div class="left">
            <img src="~@/assets/img/modules/mall/hot.png" alt="图片">
            <span>
              {{componentsData.homeRecommendTwo.info.title}}
            </span>
          </div>
          <div class="right">
            <span>
              更多
            </span>
            <img src="~@/assets/img/modules/mall/more.png" alt="图片">
          </div>
        </header>
        <section class="products">
          <ul>
            <li
              v-for="item of componentsData.homeRecommendTwo.list"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="图片">
              <p class="name">
                {{item.title}}
              </p>
              <p class="price">
                ¥5000.00
              </p>
            </li>
          </ul>
        </section>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api';

export default defineComponent({
  components: {
  },
  props: {
    componentsData: Object,
  },
  setup() {
    return {
    };
  },
});
</script>

<style lang="scss" scoped>
.preview {
  position: relative;

  > header {
    position: sticky;
    top: 0;
    display: grid;
    place-items: center;
    height: 32px;
    font-size: 16px;
    color: #000104;
    z-index: 1;
    background-color: #FFF;
  }

  > main {
    > .carousel {
      img {
        height: 198px;
        width: 100%;
        object-fit: cover;
        object-position: center center;
        background-color: #F5F9F9;
      }
    }

    > .nav {
      padding: 17px;

      > ul {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 19px;

        > li {
          display: grid;
          grid-auto-flow: row;
          justify-items: center;
          gap: 10px;
          font-size: 12px;
          color: #8E94A6;

          > img {
            height: 44px;
            width: 100%;
            border-radius: 15px;
            object-fit: contain;
            object-position: center center;
            background-color: #F5F9F9;
          }
        }
      }
    }

    > .recommend {
      padding: 17px;

      > header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 13.5px;

        > .left {
          display: flex;
          align-items: center;
          color: #333333;
          font-size: 16px;
          font-weight: bold;

          > img {
            margin-right: 6.25px;
            height: 20px;
            width: auto;
          }
        }

        > .right {
          display: flex;
          align-items: center;
          color: #999999;
          font-size: 12px;

          > img {
            margin-left: 6.25px;
            height: 15px;
            width: auto;
          }
        }
      }

      > .banner {
        margin-bottom: 10px;

        > img {
          border-radius: 5px;
          height: 140px;
          width: 100%;
          object-fit: cover;
          object-position: center center;
        }
      }

      > .products {
        > ul {
          display: grid;
          grid-auto-columns: 77px;
          grid-auto-flow: column;
          gap: 9px;
          overflow-x: auto;

          > li {
            > img {
              display: block;
              margin-bottom: 9px;
              object-fit: cover;
              object-position: center center;
              height: 77px;
              background-color: #F5F5F5;
            }

            > .name {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-bottom: 5px;
              color: #4D4D4D;
              font-size: 12px;
            }

            > .price {
              color: #FF4646;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
