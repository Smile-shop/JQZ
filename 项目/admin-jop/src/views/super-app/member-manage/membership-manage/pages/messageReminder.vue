<template>
  <div class="message-reminder">
    <!-- 消息弹窗位置示意图 -->
    <div class="message-left">
      <p class="title">消息弹窗位置示意图</p>
      <img :src="img">
    </div>
    <!-- 消息提醒选择 -->
    <div class="message-right">
      <p class="title">消息提醒选择</p>
      <div class="message-checkbox">
        <div class="message-div m-birthday-box">
          <el-checkbox label="会员生日提醒" true-label="1" false-label="0" v-model="checkList.memBirthDayRemind" class="m-birthday"></el-checkbox>
          <div class="message-date">
            <span class="message-span">设置提醒范围：</span>
            <el-input class="el-input-class" v-model="checkList.remindDayLimit" @keyup.native="chechNum" :disabled="checkList.memBirthDayRemind === '0' ? true : false"></el-input>
            <span class="message-span-s">（支持1-30天）</span>
          </div>
        </div>
        <!-- <div class="message-div">
          <el-checkbox label="今日定时消息任务提醒" true-label="1" false-label="0" v-model="checkList.todayWorkRemind"></el-checkbox>
        </div> -->
        <!-- <div class="message-div">
          <el-checkbox label="今日新增潜客数量提醒" true-label="1" false-label="0" v-model="checkList.todayAddCustomNumRemind"></el-checkbox>
        </div> -->
        <!-- <div class="message-div">
          <el-checkbox label="未处理消息数量提醒" true-label="1" false-label="0" v-model="checkList.unDoMessageNumRemind"></el-checkbox>
        </div>
        <div class="message-div">
          <el-checkbox label="会员跟进提醒" true-label="1" false-label="0" v-model="checkList.memberFollowRemind"></el-checkbox>
        </div> -->
        <div class="message-div">
          <el-checkbox label="系统消息未读数" true-label="1" false-label="0" v-model="checkList.systemMessageNotRead"></el-checkbox>
        </div>
        <div class="message-div">
          <el-checkbox label="聊天消息未读数" true-label="1" false-label="0" v-model="checkList.chatMessageNotRead"></el-checkbox>
        </div>
        <div class="message-div">
          <el-checkbox label="新会员数" true-label="1" false-label="0" v-model="checkList.numberOfNewMembers"></el-checkbox>
        </div>
        <div class="message-div">
          <el-checkbox label="新粉丝数" true-label="1" false-label="0" v-model="checkList.numberOfNewFans"></el-checkbox>
        </div>
        <div class="message-div">
          <el-checkbox label="定时消息待发数" true-label="1" false-label="0" v-model="checkList.numberOfScheduledMessages"></el-checkbox>
        </div>
        <el-button type="primary" class="message-btn" @click="saveData">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getmemberMessgeRemindInfo, messgeRemindSet } from '@/api/system-set';

@Component({
})
export default class PoolCount extends Vue {
  private checkList: any = {
    memBirthDayRemind: '0',
    remindDayLimit: '1',
    systemMessageNotRead: '0',
    chatMessageNotRead: '0',
    numberOfNewMembers: '0',
    numberOfNewFans: '0',
    numberOfScheduledMessages: '0'
  };
  private img: any = require('@/assets/images/super-app/popup.png');
   // 保存
  private saveData() {
    if (this.checkList.memBirthDayRemind === '1' && this.checkList.remindDayLimit === '') {
      const eInput: any = document.querySelector('.el-input-class .el-input__inner');
      this.$message.error('请设置提醒范围');
      eInput.focus();
      return
    }
    messgeRemindSet(this.checkList).then((res: any) => {
      if (res.code === 0) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } else {
        this.$message.error(res.msg);
      }
    });
  }
  // 检验生日设置的天数
  private chechNum() {
    const reg = /^([1-9]|[1-2][0-9]|[3][0]\d?)$/;
    if (this.checkList.remindDayLimit === '') {
      return;
    }
    if (!reg.test(this.checkList.remindDayLimit)) {
      this.$message.error('仅支持1-30天');
      this.checkList.remindDayLimit = '1';
    }
  }
  private mounted() {
    this.getmemberMessgeRemindInfo();
  }
  // 查询
  private getmemberMessgeRemindInfo() {
    getmemberMessgeRemindInfo().then((res: any) => {
      if (res.code === 0) {
        this.checkList = res.data ? res.data : {};
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
</script>

<style lang="scss">
.message-reminder {
  display: flex;
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
    .title{
      color: #333;
      font-weight: bold;
    }
    .message-div{
      margin: 12px 0;
      height: 40px;
      .m-birthday{
        float: left;
      }
      .message-date{
        float: left;
        margin-left: 90px;
        .message-span{
          color: #606266;
        }
        .el-input-class{
          display: inline-block;
          width: 70px;
          .el-input__inner{
            text-align: center;
          }
        }
        .message-span-s{
          font-size: 14px;
          color: #999;
        }
        .message-span{
          font-size: 14px;
        }
      }
    }
    .m-birthday-box{
      display: flex;
      align-items: center;
    }
    .m-birthday-box:after{
      display: block;
      content: '';
      clear: both;
    }
    .message-btn{
      padding: 12px 45px;
    }
  }
}
</style>


