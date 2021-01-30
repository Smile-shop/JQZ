<template>
  <div class="OnlineClassify">
    <el-button type="primary" @click="addOnlineClassify" class="addOnline" :disabled = "newLen">新增</el-button>
    <el-table border :data="onlinClassifyTable">
      <el-table-column label="序号" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.sequence}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类名称" prop="classifiedName"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">已启用</span>
          <span v-else>已禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="上架商品数量" prop="quantity"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span class="editor" style="cursor: pointer" @click="handleEditor(scope.row)">重新编辑</span>
          <span class="operatingSplit">|</span>
          <span
            class="embar"
            style="cursor: pointer"
            v-if="scope.row.status == 1"
            @click="handleChangeState(scope.row, 0)"
          >禁用</span>
          <span
            class="embar"
            style="cursor: pointer"
            v-else
            @click="handleChangeState(scope.row, 1)"
          >启用</span>
          <span class="operatingSplit close">|</span>
          <span class="embar close" style="cursor: pointer" @click="handleDelete(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="situation" :visible.sync="dialogFormVisible" :width="dialogWidth">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="classifiedName">
          <el-input v-model="form.classifiedName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="序号" :label-width="formLabelWidth" prop="sequence">
          <el-input v-model.number="form.sequence" type="sequence" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-radio v-model="form.status" label="1">启用</el-radio>
          <el-radio v-model="form.status" label="0">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer addBtn">
        <el-button type="primary" @click="addSubmitOnline('ruleForm')">{{submitText}}</el-button>
      </div>
    </el-dialog>
    <div class="block pages">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSize"
        :page-size="pageSizeSkip"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

  <el-dialog
    title="提示"
    :visible.sync="centerDialogVisible"
    width="30%"
    center>
  <span class="confirm-delete">确定删除吗？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleSure">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { getOnlineClassify, submit, addSubmit, deleteOnline } from '@/api/super-crm/csr-onlineClassify'
@Component
export default class OnlinClassify extends Vue {
  private centerDialogVisible: boolean = false
  private params: any = {}
  private constant: number = 12
  private dialogWidth: string = '35%'
  private newLen: boolean = false
  private situation: string = ''
  private value: boolean = true
  private submitText: string = '添加'
  private pageSize: any = [10, 20, 30, 40, 50]
  private pageSizeSkip: number = 10
  private currentPage: number = 1
  private total: number = 0
  private onlinClassifyTable: any = []
  private dialogFormVisible: boolean = false
  private formLabelWidth: string = '120px'
  private form: any = {
    categoryId: '',
    classifiedName: '',
    identification: '',
    quantity: '',
    sequence: '',
    status: '1',
    updateBy: '',
    updateTime: ''
  }
  private rules: any = {
    classifiedName: [
      { required: true, message: '请输入分类名称', trigger: 'blur' },
      { min: 1, max: 10, message: '长度 10 个字', trigger: 'blur' }
    ],
    sequence: [
      {
        required: true,
        message: '请填写序号',
        trigger: 'blur'
      },
      {
        type: 'number',
        min: 1,
        max: 1000,
        message: '请输入合理的序号数字',
        trigger: 'blur'
      }
    ],
    status: [
      {
        required: true
      }
    ]
  }
  private pages: any = {
    pageNum: 1,
    pageSize: 12
  }

  private created() {
    this.getOnlineClassify(this.pages)
  }

  // 获得分类列表
  private getOnlineClassify(data: any) {
    const option = data
    getOnlineClassify(option).then((res: any) => {
      const { total, list, pageNum } = res.data
      if (total >= this.constant) {
        this.newLen = true
      }
      this.onlinClassifyTable = list
      this.total = total
      this.currentPage = pageNum
    })
  }

  // 添加热门分类按钮
  private addOnlineClassify() {
    this.changeDialogTitle('添加热门分类')
    this.changeSubmitText('添加')
    this.dialogFormVisible = true
    const options: any = {}
    Object.keys(this.form).forEach((item: string) => {
      options[item] = ''
    })
    this.form = Object.assign({}, this.form, options)
    const len: number = Number(this.total) + 1
    this.form.sequence = len
    this.form.status = '1'
  }

  // 改变弹出框名字且弹出
  private changeDialogTitle(title: string) {
    this.situation = title
    this.dialogFormVisible = true
  }

  // 改变提交框文字
  private changeSubmitText(text: string) {
    this.submitText = text
  }

  // 编辑
  private handleEditor(data: any) {
    this.changeDialogTitle('编辑热门分类')
    data.status = String(data.status)
    this.form = Object.assign({}, this.form, data)
    this.changeSubmitText('确定')
  }

  // 提交添加或编辑
  private addSubmitOnline(formName: any) {
    const form: any = this.$refs[formName]
    form.validate((valid: boolean): void => {
      if (valid) {
        this.form.updateTime = new Date().getTime()
        this.form.status = String(this.form.status)
        this.form.updateTime = String(this.form.updateTime)
        this.form.sequence = Number(this.form.sequence)
        const option = this.form
        const { categoryId } = option
        if (categoryId) {
          this.submit(option)
        } else {
          this.addSubmit(option)
        }
      }
    })
  }

  // 新增提交接口
  private async submit(data: any) {
    const res = await submit(data)
    const { code } = res
    const tipText: any = {
      添加: '添加成功',
      确定: '修改成功'
    }
    if (code === 0) {
      this.$message({
        message: tipText[this.submitText],
        type: 'success'
      })
      this.dialogFormVisible = false
      this.getOnlineClassify(this.pages)
    }
  }

  // 编辑提交接口
  private async addSubmit(data: any) {
    const res = await addSubmit(data)
    const success = 0
    const { code } = res
    const tipText: any = {
      添加: '添加成功',
      确定: '修改成功'
    }
    if (code === success) {
      this.$message({
        message: tipText[this.submitText],
        type: 'success'
      })
      this.dialogFormVisible = false
      this.getOnlineClassify(this.pages)
    }
  }

  // 关闭或开启 1 开启 0 禁用
  private handleChangeState(data: any, state: number): void {
    this.submitText = '确定'
    const result: any = []
    const id: number = data.categoryId
    this.onlinClassifyTable.map((item: any): void => {
      if (item.categoryId === id) {
        item.status = state
        this.form = Object.assign({}, this.form, item)
      }
    })
    const option = this.form
    this.submit(option)
  }

  private modifyStatus() {
    return null
  }

  private handleSizeChange(val: number): void {
    this.pages.pageSize = val
    const option: any = this.pages

    this.getOnlineClassify(option)
  }

  private handleCurrentChange(val: number): void {
    this.pages.pageNum = val
    const option = this.pages

    this.getOnlineClassify(option)
  }


  // 删除操作接口
  private async deleteOnline(data: any) {
    const res = await deleteOnline(data)
    const { code } = res
    if (code === 0) {
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.dialogFormVisible = false
      this.getOnlineClassify(this.pages)
    }
  }

 // 删除按钮
  private handleDelete(val: any): void {
    const { categoryId } = val
    const params: any = {categoryId}
    this.params = params
    this.centerDialogVisible = true
  }

  // 确定删除对话
  private handleSure() {
    this.centerDialogVisible = false
    this.deleteOnline(this.params)
  }
}
</script>

<style scoped>
.addOnline {
  float: right;
  margin-bottom: 5px;
}
.addBtn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.operatingSplit {
  margin: 0 15px;
  color: #66b1ff;
}
.editor, .embar {
  cursor: pointer !important;
  color: #66b1ff;
}
.pages {
  display: none;
  float: right;
  margin-top: 5px;
}
.close {
  display: none;
}
.confirm-delete {
  display: flex;
  justify-content: center;
}
</style>