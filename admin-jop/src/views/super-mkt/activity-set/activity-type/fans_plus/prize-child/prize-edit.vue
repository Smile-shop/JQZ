<template>
  <div class="prize-edit">
    <el-form ref="form" label-width="120px">
      <el-form-item label="奖品类型：">{{ formData.productType || '--'}}</el-form-item>
      <el-form-item label="奖品名称：">
        <div>
          {{ formData.giftName || '--' }}
          <el-input
            size="small"
            style="width: 200px;margin: 0 10px"
            maxlength="16"
            v-model="formData.shelfGiftName"
            placeholder="请输入别名"
          ></el-input>
          <!-- <el-button size="mini" type="primary" @click="save">保存</el-button> -->
          <span>（线上别名）</span>
        </div>
      </el-form-item>
      <el-form-item label="奖品图片：" style="margin-bottom: 50px;">
        <div class="param-upload-box">
          <el-upload
            class="upload-demo"
            ref="upload"
            :headers="opt()"
            :action="uploadUrl()"
            :file-list="fileList"
            :show-file-list="false"
            :on-success="uploadLogoSuccess"
            :on-error="uploadLogoError"
            :before-upload="beforeAvatarUpload"
            auto-upload
          >
            <el-button
              ref="uploadUp"
              style="width: 300px"
              class="el-icon-upload upbtn"
              slot="trigger"
              size="small"
              type="primary"
              plain
            >点击从本地上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <ul class="upload-img-box" v-if="fileList">
            <li class="upload-li" v-for="(item, index) in fileList" :key="index">
              <div class="upload-im">
                <el-image style="width: 100%; height: 100%" :src="item.url" fit="scale-down"></el-image>
              </div>
              <p @click="deleteImg(index)" class="upload-delete">删除</p>
            </li>
          </ul>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { updateAward } from '@/api/super-mkt/activity-set/fans_plus';
import user from '@/utils/user';
import { imagesUrl } from '@/utils/imageUrl';

@Component({})
export default class PrizeEdit extends Vue {
  @Prop({ default: {} })
  data: any;
  formData = {
    productType: '--',
    shelfGiftName: '',
    giftName: '',
    onlineImg: '',
  };
  fileList: any[] = [];
  @Watch('data')
  watchData(val: any) {
    this.formData = Object.assign({}, this.data);
    if (val.onlineImg) {
      this.fileList.push({ url: val.onlineImg });
    } else {
      val.picList.length
        ? this.fileList.push({
            url: imagesUrl({
              path: '/jop-wx-web/op/showimage',
              name: val.picList[0] || '',
              alias: 'Gift',
            }),
          })
        : (this.fileList = []);
    }
  }
  async save() {
    const res: any = await updateAward(
      Object.assign(this.formData, { productDetail: '', activitiyId: this.$route.query.activitiyId })
    );
    const { code, msg } = res;
    if (!code) {
      this.$message.success(msg);
    }
  }

  uploadUrl() {
    return `${VUE_APP_BASE_API}/jop-marketing-web/market/upload`;
  }

  opt() {
    const opt = {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey,
    };
    return opt;
  }
  // 删除图片
  deleteImg() {
    this.fileList = [];
    this.formData.onlineImg = '';
  }

  uploadLogoSuccess(res: any, file: any, fileList: any) {
    if (res.code == '0') {
      this.$message.success(res.msg);
      this.formData.onlineImg = res.data[0];
      if (this.fileList.length) {
        this.fileList[0].url = res.data[0];
      } else {
        this.fileList.push({ url: res.data[0] });
      }
    } else {
      this.$message({
        type: 'error',
        message: res.msg,
      });
    }
  }

  // 上传文件限制个数
  limitUpload(files: any, fileList: any) {
    this.$message({
      message: '最多可添加1张图片',
      type: 'error',
    });
  }

  // 上传图片之前
  beforeAvatarUpload(file: any) {
    const imgMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
    const extension =
      imgMsg === 'jpg' ||
      imgMsg === 'JPG' ||
      imgMsg === 'png' ||
      imgMsg === 'PNG';
    const isLt50M = file.size / 1024 / 1024 <= 0.5;
    if (!extension) {
      this.$message.error('仅支持jpg，png格式的图片');
      return false;
    }
    if (!isLt50M) {
      this.$message.error('上传图片大小不能超过500k');
      return false;
    }
    return extension && isLt50M;
  }

  uploadLogoError() {
    this.$message.error('上传失败，请重新上传！');
  }
}
</script>

<style lang="scss" scoped>
.prize-edit {
  .param-upload-box {
    /deep/ .el-upload--picture-card {
      display: none;
    }
    .img-tip {
      font-size: 12px;
      font-weight: 400;
      color: #40445c;
    }
    .upload-btn {
      margin: 14px 0;
      width: 400px;
      background: #fff;
      border: 1px solid #d9d9d9;
      color: #5b81fe;
      font-size: 12px;
      font-weight: 400;
      &::before {
        margin-right: 12px;
      }
    }
    .upload-img-box {
      margin-top: 10px;
      &::after {
        display: block;
        content: '';
        clear: both;
      }
      li {
        width: 150px;
        height: 150px;
        float: left;
        margin-right: 10px;
        .upload-im {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          border: 1px solid #d9d9d9;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .upload-wrap {
            position: absolute;
            width: 100%;
            height: 80px;
            top: 0;
            left: 0;
            background: rgba(2, 2, 2, 1);
            opacity: 0.59;
            display: flex;
            justify-content: center;
            align-items: center;
            display: none;
            span {
              color: #fff;
              cursor: pointer;
              width: 0;
              height: 0;
              margin: auto 4px;
            }
            .left {
              border-top: 9px solid transparent;
              border-bottom: 9px solid transparent;
              border-right: 9px solid rgba(255, 255, 255, 1);
              position: relative;
              i {
                position: absolute;
                width: 1px;
                height: 16px;
                border-left: 2px solid rgba(255, 255, 255, 1);
                top: -8px;
                left: -4px;
              }
            }
            .lastleft {
              border-right: 9px solid rgba(255, 255, 255, 1);
              i {
                border-left-color: rgba(187, 186, 186, 1);
              }
            }
            .turn-left {
              border-top: 9px solid transparent;
              border-bottom: 9px solid transparent;
              border-right: 9px solid #fff;
            }
            .turn-right {
              border-top: 9px solid transparent;
              border-bottom: 9px solid transparent;
              border-left: 9px solid #fff;
            }
            .right {
              border-top: 9px solid transparent;
              border-bottom: 9px solid transparent;
              border-left: 9px solid #fff;
              position: relative;
              i {
                position: absolute;
                width: 1px;
                height: 16px;
                border-left: 2px solid #fff;
                top: -8px;
                right: -4px;
              }
            }
          }
        }
        .upload-delete {
          text-align: center;
          color: #5b81fe;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>


