<template>
<div>
    <div class="set-page">
      <el-form
      ref="form"
      label-width="150px"
      class="add-form"
      :model="form"
      >
      <el-form-item prop="price" label="活动阶梯设置：">
        <div class="gift-item">
          <el-switch  v-model="isShowOneGift" disabled></el-switch>
            <span >一级礼品</span>
           <span >所需金额</span>
           <span >
                <el-input-number v-model="form.oneGiftNotice"  :controls="false" :min="1" :max="99999" :style="{width: '80px'}"></el-input-number>
           </span>
           <span >元</span>
           <span ><el-button type="primary" size="small" icon="el-icon-plus">添加礼品</el-button></span>
           <span >图片大小需不大于500KB，限制jpg/png，建议图片比例1:1</span>
        </div>
        <div style="margin-top:10px" v-if="isShowOneGift">
            <GiftTable></GiftTable>
        </div>
        <div  class="gift-item">
          <el-switch  v-model="isShowTwoGift"></el-switch><span >二级礼品</span>
           <span >所需金额</span>
           <span >
                <el-input-number v-model="form.twoGiftNotice"  :controls="false" :min="1" :max="99999" :style="{width: '80px'}"></el-input-number>
           </span>
           <span >元</span>
           <span ><el-button type="primary" size="small" icon="el-icon-plus">添加礼品</el-button></span>
        </div>
        <div style="margin-top:10px" v-if="isShowTwoGift">
              <GiftTable></GiftTable>
        </div>
        <div  class="gift-item">
          <el-switch  v-model="isShowThreeGift"></el-switch><span >三级礼品</span>
           <span >所需金额</span>
           <span >
                <el-input-number v-model="form.threeGiftNotice"  :controls="false" :min="1" :max="99999" :style="{width: '80px'}"></el-input-number>
           </span>
           <span >元</span>
           <span ><el-button type="primary" size="small" icon="el-icon-plus">添加礼品</el-button></span>
        </div>
        <div style="margin-top:10px" v-if="isShowThreeGift">
              <GiftTable></GiftTable>
        </div>
      </el-form-item>
      </el-form>
  </div>
  <div class="button-div">
    <el-button type="success"  @click="onprev">上一步</el-button>
    <el-button type="primary"  @click="submit">下一步</el-button>
  </div>
</div>
</template>
<script lang="ts">
import {Vue, Component, Prop , Emit, Watch} from 'vue-property-decorator';
import GiftTable from './gift-table.vue';
import {
  addDistributionSecond,
  getDistributionSecond,
  uploadBgImg
} from '@/api/super-mkt/activity-set/fission_retail';
@Component({
  components: {GiftTable}
})
export default class RetailActivity extends Vue {
  @Prop({default: null}) activitiyId!: any;
  @Prop({default: ''}) curToken!: string;
   form = {
    curToken: '',
    distributionId: '', // 活动ID
    status: 1
   }
   isShowOneGift = true;
   isShowTwoGift = false;
   isShowThreeGift = false;

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
  }

  initSendForm() {//
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
  onprev() {
     this.$emit('onPreActive');
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

    // 图片上传
  uploadImg(res: any) {
    const {file} = res;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alias', 'market');
    uploadBgImg(formData).then((res: any) => {
      const {data} = res;
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
.set-page {
  display: flex;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.submit {
  text-align: center;
  width: 100%;
  padding: 8px 0;
  margin-top: 45px;
}
.gift-item{
  margin-top: 10px;
  & span {
      margin-left:10px;
  }
}
  </style>