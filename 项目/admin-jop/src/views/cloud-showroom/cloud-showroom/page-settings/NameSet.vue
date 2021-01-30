<template>
  <div class="name-set">
    <set-layout>
      <div slot="preview">
        <preview
          :title="formData.title"
          :isShowGoldPrice="formData.showGoldPrice"
          :tabIndex="tabIndex"
        />
      </div>
      <div slot="set">
        <el-form
          label-position="top"
          :model="formData"
          class="form"
        >
          <el-form-item label="首页名称">
            <el-input v-model="formData.title" maxlength="20"></el-input>
            <dl class="explain">
              <dd>
                说明： 不添加时默认为云展厅，最多不得超过20个字符。
              </dd>
            </dl>
          </el-form-item>
          <el-form-item label="首页今日金价">
            <el-radio-group v-model="formData.showGoldPrice">
              <el-radio :label="1">显示金价</el-radio>
              <el-radio :label="0">隐藏金价</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="首页客服">
            <el-radio-group v-model="formData.showCustomerService">
              <el-radio :label="1">显示客服</el-radio>
              <el-radio :label="0">隐藏客服</el-radio>
            </el-radio-group>
            <dl class="explain">
              <dd>
                说明： 请配置好客服，若没有配置开启后，按钮也无效。
              </dd>
            </dl>
          </el-form-item>
          <el-form-item label="首页分享">
            <el-radio-group v-model="formData.showShare">
              <el-radio :label="1">显示分享</el-radio>
              <el-radio :label="0">隐藏分享</el-radio>
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
export default class NameSet extends Vue {
  formData = {
    title: '云展厅',
    showGoldPrice: 0,
    showCustomerService: 0,
    showShare: 0
  }
  @Prop({type: String})
  tabIndex!: string
  onSubmit() {
    this.$message.success('设置成功');
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
  .name-set {
    .form {
      width: 400px;
      .set-button{
        width: 68px;
        padding: 7px;
        font-size: 12px;
      }
    }

    .explain {
      color: #40445C;
      line-height: 2;
      dt {
        font-size: 12px;
      }
      dd {
        font-size: 12px;
      }
    }
  }
</style>
