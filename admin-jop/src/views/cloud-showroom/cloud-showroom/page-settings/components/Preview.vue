<template>
  <div class="preview">
    <div class="preview_bg">
      <img src="@/assets/images/super-crm/cloud-showroom/goods.png" alt="">
    </div>
    <div class="container">
      <header>
        <!-- <div class="status-bar">
          <img src="~@/assets/images/super-crm/cloud-showroom/status-bar.png" alt="图片">
        </div> -->
        <div class="tool-bar">
          {{title}}
        </div>
      </header>
      <main>
        <!-- 首页名称 -->
        <img v-if="isShowGoldPrice == 1 && tabIndex == 'name'" src="~@/assets/images/super-crm/cloud-showroom/index.png" alt="图片" style="width: 100%;" >
        <img v-if="isShowGoldPrice == 0 && tabIndex == 'name'"  alt="图片" style="width: 100%;" src="~@/assets/images/super-crm/cloud-showroom/hidden-price.png" >
        <!-- 风格设置 -->
        <img v-if="tabIndex === 'style' && styleIndex === '0'" src="~@/assets/images/super-crm/cloud-showroom/index.png" alt="图片" style="width: 100%;">
        <img v-if="tabIndex === 'style' && styleIndex === '1'" src="~@/assets/images/super-crm/cloud-showroom/gold-style.png"  alt="图片" style="width: 100%;">

        <section class="banner"  v-if="tabIndex == 'carousel'">
          <el-carousel
            height="216px"
            indicator-position="none"
          >
            <el-carousel-item
              v-for="(item, index) in carousel"
              :key="index"
            >
              <img
                :src="item.pictureUrl || 'https://fakeimg.pl/375x211/'"
                alt="图片"
              >
            </el-carousel-item>
          </el-carousel>
          <div class="info-bar">
            <div class="search-bar">
              <input type="text">
              <i class="iconfont el-icon-search"></i>
            </div>
          </div>
          <!-- <img
            v-if="isShowGoldPrice == 1"
            src="~@/assets/images/super-crm/cloud-showroom/jinjialan.png"
            alt="金价栏"
          > -->
          <img src="~@/assets/images/super-crm/cloud-showroom/carousel.png" alt="">
        </section>

        <section class="search-type" v-if="tabIndex === 'type'">
          <img src="~@/assets/images/super-crm/cloud-showroom/type-1.png" alt="">
          <ul>
            <li
              v-for="(item, index) of type"
              :key="index"
            >
              <img :src="item.pictureUrl || 'https://fakeimg.pl/50x50/'" alt="首饰">
              <p>
                {{item.classifiedName}}
              </p>
            </li>
          </ul>
          <img src="~@/assets/images/super-crm/cloud-showroom/type-2.png" alt="">
        </section>

        <section class="recommend-bar-1" v-if="tabIndex === 'recommendOne'">
          <img src="~@/assets/images/super-crm/cloud-showroom/recommend-1.png" alt="">
          <header>
            <div class="left">
              {{recommendOne.presenterName || '推荐位名称'}}
            </div>
            <div class="right">
              更多
              <i class="iconfont el-icon-arrow-right"></i>
            </div>
          </header>
          <ul>
            <li
              v-for="(item, index) of recommendOne.productDetaileds"
              :key="index"
            >
              <img :src="item.photo || 'https://fakeimg.pl/166x166/'" alt="图片">
              <p class="name">
                {{item.name || '商品名称'}}
              </p>
              <div class="info-bar">
                <div class="left">
                  <span>
                    J-G
                  </span>
                  <span>
                    SI
                  </span>
                </div>
                <div class="right">
                  999<small>件</small>
                </div>
              </div>
              <div class="price-bar">
                <div class="left">
                  <small>
                    ￥
                  </small>
                  1000
                </div>
                <div class="right">
                  <i class="iconfont el-icon-shopping-cart-2"></i>
                </div>
              </div>
            </li>
          </ul>
          <img src="~@/assets/images/super-crm/cloud-showroom/recommend-2.png" alt="">
        </section>

        <section class="recommend-bar-2" v-if="tabIndex === 'recommendTwo'">
          <img src="~@/assets/images/super-crm/cloud-showroom/recommend-1.png" alt="">
          <header>
            <div class="left">
              {{recommendTwo.presenterName || '推荐位名称'}}
            </div>
            <div class="right">
              更多
              <i class="iconfont el-icon-arrow-right"></i>
            </div>
          </header>
          <ul>
            <li
              v-for="(item, index) of recommendTwo.productDetaileds"
              :key="index"
            >
              <img :src="item.photo || 'https://fakeimg.pl/166x166/'" alt="图片">
              <p class="name">
                {{item.name || '商品名称'}}
              </p>
              <div class="info-bar">
                <div class="left">
                  <span>
                    J-G
                  </span>
                  <span>
                    SI
                  </span>
                </div>
                <div class="right">
                  999<small>件</small>
                </div>
              </div>
              <div class="price-bar">
                <div class="left">
                  <small>
                    ￥
                  </small>
                  1000
                </div>
                <div class="right">
                  <i class="iconfont el-icon-shopping-cart-2"></i>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </main>
      <footer>
        <div>
          <img style="transform: scale(1.3);" src="~@/assets/images/super-crm/cloud-showroom/down_tip.png"/>
        </div>
        <!-- <div class="active" :style="{'color': tabIndex === 'style' && styleIndex === '1' ? '#DBB051' : ''}">
          <i class="iconfont icon-shouye_xuanzhong home"></i>
          主页
        </div>
        <div>
          <i class="iconfont icon-fenlei"></i>
          分类
        </div>
        <div>
          <i class="iconfont icon-gouwudai"></i>
          购物车
        </div>
        <div>
          <i class="iconfont icon-wode"></i>
          我的
        </div> -->
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({
})
export default class Preview extends Vue {
  // tabIndex
  @Prop({
    type: String
  })
  tabIndex!: string
  // 风格设置/风格类型
  @Prop({type: String, default() {return '0'}})
  styleIndex!: string
  // 标题
  @Prop({
    type: String,
    required: false,
    default() {
      return '云展厅'
    }
  })
  title!: string

  // 是否显示金价
  @Prop({
    type: Number,
    required: false,
    default() {
      return 1
    }
  })
  isShowGoldPrice!: number

  // 轮播图
  @Prop({
    type: Array,
    required: false,
    default() {
      return [
        {
          pictureUrl: '',
          title: '',
          rederectUrl: '',
        }
      ]
    }
  })
  carousel!: any

  // 类型查询列表
  @Prop({
    type: Array,
    required: false,
    default() {
      const res = [];

      for (let index = 0; index < 10; index++) {
        res.push({
          pictureUrl: '',
          classifiedName: '类型名称'
        })
      }

      return res
    }
  })
  type!: any

  // 推荐位1
  @Prop({
    type: Object,
    required: false,
    default() {
      const res: any = {
        presenterName: '推荐位名称',
        productDetaileds: []
      };

      for (let index = 0; index < 5; index++) {
        res.productDetaileds.push({
          name: '商品名'
        })
      }

      return res
    },
  })
  recommendOne!: any

  // 推荐位2
  @Prop({
    type: Object,
    required: false,
    default() {
      const res: any = {
        presenterName: '推荐位名称',
        productDetaileds: []
      };

      for (let index = 0; index < 5; index++) {
        res.productDetaileds.push({
          name: '商品名'
        })
      }

      return res
    }
  })
  recommendTwo!: any
  mounted() {
    console.log(this.tabIndex)
  }
}
</script>

<style lang="scss" scoped>
  .preview {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    > .preview_bg{
      position: absolute;
      top: 0;
    }
    > .container {
      position: relative;
      // height: 667px;
      height: 598px;
      // width: 375px;
      width: 293px;
      overflow-x: hidden;
      overflow-y: auto;
      // border: 1px solid #CCC;
      top: 48px;
      &::-webkit-scrollbar {
        width: 2px;
      }

      > header {
        position: sticky;
        top: 0;
        background-color: #FFF;
        z-index: 1000;

        .status-bar {
          > img {
            width: 100%;
          }
        }

        > .tool-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          font-size:16px;
          color: #4D4D4D;
        }
      }

      > main {
        min-height: 667px;

        > .banner {
          position: relative;
          margin-bottom: 30px;

          img {
            height: 100%;
            width: 100%;
          }

          > .info-bar {
            z-index: 100;
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            display: flex;

              > .search-bar {
              display: flex;
              align-items: center;
              flex-grow: 1;
              margin-right: 10px;

              > input {
                width: 100%;
                border-radius: 50px;
                padding: 10px 40px;
                border: none;
                outline: none;
                background:rgba(0,0,0,0.26);
                color: #FFF;
              }

              > .iconfont {
                position: absolute;
                left: 10px;
                font-size: 20px;
                color: #FFF;
              }
            }

            > .gold-price {
              width: 50px;

              > .title {
                margin-bottom: 3px;
                border-radius: 2px;
                font-size: 10px;
                color: #4D4D4D;
                background-color: #FFF;
                text-align: center;
              }

              > .price {
                text-align: center;
                color: #EC7C68;
                font-size: 12px;
                font-weight: bold;
              }
            }
          }
        }

        > .search-type {
          margin-bottom: 26px;
          // padding: 0 15px 0 15px;

          > ul {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            column-gap: 5px;
            row-gap: 5px;
            margin-top: 10px;

            > li {
              display: flex;
              flex-direction: column;
              align-items: center;

              > img {
                object-fit: cover;
                object-position: center center;
                margin-bottom: 8px;
                border-radius: 50%;
                width: 50px;
                height: 50px;
              }

              > p {
                text-align: center;
                color: #A3AAB7;
                font-size: 11px;
              }
            }
          }
        }

        > .recommend-bar-1 {
          margin-bottom: 28px;
          // padding: 0 2px;

          > header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 17px;
            padding-left: 8px;

            > .left {
              font-size: 13px;
              font-weight: bold;
              color: #4D4D4D;
            }

            > .right {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #A3AAB7;

              > .iconfont {
                margin-left: 5px;
                font-size: 10px;
              }
            }
          }

          > ul {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x;
            padding-left: 8px;

            > li {
              scroll-snap-align: start;
              margin-right: 15px;
              flex-shrink: 0;

              > img {
                margin-bottom: 7px;
                border-radius: 5px;
                height: 126px;
                width: 126px;
                object-fit: cover;
                object-position: center center;
              }

              > .name {
                margin-bottom: 2px;
                font-size:12px;
                color: #4D4D4D;
              }

              > .info-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;

                > .left {
                  color: #A3AAB7;
                  font-size: 12px;

                  > span {
                    &:not(:last-of-type) {
                      margin-right: 10px;
                    }
                  }
                }

                > .right {
                  color: #4D4D4D;
                  font-size: 12px;
                }
              }

              > .price-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;

                > .left {
                  color: #4D4D4D;
                  font-size: 12px;
                }

                > .right {
                  > .iconfont {
                    color: #4D4D4D;
                    font-size: 18px;
                  }
                }
              }
            }
          }
        }

        > .recommend-bar-2 {
          margin-bottom: 28px;
          // padding: 0 15px 0 15px;

          > header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 17px;

            > .left {
              font-size: 12px;
              font-weight: bold;
              color: #4D4D4D;
            }

            > .right {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #A3AAB7;

              > .iconfont {
                margin-left: 5px;
                font-size: 10px;
              }
            }
          }

          > ul {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;

            > li {
              > img {
                margin-bottom: 7px;
                border-radius: 5px;
                height: 126px;
                width: 100%;
                object-fit: cover;
                object-position: center center;
              }

              > .name {
                margin-bottom: 2px;
                font-size:12px;
                color: #4D4D4D;
              }

              > .info-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;

                > .left {
                  color: #A3AAB7;
                  font-size: 12px;

                  > span {
                    &:not(:last-of-type) {
                      margin-right: 10px;
                    }
                  }
                }

                > .right {
                  color: #4D4D4D;
                  font-size: 12px;
                }
              }

              > .price-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;

                > .left {
                  color: #4D4D4D;
                  font-size: 12px;
                }

                > .right {
                  > .iconfont {
                    color: #4D4D4D;
                    font-size: 18px;
                  }
                }
              }
            }
          }
        }
      }

      > footer {
        position: sticky;
        bottom: 0;
        background-color: #FFF;
        padding: 8px 28px;
        display: flex;
        justify-content: space-between;
        box-shadow: #DCDCE3 0 -2px 5px;

        > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 10px;
          color: #A3AAB7;

          > .iconfont {
            font-size: 20px;
          }

          &.active {
            color: #4D4D4D;
            .home{
              font-size: 20px;
            }
          }
        }
      }
    }
  }
</style>
