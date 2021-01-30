<template>
  <article class="infomation-edit">
    <el-row>
      <el-col :span="10">
        <div class="input-item" style="width: 400px;">
          <div class="label">资讯栏目：</div>
          <div class="content">
            <el-select v-model="editCategoryDetailForm.categoryId" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in categoryTableData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="input-item" style="width: 400px;">
          <div class="label">资讯标题：</div>
          <div class="content">
            <el-input v-model="editCategoryDetailForm.title" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="10">
        <div class="input-item" style="width: 400px;">
          <div class="label">摘要：</div>
          <div class="content">
            <el-input v-model="editCategoryDetailForm.summary" type="textarea" :rows="5" maxlength="500" show-word-limit placeholder="请输入内容"></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="input-item" style="width: 600px;">
          <div class="label">摘要图片：</div>
          <div class="content">
            <!-- <el-input v-model="editCategoryDetailForm.summaryImg" placeholder="请输入内容"></el-input> -->
            <el-upload
              class="upload-demo"
              :headers="uploadOpt"
              :action="uploadUrl()"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              name="file">
              <el-button size="small" type="primary">上传图片</el-button>
              <span class="el-upload-tip">图片格式：*jpg、png,尺寸：300px*300px</span>
            </el-upload>
            <div class="img-share">
              <img v-show="editCategoryDetailForm.summaryImg" :src="editCategoryDetailForm.summaryImg" alt="logo">
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2">
        <div class="input-item" style="width: 400px;">
          <div class="label">是否显示：</div>
          <div class="content">
            <el-switch :active-value="1" :inactive-value="0" v-model="editCategoryDetailForm.status" style="margin-top: 10px"></el-switch>
          </div>
        </div>
      </el-col>
      <el-col :span="22">
        <div class="input-item" style="width: 500px;">
          <div class="label">排序：</div>
          <div class="content">
            <el-input v-model="editCategoryDetailForm.sort" placeholder="请输入内容" style="width: 155px"></el-input>
            <span class="info">( 数字越大越靠前 )</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="input-item">
      <div class="label">资讯详情：</div>
      <div class="content">
        <WangEditor ref="ue" type="news" :contents="editCategoryDetailForm.content"></WangEditor>
      </div>
    </div>

    <div class="input-item">
      <div class="label"></div>
      <div class="content">
        <el-button type="primary" @click="submitEditCategoryDetail">保存</el-button>
        <el-button @click="cancelEditCategoryDetail">取消</el-button>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import { getCategory, getCategoryDetail, addCategoryDetail, editCategoryDetail } from '@/api/super-crm/wx-member-functions';
import WangEditor from '@/components/WangEditor.vue';
import user from '@/utils/user';
import { htmlEncodeByRegExp, htmlDecodeByRegExp } from '@/utils/storeageCompile';

@Component({
  components: {
    WangEditor
  }
})
export default class InfomationEdit extends Vue {
  private categoryTableData = [];
  private editCategoryDetailForm = {
    categoryId: '',
    title: '',
    summary: '',
    summaryImg: '',
    status: 0,
    sort: 0,
    content: ''
  };
  private isNew: boolean = true;

  // 上传图片header设置
  get uploadOpt() {
    return {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey
    }
  }
  // 上传图片路径
  uploadUrl(): string {
    return `${VUE_APP_BASE_API}/jop-wx-web/file/upload`;
  }

  private uploadSuccess(res: any) {
    if (res.code === 0) {
      this.editCategoryDetailForm.summaryImg = res.data.url;
      this.$message({
        type: 'success',
        message: '上传成功！'
      });
    } else {
      this.uploadError();
    }
  }

  private uploadError() {
    this.$message.error('上传失败，请重新上传！');
  }

  private mounted() {
    this.getCategory();
    const id = this.$route.query.id;
    if (id === 'new') {
      this.isNew = true;
    } else {
      this.isNew = false;
      this.getCategoryDetail(id)
    }
  }

  private getCategory() {
    return getCategory().then((res: any) => {
      this.categoryTableData = res.data || [];
    })
  }

  private getCategoryDetail(id: any) {
    return getCategoryDetail({
      companyKey: user.serverUser.account.companyKey,
      id,
      remark: 'Y' // 标识
    }).then((res: any) => {
      this.editCategoryDetailForm = {
        title: res.data.title,
        categoryId: res.data.categoryId,
        status: res.data.status,
        summary: res.data.summary,
        summaryImg: res.data.summaryImg,
        content: htmlDecodeByRegExp(res.data.content),
        sort: res.data.sort
      }
    })
  }

  private submitEditCategoryDetail() {
    if (this.editCategoryDetailForm.title === '') {
      this.$message.info('资讯标题不能为空！');
      return;
    };
    if (this.editCategoryDetailForm.categoryId === '') {
      this.$message.info('资讯栏目不能为空！');
      return;
    };
    if (this.editCategoryDetailForm.summary === '') {
      this.$message.info('摘要不能为空！');
      return;
    };
    const content = (this.$refs.ue as any).getContent();
    if (content === '') {
      this.$message.info('资讯详情不能为空！');
      return;
    };
    if ((this.$refs.ue as any).limitNumber > 20000) {
      return this.$message.info('资讯内容已超过最大限制字数，请重新编辑！')
    }
    if (this.isNew) {
      const params = {
        categoryId: this.editCategoryDetailForm.categoryId,
        content: htmlEncodeByRegExp(content),
        sort: this.editCategoryDetailForm.sort,
        status: this.editCategoryDetailForm.status,
        summary: this.editCategoryDetailForm.summary,
        summaryImg: this.editCategoryDetailForm.summaryImg,
        title: this.editCategoryDetailForm.title
      }
      addCategoryDetail(params).then((res: any) => {
        this.$message({
          type: 'success',
          message: '新增成功！'
        });
        this.cancelEditCategoryDetail();
      })
    } else {
      const params = {
        id: this.$route.query.id,
        categoryId: this.editCategoryDetailForm.categoryId,
        content: htmlEncodeByRegExp(content),
        sort: this.editCategoryDetailForm.sort,
        status: this.editCategoryDetailForm.status,
        summary: this.editCategoryDetailForm.summary,
        summaryImg: this.editCategoryDetailForm.summaryImg,
        title: this.editCategoryDetailForm.title
      }
      editCategoryDetail(params).then((res: any) => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        this.cancelEditCategoryDetail();
      })
    }
  }

  private cancelEditCategoryDetail() {
    this.editCategoryDetailForm = {
      categoryId: '',
      title: '',
      summary: '',
      summaryImg: '',
      status: 0,
      sort: 0,
      content: ''
    };
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
.infomation-edit {
  min-width: 900px;
  .input-item {
    display: flex;
    margin: 8px 0 20px 0;
    .label {
      width: 120px;
      flex-shrink: 0;
      font-size: 14px;
      color: #606266;
      padding: 10px;
      text-align: right;
    }
    .content {
      flex-grow: 1;
      .info {
        font-size: 12px;
        color: #999999;
        padding-left: 8px;
      }
      .el-upload-tip {
        font-family: MicrosoftYaHei;
        font-size: 12px;
        color: #999999;
        padding-left: 13px;
      }
      .img-share {
        border-radius: 4px;
        border: 1px solid #dddddd;
        height: 74px;
        margin-top: 12px;
        width: 280px;
        img {
          // width: 50%;
          height: 100%;
        }
      }
    }
  }
}
</style>
