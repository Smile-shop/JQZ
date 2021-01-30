<template>
  <div class="share">
    <set-layout>
      <div class="preview" slot="preview">
        <img src="~@/assets/images/super-crm/wx-mall/follow.png" alt="">
      </div>
      <div slot="set">
        <el-form
          label-position="top"
          :model="form"
          class="form"
        >
          <el-form-item label="公众号引导关注">
            <el-radio-group v-model="form.shareGuide">
              <el-radio label="1">进入页面即提示</el-radio>
              <el-radio label="2">购买后提示</el-radio>
            </el-radio-group>
            <p
              :style="{
                fontSize: '12px',
                color: '#9A9EA6'
              }"
            >
              温馨提示：顾客不关注公众号，无法使用微会员的所有功能、无法收到消息通知、无法聊天等；暂不提供关闭提醒。
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
export default class Guide extends Vue {
  form = {
    shareGuide: '1'
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
    .img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
