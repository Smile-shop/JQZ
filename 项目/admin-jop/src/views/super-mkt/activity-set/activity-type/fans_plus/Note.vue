<template>
    <div class="edit-from-view">
        <div class="nav-bar">
            <el-tabs type="card" v-model="tabname">
            <el-tab-pane label="好友通知" name="first"  :disabled="tabname!='first'">
              <Friend ref="friendform" :initForm="this.form" @onNextActive="onGoto('second')" @onPreActive="onPreActive"></Friend>
            </el-tab-pane>
            <el-tab-pane label="邀请人通知" name="second"  :disabled="tabname!='second'">
              <Inviter ref="inviterform" :initForm="this.form" @onNextActive="onNextActive" @onPreActive="onGoto('first')"></Inviter>
            </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import Friend from './Friend.vue';
import Inviter from './Inviter.vue';
import {
  getActiveThree,
  saveActiveThree
} from '@/api/super-mkt/activity-set/fans_plus';
@Component({
  components: {
    Friend,
    Inviter
  }
})
export default class NoteActivity extends Vue {
    @Prop({default: null}) activitiyId!: any;
    @Prop({default: ''}) curToken!: string;
    tabname = 'first';
    form = {
      activitiyId: '', // 活动ID
      curToken: '',
      cancelReminderJson: '', // 好友取关扣人气提示
      cancelReminderIsOpen: '', // 好友取消关注提醒开关（0,关闭，1，开启）
      cancelReminderNumIsOpen: '', // 活动达标提醒开关（0,关闭，1，开启）
      cancelReminderNum: 0, // 提醒多少条取关提醒后不通知
      friendReminderJson: '', // 好友扫码提示语
      friendReminderIsOpen: '', // 好友扫码提醒开关（0,关闭，1，开启）
      reachedReminderJson: '', // 活动达标提示语
      repeatReminder: '', // 已关注再次扫码提示语
      sweepcodeReminder: '', // 扫码关注提示语
      willReachedReminderJson: '', // 即将达标提示语
      willReachedReminderIsOpen: '', // 即将达标提醒开关（0,关闭，1，开启）
      willReachedReminderUserNum: 0// 即将达标提醒人数
    };

    mounted() {
        let  body: any;
        if (this.curToken != '' && this.activitiyId) {
          body =  {activitiyId: this.activitiyId, curToken: this.curToken};
        } else if (this.activitiyId) {
          body =  {activitiyId: this.activitiyId};
        } else if (this.curToken != '') {
          body =  {curToken: this.curToken};
        }
        if (body) {
          getActiveThree(body).then((res: any) => {
                if (res.code === 0) {
                  if (res.data) {
                    this.form = res.data;
                  }
                }
          });
        }
  }
  onGoto(name: string) {
      this.tabname = name;
  }
  onNextActive() {
     const friendform: any =  (this.$refs.friendform as any).form;
     const inviterform: any =  (this.$refs.inviterform as any).form;
     const body: any = {
      curToken : this.curToken,
      activitiyId: '',
      ...friendform,
      ...inviterform
    }
     body.cancelReminderJson = JSON.stringify(inviterform.cancelReminderJson);
     body.friendReminderJson = JSON.stringify(inviterform.friendReminderJson);
     body.reachedReminderJson = JSON.stringify(inviterform.reachedReminderJson);
     body.willReachedReminderJson = JSON.stringify(inviterform.willReachedReminderJson);
     if (!this.activitiyId) {
        delete body.activitiyId;
    } else {
        body.activitiyId = this.activitiyId;
    }
     saveActiveThree(body).then((res: any) => {
        if (res.code === 0) {
             this.$emit('onNextActive');
        }
    });
  }
  onPreActive() {
      this.$emit('onPreActive');
  }
}
</script>
<style lang='scss' scoped>
  .edit-from-view {
    flex: 1;
    font-size: 14px;
    padding-left: 20px;
  }
</style>