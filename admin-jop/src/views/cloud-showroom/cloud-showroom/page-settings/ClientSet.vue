<template>
  <div class="client-set">
    <set-layout>
      <div class="preview" slot="preview">
        <div class="preview_bg">
          <img src="@/assets/images/super-crm/cloud-showroom/goods.png" alt="">
         <!--  <footer>
            <div class="home">
              <i class="iconfont icon-shouye"></i>
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
            <div class="active">
              <i class="iconfont icon-wode_xuanzhong"></i>
              我的
            </div> 
          </footer> -->
        </div>
        <img v-if="formData.editShopmallName" src="~@/assets/images/super-crm/cloud-showroom/my.png" alt="图片">
        <img v-else src="~@/assets/images/super-crm/cloud-showroom/my-2.png" alt="图片">
      </div>
      <div slot="set">
        <el-form
          label-position="top"
          :model="formData"
          class="form"
        >
          <el-form-item label="设置客户信息">
            <el-checkbox
              v-model="formData.editShopmallName"
              :true-label="1"
              :false-label="0"
            >
              允许客户更改商城名称、金价等信息，并公开分享
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              class="set-button"
              type="primary"
              @click="setPageSet"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
        <dl class="explain">
          <dt>
            说明：
          </dt>
          <dd>
            1.客户更改商城名称、价格展示倍率后，会更改客户自己手机内小程序展示的名称和价格；
          </dd>
          <dd>
              2.可用于展厅内向进店顾客展示使用。
          </dd>
        </dl>
      </div>
    </set-layout>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import SetLayout from './components/SetLayout.vue';
import Preview from './components/Preview.vue';
import { getPageSet, setPageSet } from '@/api/super-crm/cloud-showroom-page';

@Component({
  components: {
    SetLayout,
    Preview
  }
})
export default class ClientSet extends Vue {
  formData = {
    editShopmallName: 0
  }

  mounted() {
    this.getPageSet();
  }

  async getPageSet() {
    const body = {};

    const res = await getPageSet(body);
    this.formData = res.replyData;
  }

  async setPageSet() {
    const body = {
      ...this.formData
    };

    const res = await setPageSet(body);
    this.$message.success('设置成功');
  }
}
</script>

<style lang="scss" scoped>
  .client-set {
    .form {
      width: 400px;
      .set-button{
        width: 68px;
        padding: 7px;
        font-size: 12px;
      }
    }

    .preview {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      > .preview_bg{
        position: absolute;
        top: 0;
        footer {
          position: sticky;
          bottom: 67px;
          background-color: #FFF;
          padding: 8px 28px;
          display: flex;
          justify-content: space-between;
          box-shadow: #DCDCE3 0 -2px 5px;
          width: 82%;
          left: 63px;

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
            }
            &.home{
              i{
                font-size: 20px;
              }
            }
          }
        }
      }
      > img {
        // width: 375px;
        // height: auto;
        width: 298px;
        position: relative;
        top: 53px;
      }
    }

    .explain {
      color: #40445C;
      line-height: 2;

      dt {
        font-size: 14px;
      }

      dd {
        font-size: 12px;
      }
    }
  }
</style>
