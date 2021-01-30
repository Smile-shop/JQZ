<template>
  <article class="page-setting">
    <section class="template-select">
      <div class="phone-show">
        <p class="info">【效果预览】</p>
        <div class="phone-content">
          <header class="header">
            <i class="el-icon-close"></i>
            <i class="el-icon-more san"></i>
            <div class="header-title">{{ pageStyle.titlePage || '连单券领取'}}</div>
          </header>
          <div class="content">
            <img :src="pageStyle.themebackground" />
            <div class="content-mask">
              <img class="content-mask-btn" :src="btnImg" />
            </div>
            <div class="content-text" v-html="pageStyle.configurationPage"></div>
          </div>
        </div>
      </div>
      <div class="item-set">
        <el-form ref="form" class="form-content" :model="pageStyle" label-width="120px">
          <el-form-item label="页面标题:" :rules="[{ required: true}]">
            <el-input
              style="width:344px"
              maxlength="100"
              v-model="pageStyle.titlePage"
              placeholder="请输入页面标题，最多支持100个字符"
            ></el-input>
          </el-form-item>
          <el-form-item label="页面文本配置:" :rules="[{ required: true}]">
            <el-input
              style="width:344px"
              placeholder="请输入文本"
              type="textarea"
              :autosize="{minRows: 4}"
              maxlength="500"
              show-word-limit
              @input="change"
              v-model="text"
            ></el-input>
          </el-form-item>
          <el-form-item label="主题设置:">
            <el-radio-group v-model="pageStyle.theme">
              <el-radio label="A">刮刮卡</el-radio>
              <!-- <el-radio :label="2">拆红包</el-radio>
              <el-radio :label="3">抽卡</el-radio>-->
            </el-radio-group>
            <br />
            <div class="template-select-img" v-for="(item, index) in bgType" :key="index">
              <img :src="item.bg" alt />
              <div class="mark">
                <img class="mark-btn" :src="item.btn" />
              </div>
              <span class="name">
                <el-radio
                  v-if="index != 3"
                  v-model="pageStyle.themeClass"
                  :label="item.type"
                  @change="setBg"
                >{{ `主题${index + 1}` }}</el-radio>
                <el-radio
                  v-else
                  v-model="pageStyle.themeClass"
                  :label="item.type"
                  @change="setBg"
                >自定义</el-radio>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="自定义背景:" v-if="pageStyle.themeClass==='0'">
            <div style="display: flex">
              <div>
                <el-upload
                  class="upload-demo"
                  :headers="uploadOpt"
                  :action="uploadUrl('1')"
                  :show-file-list="false"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  accept=".jpg,.png"
                  name="imgFile"
                >
                  <el-button plain size="small" type="primary">上传文件</el-button>
                </el-upload>
                <span class="el-upload-tip">支持扩展名：.jpg.png，尺寸：1920*1080</span>
                <div>建议套用模板设计，预留功能区。</div>
                <div>
                  模板下载：
                  <el-button @click="download" type="text">连单背景页面设计模板.psd</el-button>
                </div>
              </div>
              <div class="img-share">
                <img :src="pageStyle.img" alt />
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import {
  getPageStyle,
  setPageStyle,
  getMemberStatement,
  setMemberStatement,
} from '@/api/super-crm/wx-member';
import user from '@/utils/user';
import WangEditor from '@/components/WangEditor.vue';

@Component({
  components: {
    WangEditor,
  },
})
export default class HomeModule extends Vue {
  @Prop({ default: {} })
  data: any;
  private isFreeMember = null; // 是否免费身份标识
  private freeDialogVisible: boolean = false; // 免费身份弹窗提示
  private btnImg = require('@/assets/images/super-crm/wx-member/gj01.png');
  private pageStyle = {
    titlePage: '',
    configurationPage: '',
    theme: 'A',
    themeClass: '1',
    themebackground: require('@/assets/images/super-crm/wx-member/01.png'),
  };
  private text = '';
  private bgType = [
    {
      type: '1',
      bg: require('@/assets/images/super-crm/wx-member/01.png'),
      btn: require('@/assets/images/super-crm/wx-member/gj01.png'),
    },
    {
      type: '2',
      bg: require('@/assets/images/super-crm/wx-member/02.png'),
      btn: require('@/assets/images/super-crm/wx-member/gj02.png'),
    },
    {
      type: '3',
      bg: require('@/assets/images/super-crm/wx-member/03.png'),
      btn: require('@/assets/images/super-crm/wx-member/gj03.png'),
    },
    {
      type: '0',
      bg: '',
      btn: require('@/assets/images/super-crm/wx-member/gj01.png'),
    },
  ];
  @Watch('data')
  watchData(val: any) {
    this.pageStyle = Object.assign({}, val);
    this.text = val?.configurationPage?.replace(/<br\s*\/?>/gi, '');
    if (val.themeClass != 0) {
      this.pageStyle.themebackground = this.bgType.find(
        (item: any) => item.type == val.themeClass
      )?.bg;
      this.btnImg = this.bgType.find(
        (item: any) => item.type == val.themeClass
      )?.btn;
    } else {
      this.$set(this.bgType[3], 'bg', this.data.themebackground);
    }
  }
  private download() {
    window.open(`${VUE_APP_BASE_API}/jop-admin-web/permissionTemplate/downloadLiandanquanTemplates`)
  }
  // 上传图片header设置
  get uploadOpt() {
    return {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey,
    };
  }
  private save() {
    if (!this.pageStyle.titlePage) {
      this.$emit('pageData', { required: false, data: this.pageStyle });
      return this.$message.error('请输入页面标题');
    } else if (!this.text) {
      this.$emit('pageData', { required: false, data: this.pageStyle });
      return this.$message.error('请输入页面文本配置');
    } else if (
      this.pageStyle.themeClass === '0' &&
      !this.pageStyle.themebackground
    ) {
      this.$emit('pageData', { required: false, data: this.pageStyle });
      return this.$message.error('请上传自定义背景图');
    }
    this.$emit('pageData', { required: true, data: this.pageStyle });
  }
  private change(val: any) {
    const arr: any = [];
    this.text.split('\n').forEach((item) => arr.push(`${item.trim()}<br>`));
    this.pageStyle.configurationPage = arr.join('\n');
  }
  private setBg(val: any) {
    this.pageStyle.themebackground = this.bgType.find(
      (item: any) => item.type == val
    )?.bg;
    this.btnImg = this.bgType.find((item: any) => item.type == val)?.btn;
  }
  // 上传图片路径
  private uploadUrl(type: string): string {
    return `${VUE_APP_BASE_API}/jop-wx-web/lianDanQuan/uploadCouponBackground`;
  }
  private uploadSuccess(res: any) {
    if (res.code === 0) {
      this.pageStyle.themebackground = res.data;
      this.$set(this.bgType[3], 'bg', res.data);
      this.$message({
        type: 'success',
        message: '上传成功！',
      });
    } else {
      this.uploadError();
    }
  }
  private uploadError() {
    this.$message.error('上传失败，请重新上传！');
  }
}
</script>

<style lang="scss" scoped>
.page-setting {
  .template-select {
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
        min-height: 330px;
        border: solid 1px #dddddd;
        .header {
          width: 375px;
          height: 44px;
          line-height: 44px;
          background-color: #eeeeee;
          font-size: 16px;
          color: #333333;
          position: relative;
          display: flex;
          align-items: center;
          &-title {
            width: 290px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          i {
            margin: 0 5px;
          }
          .san {
            position: absolute;
            right: 10px;
            top: 15px;
          }
        }
        .content {
          position: relative;
          height: 904px;
          img {
            width: 100%;
          }
          &-mask {
            width: 308px;
            height: 161px;
            background: #ccc;
            position: absolute;
            top: 382px;
            border-radius: 5px;
            left: 50%;
            margin-left: -154px;
            background: url('../../../../../../../assets/images/super-crm/wx-member/gua.png');
            &-btn {
              position: absolute;
              width: 159px !important;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          &-text {
            position: absolute;
            left: 50%;
            margin-left: -150px;
            top: 611px;
            font-size: 14px;
            width: 300px;
            height: 180px;
            overflow-y: auto;
          }
        }
      }
      .phone-content-state {
        width: 377px;
        border: solid 1px #dddddd;
        background-color: #f5f5f5;
        header {
          width: 100%;
          height: 44px;
          line-height: 44px;
          background-color: #ffffff;
          text-align: center;
          font-size: 16px;
          color: #333333;
        }
        .content {
          padding: 15px;
          overflow: auto;
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
        margin-right: 20px;
        position: relative;
        cursor: pointer;
        overflow: hidden;
        img {
          width: 100%;
        }
        .mark {
          width: 114px;
          height: 60px;
          background: #ccc;
          position: absolute;
          top: 144px;
          border-radius: 5px;
          left: 50%;
          margin-left: -57px;
          background: url('../../../../../../../assets/images/super-crm/wx-member/gua.png');
          &-btn {
            position: absolute;
            width: 70px !important;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .name {
          position: absolute;
          bottom: 0;
          left: 0;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #606266;
          width: 100%;
          display: block;
          height: 38px;
          background: #fff;
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
        .el-upload-tip {
          font-family: MicrosoftYaHei;
          font-size: 12px;
          color: #999999;
          padding-left: 13px;
        }
        .img-share {
          margin-left: 40px;
          border-radius: 4px;
          background-color: #dddddd;
          height: 250px;
          img {
            height: 100%;
          }
        }
        .color-content {
          display: flex;
          .color-item-value {
            display: inline-block;
            width: 40px;
            height: 40px;
            cursor: pointer;
          }
          .color-title {
            padding-left: 12px;
            font-size: 14px;
            color: #606266;
          }
        }
        .info {
          font-size: 12px;
          color: red;
        }
        .column-item {
          display: inline-block;
          width: 112px;
          text-align: center;
          .order {
            width: 100px;
            display: flex;
            justify-content: space-around;
            height: 24px;
            visibility: hidden;
            > i {
              font-size: 24px;
              cursor: pointer;
              color: rgb(51, 122, 183);
            }
            .icon-disabled {
              color: #999999;
            }
          }
        }
        .column-item:hover {
          .order {
            visibility: visible;
          }
        }
      }
    }
  }
}
</style>


