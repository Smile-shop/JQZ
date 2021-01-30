<template>
  <div class="article-manage-list">
    <section class="top">
      <el-form
        ref="form"
        label-width="120px"
      >
        <el-form-item label="所属栏目">
          <el-select
            v-model="selectedColumnType"
            @change="columnTypeChange"
          >
            <el-option
              v-for="item in columnTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目背景">
          <el-upload
            :multiple="false"
            :file-list="background"
            list-type="picture"
            :http-request="uploadIMG"
            action=""
            :style="{
              width: '500px',
            }"
          >
            <el-button size="small" type="primary">上传图片</el-button>
            <div slot="tip" class="el-upload__tip">图片格式：*jpg、png，尺寸：750px*500px，上传前请先删除图片</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </section>
    <section class="bottom">
      <section class="toolbar">
        <div class="left">
          <el-button
            type="primary"
            size="small"
            @click="editArticle('add')"
          >
            添加文章
          </el-button>
          <el-button
            type="warning"
            size="small"
            @click="deleteArticle(multipleSelection)"
          >
            批量删除
          </el-button>
        </div>
        <div class="right">
          <el-input
            class="input"
            v-model="keyword"
            size="small"
            type="search"
            autocomplete
          />
          <el-button
            type="primary"
            size="small"
            @click="getArticleList"
          >
            查询
          </el-button>
        </div>
      </section>
      <el-table
        :data="dataList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="编号"
          prop="id"
          width="130"
        >
        </el-table-column>
        <!-- <el-table-column
          label="栏目"
          prop="columnName"
          width="130"
        >
        </el-table-column> -->
        <el-table-column
          label="标题"
          prop="title"
          width="250"
        >
        </el-table-column>
        <el-table-column
          label="顺序"
          prop="textOrder"
          width="130"
        >
        </el-table-column>
        <el-table-column
          label="是否显示"
          width="130"
        >
          <template
            slot-scope="scope"
          >
            <el-switch
              v-model="scope.row.isShow"
              :disabled="true"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="浏览数"
          prop="hitCounts"
          width="130"
        >
        </el-table-column>
        <el-table-column
          label="添加时间"
          prop="createTime"
          width="130"
        >
          <template slot-scope="scope">

            {{scope.row.createTime | momentFilter}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="editArticle('edit', scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              @click="copyLink(scope.row)"
            >
              复制链接
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteArticle([scope.row.id])"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <section class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          background
        >
        </el-pagination>
      </section>
    </section>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {Message} from 'element-ui';
import AppGutter from '@/components/AppGutter.vue';
import {
  getArticleListOptions,
  addArticleOptions,
  getArticleBatchDetailOptions,
  getArticleColumnTypeOptions,
  uploadCompanyInfoIMGOptions,
  setColumnOptions,
  getColumnBGOptions
} from '@/api/super-crm/wx-website';
import {getSessionStorage} from '@/utils/storage';

@Component({
  components: {
    AppGutter
  }
})
export default class WxWebsiteArticleManageList extends Vue {
  selectedColumnType = '';
  columnTypes: any[] = [];
  background: any[] = [];
  keyword = '';
  dataList: any[] = [];
  currentPage = 1;
  pageSize = 20;
  total = 0;
  multipleSelection: any[] = [];

  mounted() {
    this.getArticleColumnType().then((value) => {
      this.getArticleList();
      this.getColumnBG();
    })
  }

  // 复制链接
  copyLink(row: any) {
    const {user} = getSessionStorage();
    const baseURL = `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.account.companyKey}&page=wx_website`;

    /* if (process.env.NODE_ENV === 'production') {
      baseURL = `http://www.jqzjop.com/wx-interface-web/wx/auth?companyKey=${user.account.companyKey}&page=wx_website`
    } else {
      baseURL = `http://www.jbfsoft.net/wx-web/wx/auth?companyKey=${user.account.companyKey}&page=wx_website`
    } */
    let childPage = null;

    childPage = {
      type: 'article',
      data: row
    }

    const url = new URL(baseURL);
    const searchParams = url.searchParams;
    searchParams.set('childPage', JSON.stringify(childPage))

    const textArea = document.createElement('textarea');
    textArea.value = url.toString();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    textArea.remove()
    Message.success('复制成功');
  }

  // 图片上传
  uploadIMG(res: any) {
    const {file} = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('alias', 'cat');

    uploadCompanyInfoIMGOptions(formData).then((res: any) => {
      const {data} = res;
      const body = {
        id: this.selectedColumnType,
        imgName: res.data[0],
      }

      setColumnOptions(body).then((res: any) => {
        Message.success('背景修改成功');
      })
    })
  }

  // 删除文章
  deleteArticle(idList: any) {
    return new Promise((resolve, reject) => {
      const body = {
        ids: idList.join(','),
      }

      getArticleBatchDetailOptions(body).then((res: any) => {
        const {data} = res;

        this.getArticleList();
        Message.success('删除成功');
        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 查询文章
  getArticleList() {
    return new Promise((resolve, reject) => {
      const body = {
        pid: this.selectedColumnType,
        title: this.keyword,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }

      getArticleListOptions(body).then((res: any) => {
        const {data} = res;

        const {total, list} = data;
        list.map((value: any, index: number) => {
          value.isShow = value.isShow == 1 ? true : false
          return value
        })
        this.dataList = list;
        this.total = total;

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 查询背景
  getColumnBG() {
    return new Promise((resolve, reject) => {
      const body = {
        id: this.selectedColumnType,
      }

      getColumnBGOptions(body).then((res: any) => {
        const {data} = res;

        this.background = [
          {
            url: data,
            name: '背景'
          }
        ]

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 查询栏目
  getArticleColumnType() {
    return new Promise((resolve, reject) => {
      const body = {}

      getArticleColumnTypeOptions(body).then((res: any) => {
        const {data} = res;

        if (data) {
          this.columnTypes = data.map((value: any, index: number) => {
            return {
              value: value.id,
              label: value.catName,
            }
          })

          if (this.columnTypes.length) {
            this.selectedColumnType = this.columnTypes[0].value
          }

          resolve(data);
        } else {
          reject('栏目类型没有数据');
        }
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 文章类型改变
  columnTypeChange(id: string) {
    this.getArticleList();
    this.getColumnBG();
  }

  // 编辑文章
  editArticle(type: string, index: number, item: any) {
    switch (type) {
      case 'add':
        this.$emit('edit', {
          type,
        })
        break;
      case 'edit':
        this.$emit('edit', {
          type,
          selectedColumnType: this.selectedColumnType,
          id: item.id
        })
        break;
    }
  }

  // 处理选中
  handleSelectionChange(value: any) {
    this.multipleSelection = value.map((value: any, index: number) => {
      return value.id;
    });
  }

  // 每页显示数改变
  handleSizeChange(val: number) {
    this.pageSize = val
    this.getArticleList()
  }

  // 当前页面改变
  handleCurrentChange(val: number) {
    this.currentPage = val
    this.getArticleList()
  }
}
</script>

<style lang="scss" scoped>
.article-manage-list {
  & > .bottom {
    & > .toolbar {
      display: flex;
      justify-content: space-between;

      & > .right {
        display: flex;

        & > .input {
          margin-right: 1rem;
        }
      }
    }

    & > .pagination {
      display: flex;
      flex-direction: row-reverse;
      margin-top: 1.5rem;
    }
  }
}
</style>