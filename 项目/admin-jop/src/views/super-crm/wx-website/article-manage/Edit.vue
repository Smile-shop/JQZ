<template>
  <div class="article-manage-edit">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="文章标题">
        <el-input
          v-model="form.title"
          :style="{
            width: '500px',
          }"
        />
      </el-form-item>
      <el-form-item label="所属栏目">
        <el-select
          v-model="form.selectedColumnType"
        >
          <el-option
            v-for="item in form.columnTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="摘要图片">
        <el-upload
          :limit="1"
          :multiple="false"
          :file-list="form.imgs"
          list-type="picture"
          :http-request="uploadIMG"
          action=""
          :style="{
            width: '500px',
          }"
        >
          <el-button size="small" type="primary">上传图片</el-button>
          <div slot="tip" class="el-upload__tip">图片格式：*jpg、png,尺寸：300px*300px</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input
          v-model="form.abstract"
          :style="{
            width: '500px',
          }"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-switch
          v-model="form.isShow"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="排序">
        <el-input
          type="number"
          v-model="form.order"
          :style="{
            width: '500px',
          }"
        />
      </el-form-item>
      <el-form-item label="内容">
        <wang-editor :type="'seeting'" ref="ue"></wang-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="primary" @click="onBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {Message} from 'element-ui';
import AppGutter from '@/components/AppGutter.vue';
import WangEditor from '@/components/WangEditor.vue';
import {
  uploadCompanyInfoIMGOptions,
  addArticleOptions,
  getArticleColumnTypeOptions,
  getArticleDetailOptions,
} from '@/api/super-crm/wx-website';

@Component({
  components: {
    AppGutter,
    WangEditor
  }
})
export default class WxWebsiteArticleManageEdit extends Vue {
  @Prop({
    type: Object
  })
  editData!: any;

  id = '';
  type = 'add';
  form = {
    title: '',
    imgs: [],
    bgURL: '',
    selectedColumnType: '',
    columnTypes: [],
    isShow: true,
    order: 1,
    abstract: '',
  }

  mounted() {
    const {type, selectedColumnType, id} = this.editData;

    this.getArticleColumnType();

    if (type === 'add') {
      this.type = 'add';
      this.form.selectedColumnType = selectedColumnType;
    } else {
      this.type = 'edit';
      this.id = id;
      this.getArticleColumn();
    }
  }

  // 提交
  onSubmit() {
    this.updateArticle().then((res: any) => {
      this.$emit('back');
    });
  }

  onBack() {
    this.$emit('back');
  }

  // 查询栏目类型
  getArticleColumnType() {
    return new Promise((resolve, reject) => {
      const body = {
      }

      getArticleColumnTypeOptions(body).then((res: any) => {
        const {data} = res;

        this.form.columnTypes = data.map((value: any, index: number) => {
          return {
            value: value.id,
            label: value.catName,
          }
        })

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 查询栏目
  getArticleColumn() {
    return new Promise((resolve, reject) => {
      const body = {
        id: this.id,
        type: '1',
      }

      getArticleDetailOptions(body).then((res: any) => {
        const {data} = res;

        const {
          title,
          summary,
          pid,
          isShow,
          content,
          imgNames,
          textOrder,
          imgUrl
        } = data
        this.form.title = title;
        this.form.bgURL = imgNames;
        this.form.selectedColumnType = pid;
        this.form.isShow = isShow == 1 ? true : false;
        this.form.order = textOrder;
        this.form.abstract = summary;
        (<any> this.$refs.ue).setContent(content);
        (<any> this.form).imgs = [{
          name: imgNames,
          url: imgUrl,
        }]

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }
  // 提交修改
  updateArticle() {
    return new Promise((resolve, reject) => {
      const body = {
        id: this.id,
        type: '1',
        textOrder: this.form.order,
        title: this.form.title,
        summary: this.form.abstract,
        isShow: this.form.isShow ? '1' : '0',
        imgNames: this.form.bgURL,
        content: (<any> this.$refs.ue).getContent(),
        pid: this.form.selectedColumnType,
      }

      addArticleOptions(body).then((res: any) => {
        const {data} = res;

        Message.success('提交成功');

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 图片上传
  uploadIMG(res: any) {
    const {file} = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('alias', 'article');

    uploadCompanyInfoIMGOptions(formData).then((res: any) => {
      const {data} = res;
      this.form.bgURL = res.data[0];
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
