<template>
  <div class="page-style-edit">
    <div class="preview">
      <div class="content">
        <div class="img-list">
          <img
            v-for="(item, index) of dataList"
            :key="index"
            :src="imgBaseUrl + item"
            alt="图片"
          >
        </div> 
      </div>
    </div>
    <div class="setting">
      <el-upload
        :multiple="true"
        :show-file-list="false"
        list-type="picture"
        :http-request="uploadIMG"
        action=""
        :style="{
          width: '500px',
        }"
      >
        <el-button size="small" type="primary">上传图片</el-button>
        <div slot="tip" class="el-upload__tip">图片格式：*jpg、png，尺寸：750px * 500px</div>
      </el-upload>
      <app-gutter/>
      <el-table
        :data="dataList"
        class="table"
      >
        <el-table-column
          label="图片"
          prop="name"
        >
          <template
            slot-scope="scope"
          >
            <img class="table-img" :src="imgBaseUrl + scope.row" alt="图片">
          </template>
        </el-table-column>
        <el-table-column
          label="排序"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-arrow-up"
              circle
              size="small"
              :disabled="scope.$index === 0"
              @click="moveUp(scope.$index)"
            >
            </el-button>
            <el-button
              icon="el-icon-arrow-down"
              circle
              size="small"
              :disabled="scope.$index + 1 === dataList.length"
              @click="moveDown(scope.$index)"
            >
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              @click="deleteImg(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <app-gutter/>
      <el-button
        @click="onSubmit"
        type="primary"
      >
        保存
      </el-button>
      <el-button
        @click="onBack"
        type="primary"
      >
        返回
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {Message} from 'element-ui';
import AppGutter from '@/components/AppGutter.vue';
import {
  getStyleIMGOptions,
  addStyleIMGOptions,
  uploadMessageIMGOptions,
} from '@/api/super-crm/wx-website';

@Component({
  components: {
    AppGutter
  }
})
export default class WxWebsitePageStyleEdit extends Vue {
  @Prop({
    type: String
  })
  editData!: string;

  imgBaseUrl: string = '';
  dataList: any[] = []
  imgList: string[] = []

  mounted() {
    this.getStyle();
  }

  // 图片上传
  uploadIMG(res: any) {
    const {file} = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('type', '1');

    uploadMessageIMGOptions(formData).then((res: any) => {
      const {data} = res;

      // this.dataList.push(`${data.imgurl}${data.imgname[0]}`);
      this.dataList.push(`${data.imgname[0]}`);
      this.saveSetting('上传');
    })
  }

  // 保存设置
  saveSetting(message: string) {
    return new Promise((resolve, reject) => {
      const body = {
        imgUrl: this.dataList.join(','),
        surfaceId: this.editData,
      }

      addStyleIMGOptions(body).then((res: any) => {
        const {data} = res;

        Message.success(`${message}成功`);
        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 向上移动
  moveUp(index: number) {
    const item = this.dataList.splice(index, 1)[0]
    this.dataList.splice(index - 1, 0, item)
  }

  // 向下移动
  moveDown(index: number) {
    const item = this.dataList.splice(index, 1)[0]
    this.dataList.splice(index + 1, 0, item)
  }

  // 获取图片列表
  getStyle() {
    return new Promise((resolve, reject) => {
      const body = {
        surfaceId: this.editData,
      }

      getStyleIMGOptions(body).then((res: any) => {
        const {data} = res;

        this.dataList = data.imgName.split(',')
        this.imgBaseUrl = data.headUrl
        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 删除
  deleteImg(index: number) {
    this.dataList.splice(index, 1);
    this.saveSetting('删除');
  }

  // 保存
  onSubmit() {
    this.saveSetting('保存');
  }

  // 提交
  onBack() {
    this.$emit('back');
  }
}
</script>

<style lang="scss" scoped>
.page-style-edit {
  display: flex;

  & > .preview {
    margin-right: 1rem;

    & > .content {
      overflow: hidden;
      padding: 3rem 2rem 5.5rem 2rem;
      width: 22rem;
      height: 46rem;
      background-image: url('~@/assets/images/super-crm/wx-website/test-phone.png');
      background-repeat: no-repeat;
      background-size: contain;

      & > .img-list {
        overflow: hidden scroll;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;

        & > img {
          flex-shrink: 0;
          width: 100%;
          height: auto;
        }
      }
    }
  }

  & > .setting {
    flex-grow: 1;

    & .table-img {
      width: auto;
      height: 100px;
    }

    & > .table {
      margin-bottom: 1rem;
    }
  }
}
</style>