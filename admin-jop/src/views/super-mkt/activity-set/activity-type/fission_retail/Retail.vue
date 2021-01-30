<template>
<div>
    <div class="set-page">
      <div class="set-warp">
        <el-form
          ref="form"
          label-width="100px"
          class="add-form"
          :model="form"
          :rules="isShowStock?allrules:stockRules"
          >
          <el-form-item prop="goodsPrice" label="活动售价：">
              <el-input-number placeholder="请输入" :disabled="form.status==2" v-model="form.goodsPrice" :controls="false" :min="1" :max="999" :precision="2" :style="{width: '120px'}"></el-input-number> 
              <span style="margin-left:10px">元</span>
          </el-form-item>
          <el-form-item prop="origPrice" label="划线价格：">
              <el-input-number placeholder="请输入" :disabled="form.status==2" v-model="form.origPrice" :controls="false" :min="1" :max="999" :precision="2" :style="{width: '120px'}"></el-input-number>
              <span style="margin-left:10px">元</span>
          </el-form-item>
          <el-form-item prop="stock" label="库存：">
              <span>
                <el-switch v-model="isShowStock"></el-switch>
                <el-input-number :disabled="!isShowStock" placeholder="请输入" v-model="form.stock" :controls="false" :min="1" :max="99999" style="width:120px;margin-left:10px"></el-input-number>
                <span style="margin-left:10px">关闭页面上不展示库存</span>
              </span>
          </el-form-item>
          <el-form-item prop="price" label="分销设置：">
              <div><el-switch  v-model="isShowOneProfit" disabled></el-switch><span style="margin-left:10px">一级分销</span></div>
              <div><el-switch :disabled="form.status==2"  v-model="isShowTwoProfit"></el-switch><span style="margin-left:10px">二级分销</span></div>
              <div class="sy-class">
                  <div>
                     <el-radio-group :disabled="form.status==2" v-model="form.profitType">
                      <el-radio :label="1">固定收益</el-radio><el-radio :label="2">比例收益</el-radio>
                     </el-radio-group>
                  </div>
                  <div>
                    <span>一级收益：</span>
                     <template v-if="(form.profitType&&form.profitType==2)">
                        <el-input-number :disabled="form.status==2"  :placeholder="'不高于60%'" v-model="form.oneProfit" :controls="false" :min="0" :max="60" style="width:120px;margin-left:10px"></el-input-number>
                      <span>%</span>
                     </template>
                     <template v-else>
                        <el-input-number :disabled="form.status==2"  :placeholder="'最低0.3元起'" v-model="form.oneProfit" :controls="false" :min="0.3"  style="width:120px;margin-left:10px"></el-input-number>
                        <span>元</span>
                     </template>
                  </div>
                  <div v-if="isShowTwoProfit">
                    <span>二级收益：</span>
                     <template v-if="(form.profitType&&form.profitType==2)">
                        <el-input-number :disabled="form.status==2"  :placeholder="'不高于35%'" v-model="form.twoProfit" :controls="false" :min="0" :max="35" style="width:120px;margin-left:10px"></el-input-number>
                        <span>%</span>
                     </template>
                     <template v-else>
                        <el-input-number :disabled="form.status==2"  :placeholder="'最低0.3元起'" v-model="form.twoProfit" :controls="false" :min="0.3"  style="width:120px;margin-left:10px"></el-input-number>
                        <span>元</span>
                     </template>
                  </div>
              </div>
              <div><el-switch :disabled="form.status==2"  v-model="isDistributionType"></el-switch><span style="margin-left:10px">允许用户未购买分销</span><span style="margin-left:10px">开启后，用户未购买也能获得海报</span></div>
          </el-form-item>
          <el-form-item label="分销绑定：">
            <div style="margin:10px"><el-radio style="margin-left:10px" :label="1" v-model="form.bindType">支付后绑定</el-radio><span>针对本活动，仅支持用户购买成功后完成分销绑定</span></div>
            <div style="margin:10px">一级分销入账文案：
              <span style="margin:20px 0;">
                <el-input v-model="form.onePayNotice" placeholder="你的好友已下单，奖励已到账！" type="text" maxlength="30" :style="{width: '350px'}" show-word-limit>
              </el-input></span>
              <el-tooltip placement="top">
                <div slot="content">你的好友已下单，奖励已到账！</div>
                <span class="key-ulspan">查看示例</span>
              </el-tooltip>
            </div>
            <div style="margin:10px">二级分销入账文案：
              <span style="margin:20px 0;">
                <el-input v-model="form.twoPayNotice" placeholder="你的好友分销了一单，你又获得了一笔分销佣金" type="text" maxlength="30" :style="{width: '350px'}" show-word-limit></el-input>
              </span>
              <el-tooltip placement="top">
                <div slot="content">你的好友分销了一单，你又获得了一笔分销佣金</div>
                <span class="key-ulspan">查看示例</span>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item prop="posterUrl" label="海报设置：">
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
                      <el-button type="primary">选择图片</el-button>
                    </template>
                  </el-upload>
                </span>
              </div>
              <div>建议尺寸750*1334px，JPG、PNG格式，图片小于2MB。</div>
              <div><span>带参数二维码：</span><el-radio style="margin-left:10px"  v-model="form.isShowQrCode" label="1">二维码</el-radio></div>
              <div><span>用户头像：</span><el-switch v-model="isHeadImgSetting" @change="onUserHeadChange"></el-switch></div>
              <div>                  
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
              </div>
              <div>
                <span>形状：</span>
                <el-radio-group v-model="form.headImgShape" @change="onHeadImgShapeChange">
                    <el-radio-button label="1">圆型</el-radio-button>
                    <el-radio-button label="2">方型</el-radio-button>
                </el-radio-group>
              </div>
              <div><span>用户昵称：</span><el-switch v-model="isUserNicknameStyleSetting" @change="onNicknameChange"></el-switch></div>
              <div v-if="isUserNicknameStyleSetting">
              <span>颜色：</span><span><el-color-picker v-model="form.userNicknameColor" size="medium" @change="onColorChange"></el-color-picker></span>
              <span>大小：</span><el-input :style="{margin:'5px',width:'100px'}"
                v-model.number="form.userNicknameSize"
                onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                oninput="if(value.length>2)value=value.slice(0,2)"
                onblur="if(value>90)value=90"
                type="number"
                @blur="onColorChange"></el-input><span>字号</span>
              </div>
          </el-form-item>
          </el-form>
          </div>
          <div class="view-content">
              <vue-fabric ref="canvas" id="fabriccanvas" width="375" height="667" @onUpdataItem="onUpdataItem"></vue-fabric>
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
import VueFabric from '@/components/VueFabric.vue';
import {
  addDistributionSecond,
  getDistributionSecond,
  uploadBgImg
} from '@/api/super-mkt/activity-set/fission_retail';
@Component({
  components: {
    VueFabric
  }
})
export default class RetailActivity extends Vue {
  @Prop({default: null}) activitiyId!: any;
  @Prop({default: ''}) curToken!: string;
   form = {
    curToken: '',
    distributionId: '', // 活动ID
    profitType: 1, //
    // goodsPrice: 0, // 划线价格
    // origPrice: 0, // 活动售价
    level: 1, // 分销等级（0,无等级 1，只有一级，2，二级）
    // stock: 0, // 库存
    // oneProfit: 0, // 一级收益
    // twoProfit: 0, // 二级收益
    isShowStock: 0, // 是否显示库存
    isDistributionType: 0, // 是否允许用户未购买分销
    onePayNotice: '', // 一级分销入账文案
    twoPayNotice: '', // 二级分销入账文案
    bindType: 1, // 分销绑定类型（1，支付后绑定）
    headImgWidth: 66, // 头像宽度
    headImgHighth: 66, // 头像高度
    headImgShape: '2', // 头像形状（1，圆形，2，正方形）
    headImgX: 30, // 头像X坐标
    headImgY: 30, // 头像Y坐标
    isHeadImgSetting: '1', // 是否设置头像（1，是 0否）
    posterUrl: '', // 海报
    isShowQrCode: '1', // 是否显示带参二维码（1，是 0否）
    isUserNicknameStyleSetting: '1', // 用户昵称是否设置样式（1,是，0，否）
    userNicknameColor: '#409EFF', // 昵称颜色
    userNicknameSize: 20, // 昵称大小
    userNicknameX: 120, // 昵称X
    userNicknameY: 50, // 昵称Y
    qrcodeHighth: 84,
    qrcodeWidth: 84,
    qrcodeX: 150,
    qrcodeY: 550,
    status: 1
   }
   isShowOneProfit = true;
   isShowTwoProfit = false;
   isShowStock = false;
   isDistributionType = false;
   isUserNicknameStyleSetting = false;
   isHeadImgSetting = false;
   // 规则
    allrules = {
      origPrice: [
        { required: true, message: '请输入活动售价', trigger: 'blur' },
      ],
      goodsPrice: [
        { required: true, message: '请输入划线价格', trigger: 'blur' },
      ],
      stock: [
        { required: true, message: '请输入库存', trigger: 'blur' },
      ],
      posterUrl: [
        { required: true, message: '请上传海报背景', trigger: 'on-success' },
      ]
    };
   // 规则
  stockRules = {
    origPrice: [
      { required: true, message: '请输入活动售价', trigger: 'blur' },
    ],
    goodsPrice: [
      { required: true, message: '请输入划线价格', trigger: 'blur' },
    ],
    posterUrl: [
      { required: true, message: '请上传海报背景', trigger: 'on-success' },
    ]
  }

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
          getDistributionSecond(body).then((res: any) => {
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
    this.isDistributionType = this.form.isDistributionType == 1;
    this.isShowStock = this.form.isShowStock == 1;
    this.isUserNicknameStyleSetting = this.form.isUserNicknameStyleSetting == '1';
    this.isHeadImgSetting = this.form.isHeadImgSetting == '1';
    this.isShowTwoProfit = this.form.level == 2 ? true : false  ;
    if (this.form.posterUrl && this.form.posterUrl != '') {
          this.onAddBackgroundImage(this.form.posterUrl);
        } else {
          this.onAddBackgroundImage(require('@/assets/images/super-mkt/fans_plus/defult_bg.jpg'));
        }
    this.onGreatUserNickname();
    this.onGreatImgeCode();
    this.onUserHead();
  }

  initSendForm() {
    this.form.isDistributionType = this.isDistributionType ?  1 : 0;
    this.form.isShowStock = this.isShowStock ? 1 : 0;
    this.form.isUserNicknameStyleSetting = this.isUserNicknameStyleSetting ? '1' : '0';
    this.form.isHeadImgSetting = this.isHeadImgSetting ? '1' : '0';
    this.form.level = this.isShowTwoProfit ? 2 : 1;
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
    if (this.form.status == 3) {
        this.$emit('onNextActive');
    } else {
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
  }

  onSaveActiveSecond() {
    this.initSendForm();
    const body: any = {
        ...this.form,
      }
    if (!this.activitiyId) {
        delete body.distributionId;
    } else {
      body.distributionId = this.activitiyId;
    }
    addDistributionSecond(body).then((res: any) => {
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
      this.form.posterUrl = res.data[0];
      this.onAddBackgroundImage(this.form.posterUrl);
    })
  }

    // 上传图片之前
  beforeAvatarUpload(file: any) {
    const imgMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
    const extension =
      imgMsg === 'jpg' ||
      imgMsg === 'JPG' ||
      imgMsg === 'png' ||
      imgMsg === 'PNG'
      ;
    const isLt2M = file.size / 1024 / 1024 <= 2;
    if (!extension) {
      this.$message.error('仅支持jpg格式的图片');
      return false;
    }
    if (!isLt2M) {
      this.$message.error('上传图片大小不能超过500k');
      return false;
    }
    return extension && isLt2M;
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-input .el-input__count .el-input__count-inner{
  background:transparent;
}
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
      width: 1000px;
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
    .key-ulspan {
      margin-left:10px;
      color: #1fc965;
      text-decoration: underline;
      cursor: pointer;
    }
    .sy-class{
        margin-left:50px;
        & div{
          margin-top:5px;
        }
        & span{
           margin-left:10px;
        }
    }
  </style>