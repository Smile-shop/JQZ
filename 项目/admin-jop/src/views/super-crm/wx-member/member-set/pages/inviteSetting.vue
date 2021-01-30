<template>
    <div class="invite-setting">
        <el-tabs v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane label="分享页面设置" name="first">
                <section class="invite-wrapper">
                    <div class="invite-phone">
                        <p class="title">【效果预览】</p>
                        <div class="phone-show">
                            <div class="phone-style">
                                <div class="wx-share">
                                    <div class="info-content">
                                        <div class="info">
                                            <div class="tit">{{basisDataform.title}}</div>
                                            <div class="con">{{basisDataform.info}}</div>
                                        </div>
                                        <div class="img-div">
                                            <img v-if="shareImg" class="img-share" :src="shareImg" alt="share-img" />
                                        </div>
                                    </div>
                                    <div class="photo-content">
                                        <i class="iconfont icon-huiyuan"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="invite-box">
                        <el-form ref="form" class="form-box" :model="basisDataform">
                            <el-popover
                                placement="top-start"
                                width="200"
                                trigger="hover"
                                content=" 开启后，分享生效；关闭后会影响分享链接邀请好友方式的积分获得">
                                <i class="icon-i iconfont icon-wenhao" type="icon-wenhao" size="16px" slot="reference" color="#606266"></i>
                            </el-popover>
                            <el-form-item label="分享邀请：" >
                                <el-switch inactive-value="2" active-value="1" v-model="basisDataform.isShare"></el-switch>
                            </el-form-item>
                            <el-form-item label="分享图片:">
                                <el-upload
                                class="upload-demo"
                                :headers="uploadOpt"
                                :action="uploadUrl('2')"
                                :show-file-list="false"
                                :on-success="uploadShareSuccess"
                                :on-error="uploadError"
                                :disabled="basisDataform.isShare === '2' ? true : false"
                                name="imgFile"
                                >
                                    <el-button size="small" type="primary" :disabled="basisDataform.isShare === '2' ? true : false">上传图片</el-button>
                                    <span class="el-upload-tip">图片格式：*jpg、png,尺寸：300px*300px</span>
                                </el-upload>
                                <div class="img-share">
                                    <img v-if="shareImg" class="share" :src="shareImg" alt="share-img" />
                                </div>
                            </el-form-item>
                            <el-form-item label="分享标题:" class="share-title">
                                <el-input v-model="basisDataform.title" :maxlength="13" :disabled="basisDataform.isShare === '2' ? true : false"></el-input>
                            </el-form-item>
                            <el-form-item label="分享内容:" class="share-content">
                                <el-input type="textarea" v-model="basisDataform.info" :maxlength="32" :disabled="basisDataform.isShare === '2' ? true : false"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="subShareBasisData">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </section>
            </el-tab-pane>
            <el-tab-pane label="邀请设置" name="second" :disabled="basisDataform.isShare === '2' ? true : false">
                 <section class="invite-wrapper">
                    <!-- <div class="invite-phone">
                        <p class="title">【效果预览】</p>
                        <div class="phone-show"></div>
                    </div> -->
                    <div class="invite-box invite-box2">
                        <el-form ref="form" class="form-box form-box2" :model="form2" label-width="100px">
                            <el-form-item label="邀请设置：">
                                <p class="invite-label">此设置仅对“卡包注册”模式生效；“常规注册”模式，有推荐人时不可更改信息。</p>
                                <el-radio-group v-model="form2.autoShopSaler" class="el-radio-wrap">
                                    <el-radio label="0" class="el-label-wrap">手动选择门店和发卡人</el-radio>
                                    <p class="radio-p">（说明：新注册用户，有推荐人时，默认推荐人的门店或发卡人，可手动修改。）</p>
                                    <el-radio label="1" class="el-label-wrap">默认绑定推荐人门店和发卡人</el-radio>
                                    <p class="radio-p">（说明：新注册用户，有推荐人时，默认推荐人的门店或发卡人，自动提交。）</p>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="会员邀请积分设置：" label-width="155px">
                                <p>微会员 — 积分设置 — 会员邀请好友注册送积分</p>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="saveData">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </section>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getWxCompanyInfo, updateWxCompany} from '@/api/super-crm/wx-member'
import user from '@/utils/user';

@Component({})
export default class InviteSetting extends Vue {
    private activeName: string = 'first';
    private fileList =  []
    private basisDataform = {
        title: '注册会员',
        info: '有福同享，注册享好礼！',
        isShare: null
    }
    // 分享图片
    private shareImg: string = ''
    private form2 = {
        autoShopSaler: '1'
    }
    private mounted() {
        this.getWxCompanyInfo();
    }
    // 点击tab栏
    private handleClick(tab: any) {
        this.getWxCompanyInfo();
        // if (tab.index === '1') {
        //     this.getWxCompanyInfo();
        // }
    }

     // 邀请设置查询
   private getWxCompanyInfo() {
       getWxCompanyInfo().then((res: any) => {
            this.form2.autoShopSaler = res.data.autoShopSaler || '0';
            this.basisDataform.title = res.data.shareTitle || ''
            this.basisDataform.info = res.data.shareContent || ''
            this.shareImg = res.data.shareImg || ''
            this.basisDataform.isShare = res.data.isShare
       })
   }
    // 保存
    private saveData() {
        const params = {
            ...this.form2
        }
        updateWxCompany(params).then((res: any) => {
            this.$message.success('保存成功')
        })
    }
    private uploadShareSuccess(res: any) {
        if (res.code === 0) {
            this.shareImg = res.data;
            this.$message({
                type: 'success',
                message: '上传成功！'
            });
        } else {
            this.uploadError();
        }
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

    private uploadError() {
        this.$message.error('上传失败，请重新上传！');
    }
    // 分享保存
    private subShareBasisData() {
    if (this.shareImg === '') {
      this.$message({
        message: '请上传分享图片！',
        type: 'warning'
      })
      return
    }
    if (this.basisDataform.title === '') {
      this.$message({
        message: '请填写分享标题！',
        type: 'warning'
      })
      return
    }
    if (this.basisDataform.info === '') {
      this.$message({
        message: '请填写分享内容！',
        type: 'warning'
      })
      return
    }
    const params = {
      shareTitle: this.basisDataform.title,
      shareImg: this.shareImg,
      shareContent: this.basisDataform.info,
      isShare: this.basisDataform.isShare
    }
    updateWxCompany(params).then((res: any) => {
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
    })
  }
}
</script>

<style lang="scss">
.invite-setting {
    .invite-wrapper {
        display: flex;
        .invite-phone {
            width: 332px;
            height: 667px;
            .title {
                width: 100%;
                text-align: center;
                font-family: MicrosoftYaHei-Bold;
                font-size: 16px;
                font-weight: bold;
                color: #409eff;
                padding-bottom: 20px;
            }
            .phone-show {
                width: 100%;
                height: calc(100% - 50px);
                background: #f5f5f5;
                border: solid 1px #dddddd;
                // background: url('~@/assets/images/super-crm/cloud-showroom/goods.png') no-repeat top center;
                // background-size: 90%;
                .phone-style {
                    width: 100%;
                    height: 100%;
                    .wx-share {
                        display: flex;
                        width: 100%;
                        margin: 0 auto;
                        height: 100%;
                        .info-content {
                            width: 270px;
                            height: 76px;
                            border-radius: 4px;
                            border: solid 1px #eeeeee;
                            background-color: #ffffff;
                            margin: 10px 6px 0 10px;
                            padding-right: 8px;
                            display: flex;
                            .info {
                                width: 210px;
                                flex-grow: 1;
                                .tit {
                                    font-size: 14px;
                                    color: #333333;
                                    padding: 11px 0 5px 12px;
                                    height: 34px;
                                }
                                .con {
                                    font-size: 11px;
                                    color: #999999;
                                    padding: 0 0 5px 12px;
                                }
                            }
                            .img-div {
                                width: 45px;
                                font-size: 0;
                                img {
                                    width: 38px;
                                    margin-top: 30px;
                                    margin-left: 2px;
                                }
                            }
                        }
                    }
                    .photo-content {
                        width: 38px;
                        height: 38px;
                        line-height: 38px;
                        text-align: center;
                        border-radius: 4px;
                        border: solid 1px #eeeeee;
                        background-color: #ffffff;
                        margin-top: 10px;
                        i {
                            font-size: 21px;
                            color: #999999;
                        }
                    }
                }
            }
        }
        .invite-box {
            flex: 1;
            margin-left: 30px;
            .form-box {
                width: 500px;
                position: relative;
                /deep/ .el-switch__core {
                    margin-left: 30px;
                }
                .share-title {
                    .el-input {
                        width: 380px;
                    }
                }
                .share-content {
                    .el-textarea {
                        width: 380px;
                    }
                }
                .icon-i {
                    position: absolute;
                    left: 66px;
                    top: 12px;
                    z-index: 1;
                }
                .el-radio-wrap {
                    margin-top: 15px;
                    font-size: 13px;
                    color: #999999;
                    .el-label-wrap {
                        display: block;
                        margin-bottom: 10px;
                    }
                }
                .el-upload-tip {
                    font-family: MicrosoftYaHei;
                    font-size: 12px;
                    color: #999999;
                    padding-left: 13px;
                }
                .img-share {
                    border-radius: 4px;
                    border: solid 1px #dddddd;
                    width: 452px;
                    height: 76px;
                    font-size: 0;
                    margin-top: 12px;
                    padding: 5px;
                    .share {
                        width: 64px;
                        height: 64px;
                    }
                }
                .share-box {
                    display: flex;
                    .share-img {
                        width: 80px;
                        height: 80px;
                    }
                    .invite-upload {
                        flex: 1;
                        padding-left: 20px;
                        .el-upload--text {
                            text-align: left;
                        }
                    }
                }
            }
            .form-box2 {
                width: 100%;
                .radio-p {
                    margin-bottom: 30px;
                    margin-left: 18px;
                }
            }
        }
        .invite-box2 {
            margin-left: 0;
            .invite-label {
                font-size: 13px;
                color: #666;
            }
        }
    }
}
</style>