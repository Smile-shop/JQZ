<template>
<div class="activity-type-add">
      <el-form ref="form" :model="form" label-width="180px" class="add-form">
        <el-form-item label="投诉：">
          <div><el-switch v-model="isOpenComplaint"></el-switch><span style="margin-left:10px">开启后，可拦截部分用户投诉，降低微信封锁风险，建议开启！</span></div>
        </el-form-item>
         <el-form-item label="交易须知：">
          <div><el-switch v-model="isOpenTradeRemark"></el-switch><span style="margin-left:10px">开启后，将隐藏“交易须知”模块</span></div>
        </el-form-item>
         <el-form-item label="排行榜：">
          <div><el-switch v-model="isOpenRanking"></el-switch><span style="margin-left:10px">开启后，首页将显示排行榜信息，建议开启！</span></div>
        </el-form-item>
        <el-form-item>
          <div>
             <el-radio-group v-model="form.rankingType">
               <el-radio :label="1">邀请人数</el-radio><el-radio :label="2">累计收益</el-radio>
             </el-radio-group>
            <span style="margin-left:10px">选择排行榜排名方式</span></div>
        </el-form-item>
         <el-form-item label="页面底部版权：">
          <div>
             <el-radio-group v-model="form.copyrightType">
              <el-radio :label="1">商家版权</el-radio><el-radio :label="2">联合版权</el-radio>
             </el-radio-group>
            </div>
        </el-form-item>
      </el-form>
      <div class="button-div">
      <el-button type="success"  @click="onprev">上一步</el-button>
      <template v-if="form.status==3">
          <el-button type="primary" @click="onBlack">返回活动列表</el-button>
      </template>
      <template v-else>
          <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </div>
</div>
</template>
<script lang="ts">
import {Vue, Component, Prop , Emit, Watch} from 'vue-property-decorator';
import {
  addDistributionFour,
  getDistributionFour
} from '@/api/super-mkt/activity-set/fission_retail';
import { saveActivity } from '@/utils/buttonPermission'
@Component({
  components: {},
})
export default class SetActivity extends Vue {
  @Prop({default: null}) activitiyId!: any;
  @Prop({default: ''}) curToken!: string;
  form = {
    distributionId: '', // 活动ID
    curToken: '',
    copyrightType: 1, // 页面底部版权（1，商家版权，2，联合版权）
    isOpenComplaint: 1, // 是否开启投诉（1，是，0，否）
    isOpenRanking: 1, // 是否开启排行榜（1，是，0，否）
    isOpenTradeRemark: 1, // 是否开启交易须知（1，是，0，否）
    rankingType: 2, // 排行榜排名方式（1，邀请人数，2，累计收益）
    status: 1
  };
  isOpenComplaint: boolean = false; // 是否开启投诉（1，是，0，否）
  isOpenRanking: boolean = false; // 是否开启排行榜（1，是，0，否）
  isOpenTradeRemark: boolean = false; // 是否开启交易须知（1，是，0，否）
  mounted() {
        let  body: any;
        if (this.curToken != '' && this.activitiyId) {
          body =  {distributionId: this.activitiyId, curToken: this.curToken};
        } else if (this.activitiyId) {
          body =  {distributionId: this.activitiyId};
        } else if (this.curToken != '') {
          body =  {curToken: this.curToken};
        }
        if (body) {
          getDistributionFour(body).then((res: any) => {
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
    if (this.curToken && this.curToken != '') {
        this.form.curToken = this.curToken;
    }
    this.isOpenComplaint = this.form.isOpenComplaint == 1 ;
    this.isOpenRanking = this.form.isOpenRanking == 1 ;
    this.isOpenTradeRemark = this.form.isOpenTradeRemark == 1 ;
  }


  onprev() {
     this.$emit('onPreActive');
  }

  initSendForm() {
    this.form.isOpenComplaint = this.isOpenComplaint ? 1 : 0;
    this.form.isOpenRanking = this.isOpenRanking ?  1 : 0;
    this.form.isOpenTradeRemark = this.isOpenTradeRemark ?  1 : 0;
  }
  onBlack() {
     this.$router.push({
      path: '/fission/distri-manage/activity-list',
    });
  }
  async submit() {
    if (! await saveActivity()) {
      return;
    }
    this.initSendForm();
    const body: any  = {
        ...this.form,
      }
    if (!this.activitiyId) {
      delete body.distributionId;
    } else {
      body.distributionId = this.activitiyId;
    }
    addDistributionFour(body).then((res: any) => {
           if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '活动保存成功！'
                });
                this.$router.push({
                  path: '/fission/distri-manage/activity-list',
                });
           }
    });
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-input .el-input__count .el-input__count-inner{
  background:transparent;
}
.blue-ulspan{
    margin:15px;
    color: #409EFF;
    text-decoration:underline;
    cursor:pointer;
}
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
      border-color: #409eff;
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

              > .el-textarea {
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
      }
    }
  }

  & /deep/ .el-form-item__error {
    position: absolute;
    top: 0;
    left: 430px;
  }
}
</style>