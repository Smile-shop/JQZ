<template>
  <article class="infomation-manage">
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
    <el-button type="primary" icon="el-icon-plus" @click="addCategoryDetail('new')">新增资讯</el-button>
    <el-button type="danger" @click="removeCategoryDetailList">批量删除</el-button>
    <el-table
      :data="categoryDetailTableData"
      border
      @selection-change="handleSelectionChange"
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
          <el-button size="small" @click="addCategoryDetail(scope.row.id)">编辑</el-button>
          <el-button size="small" @click="copyItemLink(scope.row)">复制链接</el-button>
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
      @size-change="getCategoryDetailList"
      @current-change="getCategoryDetailList"
      :current-page.sync="currentPage"
      :total="tableTotal"
    ></el-pagination>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getCategory, getCategoryDetailList, removeCategoryDetail, getCategoryDetail, removeCategoryDetailList } from '@/api/super-crm/wx-member-functions';
import user from '@/utils/user';

@Component({
})
export default class InfomationManage extends Vue {
  private categoryTableData = [];
  private editableIndex: number = -1;
  private infoManageForm = {
    categoryId: '',
    title: ''
  }
  private pageSize: number = 10;
  private currentPage: number = 1;
  private tableTotal: number = 0;
  private categoryDetailTableData = [];
  private multipleSelection = [];

  private mounted() {
    this.getCategory();
    this.getCategoryDetailList();
  }

  private getCategory() {
    return getCategory().then((res: any) => {
      this.categoryTableData = res.data || [];
    })
  }

  private getCategoryDetailList() {
    const params = {
      categoryId: this.infoManageForm.categoryId,
      title: this.infoManageForm.title,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    }
    return getCategoryDetailList(params).then((res: any) => {
      if (res.data) {
        this.categoryDetailTableData = res.data.list || [];
        this.tableTotal = res.data.page.total || 0;
      } else {
        this.categoryDetailTableData = [];
        this.tableTotal = 0;
      }
    })
  }

  private copyItemLink(item: any) {
    const oldInput = document.getElementById('copy-input');
    if (oldInput) {
      document.body.removeChild(oldInput);
    }
    const oInput = document.createElement('input');
    oInput.value = `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}&page=consult-details/${item.id}`;
    oInput.id = 'copy-input';
    oInput.style.opacity = '0';
    document.body.appendChild(oInput);
    try {
      const range = document.createRange();
      range.selectNode(oInput);
      (window as any).getSelection().removeAllRanges();
      (window as any).getSelection().addRange(range);
      document.execCommand('copy');
      (window as any).getSelection().removeAllRanges();
      this.$message({
        type: 'success',
        message: '复制成功！'
      });
    } catch (e) {
      this.$message({
        type: 'error',
        message: '复制失败！'
      });
    }
  }

  private handleSelectionChange(val: any) {
    this.multipleSelection = val;
  }

  private removeCategoryDetailList() {
    if (this.multipleSelection.length <= 0) {
      this.$message({
        type: 'info',
        message: '请选择！'
      });
      return;
    }
    const idList = this.multipleSelection.map((p: any) => p.id);
    this.$confirm('确定删除选中资讯？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      removeCategoryDetailList({ idList }).then((res: any) => {
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

  private addCategoryDetail(item: any) {
    this.$router.push({
      path: '/super-crm/wx-member/member-function/info-center/edit',
      query: {
        id: item
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.infomation-manage {
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
  .table-page {
    position: fixed;
    bottom: 15px;
    right: 20px;
  }
}
</style>

