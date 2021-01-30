<template>
  <article class="auto-replay">
    <el-tabs v-model="activeName">
      <el-tab-pane label="关键词回复" name="1" lazy>
        <p class="key-word-info">通过编辑内容或关键词规则，快速进行自动回复设置。关闭自动回复之后，将立即对所有用户生效。</p>
        <p class="key-word-info" style="padding:12px 0"> 
          自动回复：
          <el-switch @change="replyStateControl" active-value="0" inactive-value="1" v-model="replyState" active-color="#409eff"></el-switch>
        </p>
        <KeyWord :replyState="replyState" @replayStateChange="replayStateChange"></KeyWord>
      </el-tab-pane>
      <el-tab-pane label="收到消息回复" name="2" lazy>
        <p class="key-word-info">通过编辑内容或关键词规则，快速进行自动回复设置。关闭自动回复之后，将立即对所有用户生效。</p>
        <p class="key-word-info" style="padding:12px 0">
          自动回复：
          <el-switch @change="replyStateControl" active-value="0" inactive-value="1" v-model="replyState" active-color="#409eff"></el-switch>
        </p>
        <ReceivedMessage :replyState="replyState" @replayStateChange="replayStateChange"></ReceivedMessage>
      </el-tab-pane>
      <el-tab-pane label="被关注回复" name="3" lazy>
        <p class="key-word-info">通过编辑内容或关键词规则，快速进行自动回复设置。关闭自动回复之后，将立即对所有用户生效。</p>
        <p class="key-word-info" style="padding:12px 0">
          自动回复：
          <el-switch @change="replyStateControl" active-value="0" inactive-value="1" v-model="replyState" active-color="#409eff"></el-switch>
        </p>
        <Focused :replyState="replyState" @replayStateChange="replayStateChange"></Focused>
      </el-tab-pane>
    </el-tabs>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import KeyWord from './components/KeyWord.vue';
import ReceivedMessage from './components/ReceivedMessage.vue';
import Focused from './components/Focused.vue';
import { replyStateControl, getReplyStateControl } from '@/api/super-crm/wx-params-set';

@Component({
  components: {
    KeyWord,
    ReceivedMessage,
    Focused
  }
})
export default class AutoReplay extends Vue {
  private activeName: string = '1';
  private replyState: string = '1';
  private mounted() {
    getReplyStateControl().then((res: any) => {
      this.replyState = res.data.replyState || '0';
    })
  }
  private replayStateChange(value: string) {
    console.log(value)
    this.replyState = value;
  }
  private replyStateControl(value: string) {
    const params = {
      replyState: value
    }
    replyStateControl(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '修改成功！'
      });
    })
  }
}
</script>

<style lang="scss" scoped>
.auto-replay {
  .key-word-info {
    font-size: 14px;
    color: #333333;
  }
}
</style>
