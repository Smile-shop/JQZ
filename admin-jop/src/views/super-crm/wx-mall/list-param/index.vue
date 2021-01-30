<template>
  <div class="parameter-show">
    <nav>
      <div
        v-for="(item, index) in jewelryGeneraList"
        :class="{
          active: index === jewelryGeneraShowIndex
        }"
        :key="index"
        @click="findJewelryGenera(index)"
      >
        {{item.name}}
      </div>
    </nav>

    <el-card class="product-set">
      <div slot="header" class="header">
        <span>请选择商品要显示的参数</span>
      </div>
      <div class="product-param">
        <el-input
          v-model="productParamKeyword"
          placeholder="查询"
        >
        </el-input>
        <ul>
          <li
            v-for="(item, index) in productPropertysfilter"
            :key="index"
          >
            <span>{{item.name}}</span>
            <el-checkbox
              size="large"
              v-model="item.check"
            >
            </el-checkbox>
          </li>
        </ul>
      </div>
      <footer
        class="footer"
      >
        <el-button
          type="primary"
          @click="addCheckedHandle"
        >
          添加选中
        </el-button>
      </footer>
    </el-card>

    <el-card class="product-show-param">
      <div slot="header" class="header">
        <span>请对参数进行排序(不能超过4个)</span>
      </div>
      <div>
        <ul class="show-param-list">
          <li
            v-for="(item, index) in showDatas"
            :key="index"
          >
            <span class="number">{{index + 1}}</span>
            <span class="name">{{item.name}}</span>
            <el-input
              v-if="!item.isCustom"
              v-model="item.rename"
              class="rename"
              type="text"
              placeholder="重命名"
            />
            <el-input
              v-if="!item.isCustom"
              v-model="item.unit"
              class="unit"
              type="text"
              placeholder="单位"
            />
            <span
              v-if="item.isCustom"
              class="customParamValue"
            >
              {{item.value}}
            </span>
            <div
              class="moveIconGroup"
            >
              <div>
                <el-button
                  v-show="index !== 0"
                  type="primary"
                  circle
                  icon="el-icon-caret-top"
                  size="small"
                  @click="moveUp(index)"
                >
                </el-button>
              </div>
              <div>
                <el-button
                  v-show="index + 1 !== showDatas.length"
                  type="primary"
                  circle
                  icon="el-icon-caret-bottom"
                  size="small"
                  @click="moveDown(index)"
                >
                </el-button>
              </div>
            </div>
          </li>
        </ul>
        <footer
          class="footer"
        >
          <el-button
            type="primary"
            @click="saveSet"
          >
            保存设置
          </el-button>
        </footer>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {Message} from 'element-ui';
import {queryDisplayParamOptions, queryJewelryQenera, updateListDisplayParamOptions} from '@/api/super-crm/wx-mall';

@Component({
  filters: {
    addPreviewData(data: string) {
      if (!data) {
        return '***'
      } else {
        return data
      }
    }
  }
})
export default class WxCredentialparameterShow extends Vue {
  jewelryGeneraList: any = [] // 首饰大类列表
  jewelryGeneraShowIndex = 0 // 显示的首饰大类索引
  productPropertys: any = [] // 产品属性
  productPropertysfilter: any = [] // 过滤后的产品属性
  productParamKeyword = '' // 产品参数关键字
  otherInfoList: any = [] // 其它信息列表
  showDatas: any = [] // 显示的数据
  remark = '' // 备注
  isShowPreview = false

  @Watch('productParamKeyword')
  watchProductParamKeyword(value: any) {
    if (!value) {
      this.productPropertysfilter = this.productPropertys
    } else {
      this.productPropertysfilter = this.productPropertys.filter((item: any) => {
        return item.name.includes(value)
      })
    }
  }

  mounted() {
    this.findSelectedJewelryGenera()
  }

  // 查询已选择的首饰大类 *
  findSelectedJewelryGenera() {
    const body = {};

    queryJewelryQenera(body).then((res: any) => {
      const data = res.data
      this.jewelryGeneraList = data.dataList
      this.findJewelryGenera(0);
    })
  };

  // 查询首饰大类的属性 *
  findJewelryGenera(index: number) {
    this.jewelryGeneraShowIndex = index

    const body = {
      showType: 3,
      displayMode: 3,
      category: this.jewelryGeneraList[index].id
    }

    queryDisplayParamOptions(body).then((res: any) => {
      const data = res.data
      const {customProperty, productProperty, rename, showDataList} = data
      this.productPropertys = productProperty
      this.productPropertysfilter = productProperty
      this.otherInfoList = customProperty
      this.showDatas = showDataList
    })
  };

  // 添加选中处理 *
  addCheckedHandle() {
    // 选中的产品属性
    const checkedProductPropertys = this.productPropertys.filter((item: any) => {
      return item.check === true
    })

    // 产中的自定义属性
    const checkedCustomPropertys = this.otherInfoList.filter((item: any) => {
      return item.check === true
    })

    // 所有选中的属性
    const tempShowDatas = checkedProductPropertys.concat(checkedCustomPropertys)

    // 显示的属性中只返回已经选中的元素
    this.showDatas = this.showDatas.filter((item: any) => {
      const itemName = item.name

      return tempShowDatas.some((item2: any) => {
        return item2.name === item.name
      })
    })

    // 将显示数据中没有的数据添加到显示数据中
    tempShowDatas.forEach((item: any) => {
      const isHaveItem = this.showDatas.every((item2: any) => {
        return item2.name !== item.name
      })

      if (isHaveItem) {
        this.showDatas.push(item)
      }
    })
  }

  // 向上移动
  moveUp(index: number) {
    const item = this.showDatas.splice(index, 1)[0]
    this.showDatas.splice(index - 1, 0, item)
  }

  // 向下移动
  moveDown(index: number) {
    const item = this.showDatas.splice(index, 1)[0]
    this.showDatas.splice(index + 1, 0, item)
  }

  // 保存设置
  saveSet() {
    const body = {
      displayMode: 3,
      categoryName: this.jewelryGeneraList[this.jewelryGeneraShowIndex].name,
      category: this.jewelryGeneraList[this.jewelryGeneraShowIndex].id,
      showContent: this.showDatas,
      productProperty: this.productPropertys,
      customContent: this.otherInfoList
    }

    if (body.showContent.length > 4) {
      this.$message.warning('不能超过4个');
    } else {
      updateListDisplayParamOptions(body).then((res: any) => {
        Message.success('保存成功');
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.parameter-show {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 20px;

  > nav {
    display: flex;
    flex-direction: column;
    width: 15%;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      font-size: 16px;
      border-bottom: 1px solid #eeeeee;
      cursor: pointer;

      &.active {
        border-bottom: 1px solid #3497db;
        color: #3497db;
        font-weight: bold;
      }
    }
  }

  > .product-set {
    width: 40%;

      .product-param {
        margin-bottom: 15px;

        ul {
          overflow-y: scroll;
          list-style: none;
          margin-top: 10px;
          border: 1px solid rgb(233, 234, 236);
          border-radius: 2px;
          padding: 10px;
          height: 500px;

          > li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 35px;
          border-bottom: 1px solid #eee;

          > input {
            height: 18px;
            width: 18px;
          }
          }
        }
      }

      .custom-param {
        margin-bottom: 15px;

        .header {
          display: flex;
          justify-content: space-between;

          > a {
            color: #3497db;
          }
        }

        .row {
          display: flex;
          margin-bottom: 10px;
          align-items: center;
          justify-content: space-between;

          &:last-of-type {
            margin-bottom: 0;
          }

          .icon-group {
            display: flex;
            justify-content: space-between;
            width: 13%;
            margin-right: 10px;
          }
        }
      }

      .remark {
        margin-bottom: 15px;
      }

      .footer {
        display: flex;
        justify-content: center;
      }
  }

  > .product-show-param {
    width: 40%;

    .header {
      display: flex;
      justify-content: space-between;

      > a {
        color: #3497db;
      }
    }

    .show-param-list {
      list-style: none;

      > li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        height: 40px;

        .number {
          width: 10%;
          padding-right: 10px;
        }

        .name {
          width: 25%;
          padding-right: 10px;
        }

        .rename {
          width: 25%;
          padding-right: 10px;
        }

        .unit {
          width: 25%;
          padding-right: 10px;
        }

        .customParamValue {
          width: 50%;
        }

        .moveIconGroup {
          display: flex;
          justify-content: flex-end;
          width: 15%;

          > div {
            width: 50%;

            .ivu-icon {
              cursor: pointer;
            }
          }
        }
      }
    }

    .footer {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }

  > .preview-box {
    position: absolute;
    top: 100px;
    right: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: 700px;
    background: url(~@/assets/images/super-crm/wx-credential/test-phone.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;

    .preview-content {
      display: flex;
      flex-direction: column;
      width: 295px;
      height: 610px;
      transform: translateY(5px);
      border-radius: 26px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      background-color: rgb(244, 244, 244);

      > header {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 150px;
        font-size: 40px;
        color: rgb(51, 141, 237);
        font-weight: bold;
      }

      > main {
        border-top: 2px solid #fff;
        padding: 20px;

        ul {
          list-style-type: none;
          margin-bottom: 15px;

          &:last-of-type {
            margin-bottom: 0;
          }

          > li {
            margin-bottom: 5px;
            display: flex;

            &:last-of-type {
              margin-bottom: 0;
            }

            > span {
              &:first-of-type {
                margin-right: 5px;
                font-weight: bold;
                width: 30%;
              }

              &:last-of-type {
                width: 70%;
                color: rgb(140, 140, 140);
              }
            }
          }
        }
      }
    }
  }
}
</style>
