<template>
  <div
    id="advanced-query"
  >
    <popup
      v-model="isShowComponent"
      position="right"
      @click-overlay="hideHandle"
    >
      <div
        class="menu"
        ref="menu"
      >
        <header>
          <span class="title">
            找款式
          </span>
          <span
            class="cancle"
            @click="hideHandle"
          >
            取消
          </span>
        </header>
        <div
          class="content-box"
          ref="contentBox"
        >
          <!-- 热门筛选 -->
          <div class="hot-filter checkbox-gourp">
            <base-checkbox-button
              text="活动商品"
              value="activityProduct"
              v-model="productSearchOptions.isActivity"
            />
            <base-checkbox-button
              text="仅看有货"
              value="hasProduct"
              v-model="productSearchOptions.exists"
            />
          </div>

          <!-- 活动列表 -->
          <the-advanced-query-checkbox-gourp
            title="活动列表"
            :isDefaultShow="true"
          >
            <div class="checkbox-gourp">
              <base-checkbox-button
                text="全部"
                value=""
                v-model="productSearchOptions.activityList"
              />
              <base-checkbox-button
                v-for="(item, index) of searchTypeList.activityList"
                :key="index"
                :text="item.name"
                :value="item.id"
                v-model="productSearchOptions.activityList"
              />
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 商品分类 -->
          <the-advanced-query-checkbox-gourp
            title="商品分类"
            :isDefaultShow="true"
          >
            <div class="checkbox-gourp">
              <base-checkbox-button
                text="全部"
                value=""
                v-model="productSearchOptions.productType"
              />
              <base-checkbox-button
                v-for="(item, index) of searchTypeList.jewelLargeType"
                :key="index"
                :text="item.name"
                :value="item.id"
                v-model="productSearchOptions.productType"
              />
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 商品小类 -->
          <the-advanced-query-checkbox-gourp
            title="商品小类"
            :isDefaultShow="true"
          >
            <div class="checkbox-gourp">
              <base-checkbox-button
                text="全部"
                value=""
                v-model="productSearchOptions.jewelrySmallCategoryList"
              />
              <base-checkbox-button
                v-for="(item, index) of searchTypeList.jewelSmallType"
                :key="index"
                :text="item.name"
                :value="item.id"
                v-model="productSearchOptions.jewelrySmallCategoryList"
              />
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 价格区间 -->
          <the-advanced-query-checkbox-gourp
            title="价格区间"
          >
            <div class="compound-box">
              <div class="input-range">
                <input
                  v-model.number="productSearchOptions.priceMin"
                  type="number"
                  placeholder="最低价"
                  @focus="scrollIntoView"
                >
                <i class="iconfont icon-heng"></i>
                <input
                  v-model.number="productSearchOptions.priceMax"
                  type="number"
                  placeholder="最高价"
                  @focus="scrollIntoView"
                >
              </div>
              <div class="checkbox-gourp">
                <base-radio-button
                  text="0-5000"
                  value="0"
                  type="radio"
                  :canCancel="true"
                  v-model="productSearchOptions.priceRange"
                />
                <base-radio-button
                  text="5001-10000"
                  value="1"
                  type="radio"
                  :canCancel="true"
                  v-model="productSearchOptions.priceRange"
                />
                <base-radio-button
                  text="10001-15000"
                  value="2"
                  type="radio"
                  :canCancel="true"
                  v-model="productSearchOptions.priceRange"
                />
                <base-radio-button
                  text="15001以上"
                  value="3"
                  type="radio"
                  :canCancel="true"
                  v-model="productSearchOptions.priceRange"
                />
              </div>
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 材料成色 -->
          <the-advanced-query-checkbox-gourp
            title="材料成色"
          >
            <div class="checkbox-gourp">
              <base-checkbox-button
                text="全部"
                value=""
                v-model="productSearchOptions.materialsGrade"
              />
              <base-checkbox-button
                v-for="(item, index) of searchTypeList.material"
                :key="index"
                :text="item.name"
                :value="item.id"
                v-model="productSearchOptions.materialsGrade"
              />
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 成色含量 -->
          <the-advanced-query-checkbox-gourp
            title="成色含量"
          >
            <div class="checkbox-gourp">
              <base-checkbox-button
                text="全部"
                value=""
                v-model="productSearchOptions.productContent"
              />
              <base-checkbox-button
                v-for="(item, index) of searchTypeList.materialColor"
                :key="index"
                :text="item.name"
                :value="item.id"
                v-model="productSearchOptions.productContent"
              />
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 主石名称 -->
          <the-advanced-query-checkbox-gourp
            title="主石名称"
          >
            <div class="checkbox-gourp">
              <base-checkbox-button
                text="全部"
                value=""
                v-model="productSearchOptions.stoneName"
              />
              <base-checkbox-button
                v-for="(item, index) of searchTypeList.mainStone"
                :key="index"
                :text="item.name"
                :value="item.id"
                v-model="productSearchOptions.stoneName"
              />
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 首饰类型 -->
          <the-advanced-query-checkbox-gourp
            title="首饰类型"
          >
            <div class="checkbox-gourp">
              <base-checkbox-button
                text="全部"
                value=""
                v-model="productSearchOptions.jewelryType"
              />
              <base-checkbox-button
                v-for="(item, index) of searchTypeList.jewelType"
                :key="index"
                :text="item.name"
                :value="item.id"
                v-model="productSearchOptions.jewelryType"
              />
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 条码号 -->
          <the-advanced-query-checkbox-gourp
            v-if="searchTypeList.barcode === 1"
            title="条码号"
          >
            <div class="compound-box">
              <div class="input-one">
                <input
                  v-model.trim="productSearchOptions.barCode"
                  type="text"
                  placeholder="请输入条码号"
                  @focus="scrollIntoView"
                >
              </div>
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 证书号 -->
          <the-advanced-query-checkbox-gourp
            v-if="searchTypeList.certificateNum === 1"
            title="证书号"
          >
            <div class="compound-box">
              <div class="input-one">
                <input
                  v-model.trim="productSearchOptions.credentialCode"
                  type="text"
                  placeholder="请输入证书号"
                  @focus="scrollIntoView"
                >
              </div>
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 款式系列 -->
          <the-advanced-query-checkbox-gourp
            v-if="searchTypeList.styleSer === 1"
            title="款式系列"
          >
            <div class="compound-box">
              <div class="input-one">
                <input
                  v-model.trim="productSearchOptions.styleSet"
                  type="text"
                  placeholder="请输入款式系列"
                  @focus="scrollIntoView"
                >
              </div>
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 手寸 -->
          <the-advanced-query-checkbox-gourp
            v-if="searchTypeList.handInch === 1"
            title="手寸"
          >
            <div class="compound-box">
              <div class="input-range">
                <input
                  v-model.number="productSearchOptions.ringSizeMin"
                  type="number"
                  @focus="scrollIntoView"
                >
                <i class="iconfont icon-heng"></i>
                <input
                  v-model.number="productSearchOptions.ringSizeMax"
                  type="number"
                  @focus="scrollIntoView"
                >
              </div>
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 金重 -->
          <the-advanced-query-checkbox-gourp
            v-if="searchTypeList.goldWeight === 1"
            title="金重"
          >
            <div class="compound-box">
              <div class="input-range">
                <input
                  v-model.number="productSearchOptions.goldWeighMin"
                  type="number"
                  @focus="scrollIntoView"
                >
                <i class="iconfont icon-heng"></i>
                <input
                  v-model.number="productSearchOptions.goldWeighMax"
                  type="number"
                  @focus="scrollIntoView"
                >
              </div>
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 主石重 -->
          <the-advanced-query-checkbox-gourp
            v-if="searchTypeList.mainStoneWeight === 1"
            title="主石重"
          >
            <div class="compound-box">
              <div class="input-range">
                <input
                  v-model.number="productSearchOptions.stoneWeighMin"
                  type="number"
                  @focus="scrollIntoView"
                >
                <i class="iconfont icon-heng"></i>
                <input
                  v-model.number="productSearchOptions.stoneWeighMax"
                  type="number"
                  @focus="scrollIntoView"
                >
              </div>
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 主石粒数 -->
          <the-advanced-query-checkbox-gourp
            v-if="searchTypeList.mainStoneNum === 1"
            title="主石粒数"
          >
            <div class="compound-box">
              <div class="checkbox-gourp">
                <radio
                  v-model="productSearchOptions.stoneQuantity"
                  name=""
                >
                  全部
                </radio>
                <radio
                  v-model="productSearchOptions.stoneQuantity"
                  name="1"
                >
                  单粒
                </radio>
                <radio
                  v-model="productSearchOptions.stoneQuantity"
                  name="2"
                >
                  多粒
                </radio>
              </div>
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 副石 -->
          <the-advanced-query-checkbox-gourp
            v-if="searchTypeList.deputyStone === 1"
            title="副石"
          >
            <div class="compound-box">
              <div class="checkbox-gourp">
                <radio
                  v-model="productSearchOptions.stoneOther"
                  name=""
                >
                  全部
                </radio>
                <radio
                  v-model="productSearchOptions.stoneOther"
                  name="1"
                >
                  单粒
                </radio>
                <radio
                  v-model="productSearchOptions.stoneOther"
                  name="2"
                >
                  多粒
                </radio>
              </div>
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 主石净度 -->
          <the-advanced-query-checkbox-gourp
            title="主石净度"
          >
            <div class="checkbox-gourp">
              <base-checkbox-button
                text="全部"
                value=""
                v-model="productSearchOptions.stoneClarity"
              />
              <base-checkbox-button
                v-for="(item, index) of searchTypeList.mainStoneQuality"
                :key="index"
                :text="item.name"
                :value="item.id"
                v-model="productSearchOptions.stoneClarity"
              />
            </div>
          </the-advanced-query-checkbox-gourp>

          <!-- 主石颜色 -->
          <the-advanced-query-checkbox-gourp
            title="主石颜色"
          >
            <div class="checkbox-gourp">
              <base-checkbox-button
                text="全部"
                value=""
                v-model="productSearchOptions.stoneColor"
              />
              <base-checkbox-button
                v-for="(item, index) of searchTypeList.mainStoneColor"
                :key="index"
                :text="item.name"
                :value="item.id"
                v-model="productSearchOptions.stoneColor"
              />
            </div>
          </the-advanced-query-checkbox-gourp>
        </div>
        <footer>
          <div
            @click="initHandle"
          >
            重置
          </div>
          <div
            @click="emitSearch"
          >
            确认
          </div>
        </footer>
      </div>
    </popup>
  </div>
</template>

<script lang="ts">
// vue
import {Vue, Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';
import {Mutation, State} from 'vuex-class';
import {Popup, Radio} from 'vant';

// 组件
import BaseCheckboxButton from '@/components/base-checkbox-button.vue';
import BaseRadioButton from '@/components/base-radio-button.vue';
import TheAdvancedQueryCheckboxGourp from '@/components/the-advanced-query-checkbox-gourp.vue';
import {Toast} from 'vant';

// http
import {httpReq} from '@/utils/http-req';
import {searchTypeReq} from '@/serves/home';

@Component({
  components: {
    Popup,
    Radio,
    BaseCheckboxButton,
    TheAdvancedQueryCheckboxGourp,
    BaseRadioButton,
  },
  /* watch: {
    'productSearchOptions.priceRange'(value) {
      console.log(value);
    },
  }, */
})
export default class TheAdvancedQuery extends Vue {
  @Model('show', {
    required: true,
  })
  private isShow!: boolean;

  @State('searchTypeList')
  private searchTypeList!: any;

  @State('productSearchOptions')
  private productSearchOptions!: any;

  @Mutation('setSearchTypeList')
  private setSearchTypeList!: any;

  @Mutation('initProductSearchOptions')
  private initProductSearchOptions!: any;

  // 是否显示组件内数据
  private isShowComponent: boolean = false;

  @Watch('productSearchOptions.priceRange')
  private watchProductSearchOptionsPriceRange(value: string, oldValue: string): void {
    switch (value) {
      case '0':
        this.productSearchOptions.priceMin = 0;
        this.productSearchOptions.priceMax = 5000;
        break;
      case '1':
        this.productSearchOptions.priceMin = 5001;
        this.productSearchOptions.priceMax = 10000;
        break;
      case '2':
        this.productSearchOptions.priceMin = 10001;
        this.productSearchOptions.priceMax = 15000;
        break;
      case '3':
        this.productSearchOptions.priceMin = 15001;
        this.productSearchOptions.priceMax = '';
        break;
      case '4':
        break;
      default:
        this.productSearchOptions.priceMin = '';
        this.productSearchOptions.priceMax = '';
        break;
    }
  }

  @Watch('productSearchOptions.priceMin', {
    deep: true,
  })
  private watchProductSearchOptionsPriceMin(value: number | string, oldValue: number | string): void {
    switch (value) {
      case 0:
        break;
      case 5001:
        break;
      case 10001:
        break;
      case 15001:
        break;
      default:
        this.productSearchOptions.priceRange = '4';
        break;
    }
  }

  @Watch('productSearchOptions.priceMax', {
    deep: true,
  })
  private watchProductSearchOptionsPriceMax(value: number | string, oldValue: number | string): void {
    switch (value) {
      case 5000:
        break;
      case 10000:
        break;
      case 15000:
        break;
      case '':
        break;
      default:
        this.productSearchOptions.priceRange = '4';
        break;
    }
  }

  @Watch('isShowComponent')
  private watchIsShowComponent(value: boolean, oldValue: boolean): void {
    this.emitShow();
  }

  @Watch('isShow')
  private watchIsShow(value: boolean, oldValue: boolean): void {
    this.isShowComponent = value;
  }

  // 触发显示隐藏事件
  @Emit('show')
  private emitShow(): boolean {
    return this.isShowComponent;
  }

  // 触发查询事件
  @Emit('search')
  private emitSearch(): boolean {
    this.isShowComponent = false;
    return false;
  }

  private mounted() {
    this.isShowComponent = this.isShow;
    if (!this.searchTypeList.isSearch) {
      this.getSearchType();
    }
  }

  // 重置处理
  private initHandle() {
    this.initProductSearchOptions();
    Toast('已重置');
  }

  // 隐藏处理
  private hideHandle(): void {
    this.isShowComponent = false;
  }

  // 高级查询类型
  private getSearchType() {
    return new Promise((resolve, reject) => {
      searchTypeReq.requestInit.body = JSON.stringify({});
      const httpRes = httpReq(searchTypeReq);

      httpRes.then(data => {
        for (const [key, value] of Object.entries(data)) {
          if (Array.isArray(value)) {
            const showItemList = value.filter((item, index) => {
              return item.isShow === '1';
            });

            data[key] = showItemList;
          }
        }

        data.isSearch = true;

        this.setSearchTypeList(data);
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  private scrollIntoView(event: FocusEvent) {
    (event.target as HTMLInputElement).scrollIntoView();
  }
}
</script>

<style lang="scss" scoped>
#advanced-query {
  & > .van-popup {
    & .menu {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100vh;
      width: 40rem;

      & > * {
        border-bottom: 1px solid var(--color-bg);

        &:last-child {
          border-bottom: none;
        }
      }

      & > header {
        display: flex;
        flex-shrink: 0;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.3rem;
        padding: 1.8rem 1.3rem;
        font-size: 2rem;
        color: var(--color-theme);

        & > .cancle {
          font-size: 1.8rem;
        }
      }

      & > .content-box {
        flex-grow: 1;
        overflow: hidden scroll;

        & > .hot-filter {
          border-bottom: 1px solid var(--color-bg);
        }

        & .checkbox-gourp {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 1.1rem;
          padding: 0 1.2rem 1.2rem 1.2rem;
        }

        & .compound-box {

          // 单个输入框
          & > .input-one {
            padding: 1.3rem;

            & > input {
              width: 100%;
              border: none;
              border-radius: .3rem;
              padding: 1.3rem;
              font-size: 1.5rem;
              background-color: #f7f7f7;
            }
          }

          // 范围输入框
          & > .input-range {
            display: flex;
            justify-content: space-between;
            padding: 1.3rem;

            & > input {
              border: none;
              border-radius: .3rem;
              padding: 1.3rem;
              width: 13rem;
              font-size: 1.5rem;
              background-color: #f7f7f7;
            }

            & > .iconfont {
              display: grid;
              align-items: center;
            }
          }
        }
      }

      & > footer {
        display: flex;
        flex-shrink: 0;
        border-top: 1px solid var(--color-bg);

        & > div {
          flex-basis: 50%;
          display: flex;
          justify-content: center;
          padding: 1.9rem;
          font-size: 2rem;
          color: #333333;
          background-color: #fff;

          &:last-of-type {
            color: #ffffff;
            background-color: var(--color-theme);
          }
        }
      }
    }
  }
}
</style>