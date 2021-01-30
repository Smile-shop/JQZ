<template>
  <div class="share">
    <set-layout>
      <div class="preview" slot="preview">
        <div
          :class="{
            template: true,
            'template-1': form.shareStyle == '1',
            'template-2': form.shareStyle == '2',
            'template-3': form.shareStyle == '3',
          }"
        >
          <section v-show="form.shareLogo == 1" class="header">
            <img src="~@/assets/images/super-crm/wx-mall/logo.jpg" alt="头像">
            <div class="right">
              <h2>金千枝</h2>
              <p>给您分享了一个商品</p>
            </div>
          </section>
          <section v-show="form.shareLogo == 2" class="header">
            <img src="~@/assets/images/super-crm/wx-mall/head-portrait.jpg" alt="头像">
            <div class="right">
              <h2>张萌萌</h2>
              <p>给您分享了一个商品</p>
            </div>
          </section>
          <section class="content">
            <img src="~@/assets/images/super-crm/wx-mall/product.png" alt="商品">
            <section class="bottom">
              <div class="left">
                <p class="introduce">
                  周六福品牌最热 高浓度 包邮自然系列
                </p>
                <p class="product-info">
                  <span v-show="form.sharePrice == '1'" class="price">
                    <small class="small">
                      ￥
                    </small>
                    399
                  </span>
                  <span v-show="form.shareWeight == '1'" class="weight">
                    500g
                  </span>
                </p>
              </div>
              <div class="right">
                <img src="~@/assets/images/super-crm/wx-mall/qr-code.png" alt="二维码">
                <p>
                  长按保存图片
                  <i class="iconfont icon-icon-refresh"></i>
                </p>
              </div>
            </section>
          </section>
        </div>
      </div>
      <div slot="set">
        <el-form
          label-position="top"
          :model="form"
          class="form"
        >
          <el-form-item label="选择模板">
            <el-radio-group v-model="form.shareStyle">
              <el-radio label="1">模板一</el-radio>
              <el-radio label="2">模板二</el-radio>
              <el-radio label="3">模板三</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分享人信息">
            <el-radio-group v-model="form.shareLogo">
              <el-radio label="1">显示企业logo</el-radio>
              <el-radio label="2">显示营业员头像和昵称</el-radio>
              <el-radio label="3">不显示分享人信息</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="参数显示">
            <el-checkbox v-model="form.sharePrice" true-label="1" false-label="0">显示价格</el-checkbox>
            <el-checkbox v-model="form.shareWeight" true-label="1" false-label="0">显示重量（主石重量）</el-checkbox>
            <p
              :style="{
                fontSize: '12px',
                color: '#9A9EA6'
              }"
            >
              温馨提示：有主石重量则展示”主石重量”，当黄金按克卖则展示”净金重”，其他大类均不展示
            </p>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSave"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </set-layout>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import SetLayout from './components/SetLayout.vue';
import { setProductShareStyle,  getProductShareStyle} from '@/api/super-crm/wx-mall';

@Component({
  components: {
    SetLayout,
  }
})
export default class Share extends Vue {
  form = {
    shareStyle: '1',
    shareLogo: '2',
    sharePrice: '1',
    shareWeight: '0',
  };

  mounted() {
    this.getProductShareStyle();
  }

  onSave() {
    this.setProductShareStyle();
  }

  async getProductShareStyle() {
    const body = {};
    const { data } = await getProductShareStyle(body);
    this.form = data;
  }

  async setProductShareStyle() {
    const body = {
      ...this.form
    }

    const res = await setProductShareStyle(body);
    this.$message.success('设置成功');
    this.getProductShareStyle();
  }
}
</script>

<style lang="scss" scoped>
.share {
  .preview {
    display: flex;
    align-items: center;
    justify-content: center;

    .template {
      display: flex;
      flex-direction: column;
      width: 332px;
      box-shadow:0px 2px 30px 0px rgba(0, 0, 0, 0.1);
      border-radius:8px;
      overflow: hidden;
      padding: 16px;

      &.template {
        > .header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;

          > img {
            margin-right: 16px;
            height: 56px;
            width: 56px;
            border-radius: 50%;
            object-fit: contain;
            object-position: center center;
            background: #FFF;
            border: 2px solid #FFF;
          }

          > .right {
            > h2 {
              margin-bottom: 8px;
              color: #333333;
              font-size: 18px;
              font-weight: bold;
            }

            > p {
              color: #999999;
              font-size: 12px;
            }
          }
        }

        > .content {
          border-radius: 8px;
          overflow: hidden;
          box-shadow:0px 2px 20px 0px rgba(0, 0, 0, 0.05);

          > img {
            margin-bottom: 10px;
            height: auto;
            width: 100%;
          }

          > .bottom {
            padding: 15px;
            display: flex;
            justify-content: space-between;

            > .left {
              display: flex;
              flex-direction: column;
              margin-right: 30px;
              flex-shrink: 1;

              > .introduce {
                line-height: 30px;
                font-size:14px;
                color:rgba(149,158,172,1);
              }

              > .product-info {
                > .price {
                  margin-right: 15px;
                  font-size: 26px;
                  color: #FF0000;

                  > small {
                    font-size: 14px;
                  }
                }

                > .weight {
                  color:rgba(149,158,172,1);
                }
              }
            }

            > .right {
              display: flex;
              flex-direction: column;
              flex-shrink: 0;
              align-items: flex-end;

              > img {
                margin-bottom: 10px;
                width: 80px;
                height: 80px;
              }

              > p {
                font-size: 12px;
                color:rgba(153,153,153,1);
                display: none;

                > .iconfont {
                  font-size: 14px;
                }
              }
            }
          }
        }
      }

      &.template-2 {
        position: relative;
        padding: unset;

        > .header {
          position: absolute;
          top: 12px;
          left: 12px;
          background:rgba(0,0,0,.4);
          border-radius: 35px;
          padding: 6px 20px 6px 8px;

          > img {
            height: 48px;
            width: 48px;
          }

          > .right {
            > h2 {
              color: #FFF;
            }

            > p {
              color: #FFF;
            }
          }
        }

        > .content {
          border-radius: unset;
          box-shadow: unset;
        }
      }

      &.template-3 {
        > .header {
          align-self: center;
          background:rgba(234,237,241,1);
          border-radius: 35px;
          padding: 2px 10px;

          > img {
            border: unset;
            margin-right: 5px;
            height: 20px;
            width: 20px;
          }

          > .right {
            > h2 {
              display: none;
            }

            > p {
              color: #606266;
            }
          }
        }

        > .content {
          > .bottom {
            > .left {
              flex-direction: column-reverse;
            }

            > .right {
              > p {
                display: unset;
              }
            }
          }
        }
      }
    }
  }
}
</style>
