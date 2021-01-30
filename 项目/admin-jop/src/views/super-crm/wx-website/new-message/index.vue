<template>
  <div class="new-message">
    <div class="article-home">
      <section class="top">
        <el-form
          ref="form"
          label-width="120px" 
        >
          <el-form-item label="栏目背景">
            <el-upload
              :multiple="false"
              :file-list="background"
              list-type="picture"
              :http-request="uploadIMG"
              :limit="1"
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
              type="warning"
              size="small"
              @click="deleteArticle(multipleSelection)"
            >
              批量删除
            </el-button>
          </div>
          <div class="right">
            <el-date-picker
              :style="{
                width: '300px'
              }"
              class="date-picker"
              size="small"
              v-model="dateRange"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-input
              :style="{
                width: '200px'
              }"
              class="keyword-input"
              v-model="keyword"
              size="small"
            />
            <el-button
              type="primary"
              size="small"
              @click="getMessage"
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
            type="index"
            width="50"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            label="留言内容"
            prop="content"
            width="300"
          >
          </el-table-column>
          <el-table-column
            label="姓名"
            prop="userName"
            width="130"
          >
          </el-table-column>
          <el-table-column
            label="电话"
            prop="userPhone"
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
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import moment from 'moment';
import {Message} from 'element-ui';
import {getSessionStorage} from '@/utils/storage';
import {
  getMessageOptions,
  deleteMessageOptions,
  uploadMessageIMGOptions,
  saveMessageIMGOptions,
  getMessageIMGOptions,
} from '@/api/super-crm/wx-website';

@Component({
})
export default class WxWebsiteNewMessage extends Vue {
  background: any[] = []
  keyword = ''
  dateRange = ''
  dataList: any[] = []
  currentPage = 1
  pageSize = 20
  total = 0
  multipleSelection = []

  mounted() {
    this.getMessage();
    this.getMessageIMG();
  }

  // 图片上传
  uploadIMG(res: any) {
    const {file} = res;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('type', '0');

    uploadMessageIMGOptions(formData).then((res: any) => {
      const {data} = res;

      const body = {
        backImg: data.imgname[0]
      }

      saveMessageIMGOptions(body).then((res: any) => {
        Message.success('上传成功');
      })
    })
  }

  // 图片查询
  getMessageIMG() {
    return new Promise((resolve, reject) => {
      const {user} = getSessionStorage();
      const body = {
        companyKey: user.account.companyKey
      }

      getMessageIMGOptions(body).then((res: any) => {
        const {data} = res;

        this.background.push({
          name: '',
          url: data.backImg,
        })

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 查询数据
  getMessage() {
    return new Promise((resolve, reject) => {
      const {user} = getSessionStorage();
      const body = {
        page: {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
        },
        params: {
          content: this.keyword,
          startTime: this.dateRange ? moment(this.dateRange[0]).format('YYYY-MM-DD') : '',
          endTime: this.dateRange ? moment(this.dateRange[1]).format('YYYY-MM-DD') : '',
        }
      }

      getMessageOptions(body).then((res: any) => {
        const {data} = res;

        const {total, list} = data;
        this.total = total;
        this.dataList = list;

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 删除留言
  deleteArticle(body: any) {
    return new Promise((resolve, reject) => {
      const {user} = getSessionStorage();

      deleteMessageOptions(body).then((res: any) => {
        const {data} = res;

        this.getMessage();
        Message.success('删除成功');

        resolve(data);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
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
    this.getMessage()
  }

  // 当前页面改变
  handleCurrentChange(val: number) {
    this.currentPage = val;
    this.getMessage()
  }
}
</script>

<style lang="scss" scoped>
.new-message {
  & > .article-home {
    & > .bottom {
      & > .toolbar {
        display: flex;
        justify-content: space-between;

        & > .right {
          display: flex;

          & > .keyword-input {
            margin-right: 1rem;
          }

          & > .date-picker {
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
}
</style>


