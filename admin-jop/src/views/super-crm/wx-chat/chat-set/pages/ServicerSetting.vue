<template>
  <article class="servicer-set">
    <div class="chat-set-content">
      <div class="title">企业欢迎信息</div>
      <div class="info">每段对话开启时，系统自动向客户发送一段欢迎语</div>
      <el-input class="input-content" v-model="chatSetParams.welcomeWord" placeholder="您好！请问有什么需要帮助的！" style="width: 370px"></el-input>

      <!-- <div class="title">客服无应答时信息</div>
      <div class="info">客服超过<span class="time">1分钟</span>秒无响应时自动发送一段信息</div>
      <el-input class="input-content" v-model="chatSetParams.noresponseWord" placeholder="您好！客服正在忙。请稍等！" style="width: 370px"></el-input>

      <div class="title">客服不在线提示</div>
      <div class="info">当没有客服在线时，系统自动发送一段信息</div>
      <el-input class="input-content" v-model="chatSetParams.notonlineWord" placeholder="很抱歉！当前没有客服在线！" style="width: 370px"></el-input> -->

      <div class="title">会话结束提示语</div>
      <div class="info">会话结束后，系统自动发送一段信息</div>
      <el-input class="input-content" v-model="chatSetParams.endkfWord" placeholder="会话结束提示语" style="width: 370px"></el-input>

      <div class="title">默认专属客服顾问设置</div>
      <div class="info">顾客在微客服界面的专属客服顾问默认设置项</div>
      <div class="chat-radio"><el-radio v-model="chatSetParams.onlyService" label="1">专属售货员设置为专属客服顾问</el-radio></div>
      <div class="chat-radio chat-radio2"><el-radio v-model="chatSetParams.onlyService" label="0">无初始专属客服</el-radio></div>

      <div class="title">客服顾问列表展示设置</div>
      <div class="info">客服顾问列表样式是否按照门店分组展示</div>
      <div class="chat-radio"><el-radio v-model="chatSetParams.shopGroup" label="1">按照门店分组展示（适用于客服及门店数量较多时）</el-radio></div>
      <div class="chat-radio"><el-radio v-model="chatSetParams.shopGroup" label="0">无门店分组展示（适用于客服及门店数量较少时）</el-radio></div>
      <div class="chat-radio chat-radio2 chat-rad">
        <el-radio v-model="chatSetParams.shopGroup" label="2">只展示专属客服</el-radio><span class="serve-span">(勾选后，客户咨询客服时，直接跳转到专属客服的聊天界面；无专属客服时，跳转到系统默认客服的聊天界面，可在<a href='#' @click.prevent="goRoute" class="operation-go">系统设置-账户管理</a>中，设置系统默认客服)</span>
        <div class="chatSet-road" v-if="chatSetParams.shopGroup === '2'">
          <el-radio v-model="chatSetParams.isComplain" label="1">打开用户“投诉”通道</el-radio>
          <el-radio v-model="chatSetParams.isComplain" label="0">关闭用户“投诉”通道<span class="explain-tip">（打开“投诉”通道后，客户的投诉消息，会发送给专属客服所绑定店员门店的店长）</span></el-radio>
        </div>
      </div>
      <div class="btn" @click="submitChatSet">保存</div>
    </div>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getChatSet, setChatSet } from '@/api/super-crm/wx-chat';

@Component({
})
export default class ServicerSetting extends Vue {
  private chatSetParams = {
    welcomeWord: '',
    endkfWord: '',
    noresponseWord: '',
    notonlineWord: '',
    onlyService: '1',
    shopGroup: '1',
    shopGroupType: '0',
    isComplain: '0'
  }
  private mounted() {
    this.getChatSetInfo();
  }

  private getChatSetInfo() {
    getChatSet().then((res: any) => {
      this.chatSetParams = res.data || this.chatSetParams;
      const dataList = [];
      dataList.push(this.chatSetParams);
      dataList.map((item: any) => {
        if (item.onlyService === null) {
          this.chatSetParams.onlyService = '1';
        }
        if (item.shopGroup === null) {
          this.chatSetParams.shopGroup = '1';
        }
        if (item.isComplain === null) {
          this.chatSetParams.isComplain = '0';
        }
      });
    })
  }

  private submitChatSet() {
    const params = {
      welcomeWord: this.chatSetParams.welcomeWord,
      noresponseWord: this.chatSetParams.noresponseWord,
      notonlineWord: this.chatSetParams.notonlineWord,
      endkfWord: this.chatSetParams.endkfWord,
      onlyService: this.chatSetParams.onlyService,
      shopGroup: this.chatSetParams.shopGroup,
      isComplain: this.chatSetParams.isComplain
    }
    setChatSet(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '保存成功！'
      })
      this.getChatSetInfo();
    })
  }
  private goRoute() {
    this.$router.push({
      path: '/system-set/user-set/user-control/account-manage'
    });
  }
}
</script>

<style lang="scss" scoped>
.servicer-set {
  .chat-set-content {
    .title {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #333333;
      padding: 0 0 0 22px;
    }
    .info {
      font-family: MicrosoftYaHei;
      font-size: 12px;
      color: #999999;
      padding: 11px 0 0 22px;
      .time {
        color: red;
      }
    }
    .chat-radio{
      padding: 11px 0 0 22px;
    }
    .chat-radio2{
      margin-bottom: 26px;
    }
    .input-content {
      margin: 15px 0 24px 22px;
      font-size: 14px;
      color: #333333;
    }
    .btn {
      background-color: #409eff;
      width: 120px;
      height: 40px;
      line-height: 40px;
      border-radius: 5px;
      text-align: center;
      color: #ffffff;
      margin: 2px 0 0 22px;
      cursor: pointer;
    }
    .btn:hover {
      opacity: .85;
    }
  }
}
</style>
<style lang="scss">
  .chat-set-content{
    .el-radio__input.is-checked+.el-radio__label{
      color: #606266;
    }
    .serve-span{
      color: #7F7F7F;
      font-size: 13px;
    }
    .operation-go{
      color: #409eff;
      font-size: 13px;
      text-decoration: underline;
    }
    .chat-rad{
      .el-radio{
        margin-right: 4px;
      }
    }
    .chatSet-road{
      margin-left: 24px;
      margin-top: 10px;
      .el-radio__label{
        font-size: 13px;
        &:not(:first-child) {
          margin-right: 30px;
        }
      }
      .explain-tip{
        color: #7F7F7F;
      }
    }
  }
</style>


