<template>
  <section class="basis-setting">
    <el-tabs v-model="activeName">
      <el-tab-pane label="绑定门店" name="1">
        <div class="tab-content shop-setting">
          <header
            class="header-info"
          >指定门店： 请勾选需绑定的门店。若未进行勾选，其相应门店的数据（会员、品牌信息等）将不在系统内进行处理，同时在会员界面不展示。</header>
          <el-checkbox
            :indeterminate="isIndeterminateShopAllCheck"
            v-model="isShopAllCheck"
            @change="allShopClick"
          >全选</el-checkbox>
          <el-checkbox-group v-model="shopCheckList">
            <el-checkbox
              :label="item.shopName"
              v-for="item in shopList"
              :key="item.shopName"
              @change="selectShopClick"
              class="checkbox-item"
            >
              {{item.shopName}}
              <span class="chekbox-label" v-if="item.nameOut">(对外：{{item.nameOut}})</span>
            </el-checkbox>
          </el-checkbox-group>
          <el-button type="primary" class="sub-btn" @click="subShopSetMethod">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="基础资料" name="2" :disabled="isFreeMember === 1 ? true : false" v-if="isHidden">
        <div class="tab-content basis-data">
          <div class="content-header">
            <div
              class="btn btn-price"
              @click="basisDataSelect = '2'"
              :class="{'btn-selected': basisDataSelect === '2'}"
            >今日金价</div>
          </div>
          <div class="content-body">
            <header class="body-header">【效果预览】</header>
            <section class="shone-show">
              <div v-if="basisDataSelect === '1'" class="wx-share">
                <div class="info-content">
                  <div class="info">
                    <div class="title">{{basisDataform.title}}</div>
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
              <div v-else class="wx-price">
                <div class="img-price">
                  <img v-if="priceImg" :src="priceImg" alt="share-img" />
                </div>
                <div class="price-btn">
                  <div>销售金价</div>
                  <div>回收金价</div>
                </div>
                <div class="list title">
                  <div>材料成色</div>
                  <div>品牌</div>
                  <div>金价(/g)</div>
                  <div>工费(/g)</div>
                </div>
                <div class="list content" v-for="item in 2" :key="item">
                  <div>足金999.9</div>
                  <div></div>
                  <div>280</div>
                  <div></div>
                </div>
              </div>
            </section>
          </div>
          <div class="content-footer">
            <el-form ref="form" class="form-content" :model="basisDataform" label-width="100px">
              <el-form-item v-show="basisDataSelect === '1'" label="分享图片:">
                <el-upload
                  class="upload-demo"
                  :headers="uploadOpt"
                  :action="uploadUrl('2')"
                  :show-file-list="false"
                  :on-success="uploadShareSuccess"
                  :on-error="uploadError"
                  name="imgFile"
                >
                  <el-button size="small" type="primary">上传图片</el-button>
                  <span class="el-upload-tip">图片格式：*jpg、png,尺寸：300px*300px</span>
                </el-upload>
                <div class="img-share">
                  <img v-if="shareImg" class="share" :src="shareImg" alt="share-img" />
                </div>
              </el-form-item>
              <el-form-item label="分享标题:" v-show="basisDataSelect === '1'">
                <el-input v-model="basisDataform.title" :maxlength="13"></el-input>
              </el-form-item>
              <el-form-item label="分享内容:" v-show="basisDataSelect === '1'">
                <el-input type="textarea" v-model="basisDataform.info" :maxlength="32"></el-input>
              </el-form-item>
              <el-form-item v-show="basisDataSelect === '2'" label="今日金价图片:">
                <el-upload
                  class="upload-demo"
                  :headers="uploadOpt"
                  :action="uploadUrl('4')"
                  :show-file-list="false"
                  :on-success="uploadPriceSuccess"
                  :on-error="uploadError"
                  name="imgFile"
                >
                  <el-button size="small" type="primary">上传图片</el-button>
                  <span class="el-upload-tip">图片格式：*jpg、png,尺寸：375px*200px</span>
                </el-upload>
                <div class="img-share">
                  <img v-if="priceImg" class="price" :src="priceImg" alt="share-img" />
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="subBasisData">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 免费身份弹窗提示 -->
    <el-dialog
      title="温馨提示"
      :visible.sync="freeDialogVisible"
      width="30%"
      center>
      <span>付费版功能，如需使用，请联系客服购买开通。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="freeDialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  getWxShopList,
  setWxShopList,
  getBasisData,
  setBasisData
} from '@/api/super-crm/wx-member'
import user from '@/utils/user'

@Component({
  components: {}
})
export default class HomeModule extends Vue {
  private isHidden = false;  // 隐藏今日金价模块
  private isFreeMember = null; // 是否免费身份标识 1免费会员 0正常收费会员
  private freeDialogVisible: boolean = false; // 免费身份弹窗提示
  private basisDataform = {
    title: '注册会员',
    info: '有福同享，注册享好礼！'
  }
  private activeName: string = '1'
  private basisDataSelect: string = '2'
  private shopList = []
  private shopCheckList: string[] = []
  private isShopAllCheck: boolean = false
  private isIndeterminateShopAllCheck: boolean = true
  // private shareImg: string = require('@/assets/images/super-crm/wx-member/SharePictures.jpg');
  // private priceImg: string = require('@/assets/images/super-crm/wx-member/banner.png');
  private shareImg: string = ''
  private priceImg: string = ''

  // 上传图片header设置
  get uploadOpt() {
    return {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey
    }
  }
  // 上传图片路径
  uploadUrl(type: string): string {
    return `${VUE_APP_BASE_API}/jop-wx-web/wxCompany/uploadCompanyLogo?type=${type}`
  }

  private mounted() {
    this.getShopList()
    this.getBasisData()
    // 免费会员付费提示
    this.isFreeMember = user.serverUser.isFreeMember;
    this.$nextTick(() => {
      const elem: any = document.querySelector('#tab-2');
      elem.onclick = () => {
        this.freeTip(this.isFreeMember === 1);
      }
    })
  }
  // 绑定门店
  private getShopList() {
    getWxShopList().then((res: any) => {
      this.shopList = res.data || []
      this.shopCheckList = this.shopList
        .filter((p: any) => p.showStatus === '1')
        .map((p: any) => p.shopName)
      this.selectShopClick()
    })
  }
  // 免费会员弹窗提示
  private freeTip(isAble: any) {
    if (isAble) {
      this.freeDialogVisible = true;
    }
  }
  private selectShopClick() {
    this.isShopAllCheck = this.shopList.length === this.shopCheckList.length
    this.isIndeterminateShopAllCheck =
      this.shopCheckList.length > 0 &&
      this.shopCheckList.length < this.shopList.length
  }

  private allShopClick(value: any) {
    this.shopCheckList = value ? this.shopList.map((p: any) => p.shopName) : []
    this.isIndeterminateShopAllCheck = false
  }

  private subShopSetMethod() {
    const params = this.shopList.map((p: any) => {
      return {
        shopName: p.shopName,
        showStatus:
          this.shopCheckList.findIndex((item: any) => p.shopName === item) > -1
            ? '1'
            : '0'
      }
    })
    setWxShopList(params).then((res: any) => {
      this.$message({
        message: '保存成功!',
        type: 'success'
      })
    })
  }
  // 基础资料
  private getBasisData() {
    getBasisData().then((res: any) => {
      this.shareImg = res.data.shareImg || ''
      this.priceImg = res.data.goldPriceImg || ''
      this.basisDataform.title = res.data.shareTitle || ''
      this.basisDataform.info = res.data.shareContent || ''
    })
  }

  private uploadShareSuccess(res: any) {
    if (res.code === 0) {
      this.shareImg = res.data
      this.$message({
        type: 'success',
        message: '上传成功！'
      })
    } else {
      this.uploadError()
    }
  }

  private uploadPriceSuccess(res: any) {
    if (res.code === 0) {
      this.priceImg = res.data
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

  private subBasisData() {
    if (this.basisDataSelect === '1') {
      this.subShareBasisData()
    }
    if (this.basisDataSelect === '2') {
      this.subPriceBasisData()
    }
  }

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
      shareContent: this.basisDataform.info
    }
    setBasisData(params).then((res: any) => {
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
    })
  }

  private subPriceBasisData() {
    if (this.priceImg === '') {
      this.$message({
        message: '请上传今日今价图片！',
        type: 'warning'
      })
      return
    }
    const params = {
      goldPriceImg: ''
    }
    setBasisData(params).then((res: any) => {
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.basis-setting {
  .tab-content {
    height: calc(100vh - 250px);
    overflow: auto;
  }
  .shop-setting {
    .header-info {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #333333;
      padding: 12px 0;
    }
    .checkbox-item {
      width: 185px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .sub-btn {
      margin-top: 20px;
    }
  }
  .basis-data {
    display: flex;
    .content-header {
      width: 110px;
      padding-top: 40px;
      .btn {
        width: 100px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-family: MicrosoftYaHei;
        font-size: 12px;
        background-color: #eaedf1;
        color: #333333;
        cursor: pointer;
      }
      .btn:hover {
        opacity: 0.8;
      }
      .btn-price {
        margin-top: 13px;
      }
      .btn-selected {
        background-color: #409eff;
        color: #ffffff;
      }
    }
    .content-body {
      width: 330px;
      .body-header {
        width: 320px;
        text-align: center;
        font-family: MicrosoftYaHei-Bold;
        font-size: 16px;
        color: #409eff;
        padding-bottom: 18px;
      }
      .shone-show {
        width: 320px;
        height: 667px;
        background-color: #f5f5f5;
        border: solid 1px #dddddd;
        .wx-share {
          display: flex;
          .info-content {
            width: 254px;
            height: 76px;
            border-radius: 4px;
            border: solid 1px #eeeeee;
            background-color: #ffffff;
            margin: 10px 6px 0 10px;
            display: flex;
            .info {
              width: 210px;
              flex-grow: 1;
              .title {
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
        .wx-price {
          background-color: #ffffff;
          height: 100%;
          .img-price {
            width: 320px;
            height: 170px;
          }
          .price-btn {
            width: 300px;
            height: 40px;
            background-color: #d52223;
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin: 5px auto;
            color: #ffffff;
            div {
              width: 146px;
              height: 36px;
              line-height: 36px;
              text-align: center;
              font-size: 14px;
            }
            div:first-child {
              background-color: #ffffff;
              color: #d52223;
            }
          }
          .list {
            width: 300px;
            margin: 5px auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            div {
              flex-basis: 20%;
              text-align: center;
            }
          }
          .title {
            height: 40px;
            font-size: 14px;
            color: #333333;
            font-weight: bold;
            border-bottom: 1px solid #eeeeee;
          }
          .content {
            font-size: 12px;
            color: #333333;
          }
        }
      }
    }
    .content-footer {
      flex-grow: 1;
      .form-content {
        max-width: 438px;
        margin-top: 40px;
        .el-upload-tip {
          font-family: MicrosoftYaHei;
          font-size: 12px;
          color: #999999;
          padding-left: 13px;
        }
        .img-share {
          border-radius: 4px;
          border: solid 1px #dddddd;
          width: 336px;
          height: 74px;
          font-size: 0;
          margin-top: 12px;
          padding: 5px;
          .share {
            width: 64px;
            height: 64px;
          }
          .price {
            width: 118px;
            height: 64px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.shop-setting {
  .el-checkbox__label {
    width: 95%;
    white-space: normal;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: inline-block;
    -webkit-box-orient: vertical;
    vertical-align: middle;
    position: relative;
    .chekbox-label {
      position: absolute;
      bottom: -19px;
      left: 9px;
      font-size: 12px;
      color: #999;
      min-width: 200px;
    }
  }
}
</style>


