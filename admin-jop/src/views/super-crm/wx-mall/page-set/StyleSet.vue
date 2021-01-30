<template>
  <div class="style">
    <preview
      :data="formData"
    />
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
          label="主题色"
        >
          <theme-color
            :color.sync="formData.themeColor"
          >
          </theme-color>
        </el-form-item>
        <el-form-item
          label="轮播图"
        >
          <el-upload
            :multiple="true"
            list-type="picture"
            :show-file-list="false"
            :http-request="uploadCarousel"
            action=""
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">图片格式：*jpg、png，尺寸：宽750px*272px</div>
          </el-upload>
          <app-gutter/>
          <el-table
            :data="formData.carouselTableData"
            border
          >
            <el-table-column
              label="轮播图"
              prop="date"
              width="120"
            >
              <template
                slot-scope="scope"
              >
                <el-image
                  :src="scope.row.imgURL"
                  :style="{
                    width: '100px',
                    height: '100px'
                  }"
                >
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="点击状态"
              prop="date"
              width="150"
            >
              <template
                slot-scope="scope"
              >
                <el-switch
                  v-model="scope.row.clickType"
                  active-text="网址"
                  inactive-text="编号"
                  active-value="link"
                  inactive-value="code"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="产品编号或外部网址"
              prop="date"
              width="200"
            >
              <template
                slot-scope="scope"
              >
                <!-- 网址 -->
                <el-input
                  v-if="scope.row.clickType === 'link'"
                  type="url"
                  v-model="scope.row.linkURL"
                  placeholder="网址需要加http://或https://"
                />
                <!-- 产品编号 -->
                <el-input
                  v-else
                  type="text"
                  v-model="scope.row.code"
                  placeholder="产品编号"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="是否显示"
              width="80"
            >
              <template
                slot-scope="scope"
              >
                <el-checkbox
                  v-model="scope.row.isShow"
                >
                </el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              label="排序"
              width="150"
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
          label="商品显示"
        >
          <el-checkbox
            v-model="formData.commercialValue"
            true-label="Y"
            false-label="N"
          >
            只展示会员发卡门店商品(会员没有发卡门店，则显示所有商品)
          </el-checkbox>
        </el-form-item>
        <el-form-item
          label="评论设置"
        >
          <el-checkbox
            v-model="formData.isShowComment"
            :true-label="1"
            :false-label="0"
          >
            显示评论(开启/关闭展示商品所有历史购买顾客的评价和评价入口)
          </el-checkbox>
        </el-form-item>
        <el-form-item
          v-if="formData.shopCloud"
          label="微客服浮窗显示设置："
        >
          <el-checkbox
            v-for="(item, index) of formData.shopCloud"
            :key="index"
            :true-label="1"
            :false-label="0"
            v-model="item.enable"
          >
            {{item.name}}
          </el-checkbox>
        </el-form-item>
        <el-form-item
          label=""
        >
          <el-button
            type="primary"
            @click="setPageStyle"
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
import Preview from './StyleSetPreview.vue';
import AppGutter from '@/components/AppGutter.vue';
import {
  getPageStyle,
  setPageStyle
} from '@/api/super-crm/wx-mall';
import {upload} from '@/api/common';

@Component({
  components: {
    ThemeColor,
    Preview,
    AppGutter
  }
})
export default class WxMallPageSet extends Vue {
  formData: {
    title: string,
    logoFileList: any[],
    logoUrl: string,
    themeColor: string,
    carouselTableData: any[],
    shopCloud: null | any[],
    commercialValue: any,
    isShowComment: number
  } = {
    title: '微商城',
    logoFileList: [],
    logoUrl: '',
    themeColor: 'rgb(110, 115, 184)',
    isShowComment: 1,
    carouselTableData: [
      {
        imgURL: 'https://www.baidu.com/img/bd_logo1.png',
        code: '',
        isShow: true,
        linkURL: '',
        clickType: 'link',
      },
      {
        imgURL: 'https://www.baidu.com/img/bd_logo1.png',
        code: '',
        isShow: true,
        linkURL: '',
        clickType: 'code',
      },
    ],
    shopCloud: [],
    commercialValue: 'Y'
  }

  mounted() {
    this.getPageStyle()
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

  // 轮播图上传
  uploadCarousel(res: any) {
    const {file} = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('alias', 'photos');

    upload(formData).then((res: any) => {
      const {data} = res;

      (this.formData.carouselTableData as any[]).push({
        imgURL: data.url,
        code: '',
        isShow: true,
        linkURL: '',
        clickType: 'link',
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

  // 获取样式
  getPageStyle() {
    return new Promise((resolve, reject) => {
      const body = {}

      getPageStyle(body).then((res: any) => {
        const {data} = res;

        const {
          title,
          companyLogo,
          themeColor,
          banners,
          shopCloud,
          commercialValue,
          isShowComment
        } = data;

        this.formData.title = title;

        if (companyLogo) {
          this.formData.logoUrl = companyLogo;
          this.formData.logoFileList = [{
            name: 'Logo',
            url: companyLogo
          }];
        }

        this.formData.themeColor = themeColor;
        this.formData.shopCloud = shopCloud;
        this.formData.isShowComment = isShowComment;
        this.formData.commercialValue = commercialValue ? 'Y' : 'N';

        this.formData.carouselTableData = banners.map((item: any, index: number) => {
          item.isShow = item.isShow === '1' ? true : false;

          return item;
        });

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 设置样式
  setPageStyle() {
    return new Promise((resolve, reject) => {
      const {
        title,
        logoUrl,
        themeColor,
        carouselTableData,
        shopCloud,
        commercialValue,
        isShowComment
      } = this.formData;

      function bannersFormat() {
        return carouselTableData.map((item, index) => {
          const tempItem = Object.assign({}, item);
          tempItem.isShow = tempItem.isShow ? '1' : '0';
          return tempItem;
        })
      }

      const body = {
        title,
        companyLogo: logoUrl,
        themeColor,
        banners: bannersFormat(),
        shopCloud,
        commercialValue,
        isShowComment
      }

      setPageStyle(body).then((res: any) => {
        const {data} = res;

        this.$message.success('设置成功');

        resolve(data);
      }).catch((reason: any) => {
        reject(reason);
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.style {
  display: flex;

  > .setting-group {
    flex-grow: 1;
    overflow: hidden;
    min-width: 600px;
    max-width: 1000px;
  }
}
</style>
