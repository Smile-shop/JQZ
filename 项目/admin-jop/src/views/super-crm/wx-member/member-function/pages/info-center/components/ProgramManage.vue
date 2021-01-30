<template>
  <div class="program-manage">
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
          <section :aa="scope.$index" class="order-control">
            <div @click="tableSort(scope.$index, true)" :class="{'is-disabled': scope.$index === 0}"><i class="el-icon-arrow-up"></i></div>
            <div @click="tableSort(scope.$index, false)" :class="{'is-disabled': scope.$index === categoryTableData.length - 1}"><i class="el-icon-arrow-down"></i></div>
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
    <el-dialog title="新增栏目" @open="addCategoryForm.name = ''" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
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
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getCategory, setCategory, removeCategory, addCategory, tableSort } from '@/api/super-crm/wx-member-functions';

@Component({
})
export default class ProgramManage extends Vue {
  private editableIndex: number = -1;
  private categoryTableData = [];
  private dialogFormVisible: boolean = false;
  private addCategoryForm = {
    name: ''
  };

  private mounted() {
    this.getCategory();
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

  private tableSort(index: number, isUp: boolean) {
    if ((index === 0 && isUp) || (index === this.categoryTableData.length - 1 && !isUp)) {
      return;
    } else {
      const list = this.categoryTableData.map((p: any) => p.id);
      const temp = list[index];
      const i = isUp ? index - 1 : index + 1;
      list[index] = list[i];
      list[i] = temp;
      console.log(list)
      tableSort({list}).then((res: any) => {
        this.getCategory();
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.program-manage {
  .table-content {
    .order-control {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      > div {
        width: 32px;
        height: 32px;
        line-height: 30px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid #999999;
        cursor: pointer;
        > i {
          color: #999999;
        }
      }
      > div:hover {
        border: 1px solid #409EFF;
        > i {
          color: #409EFF;
        }
        opacity: .5;
      }
      > .is-disabled {
        border: 1px solid #E4E7ED;
        > i {
          color: #E4E7ED;
        }
      }
    }
  }
}
</style>

