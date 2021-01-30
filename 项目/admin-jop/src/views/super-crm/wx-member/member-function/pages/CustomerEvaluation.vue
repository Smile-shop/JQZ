<template>
  <article class="customer-evaluation">
    <el-tabs v-model="activeName">
      <el-tab-pane label="设置门店" name="1">
        <div class="title">指定门店： （勾选后客户只能评价已勾选门店的珠宝顾问）</div>
        <el-checkbox
          :indeterminate="isIndeterminateShopAllCheck"
          v-model="isShopAllCheck"
          @change="allShopClick"
        >全选</el-checkbox>
        <el-checkbox-group v-model="selectedShopList">
          <el-checkbox
            :label="item.shopName"
            v-for="item in allShopList"
            @change="selectShopClick"
            :key="item.shopName"
            class="checkbox-item"
          >{{item.shopName}}</el-checkbox>
        </el-checkbox-group>
        <el-button class="sub-btn" type="primary" @click="subEvaluationShop">保存</el-button>
      </el-tab-pane>
      <el-tab-pane label="评价维度" name="2">
        <section class="evaluation-content">
          <div class="phone-show">
            <div class="info">【效果预览】</div>
            <div class="phone-content">
              <header>
                <div class="icon">
                  <i class="iconfont icon-zuo"></i>
                </div>
                <div class="content">满意度调研</div>
                <div class="icon">我的评价</div>
              </header>
              <div class="select-item">
                <span>请选择门店</span>
                <i class="iconfont icon-you"></i>
              </div>
              <div class="select-item">
                <span>请选择门店</span>
                <i class="iconfont icon-you"></i>
              </div>
              <div class="level">满意度等级</div>
              <div class="rate-item" v-for="(item, index) in checkItemList" :key="index">
                <div class="rate-name">{{item}}</div>
                <div class="star">
                  <i
                    v-for="(rate, i) in 5"
                    :key="rate"
                    :class="[index >= (5-i) ? 'un-select' : 'select']"
                    class="el-icon-star-on"
                  ></i>
                </div>
                <div
                  class="rate-info"
                >{{['非常满意', '满意', '一般', '不满意', '非常不满意'][index > 4 ? 4 : index]}}</div>
              </div>

              <div
                class="rate-item"
                v-for="(item, index) in evaluationItemListBySelfChecked"
                :key="item"
              >
                <div class="rate-name">{{item}}</div>
                <div class="star">
                  <i
                    v-for="(rate, i) in 5"
                    :key="rate"
                    :class="[index >= (5-i) ? 'un-select' : 'select']"
                    class="el-icon-star-on"
                  ></i>
                </div>
                <div
                  class="rate-info"
                >{{['非常满意', '满意', '一般', '不满意', '非常不满意'][index > 4 ? 4 : index]}}</div>
              </div>
              <div class="level">评价详情</div>
              <div class="text-area">请填写详细评价</div>
              <div class="eva-btn">提交评价</div>
              <div class="footer-info">技术支持：金千枝数字化技术中心</div>
            </div>
          </div>
          <div class="set-con">
            <div class="set-item">
              <div class="title">选择维度：</div>
              <div class="content">
                <el-checkbox-group class="wd-select" v-model="checkItemList">
                  <el-checkbox
                    :label="item"
                    v-for="(item, index) in evaluationList"
                    :key="index"
                  >{{item}}</el-checkbox>
                </el-checkbox-group>
                <div class="wd-add-btn" @click="addEvaluationItem">
                  <i class="el-icon-plus"></i>添加维度
                </div>
                <div class="z-d-y-select">
                  <el-checkbox-group v-model="evaluationItemListBySelfChecked">
                    <el-checkbox
                      :disabled="evaluationItemListBySelf[index] === ''"
                      :label="evaluationItemListBySelf[index]"
                      class="item"
                      v-for="(item, index) in evaluationItemListBySelf"
                      :key="index"
                    >
                      <div style="cursor: pointer;">
                        <el-input
                          @focus="inputFocus(index)"
                          @blur="inputBlur(index)"
                          size="small"
                          :maxlength="10"
                          v-model="evaluationItemListBySelf[index]"
                          :placeholder="`自定义维度${index+1}`"
                          style="width:120px"
                        ></el-input>
                        <i class="el-icon-error" @click.stop.prevent="removeItem(index)"></i>
                      </div>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="z-d-y-info">*自定义维度最多五个</div>
              </div>
            </div>
            <div class="set-item">
              <div class="title"></div>
              <div class="content">
                <el-button type="primary" @click="setEvaluationSettings">保存</el-button>
              </div>
            </div>
          </div>
        </section>
      </el-tab-pane>
      <el-tab-pane label="客户评价记录" name="3">
        <EvalutionRecord v-if="activeName === '3'" :shopList="selectedShopList" />
      </el-tab-pane>
      <el-tab-pane label="珠宝顾问评价统计" name="4">
        <EvalutionSalerRecord
          v-if="activeName === '4'"
          :shopList="selectedShopList"
          :tableColumn="tableColumn"
        />
      </el-tab-pane>
    </el-tabs>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  getAllShopList,
  getSelectedShopList,
  subEvaluationShop,
  updateShopStatus,
  getEvaluationSettings,
  setEvaluationSettings
} from '@/api/super-crm/wx-member-functions'
import EvalutionRecord from './evalution/EvalutionRecord.vue'
import EvalutionSalerRecord from './evalution/EvalutionSalerRecord.vue'

@Component({
  components: {
    EvalutionRecord,
    EvalutionSalerRecord
  }
})
export default class CustomerEvaluation extends Vue {
  private activeName: string = '1'
  private checked: boolean = false
  private checkList = []
  private input: string = ''

  private rateValue: number = 1
  private evaluationList = [
    '服务态度',
    '专业知识',
    '仪容仪表',
    '店面形象',
    '商品陈列'
  ]
  private checkItemList = [
    '服务态度',
    '专业知识',
    '仪容仪表',
    '店面形象',
    '商品陈列'
  ]
  private evaluationItemListBySelf: string[] = []
  private evaluationItemListBySelfChecked: string[] = []
  private oldInputValue: string = ''

  private allShopList = []
  private selectedShopList: string[] = []
  private isShopAllCheck: boolean = false
  private isIndeterminateShopAllCheck: boolean = false

  private defaultEvalution = []
  private customzieEvalution = []

  private tableColumn = []

  private mounted() {
    this.getAllShopList()
    this.getEvaluationSettings()
  }

  private getEvaluationSettings() {
    getEvaluationSettings().then((res: any) => {
      if (res.data.customCategory) {
        const defaultList = res.data.customCategory.default
        const customzieList = res.data.customCategory.customzie
        this.checkItemList = defaultList.map((p: any) => p.name)
        this.evaluationItemListBySelf = customzieList.map((p: any) => p.name)
        this.evaluationItemListBySelfChecked = customzieList
          .filter((p: any) => p.check === '1')
          .map((p: any) => p.name)
        this.tableColumn = defaultList
          .filter((p: any) => p.check === '1')
          .map((p: any) => p.name)
          .concat(this.evaluationItemListBySelfChecked)
      }
    })
  }
  private getAllShopList() {
    getAllShopList().then((res: any) => {
      this.allShopList = res.data || []
      this.selectedShopList = this.allShopList
        .filter((p: any) => p.evaluation_status === '1')
        .map((p: any) => p.shopName)
      this.selectShopClick();
    })
  }

  private selectShopClick() {
    this.isShopAllCheck =
      this.allShopList.length === this.selectedShopList.length
    this.isIndeterminateShopAllCheck =
      this.selectedShopList.length > 0 &&
      this.selectedShopList.length < this.allShopList.length
  }

  private allShopClick(value: any) {
    this.selectedShopList = value
      ? this.allShopList.map((p: any) => p.shopName)
      : []
    this.isIndeterminateShopAllCheck = false
  }

  private subEvaluationShop() {
    const lists  = this.allShopList.map((p: any) => {
      return {
        shopName: p.shopName,
        evaluation_status: '0',
      }
    })
    lists.forEach(item => {
      this.selectedShopList.forEach(p => {
        if (item.shopName === p) {
          return item.evaluation_status = '1'
        }
      })
    });
    // const params = {
    //   evaluationStatus: '1',
    //   list: this.selectedShopList
    // }
    updateShopStatus(lists).then((res: any) => {
      this.$message({
        type: 'success',
        message: '保存成功！'
      })
      this.getAllShopList()
    })
  }

  private addEvaluationItem() {
    if (this.evaluationItemListBySelf.length < 5) {
      this.evaluationItemListBySelf.push('')
    } else {
      this.$message('已达自定义维度上限！')
    }
  }

  private removeItem(index: number) {
    this.evaluationItemListBySelf.splice(index, 1)
  }

  private inputFocus(index: number) {
    this.oldInputValue = this.evaluationItemListBySelf[index]
  }

  private inputBlur(index: number) {
    const isSame = this.evaluationItemListBySelfChecked.includes(
      this.evaluationItemListBySelf[index]
    )
    if (isSame) {
      this.$message({
        type: 'info',
        message: '填写维度名称不能相同！'
      })
      this.$set(this.evaluationItemListBySelf, index, this.oldInputValue)
    }
  }

  private setEvaluationSettings() {
    const defaultList = this.checkItemList.map((p: any, i: number) => {
      return {
        name: p,
        isCustom: 0,
        check: 1,
        id: i
      }
    })
    if (
      this.evaluationItemListBySelfChecked.findIndex((p: string) => p === '') >
      -1
    ) {
      this.$message({
        type: 'info',
        message: '请填写维度名称！'
      })
      return
    }
    const customzie = this.evaluationItemListBySelf.map(
      (p: string, i: number) => {
        const checked = this.evaluationItemListBySelfChecked.includes(p)
        return {
          name: p,
          isCustom: 1,
          check: checked ? 1 : 0,
          id: i + defaultList.length
        }
      }
    )
    const params = {
      scoreRule: '1',
      customCategory: {
        default: defaultList,
        customzie
      }
    }
    setEvaluationSettings(params).then((res: any) => {
      this.getEvaluationSettings()
      this.$message({
        type: 'success',
        message: '保存成功！'
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.customer-evaluation {
  .title {
    font-size: 14px;
    color: #333333;
    padding-bottom: 12px;
  }
  .checkbox-item {
    width: 185px;
    margin-top: 20px;
  }
  .sub-btn {
    margin-top: 20px;
  }
  .evaluation-content {
    display: flex;
    .phone-show {
      width: 375px;
      .info {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #409eff;
        padding-bottom: 12px;
      }
      .phone-content {
        width: 375px;
        height: 686px;
        overflow: auto;
        background-color: #f5f5f5;
        border: 1px solid #e5e5e5;
        header {
          display: flex;
          height: 44px;
          align-items: center;
          background-color: #ffffff;
          .icon {
            width: 80px;
            padding-left: 8px;
            font-size: 14px;
            color: #d41010;
          }
          .content {
            flex-grow: 1;
            text-align: center;
            font-size: 18px;
            color: #333333;
          }
        }
        .select-item {
          height: 50px;
          line-height: 50px;
          font-size: 14px;
          color: #787878;
          padding-left: 12px;
          span {
            padding-right: 265px;
          }
          i {
            font-size: 12px;
            color: #dddddd;
          }
        }
        .select-item:first-child {
          border-bottom: 1px solid #e5e5e5;
        }
        .level {
          height: 44px;
          line-height: 44px;
          background-color: #ffffff;
          font-size: 18px;
          color: #d41010;
          padding-left: 12px;
        }
        .rate-item {
          display: flex;
          align-items: center;
          height: 44px;
          border-bottom: 1px solid #e5e5e5;
          .rate-name {
            font-size: 14px;
            color: #787878;
            padding-left: 12px;
            width: 152px;
          }
          .star {
            i {
              font-size: 18px;
            }
            .select {
              color: #d41010;
            }
            .un-select {
              color: gray;
            }
          }
          .rate-info {
            font-size: 12px;
            color: #999999;
            padding-left: 12px;
          }
        }
        .text-area {
          width: 351px;
          height: 100px;
          background-color: #ffffff;
          border-radius: 10px;
          border: solid 1px #e5e5e5;
          margin: 14px auto;
          font-size: 12px;
          color: #cccccc;
          padding: 12px;
        }
        .eva-btn {
          width: 149px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background-color: #d41010;
          color: #ffffff;
          margin: 0 auto;
          border-radius: 5px;
          font-size: 15px;
          color: #ffffff;
        }
        .footer-info {
          font-size: 12px;
          color: #cccccc;
          text-align: center;
          padding: 24px;
        }
      }
    }
    .set-con {
      flex-grow: 1;
      padding: 30px 0 0 40px;
      .set-item {
        display: flex;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #666666;
        margin-bottom: 24px;
        .title {
          width: 70px;
          text-align: right;
          font-weight: bold;
          line-height: 35px;
        }
        .content {
          padding-left: 8px;
          .wd-select {
            display: inline-block;
          }
          .wd-add-btn {
            display: inline-block;
            width: 94px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            border-radius: 5px;
            border: solid 1px #409eff;
            color: #409eff;
            margin-left: 24px;
            cursor: pointer;
            i {
              font-size: 12px;
            }
          }
          .wd-add-btn:hover {
            opacity: 0.8;
          }
          .z-d-y-select {
            margin: 12px 0;
            .item {
              margin-bottom: 12px;
            }
            i {
              font-size: 16px;
              margin-left: 12px;
              color: #eb3941;
              cursor: pointer;
            }
          }
          .z-d-y-info {
            font-size: 14px;
            color: #999999;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.customer-evaluation {
  .el-checkbox__label {
    width: 95%;
    white-space: normal;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: inline-block;
    -webkit-box-orient: vertical;
    vertical-align: middle;
    position: relative;
    .chekbox-label {
      position: absolute;
      bottom: -19px;
      left: 9px;
      font-size: 12px;
      color: #999;
      min-width: 200px;
    }
  }
}
</style>


