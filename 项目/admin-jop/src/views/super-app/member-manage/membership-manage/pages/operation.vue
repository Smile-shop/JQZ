<template>
  <div class="operation">
    <!-- 聊天功能位置示意图 -->
    <div class="message-left">
      <p class="title">聊天功能位置示意图</p>
      <img :src="img">
    </div>
    <!-- 聊天功能开关 -->
    <div class="message-right">
      <div class="title">聊天功能开关 <span>所有APP账号功能统一管理。此处功能关闭功能后，所有APP账号均不可使用，且清除已选状态。单独控制请使用 <a href='#' @click.prevent="goRoute" class="operation-go">系统设置-账号管理</a></span></div>
      <div class="opertion-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础功能设置" name="first">
            <basic-setting ref="basicSet"></basic-setting>
          </el-tab-pane>
          <el-tab-pane label="营销功能设置" name="second">
            <marketing-setting ref="marketing"></marketing-setting>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import basicSetting from './components/basicSetting.vue'
import marketingSetting from './components/marketingSetting.vue'

@Component({
  components: {
    basicSetting,
    marketingSetting
  }
})
export default class PoolCount extends Vue {
  private img: any = require('@/assets/images/android/czgn.png');
  private activeName: string = 'first';
  private goRoute() {
    this.$router.push({
      path: '/system-set/user-set/user-control/account-manage'
    });
  }
  private handleClick(tab: any) {
    const tabIndex = tab.index;
    if (tabIndex === '0') {
      const basic: any = this.$refs.basicSet;
      basic.getSetInfo();
    } else {
      const marketing: any = this.$refs.marketing;
      marketing.getSetInfo();
    }
  }
}
</script>

<style lang="scss">
.operation {
  display: flex;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  .message-left{
    width: 320px;
    .title{
      width: 100%;
      text-align: center;
      margin-bottom: 10px;
      color: #333;
      font-weight: bold;
      font-size: 16px;
    }
  }
  .message-right{
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-left: 30px;
    .message-btn{
      padding: 12px 45px;
    }
    .title{
      color: #333;
      font-weight: bold;
      margin-bottom: 20px;
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold;
      span{
        font-size: 13px;
        color: #000;
        font-weight: 400;
        padding-left: 4px;
      }
      .operation-go{
        color: #409eff;
        font-size: 13px;
        text-decoration: underline;
      }
    }
    .opertion-content{
      .content-item{
        margin-bottom: 50px;
        .content-title{
          padding: 8px;
          background: #f9f9f9;
          color: #606266;
          margin-bottom: 14px;
          font-size: 14px;
        }
        .check-div{
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          .el-checkbox{
            min-width: 93px;
          }
          .check-setting{
            display: flex;
            align-items: center;
            width: 420px;
            justify-content: flex-end;
            .check-tip{
              font-size: 14px;
            }
            .el-input-class{
              width: 80px;
              input{
                text-align: center;
              }
            }
          }
          .check-custom{
            justify-content: flex-start;
          }
        }
      }

    }
  }
}
.el-button--small{
  padding: 10px 30px;
}
</style>


