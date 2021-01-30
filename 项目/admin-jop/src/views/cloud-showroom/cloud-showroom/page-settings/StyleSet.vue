<template>
  <div class="client-set">
  <set-layout>
      <!-- <div class="preview" slot="preview">
        <img v-if="formData.editShopmallName" src="~@/assets/images/super-crm/cloud-showroom/my.png" alt="图片">
        <img v-else src="~@/assets/images/super-crm/cloud-showroom/my-2.png" alt="图片">

      </div> -->
      <div slot="preview">
        <preview :tabIndex="tabIndex" :styleIndex="formData.style"/>
      </div>
      <div slot="set">
        <el-form
          label-position="top"
          :model="formData"
          class="form"
        >
          <el-form-item label="设置小程序风格">
            <el-radio-group v-model="formData.style">
              <el-radio :label="'0'">风格一</el-radio>
              <el-radio :label="'1'">风格二</el-radio>
            </el-radio-group>
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
            1. 此页面可同步设置小程序界面风格；
          </dd>
          <dd>
            2. 点击上方切换按钮，或者选择风格保存可以设置页面风格；
          </dd>
          <dd>
            3. <span class="set-tip">设置产品风格时，界面需要重新刷新。</span>
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
    style: '0'
  }
  @Prop({type: String})
  tabIndex!: string
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

      > img {
        width: 375px;
        height: auto;
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
        .set-tip{
          color: #FF455B;
        }
      }
    }
  }
</style>
