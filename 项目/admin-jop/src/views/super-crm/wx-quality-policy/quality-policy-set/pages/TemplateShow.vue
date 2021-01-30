<template>
  <article class="template-show">
    <el-tabs v-model="activeName">
      <el-tab-pane label="固定模板" name="1">
        <div class="template-box">
          <div class="template-select-img" v-for="(item, index) in 4" :key="index">
            <img :src="imgList01[index]" alt="v-1">
            <div class="btn-border"></div>
            <span class="name">固定模板</span>
            <el-button class="select-btn" size="mini" @click="showImg01(index, 1)">预览</el-button>
            <el-radio-group class="template-radio" v-model="evaluateStyle">
              <el-radio :label="item.toString()">样式{{styleText[index]}}</el-radio>
            </el-radio-group>
          </div>
          <p class="template-form-box">质保单内容设置</p>
          <el-form
            v-model="formData"
            label-width="218px"
          >
            <el-form-item
              label="LOGO设置："
            >
              <el-upload
                :headers="uploadOpt"
                :multiple="false"
                :show-file-list="false"
                :action="uploadUrl('6')"
                :before-upload="beforeLogoUpload"
                :on-success="uploadPriceSuccess"
                :on-error="uploadError"
                name="imgFile"
              >
                <el-button size="small" type="primary"><i class="el-icon-upload"></i>上传编辑文件</el-button>
                <div slot="tip" class="el-upload__tip">支持扩展名：*jpg、png，建议尺寸：140*40</div>
              </el-upload>
              <div class="img-share">
                <img :src="formData.evaluateLogo" alt="logo" v-if="formData.evaluateLogo">
              </div>
            </el-form-item>
            <el-form-item label="旧料展示金重（按克销售商品）:">
              <el-radio-group v-model="formData.showOldGoldWeightGram">
                <el-radio label="1">展示</el-radio>
                <el-radio label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="setConsumeNumber">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="定制模板" name="2">
        <div class="template-info">
          <p>定制模板说明：</p>
          <p>1.定制模板为增值服务，需要另外收取定制费用。如需定制请联系客服。</p>
          <p>2.定制质保单的样式以客户实际沟通确认样式为准。</p>
          <p>3.以下质保单客户案例，仅供参考。</p>
        </div>
        <div class="template-select-img" v-for="(item, index) in 4" :key="index">
          <img :src="smallImgUrl(item)" alt="v-1">
          <div class="btn-border"></div>
          <span class="name">客户案例{{styleText[index]}}</span>
          <el-button class="select-btn" size="mini" @click="showImg01(index + 1, 2)">预览</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <section class="toast-box" v-if="imgShow">
      <div class="box-content">
        <div class="mask" @click="imgShow = false"></div>
        <div class="content">
          <div class="btn-icon" v-if="activeName === '2'">
            <div @click="frontOrBack(true)" :class="[isFront ? 'selected' : '']">正面</div>
            <div @click="frontOrBack(false)" :class="[!isFront ? 'selected' : '']">反面</div>
          </div>
          <img :src="showImgUrl" alt="big-img">
        </div>
        <div class="close-icon" @click="imgShow = false"><i class="el-icon-close"></i></div>
      </div>
    </section>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {  getConsumeNumber, setConsumeNumber } from '@/api/super-crm/wx-quality-policy';
import user from '@/utils/user'
@Component({
})
export default class TemplateShow extends Vue {
  private activeName: string = '1';
  private imgShow: boolean = false;
  private showImgUrl: string = '';
  private isFront: boolean = true;
  private evaluateStyle: string = '1';
  private styleText: string = ['一', '二', '三', '四'] as any;
  private formData: any = {
    logoFileList: [],
    evaluateLogo: '',
    showOldGoldWeightGram: '1',
    goldprice: '1'
  }
  private imgList01 = [
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-1.png'),
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-2.png'),
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-3.png'),
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-4.png'),
  ]
  private imgList = [
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-1-front.jpg'),
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-1-back.jpg'),
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-2-front.jpg'),
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-2-back.jpg'),
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-3-front.jpg'),
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-3-back.jpg'),
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-4-front.jpg'),
    require('@/assets/images/super-crm/wx-quality-policy/big/new-big-4-back.jpg'),
  ];
  private imgIndex: number = -1;

  private mounted() {
    this.getConsumeNumber();
  }

  private smallImgUrl(index: number): string {
    return require(`@/assets/images/super-crm/wx-quality-policy/small/new-small-${index}.jpg`);
  }
  // 查询质保单
  private async getConsumeNumber() {
    const res = await getConsumeNumber();
    const { data } = res;
    this.formData.evaluateLogo = data.evaluateLogo;
    this.evaluateStyle = data.evaluateStyle;
    this.formData.showOldGoldWeightGram = data.showOldGoldWeightGram;
  }
  // 保存质保单
  private async setConsumeNumber() {
    const body = {
      showOldGoldWeightGram: this.formData.showOldGoldWeightGram,
      evaluateLogo: this.formData.evaluateLogo,
      evaluateStyle: this.evaluateStyle
    }
    await setConsumeNumber(body);
    this.$message.success('保存成功');
  }
  // 上传图片header设置
  get uploadOpt() {
    return {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey
    }
  }
  // 上传图片路径
  private uploadUrl(type: string): string {
    return `${VUE_APP_BASE_API}/jop-wx-web/wxCompany/uploadCompanyLogo?type=${type}`
  }
  private frontOrBack(isFront: boolean) {
    this.isFront = isFront;
    this.showImg01(this.imgIndex, 2);
  }

  private uploadPriceSuccess(res: any) {
    console.log(res.data)
    if (res.code === 0) {
      this.formData.evaluateLogo = res.data
      this.$message({
        type: 'success',
        message: '上传成功！'
      })
    } else {
      this.uploadError()
    }
  }

  private uploadError() {
    this.$message.error('上传失败，请重新上传！')
  }

  private showImg01(index: number, type: number) {
    if (type === 1) {
      this.showImgUrl = this.imgList01[index];
    } else {
      this.imgIndex = index;
      const n = this.isFront ? 2 * (index - 1) : 2 * (index - 1) + 1;
      this.showImgUrl = this.imgList[n];
    }
    this.imgShow = true;
  }

  private showImg(index: number) {
    this.imgIndex = index;
    if (index < 2) {
      this.showImgUrl = this.imgList[0];
    } else {
      const n = this.isFront ? 2 * (index - 1) - 1 : 2 * (index - 1);
      this.showImgUrl = this.imgList[n];
    }
    this.imgShow = true;
  }
  // 上传logo
  private uploadLogo(res: any) {
    const {file} = res;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alias', 'photos');
    // upload(formData).then((res: any) => {
    //   const {data} = res;

    //   this.formData.logoUrl = data.url;
    // })
  }
  // 上传logo限制
  private beforeLogoUpload(file: any) {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
      this.$message.error('上传头像图片只能是JPG或者png格式!');
    }
    if (!isLt2M) {
      this.$message.error('上传头像图片大小不能超过 2MB!');
    }
    return isJPG && isLt2M;
  }
}
</script>

<style lang="scss" scoped>
.template-show {
  .template-box {
    height: 100%;
    .template-radio {
      position: relative;
      top: 58px;
      z-index: 9;
    }
  }
  /deep/ .el-upload-list--picture {
    width: 400px;
  }
  /deep/ .el-upload-list--picture .el-upload-list__item-status-label{
    display: block;
  }
  .template-form-box {
    color: #606266;
    margin: 30px 0 20px;
  }
  .template-info {
    // height: 100px;
    border-radius: 5px;
    border: solid 1px #409eff;
    background-color: #f5faff;
    padding: 12px;
    margin-bottom: 24px;
    p {
      font-size: 14px;
      color: #333333;
      line-height: 24px;
    }
  }
  .template-select-img {
    display: inline-block;
    width: 250px;
    height: 186px;
    border-radius: 5px;
    border: solid 2px #dddddd;
    text-align: center;
    padding-top: 8px;
    margin-right: 20px;
    position: relative;
    margin-bottom: 50px;
    cursor: pointer;
    font-size: 0;
    img {
      width: 230px;
      height: 134px;
    }
    .btn-border {
      border-top: 1px solid #dddddd;
      margin-top: 2px;
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
  .img-share {
    border-radius: 4px;
    border: 1px solid #ddd;
    width: 360px;
    height: 74px;
    margin-top: 12px;
    img {
      height: 100%;
    }
  }
  .toast-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 5000;
    .box-content {
      width: 100%;
      height: 100%;
      position: relative;
      .mask {
        position: absolute;
        z-index: 5005;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        opacity: .8;
      }
      .content {
        position: absolute;
        z-index: 5010;
        left: calc(50% - 500px);
        top: calc(50% - 310px);
        width: 1000px;
        height: 820px;
        // background-color: #ffffff;
        .btn-icon {
          position: absolute;
          z-index: 5011;
          top: -60px;
          left: 390px;
          display: flex;
          width: 220px;
          height: 44px;
          background-color: #ffffff;
          color: #409eff;
          border-radius: 5px;
          div {
            flex-basis: 50%;
            text-align: center;
            line-height: 44px;
            cursor: pointer;
          }
          div:hover {
            opacity: .85;
          }
          div:first-child {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          div:last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
          .selected {
            background-color: #409eff;
            color: #ffffff;
          }
        }
        img {
          width: 100%;
          // height: 100%;
        }
      }
      .close-icon {
        position: absolute;
        z-index: 5011;
        right: 42px;
        top: 42px;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: #000000;
        color: #ffffff;
        cursor: pointer;
        i {
          font-size: 48px;
        }
      }
    }
  }
}
</style>


