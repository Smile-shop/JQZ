<template>
    <div>
        <div class="set-page">
          <div class="view-content">
              <vue-fabric ref="canvas" id="fabriccanvas" width="375" height="667" @onUpdataItem="onUpdataItem"></vue-fabric>
          </div>
          <div class="set-warp">
           <el-form
              ref="form"
              label-width="50px"
              class="add-form"
              :model="form"
              :rules="rules"
              >
                <el-form-item prop="posterImgUrl" label=" ">
                  <div style="display: flex;">
                    <span>上传海报：</span>
                    <span>
                      <el-upload
                        class="avatar-uploader"
                        :multiple="false"
                        :show-file-list="false"
                        :http-request="uploadImg"
                        :before-upload="beforeAvatarUpload"
                        action=""
                      >
                        <template>
                          <el-button  type="primary">选择图片</el-button>
                        </template>
                      </el-upload>
                    </span>
                  </div>
                  <div>最佳尺寸：750*1334，最佳大小：500KB以内，海报格式：jpg</div>
                </el-form-item>
                <el-form-item prop="isShowQrCode" label=" ">
                  <span>带参数二维码：</span><el-radio style="margin-left:10px"  v-model="form.isShowQrCode" label="1">二维码</el-radio>
                </el-form-item>
                 <el-form-item>
                  <span>用户头像：</span><el-switch v-model="isHeadImgSetting" @change="onUserHeadChange"></el-switch>
                </el-form-item>
                <el-form-item>
                  <span>尺寸：</span>
                  <el-input :style="{margin:'5px',width:'130px'}"
                    v-model.number="form.headImgWidth"
                    onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                    onblur="if(value>375)value=375"
                    type="number"
                  @blur="onInputHeadWidth">
                    <template slot="prepend">宽</template>
                  </el-input>
                   <el-input :style="{margin:'5px',width:'130px'}"
                      v-model.number="form.headImgHighth"
                      onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                      onblur="if(value>375)value=375"
                      type="number"
                     @blur="onInputHeadHighth">
                    <template slot="prepend">高</template>
                  </el-input>
                </el-form-item>
                 <el-form-item>
                  <span>形状：</span>
                   <el-radio-group v-model="form.headImgShape" @change="onHeadImgShapeChange">
                      <el-radio-button label="1">圆型</el-radio-button>
                      <el-radio-button label="2">方型</el-radio-button>
                   </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <span>用户昵称：</span><el-switch v-model="isUserNicknameStyleSetting" @change="onNicknameChange"></el-switch>
                </el-form-item>
                 <el-form-item v-if="isUserNicknameStyleSetting">
                  <span>颜色：</span><span><el-color-picker v-model="form.userNicknameColor" size="medium" @change="onColorChange"></el-color-picker></span>
                  <span>大小：</span><el-input :style="{margin:'5px',width:'100px'}"
                    v-model.number="form.userNicknameSize"
                    onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                    oninput="if(value.length>2)value=value.slice(0,2)"
                    onblur="if(value>90)value=90"
                    type="number"
                   @blur="onColorChange"></el-input><span>字号</span>
                </el-form-item>
                <el-form-item>
                  <div class="prompt">
                    <span class="prompt-title">分享海报配置说明：</span>
                    <br />
                    1.最佳尺寸： 750*1334（宽*高）
                    <br />
                    2.海报不能超过500K；
                    <br />
                    3.海报格式：jpg；
                    <br />
                    4.点击[用户头像] [用户昵称] 即可自定义相应元素对应在裂变海报上的位置；
                    <br />
                    5.可自行拖拉设置相应元素的大小
                    <br />
                  </div>
                </el-form-item>
              </el-form>
              </div>
      </div>
      <div class="button-div">
        <el-button type="success"  @click="onprev">上一步</el-button>
        <el-button type="primary"  @click="submit">下一步</el-button>
      </div>
    </div>
</template>
<script lang="ts">
import {Vue, Component, Prop , Emit, Watch} from 'vue-property-decorator';
import VueFabric from '@/components/VueFabric.vue'
import {
  uploadBgImg,
} from '@/api/super-mkt/activity-set/fans';
import {
  getActiveSecond,
  saveActiveSecond
} from '@/api/super-mkt/activity-set/fans_plus';
@Component({
  components: {
    VueFabric
  }
})
export default class BillActivity extends Vue {
  @Prop({default: null}) activitiyId!: any;
  @Prop({default: ''}) curToken!: string;
   form = {
    activitiyId: '', // 活动ID
    curToken: '',
    headImgWidth: 66, // 头像宽度
    headImgHighth: 66, // 头像高度
    headImgShape: '2', // 头像形状（1，圆形，2，正方形）
    headImgX: 50, // 头像X坐标
    headImgY: 50, // 头像Y坐标
    isHeadImgSetting: '1', // 是否设置头像（1，是 0否）
    posterImgUrl: '', // 海报
    isShowQrCode: '1', // 是否显示带参二维码（1，是 0否）
    isUserNicknameStyleSetting: '1', // 用户昵称是否设置样式（1,是，0，否）
    userNicknameColor: '#409EFF', // 昵称颜色
    userNicknameSize: 20, // 昵称大小
    userNicknameX: 100, // 昵称X
    userNicknameY: 40, // 昵称Y
    qrcodeHighth: 84,
    qrcodeWidth: 84,
    qrcodeX: 180,
    qrcodeY: 550,
   }
   isUserNicknameStyleSetting = false;
   isHeadImgSetting = false;
   // 规则
  rules = {
    posterImgUrl: [
      { required: true, message: '请上传海报背景', trigger: 'on-success' },
    ],
    isShowQrCode: [
      { required: true, message: '请选择带参二维码', trigger: 'blur' },
    ]
  }

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
          getActiveSecond(body).then((res: any) => {
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
    this.isUserNicknameStyleSetting = this.form.isUserNicknameStyleSetting == '1';
    this.isHeadImgSetting = this.form.isHeadImgSetting == '1';
    if (this.form.posterImgUrl && this.form.posterImgUrl != '') {
      this.onAddBackgroundImage(this.form.posterImgUrl);
    } else {
      this.onAddBackgroundImage(require('@/assets/images/super-mkt/fans_plus/defult_bg.jpg'));
    }
    this.onGreatUserNickname();
    this.onGreatImgeCode();
    this.onUserHead();
  }

  initSendForm() {
    this.form.isUserNicknameStyleSetting = this.isUserNicknameStyleSetting ? '1' : '0';
    this.form.isHeadImgSetting = this.isHeadImgSetting ? '1' : '0';
    const userhead = (this.$refs.canvas as VueFabric).getObjeById('userhead');
    if (userhead) {
      this.form.headImgX = userhead.aCoords.tl.x;
      this.form.headImgY = userhead.aCoords.tl.y;
    }
    const nickname = (this.$refs.canvas as VueFabric).getObjeById('nickname');
    if (nickname) {
      this.form.userNicknameX = nickname.aCoords.tl.x;
      this.form.userNicknameY = nickname.aCoords.tl.y;
    }
    const codeimg = (this.$refs.canvas as VueFabric).getObjeById('codeimg');
    if (codeimg) {
      this.form.qrcodeX = codeimg.aCoords.tl.x;
      this.form.qrcodeY = codeimg.aCoords.tl.y;
      this.form.qrcodeWidth = codeimg.width * codeimg.scaleX;
      this.form.qrcodeHighth = codeimg.height * codeimg.scaleY;
    }
  }

  onprev() {
     this.$emit('onPreActive');
  }

  onUserHeadChange(bool: boolean) {
       this.onUserHead();
  }

  onNicknameChange(bool: boolean) {
     this.onGreatUserNickname();
  }

  onInputHeadWidth() {
    this.form.headImgHighth = this.form.headImgWidth > 375 ? 375 : this.form.headImgWidth;
    if (this.isHeadImgSetting) {
          const item = (this.$refs.canvas as VueFabric).getObjeById('userhead');
          if (item) {
            (this.$refs.canvas as VueFabric).updataItem(item, this.form.headImgWidth, this.form.headImgHighth);
          }
    }
  }

  onInputHeadHighth() {
    this.form.headImgWidth = this.form.headImgHighth > 375 ? 375 : this.form.headImgHighth ;
    if (this.isHeadImgSetting) {
          const item = (this.$refs.canvas as VueFabric).getObjeById('userhead');
          if (item) {
            (this.$refs.canvas as VueFabric).updataItem(item, this.form.headImgWidth, this.form.headImgHighth);
          }
    }
  }

  onHeadImgShapeChange() {
    this.onUserHead();
  }

  submit() {
    (this.$refs.form as any).validate((valid: any) => {
      if (valid) {
         this.onSaveActiveSecond();
      } else {
        this.$message({
          message: '请检查必填项',
          type: 'warning'
        })
      }
    });
  }

  onSaveActiveSecond() {
    this.initSendForm();
    const body: any = {
        ...this.form,
      }
    if (!this.activitiyId) {
        delete body.activitiyId;
    } else {
      body.activitiyId = this.activitiyId;
    }
    saveActiveSecond(body).then((res: any) => {
        if (res.code === 0) {
             this.$emit('onNextActive');
        }
      })
  }

  onColorChange() {
    if (this.isUserNicknameStyleSetting) {
      const item = (this.$refs.canvas as VueFabric).getObjeById('nickname');
      if (item) {
        (this.$refs.canvas as VueFabric).updataText(item, this.form.userNicknameColor, this.form.userNicknameSize);
      }
    }
  }

  onUpdataItem(...options: any[]) {
    const currtOpt = options[0][0].target;
    if (currtOpt && currtOpt.id == 'userhead') {
      const width = parseInt((currtOpt.width * currtOpt.scaleX).toFixed(0), 0);
      const height = parseInt((currtOpt.height * currtOpt.scaleY).toFixed(0), 0);
      this.form.headImgWidth =  width > 375 ? 375 : width;
      this.form.headImgHighth =  height > 375 ? 375 : height;
      (this.$refs.canvas as VueFabric).updataItem(currtOpt, this.form.headImgWidth, this.form.headImgHighth);
    }
    if (currtOpt && currtOpt.id == 'codeimg') {
      const width = parseInt((currtOpt.width * currtOpt.scaleX).toFixed(0), 0);
      const height = parseInt((currtOpt.height * currtOpt.scaleY).toFixed(0), 0);
      this.form.qrcodeWidth =  width > 375 ? 375 : width;
      this.form.qrcodeHighth =  height > 375 ? 375 : height;
      (this.$refs.canvas as VueFabric).updataItem(currtOpt, this.form.qrcodeWidth, this.form.qrcodeHighth);
    }
    if (currtOpt && currtOpt.id == 'nickname') {
        currtOpt.fontSize *= currtOpt.scaleX;
        const fontSize = currtOpt.fontSize.toFixed(0) > 90 ? 90 : currtOpt.fontSize.toFixed(0);
        currtOpt.scaleX = 1;
        currtOpt.scaleY = 1;
        this.form.userNicknameSize = fontSize;
        (this.$refs.canvas as VueFabric).updataText(currtOpt, this.form.userNicknameColor, this.form.userNicknameSize);
    }
  }

  onUserHead() {
    const item = (this.$refs.canvas as VueFabric).getObjeById('userhead');
    if (item) {
      this.form.headImgX = item.aCoords.tl.x;
      this.form.headImgY = item.aCoords.tl.y;
      this.form.headImgWidth = item.width * item.scaleX;
      this.form.headImgHighth = item.height * item.scaleY;
      (this.$refs.canvas as VueFabric).removeItem(item);
    }
    if (this.isHeadImgSetting) {
        if (this.form.headImgShape == '2') {
          (this.$refs.canvas as VueFabric).createImage(require('@/assets/images/super-mkt/fans_plus/usehead_fan.png'), {id: 'userhead', left: this.form.headImgX + this.form.headImgWidth / 2, top: this.form.headImgY + this.form.headImgHighth / 2, width: this.form.headImgWidth, height: this.form.headImgHighth, lockRotation: true, hasRotatingPoint: false, hasBorders: true, hasControls: true});
       } else {
          (this.$refs.canvas as VueFabric).createImage(require('@/assets/images/super-mkt/fans_plus/usehead_yua.png'), {id: 'userhead', left: this.form.headImgX + this.form.headImgWidth / 2, top: this.form.headImgY + this.form.headImgHighth / 2, width: this.form.headImgWidth, height: this.form.headImgHighth, lockRotation: true, hasRotatingPoint: false, hasBorders: true, hasControls: true});
       }
    }
  }

  onGreatImgeCode() {
    (this.$refs.canvas as VueFabric).createImage(require('@/assets/images/super-mkt/fans_plus/qpcode.png'), {id: 'codeimg', left: this.form.qrcodeX + this.form.qrcodeHighth / 2, top: this.form.qrcodeY + this.form.qrcodeWidth / 2, width: this.form.qrcodeWidth, height: this.form.qrcodeHighth, lockRotation: true, hasRotatingPoint: false, hasBorders: true, hasControls: true});
  }

  onGreatUserNickname() {
      const item = (this.$refs.canvas as VueFabric).getObjeById('nickname');
      if (item) {
        this.form.userNicknameX = item.aCoords.tl.x;
        this.form.userNicknameY = item.aCoords.tl.y;
        this.form.userNicknameSize = item.fontSize;
        this.form.userNicknameColor = item.fill;
        (this.$refs.canvas as VueFabric).removeItem(item);
      }
      if (this.isUserNicknameStyleSetting) {
        (this.$refs.canvas as VueFabric).createText({id: 'nickname', context: '用户昵称', left: this.form.userNicknameX, top: this.form.userNicknameY, fontSize: this.form.userNicknameSize, fill: this.form.userNicknameColor, editable: false, lockRotation: true, hasRotatingPoint: false});
      }
  }

  onAddBackgroundImage(imgurl: string) {
    (this.$refs.canvas as VueFabric).setBackgroundImage(imgurl);
  }
    // 图片上传
  uploadImg(res: any) {
    const {file} = res;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alias', 'market');
    uploadBgImg(formData).then((res: any) => {
      const {data} = res;
      this.form.posterImgUrl = res.data[0];
      this.onAddBackgroundImage(this.form.posterImgUrl);
    })
  }

    // 上传图片之前
  beforeAvatarUpload(file: any) {
    const imgMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
    const extension =
      imgMsg === 'jpg' ||
      imgMsg === 'JPG';
    const isLt50M = file.size / 1024 / 1024 <= 0.5;
    if (!extension) {
      this.$message.error('仅支持jpg格式的图片');
      return false;
    }
    if (!isLt50M) {
      this.$message.error('上传图片大小不能超过500k');
      return false;
    }
    return extension && isLt50M;
  }
}
</script>
<style lang="scss" scoped>
/deep/ input[type="number"]{
  -moz-appearance: none;
  text-align: center;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
   .set-page {
      display: flex;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar-uploader .el-upload {
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
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .set-warp {
      display: flex;
      width: 100%;
      font-size: 14px;
    }
    .set-down {
      display:flex;
      width: 100%;
      font-size: 14px;
    }
    .submit {
      text-align: center;
      width: 100%;
      padding: 8px 0;
      margin-top: 45px;
    }
    .prompt {
    width: 500px;
    height: 80px;
    line-height: 24px;
    border-radius: 4px;
    font-size: 14px;
    .prompt-title {
      font-weight: bold;
    }
  }
  </style>