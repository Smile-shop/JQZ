<template>
  <div class="gold-price">
    <div class="tab-content basis-data">

      <div class="content-body">
        <header class="body-header">【效果预览】</header>
        <section class="shone-show">
          <div  class="wx-price">
            <div class="img-price">
              <img v-if="priceImg" :src="priceImg" alt="share-img" />
            </div>
            <div class="shop-select">
              <div class="shop-left">
                <i class="icon-shop iconfont icon-mendian1"></i>
                <span>金千枝翠竹旗舰店</span>
              </div>
              <div class="shop-right">
                <i class="angle"></i>
              </div>
            </div>
            <div class="gold-box">
              <div class="gold-btn">
                <p class="gold-select" v-show="radioArr.todayPrice === '1'">今日金价</p>
                <p class="gold-no" :class="{'gold-select' : radioArr.todayPrice === '0'}" v-show="radioArr.backPrice === '1'">回收金价</p>
                <!-- <p class="gold-no">换货回收金价</p> -->
              </div>
              <template v-if="radioArr.todayPrice === '1' || radioArr.backPrice === '1'">
                <div class="gold-content" v-for="(item, index) in 3" :key="index">
                  <div class="content-flex">
                    <p class="p1">足金</p>
                    <p class="p2"><span>品牌：</span>金六福</p>
                  </div>
                  <div class="content-flex">
                    <p class="p3">￥320.68</p>
                    <p class="p2" v-show="radioArr.gongPrice === '1'"><span>工费：</span>￥10</p>
                  </div>
                </div>
              </template>
              <div v-show="radioArr.contentShow === '1'">
                <div class="gold-btn">
                  <p class="gold-select">备注</p>
                </div>
                <div class="gold-text" v-html="areaValue2"></div>
              </div>
            </div>
            <!-- <div class="price-btn">
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
            </div> -->
          </div>
        </section>
      </div>
      <div class="content-footer">
        <el-form ref="form" class="form-content" :model="basisDataform" label-width="100px">
          <el-form-item label="今日金价图片:">
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
          <el-form-item label="今日金价:">
            <el-radio-group v-model="radioArr.todayPrice">
              <el-radio label="1">展示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="回收金价:">
            <el-radio-group v-model="radioArr.backPrice">
              <el-radio label="1">展示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="换货回收金价:">
            <el-radio-group v-model="radioArr.goBackPrice">
              <el-radio label="1">展示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="工费展示:">
            <el-radio-group v-model="radioArr.gongPrice" :disabled="radioArr.todayPrice === '0' && radioArr.backPrice === '0' ? true : false">
              <el-radio label="1">展示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文本框:">
            <el-radio-group v-model="radioArr.contentShow">
              <el-radio label="1">展示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文本框:" v-show="radioArr.contentShow === '1'">
            <el-input
              type="textarea"
              placeholder="请输入备注内容"
              v-model="areaValue"
              maxlength="200"
              rows="5"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="subBasisData">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import {
  getBasisData,
  setBasisData,
  qryGoldSetting,
  goldSetting
} from '@/api/super-crm/wx-member'
import user from '@/utils/user'

@Component({
  components: {}
})
export default class HomeModule extends Vue {
  private isFreeMember = null; // 是否免费身份标识 1免费会员 0正常收费会员
  private freeDialogVisible: boolean = false; // 免费身份弹窗提示
  private basisDataform = {
    title: '注册会员',
    info: '有福同享，注册享好礼！'
  }
  private activeName: string = '1'
  private shareImg: string = ''
  private priceImg: string = ''
  private areaValue: string = ''
  private areaValue2: string = ''
  private radioArr = {
    todayPrice: '1',
    backPrice: '1',
    goBackPrice: '1',
    gongPrice: '1',
    contentShow: '1',
  }

  @Watch('areaValue')
  onChange(newVal: any, oldVal: any) {
    const arr: any[] = [];
    newVal.split('\n').forEach((item: any) => arr.push(`<p style='font-size:12px;color:#999;margin: 6px 0;'>${item.trim()}</p>`));
    this.areaValue2 = arr.join('</p>');
  }
  @Watch('radioArr.todayPrice')
  todayPrice(newVal: any, oldVal: any) {
    if (newVal === '0' && this.radioArr.backPrice === '0') {
      this.radioArr.gongPrice = '0';
    }
  }
  @Watch('radioArr.backPrice')
  backPrice(newVal: any, oldVal: any) {
    if (newVal === '0' && this.radioArr.todayPrice === '0') {
      this.radioArr.gongPrice = '0';
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
  uploadUrl(type: string): string {
    return `${VUE_APP_BASE_API}/jop-wx-web/wxCompany/uploadCompanyLogo?type=${type}`
  }

  private mounted() {
    this.qryGoldSetting()
    // this.getBasisData()
    // 免费会员付费提示
    this.isFreeMember = user.serverUser.isFreeMember;
    this.$nextTick(() => {
      const elem: any = document.querySelector('#tab-2');
      // elem.onclick = () => {
      //   this.freeTip(this.isFreeMember === 1);
      // }
    })
  }
  // 查询今日金价
  private async qryGoldSetting() {
    const res = await qryGoldSetting({});
    this.areaValue = res.data.goldContent;
    this.radioArr.todayPrice = res.data.goldIsShow.toString();
    this.radioArr.backPrice = res.data.goldRetrieveIsShow.toString();
    this.radioArr.gongPrice = res.data.goldWorkPriceIsShow.toString();
    this.radioArr.contentShow = res.data.goldContentIsShow.toString();
    this.priceImg = res.data.goldPriceImg;
    // 今日金价和回收金价隐藏时，工费也得隐藏
    if (this.radioArr.todayPrice === '0' && this.radioArr.backPrice === '0' ) {
      this.radioArr.gongPrice = '0';
    }
  }
  // 免费会员弹窗提示
  private freeTip(isAble: any) {
    if (isAble) {
      this.freeDialogVisible = true;
    }
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
    this.subPriceBasisData()
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
      goldContent: this.areaValue,
      goldIsShow: parseInt(this.radioArr.todayPrice, 10),
      goldRetrieveIsShow: parseInt(this.radioArr.backPrice, 10),
      goldWorkPriceIsShow: parseInt(this.radioArr.gongPrice, 10),
      goldContentIsShow: parseInt(this.radioArr.contentShow, 10),
      goldPriceImg: ''
    }
    goldSetting(params).then((res: any) => {
      this.qryGoldSetting()
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.gold-price {
  .tab-content {
    height: calc(100vh - 250px);
    overflow: auto;
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
          background-color: #F7F3ED;
          height: 100%;
          .img-price {
            width: 320px;
            height: 170px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .shop-select {
            display: flex;
            align-items: center;
            height: 50px;
            padding: 0 15px;
            border-radius: 10px 10px 0px 0px;
            background: #fff;
            .shop-left {
              flex: 1;
              .icon-shop {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                margin-right: 8px;
              }
              span {
                font-size: 13px;
              }
            }
            .shop-right {
              width: 20px;
              display: flex;
              justify-content: center;
              align-items: flex-end;
              .angle {
                position: relative;
                bottom: -6px;
                width: 0;
                height: 0;
                border-top: 6px solid #E8D3A6;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid transparent;
              }
            }
          }
          .gold-box {
            padding: 15px;
            background: #F7F3ED;
            .gold-btn {
              display: flex;
              margin-bottom: 14px;
              p {
                margin-right: 20px;
              }
              .gold-no {
                color: #C1A975;
                font-size: 13px;
              }
              .gold-select {
                font-size: 13px;
                color: #333;
                font-weight: bold;
                position: relative;
                z-index: 2;
                &::after{
                  display: block;
                  position: absolute;
                  content: '';
                  width: 100%;
                  height: 6px;
                  background: #E8D3A6;
                  border-radius: 3px;
                  bottom: 0;
                  z-index: -1;
                }
              }
            }
          }
          .gold-content {
            display: flex;
            padding: 12px 15px;
            background: #fff;
            border-radius: 5px;
            margin: 0 0 10px;
            .content-flex {
              align-items: center;
              flex: 1;
              .p1 {
                font-size: 13px;
                font-weight: 600;
              }
              .p2 {
                font-size: 12px;
                color: #333333;
                margin-top: 6px;
                span{
                  color: #999999;
                }
              }
              .p3 {
                font-size: 13px;
                font-weight: 600;
                color: #DBB866;
              }
              &:nth-child(2) {
                p {
                  text-align: right;
                }
              }
            }
          }
          .gold-text {
            width: 100%;
            min-height: 95px;
            background: #fff;
            border-radius: 5px;
            padding: 6px 10px;
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