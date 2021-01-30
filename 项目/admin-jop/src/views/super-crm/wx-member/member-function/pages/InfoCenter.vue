<template>
  <article class="info-center">
    <el-tabs v-model="activeName">
      <el-tab-pane label="栏目管理" name="1">
        <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-plus">新增栏目</el-button>
        <el-table
          :data="categoryTableData"
          border
          class="table-content"
          style="width: 100%;margin-top:18px;">
          <el-table-column
            type="index"
            label="编号"
            align="center"
            width="140">
          </el-table-column>
          <el-table-column
            prop="name"
            label="栏目名称"
            align="center">
            <template slot-scope="scope">
              <el-input v-if="scope.$index === editableIndex" v-model="scope.row.name" placeholder="请输入内容"></el-input>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="栏目排序"
            align="center"
            width="150">
            <template slot-scope="scope">
              <section :aa="scope" class="order-control">
                <div><i class="el-icon-arrow-up"></i></div>
                <div><i class="el-icon-arrow-down"></i></div>
              </section>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            align="center"
            label="操作"
            width="240">
            <template slot-scope="scope">
              <el-button size="small" type="success" v-if="scope.$index === editableIndex" @click="submitMethod(scope.row)">保存</el-button>
              <el-button v-else size="small" @click="editMethod(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="removeItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="资讯管理" name="2">
        <article v-if="editCategoryDetailShow">
          <el-form :inline="true" :model="infoManageForm" class="demo-form-inline">
            <el-form-item label="资讯栏目：">
              <el-select v-model="infoManageForm.categoryId" placeholder="资讯栏目">
                <el-option
                  v-for="item in categoryTableData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资讯标题：">
              <el-input v-model="infoManageForm.title" placeholder="资讯标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getCategoryDetailList">查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" icon="el-icon-plus" @click="addCategoryDetail()">新增资讯</el-button>
          <el-button type="danger">批量删除</el-button>
          <el-table
            :data="categoryDetailTableData"
            border
            class="table-content"
            style="width: 100%;margin-top:18px;">
            <el-table-column
              type="selection"
              align="center"
              width="55">
            </el-table-column>
            <el-table-column
              type="index"
              label="编号"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              prop="name"
              label="资讯栏目"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="title"
              label="资讯标题"
              align="center">
            </el-table-column>
            <el-table-column
              prop="createdTime"
              label="添加时间"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="status"
              label="是否显示"
              align="center"
              width="150">
              <template slot-scope="scope">
                <i class="el-icon-success isSuccess-icon" v-if="scope.row.status"></i>
                <i class="el-icon-error isFail-icon" v-else></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="viewCount"
              label="浏览数"
              align="center"
              width="150">
            </el-table-column>
            <el-table-column
              prop="address"
              align="center"
              label="操作"
              width="240">
              <template slot-scope="scope">
                <el-button size="small" type="success" v-if="scope.$index === editableIndex" @click="submitMethod">保存</el-button>
                <el-button v-else size="small" @click="editCategoryDetail(scope.row)">编辑</el-button>
                <el-button size="small" :id="`btn-${scope.row.id}`" :data-clipboard-text="copuText(scope.row)" @click="copyItemLink(scope.row)">复制链接</el-button>
                <el-button type="danger" size="small" @click="removeCategoryDetail(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="table-page"
            background
            layout="total, prev, pager, next, sizes, jumper"
            :page-sizes="[20, 50, 100, 200, 500]"
            :page-size.sync="pageSize"
            :hide-on-single-page="isSinglePage"
            @size-change="getCategoryDetailList"
            @current-change="getCategoryDetailList"
            :current-page.sync="currentPage"
            :total="tableTotal"
          ></el-pagination>
        </article>
        <article class="edit-category-detail" v-else>
          <el-row>
            <el-col :span="6">
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
            <el-col :span="18">
              <div class="input-item" style="width: 400px;">
                <div class="label">资讯标题：</div>
                <div class="content">
                  <el-input v-model="editCategoryDetailForm.title" placeholder="请输入内容"></el-input>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <div class="input-item" style="width: 400px;">
                <div class="label">摘要：</div>
                <div class="content">
                  <el-input v-model="editCategoryDetailForm.summary" type="textarea" :rows="5" placeholder="请输入内容"></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="input-item" style="width: 400px;">
                <div class="label">摘要图片：</div>
                <div class="content">
                  <el-input v-model="editCategoryDetailForm.summaryImg" placeholder="请输入内容"></el-input>
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
              <WangEditor ref="ue" :contents="editCategoryDetailForm.content"></WangEditor>
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
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="收货地址" @open="addCategoryForm.name = ''" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="addCategoryForm" label-width="120px">
        <el-form-item label="资讯栏目名称：">
          <el-input v-model="addCategoryForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getCategory, setCategory, removeCategory, addCategory, getCategoryDetailList, removeCategoryDetail, getCategoryDetail } from '@/api/super-crm/wx-member-functions';
import user from '@/utils/user';
import WangEditor from '@/components/WangEditor.vue';
import ClipboardJS from 'clipboard';

@Component({
  components: {
    WangEditor
  }
})
export default class InfoCenter extends Vue {
  private activeName: string = '2';
  private editableIndex: number = -1;

  private categoryTableData = [];
  private dialogFormVisible: boolean = false;
  private addCategoryForm = {
    name: ''
  };
  private infoManageForm = {
    categoryId: '',
    title: ''
  }
  private pageSize: number = 10;
  private isSinglePage: boolean = true;
  private currentPage: number = 1;
  private tableTotal: number = 0;
  private categoryDetailTableData = [];

  private editCategoryDetailShow: boolean = true;
  private editCategoryDetailForm = {
    categoryId: '',
    title: '',
    summary: '',
    summaryImg: '',
    status: 0,
    sort: 0,
    content: ''
  }

  private mounted() {
    this.getCategory();
    this.getCategoryDetailList();
  }

  private getCategory() {
    getCategory().then((res: any) => {
      this.categoryTableData = res.data || [];
    })
  }

  private editMethod(index: number, row: any) {
    this.editableIndex = index;
  }

  private submitMethod(item: any) {
    const params = {
      id: item.id,
      name: item.name,
      sort: item.sort
    }
    setCategory(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '保存成功！'
      });
      this.editableIndex = -1;
      this.getCategory();
    })
  }

  private removeItem(item: any) {
    this.$confirm('确定删除该栏目？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      removeCategory({ id: item.id }).then((res: any) => {
        this.getCategory();
        this.editableIndex = -1;
        this.$message({
          type: 'success',
          message: '删除成功！'
        });
      });
    }).catch(err => {
      console.log(err);
    });
  }

  private addCategory() {
    if (this.addCategoryForm.name === '') {
      this.$message({
        type: 'warning',
        message: '请填写栏目名称!'
      });
      return;
    }
    addCategory(this.addCategoryForm).then((res: any) => {
      this.$message({
        type: 'success',
        message: '添加成功！'
      });
      this.dialogFormVisible = false;
      this.getCategory();
    })
  }

  private getCategoryDetailList() {
    const params = {
      categoryId: this.infoManageForm.categoryId,
      title: this.infoManageForm.title,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    }
    getCategoryDetailList(params).then((res: any) => {
      this.categoryDetailTableData = res.data.list || [];
    })
  }

  private copuText(item: any) {
    return `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}&page=consult-details/${item.id}`;
  }

  private copyItemLink(item: any) {
    const clipboard = new ClipboardJS(`#btn-${item.id}`);
    clipboard.on('success', (e: any) => {
      this.$message({
        type: 'success',
        message: '复制成功！'
      });
      e.clearSelection();
    });
  }

  private editCategoryDetail(item: any) {
    getCategoryDetail({id: item.id}).then((res: any) => {
      console.log(res)
      this.editCategoryDetailShow = false;
    })
  }

  private removeCategoryDetail(item: any) {
    this.$confirm('确定删除该资讯？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      removeCategoryDetail({ id: item.id }).then((res: any) => {
        this.getCategoryDetailList();
        this.editableIndex = -1;
        this.$message({
          type: 'success',
          message: '删除成功！'
        });
      });
    }).catch(err => {
      console.log(err);
    });
  }

  private addCategoryDetail() {
    this.cancelEditCategoryDetail();
    this.editCategoryDetailShow = false;
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
    this.editCategoryDetailShow = true;
  }
}
</script>

<style lang="scss" scoped>
.info-center {
  .table-page {
    position: fixed;
    bottom: 15px;
    right: 20px;
  }
  .table-content {
    .order-control {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      > div {
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid #E4E7ED;
        cursor: pointer;
      }
      > div:hover {
        border: 1px solid #409EFF;
        color: #409EFF;
        opacity: .5;
      }
    }
  }
  .demo-form-inline {
    height: 80px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  .isSuccess-icon {
    font-size: 28px;
    color: #6699ff;
  }
  .isFail-icon {
    font-size: 28px;
    color: #F56C6C;
  }
  .edit-category-detail {
    .input-item {
      display: flex;
      margin: 8px 0 20px 0;
      .label {
        width: 120px;
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
      }
    }
  }
}
</style>


