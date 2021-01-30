<template>
  <base-layout
    :isShowFooter="true"
    :isShowHeader="true"
    @search="loadMore(true)"
  >
    <list
      v-model="isLoading"
      :finished="isFinished"
      finished-text="没有更多了"
      @load="loadMore(false)"
    >
      <article
        id="query-result"
      >
        <header>
          <div class="left">
            <div
              @click="sortHandle('time')"
            >
              默认
              <i
                v-show="
                  productSearchOptions.sort === ''
                  || productSearchOptions.sort === '2'
                  || productSearchOptions.sort === '3'
                "
                class="iconfont icon-jiantou"
              >
              </i>
              <i
                v-show="productSearchOptions.sort === '0'"
                class="iconfont icon-jiantou-copy active"
              >
              </i>
              <i
                v-show="productSearchOptions.sort === '1'"
                class="iconfont icon-jiantouarrow492 active"
              >
              </i>
            </div>
            <div
              @click="sortHandle('price')"
            >
              价格
              <i
                v-show="
                  productSearchOptions.sort === ''
                  || productSearchOptions.sort === '0'
                  || productSearchOptions.sort === '1'
                "
                class="iconfont icon-jiantou"
              >
              </i>
              <i
                v-show="productSearchOptions.sort === '2'"
                class="iconfont icon-jiantou-copy active"
              >
              </i>
              <i
                v-show="productSearchOptions.sort === '3'"
                class="iconfont icon-jiantouarrow492 active"
              >
              </i>
            </div>
            <div>
              <checkbox
                v-model="productSearchOptions.isActivity"
                @change="loadMore(true)"
              >
                活动商品
              </checkbox>
            </div>
          </div>
          <div class="right">
            <div
              class="showType"
              @click="showTypeHandle"
            >
              <i
                :class="{
                  iconfont: true,
                  'icon-xiaotumoshi': showType === 'col',
                  'icon-datu': showType === 'row',
                }"
              >
              </i>
            </div>
          </div>
        </header>
        <section
          class="product-list"
          ref="test123"
        >
          <section
            v-if="showType === 'col'"
            key="column"
            class="column"
          >
            <product-list-column-item
              v-for="(item, index) of dataList"
              :key="index"
              :itemData="item"
            />
          </section>
          <section
            v-else
            key="row"
            class="row"
          >
            <product-list-row-item
              v-for="(item, index) of dataList"
              :key="index"
              :itemData="item"
            />
          </section>
        </section>
      </article>
    </list>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component} from 'vue-property-decorator';
import {Mutation, State} from 'vuex-class';
import {Toast, List} from 'vant';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import {Radio, Checkbox} from 'vant';
import ProductListColumnItem from './components/product-list-column-item.vue';
import ProductListRowItem from './components/product-list-row-item.vue';

// http
import {httpReq} from '@/utils/http-req';
import {productSearchReq} from '@/serves/home';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);

@Component({
  components: {
    BaseLayout,
    Checkbox,
    ProductListColumnItem,
    ProductListRowItem,
    List,
  },
  name: 'HomeQueryResult',
})
export default class HomeQueryResult extends Vue {
  @State('productSearchOptions')
  private productSearchOptions!: any;

  @Mutation('setProductSearchOptionsSort')
  private setProductSearchOptionsSort!: any;

  // 显示类型
  private showType: 'row' | 'col' = 'col';

  // 数据列表
  private dataList: any[] = [];

  // 是否加载
  private isLoading: boolean = false;

  // 是否全部完成
  private isFinished: boolean = false;

  // 当前页数
  private pageNum: number = 1;

  // 显示数量
  private pageSize: number = 20;

  // 是否保持活力
  private isKeepAlive: boolean = false;

  private beforeRouteEnter(to: any, from: any, next: any) {
    if (from.name === 'HomeHome') {
      next((vm: any) => {
        if (vm.isKeepAlive) {
          vm.loadMore(true);
        }
      });
    } else {
      next();
    }
  }

  private mounted() {
    this.loadMore(true);
  }

  // 显示类型处理
  private showTypeHandle(): void {
    this.showType = this.showType === 'row' ? 'col' : 'row';
  }

  // 查询数据
  private selectProductList() {
    return new Promise((resolve, reject) => {

      const body = {
        // 商品条码
        code: this.productSearchOptions.barCode,
        // 首饰大类
        jewelryLargeCategoryList: this.allOptions(this.productSearchOptions.productType),
        // 首饰小类
        jewelrySmallCategoryList: this.allOptions(this.productSearchOptions.jewelrySmallCategoryList),
        // 首饰类别
        jewelryTypeList: this.allOptions(this.productSearchOptions.jewelryType),
        // 金料成色
        goldQualityList: this.allOptions(this.productSearchOptions.materialsGrade),
        // 成色含量
        qualityList: this.allOptions(this.productSearchOptions.productContent),
        // 主石名称
        mainStoneNameList: this.allOptions(this.productSearchOptions.stoneName),
        // 最小件重
        minNetWeight: this.productSearchOptions.goldWeighMin,
        // 最大件重
        maxNetWeight: this.productSearchOptions.goldWeighMax,
        // 最小主石重
        minWeight: this.productSearchOptions.stoneWeighMin,
        // 最大主石重
        maxWeight: this.productSearchOptions.stoneWeighMax,
        // 主石净度
        mainStoneQualityList: this.allOptions(this.productSearchOptions.stoneClarity),
        // 主石颜色
        mainStoneColorList: this.allOptions(this.productSearchOptions.stoneColor),
        // 最小售价
        minPrice: this.productSearchOptions.priceMin,
        // 最大售价
        maxPrice: this.productSearchOptions.priceMax,
        // 款号
        styleNo: this.productSearchOptions.styleSet,
        // 证书号
        credentialsNo: this.productSearchOptions.credentialCode,
        // 主石粒数，0所有,1单粒，2多粒
        gemNum: this.productSearchOptions.stoneQuantity,
        // 副石数量，0所有，1有副石，2没有
        viceGemNum: this.productSearchOptions.stoneOther,
        // 开始手寸大小
        startHandInch: this.productSearchOptions.ringSizeMin,
        // 结束手寸大小
        endHandInch: this.productSearchOptions.ringSizeMax,
        // 是否活动 "Y"活动，"N"非活动
        isActivity: this.productSearchOptions.isActivity ? 'Y' : '',
        // 是否有货 "Y"活动，"N"非活动
        exists: this.productSearchOptions.exists ? 'Y' : '',
        // 排序
        sort: this.productSearchOptions.sort,
        // 活动id集合
        activityList: this.allOptions(this.productSearchOptions.activityList),
        // 当前页
        pageNum: this.pageNum,
        // 显示数
        pageSize: this.pageSize,
        // 关键字
        keyword: this.productSearchOptions.keyword,
        // 顶级类型
        topType: this.productSearchOptions.topType
      };

      productSearchReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(productSearchReq);

      httpRes.then(data => {
        this.isKeepAlive = true;
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 返回全部选项
  private allOptions(options: string[]) {
    if (options.includes('')) {
      return [];
    } else {
      return options;
    }
  }

  // 排序
  private sortHandle(sortType: 'time' | 'price') {
    this.setProductSearchOptionsSort(sortType);
    this.loadMore(true);
  }

  // 加载更多
  private async loadMore(isInit: boolean) {
    if (isInit) {
      this.pageNum = 1;
      this.isFinished = false;
      document.documentElement!.scrollTop = 0;
    } else {
      this.pageNum++;
    }
    this.isLoading = true;
    const res = this.selectProductList();

    res.then((data: any) => {
      const {list, pageNum, pages} = data;
      this.pageNum = pageNum;

      // 分页处理
      if (pageNum >= pages) {
        this.isFinished = true;
      }

      if (pageNum > 1) {
        this.dataList.push(...list);
      } else {
        this.dataList = list;
      }

      // 加载完成
      this.isLoading = false;
    }).catch(reason => {
      // 加载完成
      this.isFinished = true;
      this.isLoading = false;
    });
  }
}
</script>

<style lang="scss" scoped>
#query-result {
  display: grid;
  grid-template-rows: 5rem auto;

  & > header {
    position: sticky;
    top: 5.5rem;
    z-index: var(--zindex-sticky);
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    font-size: 1.8rem;
    background-color: #fff;

    & > .left {
      display: flex;
      align-items: center;

      & > div {
        margin-right: 3rem;

        & > .van-checkbox {
          /deep/ & >.van-checkbox__label {
            margin-left: .5rem;
          }
        }

        & > .iconfont {
          font-size: 1rem;
          color: #aaaaaa;

          &.active {
            color: var(--color-theme);
          }
        }

        &.showType {
          & > .iconfont {
            font-size: 2.5rem;
          }
        }
      }
    }

    & > .right {
      display: flex;
      align-items: center;

      & > div {
        &.showType {
          & > .iconfont {
            font-size: 2.5rem;
          }
        }
      }
    }
  }

  & > .product-list {
    & > .column {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: .5rem;
      align-content: start;
    }

    & > .row {
      display: grid;
      grid-auto-rows: 11.5rem;
      grid-gap: .5rem;
    }
  }
}
</style>
