<template>
  <article class="sign-every">
    <div class="phone-show">
      <p class="info">【效果预览】</p>
      <div class="phone-content">
        <header>会员签到</header>
        <img src="~@/assets/images/super-crm/wx-member/qd-banner.png" alt="qd-banner" />
        <div class="sign-intro">
          <div class="title">签到说明</div>
          <div class="content" v-html="memberSign.content"></div>
        </div>
        <img src="~@/assets/images/super-crm/wx-member/qd-rili.png" alt="qd-rili" />
      </div>
    </div>
    <div class="item-set">
      <div class="template-select-img page-img-selected">
        <img src="~@/assets/images/super-crm/wx-member/qdslt.png" alt="v-1" />
        <span class="name">模板1</span>
        <el-button class="select-btn" size="mini" type="primary" icon="el-icon-success">选择</el-button>
      </div>

      <el-form ref="form" class="form-content" :model="memberSign" label-width="130px">
        <!-- <el-form-item label="每日签到赠送积分:">
          <el-input style="width:344px" v-model="memberSign.score"></el-input>
          <span class="info">0为不赠送</span>
        </el-form-item>-->
        <!-- <el-form-item label="是否计入累计积分:">
          <el-switch active-value="1" inactive-value="0" v-model="memberSign.isAddtotal"></el-switch>
        </el-form-item>-->
        <router-link to="/super-crm/wx-member/member-set/score-set">请到积分设置中设置积分</router-link>
        <div style="margin: 5px;"></div>
        <el-form-item label="每日签到说明:">
          <WangEditor ref="ue" :contents="memberSign.content"></WangEditor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setMemberSignSetting">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  getMemberSignSetting,
  setMemberSignSetting
} from '@/api/super-crm/wx-member'
import WangEditor from '@/components/WangEditor.vue'

@Component({
  components: {
    WangEditor
  }
})
export default class SignEveryday extends Vue {
  private memberSign = {
    score: '',
    isAddtotal: '1',
    content: ''
  }

  private mounted() {
    this.getMemberSignSetting()
  }

  private getMemberSignSetting() {
    getMemberSignSetting().then((res: any) => {
      this.memberSign.score = res.data.score || ''
      this.memberSign.isAddtotal = res.data.isAddtotal || '1'
      this.memberSign.content = res.data.content || ''
    })
  }

  private setMemberSignSetting() {
    this.memberSign.content = (this.$refs.ue as any).getContent()
    const params = this.memberSign
    setMemberSignSetting(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '保存成功！'
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.sign-every {
  height: calc(100vh - 190px);
  overflow: auto;
  display: flex;
  .phone-show {
    width: 377px;
    .info {
      width: 377px;
      text-align: center;
      font-family: MicrosoftYaHei-Bold;
      font-size: 16px;
      font-weight: bold;
      color: #409eff;
      padding-bottom: 12px;
    }
    .phone-content {
      width: 377px;
      height: 666px;
      border: solid 1px #dddddd;
      background-color: #f5f5f5;
      header {
        height: 44px;
        line-height: 44px;
        text-align: center;
        background-color: #ffffff;
        font-size: 16px;
        color: #333333;
      }
      img {
        width: 100%;
      }
      .sign-intro {
        width: 354px;
        border-radius: 5px;
        background-color: #ffffff;
        margin: 9px auto;
        color: #d88400;
        font-size: 12px;
        .title {
          font-weight: bold;
          font-size: 14px;
          padding: 12px;
        }
        .content {
          padding: 0 12px 12px 24px;
        }
      }
    }
  }
  .item-set {
    flex-grow: 1;
    padding-left: 34px;
    .template-select-img {
      display: inline-block;
      width: 145px;
      height: 283px;
      border-radius: 5px;
      border: solid 2px #dddddd;
      text-align: center;
      padding-top: 8px;
      margin-right: 20px;
      position: relative;
      cursor: pointer;
      img {
        width: 134px;
      }
      .name {
        position: absolute;
        bottom: 10px;
        left: 10px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #606266;
      }
      .select-btn {
        position: absolute;
        bottom: 5px;
        right: 5px;
      }
    }
    .page-img-selected {
      border: solid 2px #409eff;
    }
    .form-content {
      margin-top: 25px;
      .info {
        font-size: 12px;
        color: #999999;
        padding-left: 12px;
      }
    }
  }
}
</style>


