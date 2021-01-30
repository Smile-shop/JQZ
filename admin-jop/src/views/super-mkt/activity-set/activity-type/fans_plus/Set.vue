<template>
<div>
 <el-form
      ref="form"
      :model="form"
    >
  <el-form-item>
    <el-switch
      v-model="isOpenAttack"
      active-text="防刷设置"
      >
    </el-switch>
    <div style="margin-left:50px">
      <span>如果用户  在</span>
      <el-input :style="{margin:'5px',width:'100px'}" 
        v-model.number="form.attackPeroid"
        onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
        min='0'
        type="number"
      ></el-input>
      <span>秒内，该用户助力人数超过</span>
      <el-input :style="{margin:'5px',width:'100px'}" 
        v-model.number="form.attackUserNum"
        onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
        min='0'
        type="number"
      ></el-input><span>人，则自动将该用户加入黑名单 <span class="blue-ulspan" @click="goQueryBlackUser">查看黑名单</span><br>
      列入黑名单的参与者将无法继续获得人气值</span>
    </div>
  </el-form-item>
  <el-form-item>
    <el-switch
      v-model="isOpenWinRecord"
      active-text="活动页面显示“兑奖者轮播信息”"
      >
    </el-switch>
  </el-form-item>
    <el-form-item>
    <el-switch
      v-model="isAddVirUserNum"
      active-text="活动页面显示“参与人数”"
      >
    </el-switch>
    <span>
      虚拟参与人数
    </span>
    <el-input :style="{margin:'5px',width:'100px'}" 
      v-model.number="form.addVirUserNum"
      onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
      min='0'
      type="number"
    ></el-input>
    <div style="margin-left:220px">*活动页面显示的参与人数=真实参与人数+虚拟参与人数</div>
  </el-form-item>
      <el-form-item>
    <el-switch
      v-model="isShowCountdown"
      active-text="活动页面显示“倒计时”"
      >
    </el-switch>
  </el-form-item>
      <el-form-item>
    <el-switch
      v-model="isShowRemainStock"
      active-text="活动首页显示“奖品剩余库存”"
      >
    </el-switch>
  </el-form-item>
 </el-form>
  <div class="button-div">
      <el-button type="success"  @click="onprev">上一步</el-button>
      <el-button  type="primary" @click="submit">保存</el-button>
    </div>
  <BlackuserDialog v-if="isShowBlackUser" :activitiyId="this.activitiyId"  :dialogTableVisible.sync="isShowBlackUser" @cancelDialog="cancelDialog"></BlackuserDialog>
</div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {
  getActiveFour,
  saveActiveFour
} from '@/api/super-mkt/activity-set/fans_plus';
import BlackuserDialog from './blackuser-dialog.vue';
@Component({components: {BlackuserDialog}})
export default class SetActivity extends Vue {
  @Prop({default: null}) activitiyId!: any;
  @Prop({default: ''}) curToken!: string;
  form = {
    activitiyId: '', // 活动ID
    curToken: '',
    addVirUserNum: 0, // 虚拟参与人数
    attackPeroid: 0, // 周期
    attackUserNum: 0, // 防刷推荐数量
    isAddVirUserNum: '1', // 是否开启虚拟参与人数（1，是，0，否）
    isOpenAttack: '0', // 是否开启防刷（1，是，0，否）
    isOpenWinRecord: '1', // 是否开启获奖轮播记录（1，是，0，否）
    isShowCountdown: '1', // 是否倒计时（1，是，0，否）
    isShowRemainStock: '1'// 是否显示剩余库存（1，是，0否）
  };
  isAddVirUserNum: boolean = false; // 是否开启虚拟参与人数（1，是，0，否）
  isOpenAttack: boolean = false; // 是否开启防刷（1，是，0，否）
  isOpenWinRecord: boolean = false; // 是否开启获奖轮播记录（1，是，0，否）
  isShowCountdown: boolean = false; // 是否倒计时（1，是，0，否）
  isShowRemainStock: boolean = false; // 是否显示剩余库存（1，是，0否）
  isShowBlackUser: boolean = false;
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
          getActiveFour(body).then((res: any) => {
                if (res.code === 0) {
                  if (res.data) {
                    this.form = res.data;
                  }
                  this.initForm();
                } else {
                  this.initForm();
                }
              }).catch(() => {
                 this.initForm();
              });
        } else {
        this.initForm();
      }
  }

  initForm() {
    this.form.curToken = this.curToken;
    this.isAddVirUserNum = this.form.isAddVirUserNum == '1' ;
    this.isOpenAttack = this.form.isOpenAttack == '1' ;
    this.isOpenWinRecord = this.form.isOpenWinRecord == '1' ;
    this.isShowCountdown = this.form.isShowCountdown == '1' ;
    this.isShowRemainStock = this.form.isShowRemainStock == '1' ;
  }

    // 关闭通知人数弹框
  cancelDialog() {
    this.isShowBlackUser = false;
  }

  goQueryBlackUser() {
    this.isShowBlackUser  = true;
  }

  onprev() {
     this.$emit('onPreActive');
  }

  initSendForm() {
    this.form.isAddVirUserNum = this.isAddVirUserNum ? '1' : '0';
    this.form.isOpenAttack = this.isOpenAttack ?  '1' : '0';
    this.form.isOpenWinRecord = this.isOpenWinRecord ?  '1' : '0';
    this.form.isShowCountdown = this.isShowCountdown ?  '1' : '0';
    this.form.isShowRemainStock = this.isShowRemainStock ?  '1' : '0';
  }
  submit() {
    this.initSendForm();
    const body: any  = {
        ...this.form,
      }
    if (!this.activitiyId) {
      delete body.activitiyId;
    } else {
      body.activitiyId = this.activitiyId;
    }
    saveActiveFour(body).then((res: any) => {
           if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '活动保存成功！'
                });
                this.$router.push({
                  path: '/super-mkt/activity-set/activity-type/fans_plus/home',
                });
           }
    });
  }
}
</script>
<style lang='scss' scoped>
/deep/ input[type="number"]{
  -moz-appearance: none;
  text-align: center;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.blue-ulspan{
    margin:15px;
    color: #409EFF;
    text-decoration:underline;
    cursor:pointer;
}
</style>