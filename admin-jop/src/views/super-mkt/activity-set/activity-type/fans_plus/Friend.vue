<template>
  <div class="activity-type-add">
  <el-form
      ref="form"
      label-width="180px"
      class="add-form"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        label="扫码关注提示语："
        prop="sweepcodeReminder"
      >
         <div>
          <span  v-for="(item, index) in sweepcodeReminderKeys" :key="index" @click="onAddSweepcodeReminderContext(index)" class="key-clickspan">
              {{item}}
           </span>
          <span class="key-ulspan" @click="goSweepCode">查看示例</span>
         </div>
        <el-input
          v-model="form.sweepcodeReminder"
          :placeholder="sweepCodeDes"
          type="textarea"
          :style="{
            width: '415px',
          }"
          :autosize="{ minRows: 4}"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="已关注再次扫码提示："
        prop="repeatReminder"
      >
          <div>
        
           <span  v-for="(item, index) in repeatReminderKeys" :key="index" @click="onAddRepeatReminderContext(index)" class="key-clickspan">
              {{item}}
           </span>
          <span class="key-ulspan" @click="goRepeatResult">查看示例</span>
         </div>
        <el-input
          v-model="form.repeatReminder"
          type="textarea"
          :style="{
            width: '415px',
          }"
          :autosize="{ minRows: 4}"
          :placeholder="repeatDes"
        >
        </el-input>
      </el-form-item>
  </el-form>
  <div class="button-div">
        <el-button type="success"  @click="onprev">上一步</el-button>
        <el-button type="primary"  @click="submit">下一步</el-button>
      </div>
    <!-- 查看示例弹框 -->
    <el-dialog :visible.sync="sweepCodeResult" class="look-wrapper" width="25%">
      <p><span class="key-span">#用户昵称#</span>，感谢您为<span class="key-span">#邀请人#
        </span>增加的人气值！<span class="key-span">#邀请人#</span>
        <span class="key-span">邀请您一起领取#活动目标奖品#</span>下图是您的专属活动海报图，将海报分享至朋友圈/微信好友邀请扫码关注提升人气值，完成18个人气值任务后即可到店领取
        <span class="key-span">#活动目标奖品#</span>！</p>
    </el-dialog>
    <!-- 查看示例弹框 -->
    <el-dialog :visible.sync="repeatResult" class="look-wrapper" width="25%">
      <p>嗨，<span class="key-span">#用户昵称#</span>您已经关注公众号了</p>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
@Component({components: {}})
export default class FriendActivity extends Vue {
  @Prop({default: null}) initForm!: any;
  form = {
    repeatReminder: '', // 已关注再次扫码提示语
    sweepcodeReminder: '', // 扫码关注提示语
    };
     // 规则
  rules = {
    repeatReminder: [
      { required: true, message: '请输入扫码关注提示语', trigger: 'blur' },
    ],
    sweepcodeReminder: [
      { required: true, message: '请输入已关注再次扫码提示', trigger: 'blur' },
    ]};
  sweepCodeDes = '请输入内容';
  repeatDes = '请输入内容';
  sweepCodeResult = false;
  repeatResult = false;
  sweepcodeReminderKeys = ['#用户昵称#', '#邀请人#', '#排行榜#', '#活动目标奖品#'];
  repeatReminderKeys = ['#用户昵称#'];
  @Watch('initForm')
  initData(val: any) {
    if (val) {
      this.form.repeatReminder = val.repeatReminder;
      this.form.sweepcodeReminder = val.sweepcodeReminder;
    }
  }
  goSweepCode() {
    this.sweepCodeResult = true;
  }
   goRepeatResult() {
    this.repeatResult = true;
  }
  onprev() {
     this.$emit('onPreActive');
  }
  onAddSweepcodeReminderContext(index: number) {
    this.form.sweepcodeReminder += this.sweepcodeReminderKeys[index];
  }
  onAddRepeatReminderContext(index: number) {
    this.form.repeatReminder += this.repeatReminderKeys[index];
  }
// 提交
  submit() {
    (this.$refs.form as any).validate((valid: any) => {
      if (valid) {
       this.$emit('onNextActive');
      } else {
        this.$message({
          message: '请检查必填项',
          type: 'warning'
        })
      }
    })
  }

}
</script>
<style lang='scss' scoped>
.activity-type-add {
  & > header {
    margin-bottom: 10px;
  }

  & /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    & img {
      height: 200px !important;
      width: auto !important;
    }

    &:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

  & > .add-form /deep/ {
    .line {
      margin-bottom: 20px;
      height: 10px;
      background-color: #f5f5f5;
    }

    h3 {
      color: #606266;
      font-size: 14px;

      &.inline {
        display: inline-block;
      }
    }

    & .el-form-item__content {
      > div {
        color: #999999;
      }

      > ul {
        margin-top: 5px;
        list-style: none;
        line-height: 1.6;
        color: #999999;

        & > li {
          & > span {
            color: #ff0000;
          }
        }
      }

      > .content {
        display: flex;

        > .left {
          margin-right: 30px;

          > .item {
            &:not(:last-of-type) {
              margin-bottom: 20px;
            }

            > .input-group {
              display: flex;

              > .el-textarea{
                margin-right: 10px;
              }
            }

            > ul {
              margin-top: 5px;
              list-style: none;
              line-height: 1.6;
              color: #999999;

              & > li {
                & > span {
                  color: #ff0000;
                }
              }
            }

            &.inline {
              display: flex;
              align-items: center;

              > h3 {
                margin-right: 30px;
              }

              > .el-input {
                margin-right: 10px;
              }
            }
          }

        }

        > .right {
          > .preview {
            width: 320px;
            border-radius: 5px;
	          border: solid 1px #dddddd;

            > .content {
              padding: 13px;
              font-size: 12px;

              > p {
                line-height: 1.6;
                color: #000000;
              }

              > ul {
                color: #999999;
                line-height: 1.6;
              }
            }

            > .detail {
              border-top: 1px solid#dddddd;
              padding: 12px;
              color: #999999;
              line-height: 1;
            }
          }
        }
      }
    }
  }

  & /deep/ .el-form-item__error {
    position: absolute;
    top: 0;
    left: 430px;
  }
}
.key-span{
    color: #ff0000;
}
.key-ulspan{
    color: #1FC965;
    text-decoration:underline;
    cursor:pointer;
}
.key-clickspan{
    color: #ff0000;
     cursor:pointer;
}
</style>