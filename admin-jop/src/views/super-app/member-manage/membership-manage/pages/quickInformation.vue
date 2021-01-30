<template>
  <article class="position-table-wrapper">
    <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true" v-if="tableTotal < 10">添加快捷消息</el-button>
    <el-button type="info" icon="el-icon-plus" disabled v-else>添加快捷消息</el-button>
    <span class="m-tag-tip">提示：最多添加10条快捷消息</span>
    <el-table
      class="table-content"
      :data="accountList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="content"
        label="快捷消息"
        align="left"
        >
        <template slot-scope="scope">
          <el-input :class="classStyle(scope.$index)"  maxlength="200" placeholder="请输入快捷信息"  v-if="scope.$index === editableIndex" size="small" v-model.trim="scope.row.content"></el-input>
          <span v-else>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        align="center"
        width="241"
        >
        <template slot-scope="scope">
          <el-button
            v-if="scope.$index === editableIndex"
            size="mini"
            type="success"
            @click="handleSave(scope.$index, scope.row)">保存</el-button>
            <el-button
            v-else-if="scope.row.id"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click="deleteInfo(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增快捷信息标签 -->
    <el-dialog title="新增-快捷消息" class="dialog-info"  width="27%" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="formTag" ref="formTag" :rules="rules">
        <el-form-item  prop="content">
          <el-input class="textarea-info" type="textarea" placeholder="请输入快捷信息"  v-model.trim="formTag.content" maxlength="200" show-word-limit  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="updateBasisData">确 定</el-button>
      </div>
    </el-dialog>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {shortcutInfoSetQuery, shortcutInfoSetAdd, shortcutInfoSetDel} from '@/api/system-set';
import user from '@/utils/user';

@Component({
})
export default class PositionTable extends Vue {
  private accountList = [];
  private formTag = {
    content: '',
  };
  private rules = {
    content: [{ required: true, message: '请输入快捷信息'}],
  }
  // 编辑缓存数据
  private editeValue = {
    item: {
      content: ''
    },
    index: 0
  }
  // 编辑||保存标识
  private editableIndex: number = -1;
  // 新增快捷消息显示隐藏
  private dialogFormVisible: boolean = false;
  private tableTotal: number = 0;
  private mounted() {
    this.shortcutInfoSetQuery();
  }
  // 样式
  private classStyle(scope: any) {
    return 'elInput' + scope
  }
  // 查询
  private shortcutInfoSetQuery() {
    shortcutInfoSetQuery().then((res: any) => {
      if (res.code === 0) {
        this.accountList = res.data ? res.data : [];
        this.tableTotal = this.accountList.length;
      }
    })
  }
  // 编辑
  private handleEdit(index: number, item: any) {
    this.editableIndex = index;
    if (this.editeValue.item.content == '') {
      const nowI = {
        ...item,
      }
      const nowX = JSON.parse(JSON.stringify(index))
      this.editeValue.item = nowI
      this.editeValue.index = nowX
    } else {
      const list: any = [];
      this.accountList.map((item: any, idx) => {
        if (idx == this.editeValue.index && item.content === '') {
          item = this.editeValue.item;
        }
        list.push(item);
      })
      this.accountList = list;
      const nowI = JSON.parse(JSON.stringify(item))
      const nowX = JSON.parse(JSON.stringify(index))
      this.editeValue.item = nowI
      this.editeValue.index = nowX
    }
  }
  // 保存
  private handleSave(index: number, item: any) {
    if (!item.content) {
      this.$message.error('请输入快捷信息');
      (document.querySelector(`.elInput${index}  .el-input__inner`) as any).focus();
      return false
    }
    this.editableIndex = -1;
    const params = {
      content: item.content,
      id: item.id
    }
    shortcutInfoSetAdd(params).then((res: any) => {
      if (res.code === 0) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.shortcutInfoSetQuery();
      }
    }).catch((error) => {
       this.shortcutInfoSetQuery();
    })
  }
  // 删除
  private deleteInfo(index: any, item: any) {
    this.$confirm(`确定删除这条快捷信息吗？`, '删除快捷信息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.shortcutInfoSetDel(index, item);
    })
  }
  // 删除行消息接口
  private shortcutInfoSetDel(index: any, item: any) {
    const params = {
      id: item.id
    }
    shortcutInfoSetDel(params).then((res: any) => {
      if (res.code === 0) {
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.shortcutInfoSetQuery();
      }
    });
  }
  // 关闭弹窗
  private handleClose() {
    this.formTag = {
      content: '',
    }
    this.dialogFormVisible = false;
    this.removeRule();
  }
  // 去除验证结果
  private removeRule() {
    const ele: any = this.$refs.formTag;
    ele.resetFields();
  }
  // 添加快捷消息
  private updateBasisData() {
    const params = {
      id: null,
      ...this.formTag
    }
    const ele: any = this.$refs.formTag;
    ele.validate((valid: any, obj: any) => {
      if (!valid) {
        return false;
      }
    })
    if (this.formTag.content === '') {
      return;
    }
    shortcutInfoSetAdd(params).then((res: any) => {
      if (res.code === 0) {
        this.handleClose();
        this.$message({
          type: 'success',
          message: '添加成功'
        });
        this.shortcutInfoSetQuery();
      }
    });
  }
}
</script>

<style lang="scss">
.position-table-wrapper {
  font-family: MicrosoftYaHei;
  .m-tag-tip{
    margin-left: 15px;
    font-size: 14px;
    color: #606266;
  }
  .table-content {
    margin-top: 20px;
    .icon-size{
      font-size: 26px;
    }
    .icon-success-size:before{
      color: #6699ff;
    }
    .icon-error-size:before{
      color: red;
    }
    .has-gutter tr{
      background-color: #f5f7fa;
    }
  }
  .form-tip{
    display: flex;
    color: #e12f30;
    .form-tip-title{
      width: 44px;
    }
    .form-tip-text{
      flex: 1;
    }
  }
  .pagination-box{
    .el-pagination{
      float: right;
      margin-top: 18px;
    }
  }
  .dialog-info{
    .el-dialog__header{
      border-bottom: 1px solid #ddd;
    }
  }
  .el-table__header-wrapper{
    .has-gutter{
      .is-leaf{
        .cell{
          color: #606266;
          font-weight: bold;
        }
      }
      .is-left{
        .cell{
          padding-left: 47px;
        }
      }
    }
  }
  .el-table__body{
    .is-left{
      .cell{
        padding-left: 47px;
      }
    }
  }
  .textarea-info{
    .el-textarea__inner{
      height: 180px;
    }
  }
}
</style>
