<template>
  <div class="view-set">
    <preview
      :data="form"
    />
    <div class="setting-group">
      <div class="template">
        <div class="template-item active">
          <img src="~@/assets/images/super-crm/point-mall/weihaoli-slt.jpg" alt="图片">
          <div class="bottom">
            <div class="left">
              模板1
            </div>
            <div class="right">
              <i class="iconfont el-icon-success"></i>
              选择
            </div>
          </div>
        </div>
      </div>
      <el-form
        label-width="150px"
        v-model="form"
        class="form"
      >
        <el-form-item
          label="首页标题："
        >
          <el-input
            v-model="form.title"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="首页礼品显示数量："
        >
          <el-select
            v-model="form.showNumber"
          >
            <el-option
              v-for="item of 10"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="主题颜色："
          class="theme-color"
        >
          <div class="color-picker-box">
            <el-color-picker v-model="form.themeColor"></el-color-picker>
            <div class="preinstall-color">
              <div
                v-for="(item, index) of recommendColor"
                :key="index"
                :style="{
                  backgroundColor: item
                }"
                @click="setThemeColor(item)"
              >
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="活动背景色："
        >
          <div class="color-picker-box">
            <el-color-picker v-model="form.activityBackgroundColor"></el-color-picker>
            <div class="preinstall-color">
              <div
                :style="{
                  backgroundColor: '#ea665e'
                }"
                @click="form.activityBackgroundColor = '#ea665e'"
              >
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="活动文字色："
        >
          <div class="color-picker-box">
            <el-color-picker v-model="form.activityFontColor"></el-color-picker>
            <div class="preinstall-color">
              <div
                :style="{
                  backgroundColor: '#fff283'
                }"
                @click="form.activityFontColor = '#fff283'"
              >
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="兑换数量："
        >
          <el-radio-group v-model="form.isShowExchange">
            <el-radio label="1">显示</el-radio>
            <el-radio label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="商品显示"
        >
          <el-checkbox
            v-model="form.giftValue"
            true-label="Y"
            false-label="N"
          >
            只展示会员发卡门店商品(会员没有发卡门店，则显示所有商品)
          </el-checkbox>
        </el-form-item>
        <el-form-item
          v-if="form.services"
          label="微客服浮窗显示设置："
        >
          <el-checkbox
            v-for="(item, index) of form.services"
            :key="index"
            :true-label="1"
            :false-label="0"
            v-model="item.enable"
          >
            {{item.name}}
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="setAppStyle"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {getAppStyle, setAppStyle} from '@/api/super-crm/point-mall';
import Preview from './Preview.vue';

@Component({
  components: {
    Preview
  }
})
export default class PointMallViewSet extends Vue {
  form = {
    templateNo: 1, // 模板号
    title: '',
    showNumber: 1,
    themeColor: '#e12f30',
    activityBackgroundColor: '#ea665e',
    activityFontColor: '#fff283',
    isShowExchange: 0,
    services: null,
    giftValue: 'Y'
  }

  recommendColor = [
    '#e12f30',
    '#9e0028',
    '#f66b77',
    '#e83b66',
    '#dbb866',
    '#e4c589',
    '#6e73b8',
    '#f1ae85',
    '#d9b39b',
  ]

  mounted() {
    this.getAppStyle();
  }

  // 设置主题颜色
  setThemeColor(color: string) {
    this.form.themeColor = color;
  }

  // 查询奖品类型列表
  getAppStyle() {
    return new Promise((resolve, reject) => {
      const body = {}

      getAppStyle(body).then((res: any) => {
        const {data} = res;
        const {
          templateNo,
          title,
          showAmount,
          backgroundColor,
          themeColor,
          fontColor,
          isShowExchange,
          services,
          giftValue
        } = data;

        this.form = {
          templateNo,
          title,
          showNumber: showAmount,
          themeColor,
          activityBackgroundColor: backgroundColor,
          activityFontColor: fontColor,
          isShowExchange,
          services,
          giftValue: giftValue ? 'Y' : 'N'
        }

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 设置奖品类型列表
  setAppStyle() {
    return new Promise((resolve, reject) => {
      const {
        templateNo,
        title,
        showNumber,
        themeColor,
        activityBackgroundColor,
        activityFontColor,
        isShowExchange,
        services,
        giftValue
      } = this.form;

      const body = {
        templateNo,
        title,
        showAmount: showNumber,
        backgroundColor: activityBackgroundColor,
        themeColor,
        fontColor: activityFontColor,
        isShowExchange,
        services,
        giftValue
      }

      setAppStyle(body).then((res: any) => {
        const {data} = res;

        this.$message.success('修改成功');

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.view-set {
  display: flex;

  > .setting-group {
    > .template {
      display: flex;
      margin-bottom: 35px;

      > .template-item {
        border: 2px solid #606266;
        border-radius: 5px;
        width: 145px;
        cursor: pointer;

        > img {
          width: 100%;
          height: 250px;
          vertical-align: bottom;
        }

        > .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 2px solid #eeeeee;
          padding: 4px;
          height: 40px;

          > .left {
            color: #606266;
            font-size: 14px;
          }

          > .right {
            border: 1px solid #606266;
            border-radius: 5px;
            padding: 3px 6px;
            font-size: 14px;
            color: #606266;
          }
        }

        &.active {
          border: 2px solid #4091ff;

          > .bottom {
            > .right {
              border: 1px solid #409eff;
              color: #fff;
              background-color: #409eff;
            }
          }
        }
      }
    }

    > .form {
      .color-picker-box {
        .preinstall-color {
          display: flex;
          margin-left: 10px;

          > div {
            cursor: pointer;
            height: 40px;
            width: 40px;
          }
        }
      }

      .color-picker-box {
        display: flex;
      }
    }
  }
}
</style>


