<template>
   <div class="set-page">
      <div class="set-warp">
       <el-form ref="form" label-width="180px" class="add-form" :model="form" :rules="rules">
          <el-form-item
            label="活动主图："
            prop="imgUrl"
          >
            <el-upload
            :class="{hide:hideUpload}"
            :headers="uploadHeaders"
            :action="baseURL+'\/jop-marketing-web\/market\/upload'"
            :file-list="fileList[0]?[fileList[0]]:[]"
            :multiple="false"
            :on-remove="handleRemove"
            :on-change="changeimg"
            :on-success="(response, file) => uploadPicSuccessHandle(response, file, [...fileList[0]])"
            :limit="limitCount"
            :before-upload="beforeAvatarUpload"
            list-type="picture-card"
          >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url" alt=""
                >
                <span class="el-upload-list__item-actions">
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
          </el-upload>
          <div class="prompt">建议尺寸750*750px，JPG/PNG格式，图片小于500KB。</div>
          </el-form-item>
          <el-form-item label="活动标题：" prop="title">
              <el-input
              v-model="form.title"
              maxlength="40"
              placeholder="请输入"
              :style="{width:'600px'}"
              show-word-limit    
              ></el-input>
          </el-form-item>
          <el-form-item label="活动副标题：" prop="secondTitle">
              <el-input
              type="textarea"
              v-model="form.secondTitle"
              maxlength="100"
              :rows="2"
              placeholder="请输入"
              :style="{
                  width: '600px'
                  }"
              show-word-limit    
              ></el-input>
          </el-form-item>
          <el-form-item label="活动时间：" prop="endTime">
          <el-date-picker
            type="datetime"
            placeholder="开始时间"
            v-model="form.beginTime"
            style="width: 200px;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="limitDate('start', $event)"
            :disabled="form.status==2"
          ></el-date-picker>-
          <el-date-picker
            type="datetime"
            placeholder="结束时间"
            v-model="form.endTime"
            style="width: 200px;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            @change="limitDate('end', $event)"
          ></el-date-picker>
        </el-form-item>
      <el-form-item label="活动详情：">
          <div style="display:flex">
            <wang-editor ref="ue" type="mkt-gold-plus" style="width:700px" />
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <div class="item-label">客服设置：</div>
          </template>
          <el-select v-model="form.custServiceId" placeholder="默认客服">
              <el-option
              v-for="item in clientOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>   
        </el-form-item>
       </el-form>
        <div class="view-content">
           <img src="@/assets/images/super-mkt/fission_retail/iphone.png" alt="">
           <div class="container">
            <header>
              <div class="status-bar">
                <img src="~@/assets/images/super-mkt/fission_retail/menu_title.png" alt="图片">
                <div class="tool-bar">
                  <span>{{this.form.title}}</span>
                </div>
              </div>
            </header>
            <main>
                <img  src="~@/assets/images/super-mkt/fission_retail/img_context.png" alt="图片">
                <div class="banner-bar">
                  <template v-if="(form.imgUrl!='')">
                        <img  :src="form.imgUrl" style="height:375px" alt="图片">
                  </template>
                  <template v-else>
                        <img  src="~@/assets/images/super-mkt/fission_retail/img_banner.png" style="height:375px" alt="图片">
                  </template>
                </div>
                <div class="banner-text">
                  <div class="banner-title">{{this.form.title}}</div>
                  <div class="banner-title2">{{this.form.secondTitle}}</div>
                </div>
                
            </main>
            <footer>
              <div>
                <img src="~@/assets/images/super-mkt/fission_retail/down_menu.png"/>
              </div>
            </footer>
           </div>
        </div>
        </div>
       <div class="button-div"><el-button type="primary" @click="submit">下一步</el-button></div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';
import WangEditor from '@/components/WangEditor.vue';
import {
  addDistributionFrist,
  getDistributionFrist,
  pageQueryCustomerService
} from '@/api/super-mkt/activity-set/fission_retail';
import user from '@/utils/user';
@Component({
  components: {
    WangEditor,
  },
})
export default class BaseSetActivity extends Vue {
  @Prop({ default: '' }) curToken!: string;
  hideUpload = false;
  limitCount = 1;
  baseURL = VUE_APP_BASE_API;
  uploadHeaders = {
        ticket: user.serverUser.ticket,
        companyKey: user.serverUser.account.companyKey,
        accountId: user.serverUser.account.accountId
      }
  form = {
        id: '', // 活动ID
        custServiceId: 0, // 客服ID
        imgUrl: '',
        secondTitle: '', // 活动副标题
        title: '', // 活动标题
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        curToken: '',
        detail: '', // 赠品
        status: 1
     };
  clientOptions = [] as any[];
  fileList = [] as any[];
  // 规则
rules = {
    imgUrl: [
      { required: true, message: '请上传活动主图', trigger: 'on-success' },
    ],
    title: [
      { required: true, message: '请输入活动标题', trigger: 'blur' },
    ],
    secondTitle: [
      { required: true, message: '请输入活动副标题', trigger: 'blur' },
    ],
    beginTime: [
      { required: true, message: '请输入活动时间', trigger: 'change' },
    ],
    endTime: [{ required: true, message: '请输入活动时间', trigger: 'change' }]
  };
activitiyId: any;
mounted() {
    if (this.$route.query.id) {
      this.activitiyId = this.$route.query.id;
    }
    let body: any;
    if (this.curToken != '' && this.activitiyId) {
      body = { distributionId: this.activitiyId, curToken: this.curToken };
    } else if (this.activitiyId) {
      body = { distributionId: this.activitiyId };
    } else if (this.curToken != '') {
      body = { curToken: this.curToken };
    }
    if (body) {
      getDistributionFrist(body).then((res: any) => {
        if (res.code === 0) {
          this.form = res.data;
          this.initForm();
        }
      });
    } else {
      this.initForm();
    }
    this.pageQueryCustomer();
}

initForm() {
  if (this.curToken && this.curToken != '') {
    this.form.curToken = this.curToken;
  }
  this.form.id = this.activitiyId;
  (this.$refs.ue as any).setContent(this.form.detail);
  if (this.form.imgUrl && this.form.imgUrl != '') {
      this.fileList = [{name: '', url: this.form.imgUrl}];
      this.hideUpload = this.fileList.length >= this.limitCount;
  }
}

initSendForm() {
    this.form.detail = (this.$refs.ue as any).getContent();
}

pageQueryCustomer() {
  const body: any = {
    pageNum: 1,
    pageSize: 10000
  };
  pageQueryCustomerService(body).then((res: any) => {
        if (res.code === 0) {
          this.clientOptions = res.data ? res.data.list.map((item: any, index: any) => {
            console.log(item);
            return {
              value: item.id,
              label: item.kfName
            }
          }) : [];
          this.clientOptions.unshift({value: 0, label: '默认客服'});
          }
    });
  }

uploadPicSuccessHandle(response: any, file: any, picture: any[]) {
  const { code, data } = response;
  if (code === '0' && data.length) {
    if (picture[0]) {
      picture[0].url = data[0];
    } else {
        this.fileList = [{name: '', url: data[0]}];
    }
    this.form.imgUrl = data[0];
  }
}

handleRemove(file: any, fileList: any) {
  this.form.imgUrl = '';
  this.fileList = [];
  this.hideUpload = this.fileList.length >= this.limitCount;
}

changeimg(file: any, fileList: any) {
  this.hideUpload = this.fileList.length >= this.limitCount;
}

    // 提交
submit() {
    this.initSendForm();
    if (this.form.status == 3) {
      this.$emit('onNextActive', this.form.curToken);
    } else {
      (this.$refs.form as any).validate((valid: any) => {
        if (valid) {
          this.onSaveActiveFirst();
        } else {
          this.$message({
            message: '请检查必填项',
            type: 'warning',
          });
        }
      });
    }
  }
  // 限制开始时间
limitDate(option: any, date: any) {
    if (date) {
      const timestamp = moment(date).valueOf();
      const startDate = this.form.beginTime;
      const endDate = this.form.endTime;

      switch (option) {
        case 'start':
          if (endDate) {
            const endTimestamp = moment(endDate).valueOf();
            if (timestamp >= endTimestamp) {
              this.$set(
                this.form,
                'beginTime',
                moment(endTimestamp).format('YYYY-MM-DD HH:mm:ss')
              );
              this.$message({
                message: '开始时间不能大于或等于结束时间',
                type: 'warning',
              });
              this.form.beginTime = '';
            }
          }
          break;
        case 'end':
          if (startDate) {
            const startTimestamp = moment(startDate).valueOf();

            if (timestamp <= startTimestamp) {
              this.$set(
                this.form,
                'endTime',
                moment(startTimestamp).format('YYYY-MM-DD HH:mm:ss')
              );
              this.$message({
                message: '结束时间不能小于或等于开始时间',
                type: 'warning',
              });
              this.form.endTime = '';
            }
          } else if (timestamp < Date.now()) {
            this.$set(
              this.form,
              'endTime',
              moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            );
            this.$message({
              message: '结束时间不能小于当前时间',
              type: 'warning',
            });
            this.form.endTime = '';
          }
          break;
      }
    }
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

onSaveActiveFirst() {
    return new Promise((resolve, reject) => {
      const body: any = {
        ...this.form,
      };
      if (!this.activitiyId) {
        delete body.id;
      }
      addDistributionFrist(body)
        .then((res: any) => {
          if (res.code === 0) {
            this.$emit('onNextActive', res.data);
          }
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }
   }
</script>
<style lang='scss' scoped>
/deep/ .el-input .el-input__count .el-input__count-inner{
  background:transparent;
}
/deep/ .hide .el-upload--picture-card {
    display: none;
}
.set-page {
  display: flex;
  overflow:scroll;
}
.set-warp {
  overflow:scroll;
  display: -webkit-box;
  font-size: 14px;
}
.view-content {
  margin-left: 120px;
  height: 756px;
  width: 386px;
  position: relative;
  border: 0px solid #000;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  // position: relative;
  overflow: hidden;
  > .container {
      position: absolute;
      left: 0px;
      top: 0px;
      transform:scale(0.83,0.83);
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 2px;
      }
      > header {
        position: sticky;
        top: 0;
        background-color: #FFF;
        z-index: 1000;

        .status-bar {
          position: relative;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          > img {
            width: 100%;
          }
          > .tool-bar {
            position: absolute;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size:16px;
            color: #4D4D4D;
            span{
              overflow:hidden;//隐藏文字
              text-overflow:ellipsis;//显示 ...
              white-space:nowrap;//不换行
              width:180px;
            }
          }
        }
      }
      > main {
        position: relative;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        > img {
          width: 100%;
        }
        > .banner-bar {
            position: absolute;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size:16px;
            span{
              overflow:hidden;//隐藏文字
              text-overflow:ellipsis;//显示 ...
              white-space:nowrap;//不换行
              width:180px;
            }
          }
          > .banner-text {
            position: absolute;
            top: 500px;
            > .banner-title{
                text-align: left;
                display: -webkit-box;
                -webkit-line-clamp:2;
                -webkit-box-orient:vertical;
                overflow:hidden;
                font-size:14px;
                line-height:25px;
                width:320px;
                font-weight: bold;
                font-size: 20px;
            }
            > .banner-title2{
              margin-top: 5px;
              overflow:hidden;//隐藏文字
              -webkit-box-orient:vertical;
              display: -webkit-box;
              -webkit-line-clamp:2;
              font-size: 13px;
               line-height:18px;
              text-align: left;
              width:300px;
            }
          }
      }
      > footer {
        position: sticky;
        bottom: 0;
        background-color: #FFF;
        padding: 8px 28px;
        display: flex;
        justify-content: space-between;
        box-shadow: #DCDCE3 0 -2px 5px;

        > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 10px;
          color: #A3AAB7;

          > .iconfont {
            font-size: 20px;
          }

          &.active {
            color: #4D4D4D;
            .home{
              font-size: 20px;
            }
          }
        }
      }
  }
}
.prompt {
  color: #999999;
  line-height: 20px;
  border-radius: 4px;
  font-size: 13px;
}
.item-label:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
}
</style>