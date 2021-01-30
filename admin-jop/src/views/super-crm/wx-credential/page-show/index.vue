<template>
  <div class="page-show">
    <div class="preview-box">
      <div class="title">
        【效果预览】
      </div>
      <div class="preview">
        <header>
          <div class="left">
            <i class="icon el-icon-close"></i>
            <span>
              {{formData.title}}
            </span>
          </div>
          <div class="right">
            <i class="icon el-icon-more"></i>
          </div>
        </header>
        <main
          :style="{
            backgroundColor: formData.backgroundColor,
            backgroundImage: `url(${formData.backgroundUrl})`,
          }"
        >
          <img class="logo" :src="formData.logoUrl" alt="logo">
          <div
            class="search-box"
          >
            <div
              class="left"
              :style="{
                borderColor: formData.themeColor
              }"
            >
              <input type="text" placeholder="请输入商品条码号">
              <div
                class="scan"
              >
                <i
                  class="iconfont icon-richscan_icon"
                  :style="{
                    color: formData.themeColor
                  }"
                >
                </i>
              </div>
            </div>
            <div
              class="right"
              :style="{
                backgroundColor: formData.themeColor
              }"
            >
              查询
            </div>
          </div>
          <div class="carousel-box">
            <el-carousel
              height="80px"
              indicator-position="none"
            >
              <el-carousel-item
                v-for="(item, index) in formData.carouselTableData"
                :key="index"
              >
                <img :src="item.advertisingImg" alt="图片">
              </el-carousel-item>
            </el-carousel>
          </div>
        </main>
      </div>
    </div>
    <div class="setting-group">
      <el-form
        v-model="formData"
        label-width="120px"
      >
        <el-form-item
          label="页面标题"
        >
          <el-input
            v-model="formData.title"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="企业logo"
        >
          <el-upload
            :multiple="false"
            :limit="1"
            :file-list="formData.logoFileList"
            list-type="picture"
            :http-request="uploadLogo"
            action=""
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">图片格式：*jpg、png，尺寸：宽300px*任意高</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="背景色"
        >
          <el-color-picker v-model="formData.backgroundColor"></el-color-picker>
        </el-form-item>
        <el-form-item
          label="背景图"
        >
          <el-upload
            :multiple="false"
            :limit="1"
            :file-list="formData.backgroundFileList"
            list-type="picture"
            :http-request="uploadBackground"
            :on-remove="removeBackgroundImage"
            action=""
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">图片格式：*jpg、png，尺寸：750px*1334px</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="主题色"
        >
          <theme-color
            :color.sync="formData.themeColor"
          >
          </theme-color>
        </el-form-item>
        <el-form-item
          label="首页链接"
        >
          <el-button
            @click="copyLink"
          >
            复制链接
          </el-button>
        </el-form-item>
        <el-form-item
          label="证书链接"
        >
          <el-input
            v-model="formData.link"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="广告设置"
        >
          <el-upload
            :multiple="true"
            :show-file-list="false"
            list-type="picture"
            :http-request="uploadCarousel"
            action=""
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">图片格式：*jpg、png，尺寸：宽345px*80px</div>
          </el-upload>
          <el-table
            :data="formData.carouselTableData"
            border
          >
            <el-table-column
              label="广告图"
              prop="date"
              width="180"
            >
              <template
                slot-scope="scope"
              >
                <el-image
                  :src="scope.row.advertisingImg"
                  :style="{
                    width: '100px',
                    height: '100px'
                  }"
                >
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="链接网址"
              prop="date"
              width="200"
            >
              <template
                slot-scope="scope"
              >
                <el-input
                  type="text"
                  @blur="checkLink(scope.row)"
                  v-model="scope.row.advertisingLink"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="顺序"
              width="120"
            >
              <template
                slot-scope="scope"
              >
                <el-button
                  icon="el-icon-arrow-up"
                  @click="carouselMoveUp(scope.$index)"
                  circle
                >
                </el-button>
                <el-button
                  icon="el-icon-arrow-down"
                  @click="carouselMoveDown(scope.$index)"
                  circle
                >
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120"
            >
              <template
                slot-scope="scope"
              >
                <el-button
                  type="warning"
                  @click="removeCarousel(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          label=""
        >
          <el-button
            type="primary"
            @click="setAppStyle"
          >
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import ThemeColor from '@/components/ThemeColor.vue';
import {getAppStyle, setAppStyle} from '@/api/super-crm/wx-credential';
import {upload} from '@/api/common';
import {getSessionStorage} from '@/utils/storage';

@Component({
  components: {
    ThemeColor
  }
})
export default class WxCredentialPageShow extends Vue {
  formData = {
    title: '网页标题',
    logoFileList: [],
    logoUrl: '',
    backgroundFileList: [],
    backgroundUrl: '',
    backgroundColor: '#fff',
    themeColor: 'rgb(110, 115, 184)',
    link: '',
    carouselTableData: [],
  }

  mounted() {
    this.getAppStyle();
  }

  // 复制链接
  copyLink(row: any) {
    const {user} = getSessionStorage();

    const baseURL = `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.account.companyKey}&page=wx_credential_query`;

    const url = new URL(baseURL);

    const textArea = document.createElement('textarea');
    textArea.value = url.toString();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    textArea.remove()
    this.$message.success('复制成功');
  }

  // logo上传
  uploadLogo(res: any) {
    const {file} = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('alias', 'photos');

    upload(formData).then((res: any) => {
      const {data} = res;

      this.formData.logoUrl = data.url;
    })
  }

  // 背景上传
  uploadBackground(res: any) {
    const {file} = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('alias', 'photos');

    upload(formData).then((res: any) => {
      const {data} = res;

      this.formData.backgroundUrl = data.url;
    })
  }

  checkLink(row: any) {
    const { advertisingLink } = row;
    const reg = /^https*:\/\//gi;

    if ( reg.test(advertisingLink) ) {
      return;
    } else {
      row.advertisingLink = `http://${advertisingLink}`;
    }
  }

  // 删除背景图
  removeBackgroundImage() {
    this.formData.backgroundUrl = '';
  }

  // 轮播图上传
  uploadCarousel(res: any) {
    const {file} = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('alias', 'photos');

    upload(formData).then((res: any) => {
      const {data} = res;

      (this.formData.carouselTableData as any[]).push({
        advertisingImg: data.url,
        advertisingLink: '',
      })
    })
  }

  // 设置app样式
  setAppStyle() {
    return new Promise((resolve, reject) => {
      const {
        title,
        logoUrl,
        backgroundUrl,
        backgroundColor,
        themeColor,
        link,
        carouselTableData,
      } = this.formData;

      const body = {
        title,
        companyLogo: logoUrl,
        backgroundColor,
        backgroundImg: backgroundUrl,
        themeColor,
        customColor: '',
        link,
        advertistings: carouselTableData,
      }

      setAppStyle(body).then((res: any) => {
        const {data} = res;

        this.$message.success('设置成功');

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 查询app样式
  getAppStyle() {
    return new Promise((resolve, reject) => {
      const body = {}

      getAppStyle(body).then((res: any) => {
        const {data} = res;
        const {
          title,
          companyLogo,
          backgroundColor,
          backgroundImg,
          themeColor,
          link,
          advertistings,
        } = data;

        this.formData.title = title;
        (this.formData.logoFileList as any[]) = [
          {
            name: 'logo',
            url: companyLogo
          }
        ];
        this.formData.logoUrl = companyLogo;
        (this.formData.backgroundFileList as any[]) = [
          {
            name: '背景',
            url: backgroundImg
          }
        ];
        this.formData.backgroundUrl = backgroundImg;
        this.formData.backgroundColor = backgroundColor;
        this.formData.themeColor = themeColor;
        this.formData.link = link;
        this.formData.carouselTableData = advertistings;

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 轮播图上移
  carouselMoveUp(index: number) {
    if (index === 0) {
      return false;
    } else {
      const item = this.formData.carouselTableData[index];
      this.formData.carouselTableData.splice(index, 1);
      this.formData.carouselTableData.splice(index - 1, 0, item);
    }
  }

  // 轮播图下移
  carouselMoveDown(index: number) {
    if (index === this.formData.carouselTableData.length - 1) {
      return false;
    } else {
      const item = this.formData.carouselTableData[index];
      this.formData.carouselTableData.splice(index, 1);
      this.formData.carouselTableData.splice(index + 1, 0, item);
    }
  }

  // 删除轮播图
  removeCarousel(index: number) {
    this.formData.carouselTableData.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
.page-show {
  display: flex;

  > .preview-box {
    flex-shrink: 0;
    width: 377px;
    margin-right: 33px;

    > .title {
      margin-bottom: 17px;
      text-align: center;
      color: #409eff;
    }

    > .preview {
      border: 1px solid #e3e0e0;

      > header {
        display: flex;
        justify-content: space-between;
        padding: 16px 14px;
        background-color: #f3f3f3;
        color: #333333;
        font-size: 15px;

        > .left {
          display: flex;
          align-items: center;
          font-size: 15px;

          > .icon {
            margin-right: 12px;
          }
        }
      }

      > main {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        padding: 30px 15px 15px 15px;
        height: 605px;
        background: no-repeat scroll center center / cover;

        > .logo {
          width: 150px;
          height: auto;
          margin-bottom: 29px;
        }

        > .search-box {
          align-self: stretch;
          display: flex;
          height: 45px;
          background: #fff;

          > .left {
            display: flex;
            flex-grow: 1;
            border: 1px solid #e12f30;
            padding: 0 10px;

            > input {
              flex-grow: 1;
              border: none;
              outline: none;
              font-size: 15px;
            }

            > .scan {
              display: flex;
              align-items: center;
              justify-content: center;

              > .iconfont {
                font-size: 24px;
              }
            }
          }

          > .right {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-basis: 70px;
            flex-shrink: 0;
            color: #ffffff;
          }
        }

        > .carousel-box {
          position: absolute;
          left: 15px;
          bottom: 15px;
          right: 15px;

          .el-carousel__item {
            > img {
              height: 100%;
              width: 100%;
              object-position: center center;
              object-fit: cover;
            }
          }
        }
      }
    }
  }
}
</style>
