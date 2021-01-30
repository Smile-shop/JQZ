<template>
  <div class="program-manage-edit">
    <section class="form">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="栏目名称">
          <span>{{editData.catName}}</span> 
        </el-form-item>
        <el-form-item label="栏目背景">
          <el-upload
            :multiple="false"
            :limit="1"
            :file-list="form.imgs"
            list-type="picture"
            :http-request="uploadImg"
            action
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">图片格式：*jpg、png，尺寸：190px*60px，上传前请先删除图片</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="栏目外链">
          <el-input v-model="form.link" :style="{
              width: '500px',
            }"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <wang-editor ref="ue" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button type="primary" @click="onBack">返回</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Message } from 'element-ui';
import {
  addArticleOptions,
  getArticleDetailOptions,
  uploadCompanyInfoIMGOptions
} from '@/api/super-crm/wx-website';
import WangEditor from '@/components/WangEditor.vue';

@Component({
  components: {
    WangEditor
  }
})
export default class WxWebsiteProgramManageEdit extends Vue {
  @Prop({
    required: true
  })
  editData!: any;

  form: any = {
    id: '',
    imgs: [],
    bgURL: '',
    link: '',
    html: ''
  };

  mounted() {
    this.getArticleColumn();
  }

  // 提交
  onSubmit() {
    this.updateArticle().then((res: any) => {
      this.$emit('back');
    });
  }

  // 后退
  onBack() {
    this.$emit('back');
  }

  // 图片上传
  uploadImg(res: any) {
    const { file } = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('alias', 'cat');

    uploadCompanyInfoIMGOptions(formData).then((res: any) => {
      const { data } = res;
      this.form.bgURL = data[0];
    });
  }

  // 查询文章
  getArticleColumn() {
    return new Promise((resolve, reject) => {
      const body = {
        pid: this.editData.id,
        type: '2'
      };

      getArticleDetailOptions(body)
        .then((res: any) => {
          const { data } = res;

          if (data) {
            const {
              id,
              title,
              summary,
              pid,
              isShow,
              content,
              imgNames,
              textOrder,
              imgUrl
            } = data;
            this.form.bgURL = imgNames;
            this.form.link = title;
            this.form.imgs = [
              {
                name: imgNames,
                url: imgUrl
              }
            ];
            this.form.id = id;
            (<any> this.$refs.ue).setContent(content);
          }
          resolve(res);
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }

  // 提交修改
  updateArticle() {
    return new Promise((resolve, reject) => {
      const body = {
        id: this.form.id,
        type: '2',
        imgNames: this.form.bgURL,
        content: (<any> this.$refs.ue).getContent(),
        pid: this.editData.id,
        textOrder: '1',
        title: this.form.link,
        summary: '',
        isShow: '1'
      };

      addArticleOptions(body)
        .then((res: any) => {
          const { data } = res;

          Message.success('提交成功');
          resolve(res);
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }
}
</script>

<style lang="scss" scoped>
</style>