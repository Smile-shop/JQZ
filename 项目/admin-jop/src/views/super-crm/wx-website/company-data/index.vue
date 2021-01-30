<template>
  <div class="company-data">
    <section
      class="company-info"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      > 
        <el-form-item label="网站标题">
          <el-input
            v-model="form.title"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="商标">
          <el-upload
            :multiple="false"
            :limit="1"
            :file-list="form.logo"
            list-type="picture"
            :http-request="uploadLogo"
            action=""
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">图片格式：*jpg、png，尺寸：190px*60px，上传前请先删除图片</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model="form.telephone"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setCompanyInfo">提交</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {
  uploadCompanyInfoIMGOptions,
  getCompanyInfoOptions,
  setCompanyInfoOptions
} from '@/api/super-crm/wx-website';
import {Message, MessageBox} from 'element-ui';

@Component({
})
export default class WxWebsiteCompanyData extends Vue {
  form: any = {
    title: '',
    telephone: '',
    companyId: '',
    logo: [],
    logoURL: '',
  }

  mounted() {
    this.getCompanyInfo();
  }

  // logo上传
  uploadLogo(res: any) {
    const {file} = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('alias', 'os');

    uploadCompanyInfoIMGOptions(formData).then((res: any) => {
      const {data} = res;

      this.form.logoURL = data[0];
    })
  }

  // 查询企业资料
  getCompanyInfo() {
    return new Promise((resolve, reject) => {
      const body = {}

      getCompanyInfoOptions(body).then((res: any) => {
        const {data} = res;
        const {
          companyId,
          imgUrl,
          logoImg,
          telNum,
          webTitle,
        } = data;
        const form = this.form;
        form.companyId = companyId;
        form.logo.push({
          name: logoImg,
          url: imgUrl,
        });
        form.title = webTitle;
        form.telephone = telNum;

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 设置企业信息
  setCompanyInfo() {
    return new Promise((resolve, reject) => {
      console.log(this.form)
      const body = {
        companyId: this.form.companyId,
        webTitle: this.form.title,
        logoImg: this.form.logoURL,
        telNum: this.form.telephone,
      }

      setCompanyInfoOptions(body).then((res: any) => {
        const {data} = res;

        Message.success('设置成功');
        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
</style>


