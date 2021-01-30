<template>
  <div class="style">
    <preview-container
      title="交易规则"
    >
      <div class="preview">
        <header>
          交易规则
        </header> 
        <main
          v-html="sellRules.content"
        >
        </main>
      </div>
    </preview-container>
    <div class="setting-group">
      <el-form
        label-width="120px"
      >
        <el-form-item
          label="交易规则"
        >
          <wang-editor ref="ue"/>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="updateSellRules"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import PreviewContainer from '@/components/PreviewContainer.vue';
import {
  updateSellRulesOptions,
  selectSellRulesOptions
} from '@/api/super-crm/wx-mall';
import WangEditor from '@/components/WangEditor.vue';
import {Message} from 'element-ui';

@Component({
  components: {
    PreviewContainer,
    WangEditor
  }
})
export default class WxMallPageSet extends Vue {
  sellRules = {
    id: '',
    content: '',
  }

  mounted() {
    this.findSellRules();
  }

  // 查询交易规则
  findSellRules() {
    return new Promise((resolve, reject) => {
      const body = {}

      selectSellRulesOptions(body).then((res: any) => {
        const {data} = res;

        if (data) {
          this.sellRules = data;
          (<any> this.$refs.ue).setContent(data.content);
        } else {
          Message.warning('交易规则没有数据');
        }

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 更新交易规则
  updateSellRules() {
    return new Promise((resolve, reject) => {
      const body = {
        id: this.sellRules.id,
        content: (<any> this.$refs.ue).getContent(),
      }

      updateSellRulesOptions(body).then((res: any) => {
        const {data} = res;

        this.sellRules.content = body.content;
        Message.success('提交成功');

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.style {
  display: flex;

  .preview {
    height: 100%;
    overflow: hidden auto;
    background-color: #f5f5f5;

    > header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 33px;
      background-color: #fff;
      color: #333333;
    }

    > main {
      padding: 20px 15px;

    }
  }

  > .setting-group {
    flex-grow: 1;
    overflow: hidden;
    min-width: 600px;
    max-width: 1000px;
  }
}
</style>


