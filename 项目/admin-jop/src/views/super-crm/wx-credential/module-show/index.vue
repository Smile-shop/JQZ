<template>
  <div class="module-show">
    <ul
      class="module"
    >
      <li
        v-for="(item, index) of images"
        :key="index"
        class="module-item"
      >
        <div class="top">
          <img
            :src="item"
            alt="图片"
          >
        </div>
        <div class="bottom">
          <div class="left">
            模板{{index + 1}}
          </div>
          <div class="right">
            <el-button
              @click="preview(index)"
              size="mini"
            >
              预览
            </el-button>
          </div>
        </div>
      </li>
    </ul>

    <el-dialog
      :visible.sync="isShowPreview"
      class="preview-dialog"
      top="5vh"
      width="500px"
    >
      <img
        :src="images[previewImageIndex]"
        :style="{
          width: '100%'
        }"
        alt="图片"
      >
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
})
export default class WxCredentialModuleShow extends Vue {
  images: string[] = [];

  isShowPreview = false;

  previewImageIndex = 0;

  mounted() {
    this.initImages();
  }

  // 初始化图片
  initImages() {
    const tempImages: string[] = [];
    for (let index = 1; index < 6; index++) {
      const url = require(`@/assets/images/super-crm/wx-credential/${index}.png`);
      tempImages.push(url);
    }

    this.images = tempImages;
  }

  // 预览
  preview(index: number) {
    this.previewImageIndex = index;

    this.isShowPreview = true;
  }
}
</script>

<style lang="scss" scoped>
.module-show {
  > .module {
    display: flex;

    > .module-item {
      display: flex;
      flex-direction: column;
      flex-basis: 200px;
      margin-right: 20px;
      border: 1px solid #e3e0e0;

      &:last-of-type {
        margin-right: 0;
      }

      > .top {
        border-bottom: 1px solid #ddd;
        padding: 10px;

        > img {
          width: 100%;
          height: 270px;
        }
      }

      > .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        font-size: 14px;
        color: #606266;
      }
    }
  }

  > .preview-dialog {
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>


