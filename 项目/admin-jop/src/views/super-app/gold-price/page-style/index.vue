<template>
  <div class="j-page-style">

    <div class="j-page-style-content">
      <div class="column">
        <div class="title">选择门店：</div>
        <div>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in shopList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="column">
        <div class="title">横版：</div>
        <div class="style-list">
          <div
            class="list-item"
            :class="{ 'selected': `${TVShowType}` == `${item}` }"
            v-for="item in 3"
            :key="item">
            <img :src="backImg(item, 0)" alt="v-1">
            <div class="left">
              <el-button @click="showImg(item, 0)" size="mini">预览</el-button>
            </div>
            <div class="right">
              <el-button size="mini" icon="el-icon-success" type="primary" v-if="`${TVShowType}` == `${item}`">选择</el-button>
              <el-button size="mini" icon="el-icon-success" @click="pickPageStyle(item, 0)" v-else>选择</el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="title">竖版：</div>
        <div class="style-list">
          <div
            class="list-item"
            :class="{ 'selected': `${TVShowType}` == `${item + 3}` }"
            v-for="item in 3"
            :key="item">
            <img :src="backImg(item, 3)" alt="v-1">
            <div class="left">
              <el-button @click="showImg(item, 3)" size="mini">预览</el-button>
            </div>
            <div class="right">
              <el-button size="mini" icon="el-icon-success" type="primary" v-if="`${TVShowType}` == `${item + 3}`">选择</el-button>
              <el-button size="mini" icon="el-icon-success" @click="pickPageStyle(item, 3)" v-else>选择</el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="styles-color-pick">
        <div class="item-label">推荐颜色：</div>
        <div class="color-item-value" @click="pickColor(item)" v-for="item in colorList" :key="item" :style="{'background-color': item}"></div>
      </div>

      <div class="styles-color-pick">
        <div class="item-label">自定义颜色：</div>
        <div>
          <!-- <Input v-model="themeColor" placeholder="色值" style="width: 300px" /> -->
          <el-color-picker v-model="themeColor"></el-color-picker>
          <!-- <span>{{themeColor}}</span> -->
        </div>
      </div>

      <div class="styles-color-pick">
        <div class="item-label">提示语：</div>
        <div>
          <el-input v-model="TVTextInfo" placeholder="提示语" style="width: 300px"></el-input>
        </div>
      </div>

      <div class="styles-color-pick">
        <div class="item-label">LOGO：</div>
        <div>
          <el-upload
            :headers="opt"
            :on-success="uploadLogoSuccess"
            :on-error="uploadLogoError"
            :show-file-list="false"
            name="imgFile"
            :action="uploadUrl">
            <el-button>上传图片</el-button>
          </el-upload>
        </div>
        <div class="item-footer" :style="{'background-color': themeColor}">
          <img :src="logoImg" alt="logo图片">
        </div>
      </div>

      <div class="style-select-btn">
        <el-button type="primary" @click="updatePageStyle">确认选择</el-button>
      </div>
    </div>

    <div class="mask" v-show="showImgMask">
      <i class="el-icon-close close-icon" @click="showImgMask = false"></i>
      <img :src="showImgUrl" alt="v-1">
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import { getShopList, getAndroidShopTVInfo, updateTVPageStyle } from '@/api/common';
import user from '@/utils/user';

@Component({
})
export default class GoldPricePageStyle extends Vue {
  colorList = ['#282828', '#9a0228', '#8b775c', '#173152', '#b8552e', '#433a6f', '#860309'];
  themeColor = '';
  TVTextInfo = '';
  TVShowType = '';
  logoImg = require('@/assets/images/android/no-upload.gif');
  subLogoImg = '';
  showImgMask = false;
  showImgUrl = '';

  shopList = [];
  value = '';

  @Watch('value')
  watchValue(value: any) {
    this.getShopInfo(value);
  }

  get uploadUrl() {
    return `${VUE_APP_BASE_API}/jop-wx-web/adTv/uploadTvLogo`;
  }

  get opt() {
    const opt = {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey
    };
    return opt;
  }

  mounted() {
    this.getShopList();
  }

  uploadLogoSuccess(res: any) {
    if (res.code === 0) {
      this.logoImg = res.data.showFile;
      this.subLogoImg = res.data.tvLogo;
      this.$message({
        type: 'success',
        message: '上传成功！'
      })
    } else {
      this.uploadLogoError();
    }
  }

  uploadLogoError() {
    this.$message.error('上传失败，请重新上传！');
  }

  backImg(data: any, index: any) {
    return require(`@/assets/images/android/android_${data + index}.jpg`);
  }

  getShopList() {
    const params = {
      accountId: user.serverUser.account.accountId,
      appCode: 'dayPrice',
      channel: 'android'
    }
    getShopList(params).then((res: any) => {
      this.shopList = res.data && res.data.shopPermissionList ? res.data.shopPermissionList : [];
      this.value = (this.shopList[0] as any).name;
    })
  }

  getShopInfo(data: any) {
    const params = {
      shopName: data
    }
    getAndroidShopTVInfo(params).then((res: any) => {
      const responseData = res.data;
      this.themeColor = responseData && responseData.tvColor ? responseData.tvColor : '';
      this.TVTextInfo = responseData && responseData.tvText ? responseData.tvText : '';
      this.TVShowType = responseData && responseData.tvType ? responseData.tvType : '';
      this.logoImg = responseData && responseData.tvLogo ? responseData.tvLogo : require('@/assets/images/android/no-upload.gif');
    })
  }

  pickColor(data: string) {
    this.themeColor = data;
  }

  updatePageStyle() {
    const params = {
      tvColor: this.themeColor,
      tvType: this.TVShowType,
      tvText: this.TVTextInfo,
      tvLogo: this.subLogoImg,
      shopName: this.value
    }
    updateTVPageStyle(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '保存成功！'
      })
    })
  }

  pickPageStyle(data: any, index: any) {
    this.TVShowType = data + index;
  }

  showImg(data: any, index: any) {
    this.showImgMask = true;
    this.showImgUrl = this.backImg(data, index);
  }
}
</script>

<style lang="scss" scoped>
.j-page-style {
  width: 100%;
  .j-page-style-content {
    .column {
      display: flex;
      .title {
        font-size: 14px;
        font-weight: bold;
        padding: 12px;
      }
    }
  }
  .style-list {
    width: calc(100vw - 400px);
    overflow-x: auto;
    overflow-y: hidden;
    // display: box;
    // display: -webkit-box;
    display: flex;
    .list-item {
      width: 252px;
      margin-top: 15px;
      margin-bottom: 15px;
      margin-right: 15px;
      border: 3px solid #dddddd;
      border-radius: 5px;
      padding: 8px;
      cursor: pointer;
      font-size: 0;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .left {
        position: absolute;
        bottom: 12px;
        left: 12px;
      }
      .right {
        position: absolute;
        bottom: 12px;
        right: 12px;
      }
    }
    .list-item:first-child {
      margin-left: 15px;
    }
    .list-item:hover {
      border: 3px solid #6699ff;
    }
    .selected {
      border: 3px solid #6699ff;
    }
  }
  .styles-color-pick {
    width: 100%;
    padding: 12px 15px;
    display: flex;
    align-content: center;
    .item-label {
      font-weight: bold;
      font-size: 14px;
      color: #666666;
      padding-right: 20px;
      width: 120px;
      text-align: right;
    }
    .color-item-value {
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      color: white;
      font-size: 14px;
      cursor: pointer;
    }
    .img-content {
      background-color: gray;
      text-align:center;
      padding: 2px;
      width: 242px;
      height: 121px;
      overflow: hidden;
      margin-top: 13px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .item-footer {
      margin-left: 30px;
      img {
        width: 150px;
      }
    }
  }
  .style-select-btn {
    border-top: 1px solid #dddddd;
    padding-left: 135px;
    padding-top: 18px;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    line-height: 100vh;
    background: rgba(0, 0, 0, .8);
    text-align: center;
    z-index: 9999;
    img {
      height: 100%;
      vertical-align: middle;
      display: inline-block;
    }
    .close-icon {
      position: absolute;
      right: 0;
      font-size: 24px;
      color: white;
      background-color: black;
      padding: 8px;
      margin: 12px;
      cursor: pointer;
    }
  }
}
</style>


