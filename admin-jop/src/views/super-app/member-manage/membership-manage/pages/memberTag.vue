<template>
  <article class="position-table-wrapper">
    <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">添加标签</el-button>
    <span class="m-tag-tip">提示：最多支持展示30个标签</span>
    <el-table
      class="table-content"
      :data="accountList"
      border
      style="width: 100%"> 
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        prop="tagName" 
        label="标签名称"
        align="center"
        >
        <template slot-scope="scope">
          <el-input placeholder="标签名称最长支持8个汉字" maxlength="8" v-if="scope.$index === editableIndex" size="small" v-model="scope.row.tagName"></el-input>
          <span v-else>{{ scope.row.tagName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="标签排序"
        align="center">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === editableIndex" size="small" v-model="scope.row.tagSort" @keyup.native="number(scope.$index)" maxlength="2"></el-input>
          <span v-else>{{ scope.row.tagSort }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tagStaus"
        align="center"
        label="是否展示"
        >
        <template slot-scope="scope">
          <div v-if="scope.row.tagStaus === '1'">
            <i class="el-icon-success icon-size icon-success-size"></i>
          </div>
          <div v-else-if="scope.row.tagStaus === '0'">
            <i class="el-icon-error icon-size icon-error-size"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        align="center"
        >
        <template slot-scope="scope">
          <el-button
            v-if="scope.$index === editableIndex"
            size="mini"
            type="success"
            @click="handleSave(scope.$index, scope.row)">保存</el-button>
            <el-button
            v-else-if="scope.row.tagId"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            v-if="scope.row.tagStaus === '1'"
            size="mini"
            @click="handleHidden(scope.$index, scope.row)">设为隐藏</el-button>
            <el-button
            v-else-if="scope.row.tagStaus === '0'"
            size="mini"
            @click="handleHidden(scope.$index, scope.row)">设为显示</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-box">
      <el-pagination
        layout="total,prev, pager, next,sizes, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        :page-size.sync="pageSize" 
        :total="tableTotal">
      </el-pagination>
    </div>
    <!-- 新增会员标签 -->
    <el-dialog title="新增-会员标签"  width="27%" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="formTag" ref="formTag" :rules="rules">
        <el-form-item label="标签名称：" :label-width="formLabelWidth" prop="name">
          <el-input  v-model.trim="formTag.name" placeholder="标签名称最长支持8个汉字" auto-complete="off" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="标签默认排序：" :label-width="formLabelWidth" prop="sort" >
          <el-input v-model="formTag.sort" placeholder="标签排序" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" maxlength="2"></el-input>
        </el-form-item>
        <el-form-item label="标签状态：" :label-width="formLabelWidth">
          <template>
            <el-radio-group v-model="formTag.tagStaus">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
          </el-radio-group>
          </template>
        </el-form-item>
      </el-form>
      <div class="form-tip"><span class="form-tip-title">提示：</span><span class="form-tip-text">标签创建并使用后，关系到会员搜索、统计等数据使用，为了避免误操作，标签不可删除，只可隐藏。</span></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="updateBasisData">确 定</el-button>
      </div>
    </el-dialog>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {listMemberTag, updateMemberTag, updateMemberTagStatus, addMemberTag} from '@/api/system-set';
import user from '@/utils/user';

@Component({
})
export default class PositionTable extends Vue {
  // private accountList = [];
  private accountList = [{
    tagStaus: '',
    tagSort: ''
  }];
  private formTag = {
    name: '',
    sort: '',
    tagStaus: 1,
  };
  private rules = {
    name: [{ required: true, message: '请输入标签名称'}],
    sort: [{required: true, message: '请输入标签排序'}]
  }
  // 编辑||保存标识
  private editableIndex: number = -1;
  // 设置显示隐藏标识
  private showIndex: any = '1';
  // 新增会员标签显示隐藏
  private dialogFormVisible: boolean = false;
  private formLabelWidth: string = '130px';
  // 当前页
  private currentPage: number = 1;
  private pageSize: number = 10;
  private tableTotal: number = 30;
  private mounted() {
    this.listMemberTag();
  }

  // 查询
  private listMemberTag() {
    const params = {
      page: {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
    }
    listMemberTag(params).then((res: any) => {
      if (res.code === 0) {
        this.accountList = res.data.list ? res.data.list : [];
        this.tableTotal = res.data.total;
      }
    })
  }
  // 只能输入正整数
  private number(index: number) {
    this.accountList[index].tagSort = this.accountList[index].tagSort.replace(/\D|^0/g, '');
  }
  // 编辑
  private handleEdit(index: number, item: any) {
    this.editableIndex = index;
  }
  // 保存
  private handleSave(index: number, item: any) {
    this.editableIndex = -1;
    updateMemberTag(item).then((res: any) => {
      if (res.code === 0) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
      }
    }).catch((error) => {
       this.listMemberTag();
    })
  }
  // 设置显示隐藏
  private handleHidden(index: any, item: any) {
    // this.accountList.tagStaus = !item.tagStaus;
    let tStatus = '';
    if (item.tagStaus === '1') {
      tStatus = '0';
    } else {
      tStatus = '1';
    }
    updateMemberTagStatus({tagStaus: tStatus, tagId: item.tagId}).then((res: any) => {
      if (res.code === 0) {
        if (item.tagStaus === '1') {
          this.accountList[index].tagStaus = '0';
        } else {
          this.accountList[index].tagStaus = '1';
        }
        this.$message({
          message: res.msg,
          type: 'success'
        });
      }
    });
  }
  // 每页
  private handleSizeChange(val: any) {
    this.listMemberTag();
  }
  // 当前页
  private handleCurrentChange(val: any) {
    this.listMemberTag();
  }
  // 关闭弹窗
  private handleClose() {
    this.formTag = {
      name: '',
      sort: '',
      tagStaus: 1,
    }
    this.dialogFormVisible = false;
    this.removeRule();
  }
  // 去除验证结果
  private removeRule() {
    const ele: any = this.$refs.formTag;
    ele.resetFields();
  }
  // 添加会员标签
  private updateBasisData() {
    const params = {
      tagLimitSize: 30,
      tagName: this.formTag.name,
      tagStaus: this.formTag.tagStaus,
      tagSort: this.formTag.sort,
    }
    const ele: any = this.$refs.formTag;
    ele.validate((valid: any, obj: any) => {
      if (!valid) {
        return false;
      }
    })
    if (this.formTag.name === '' || this.formTag.sort === '') {
      return;
    }
    addMemberTag(params).then((res: any) => {
      if (res.code === 0) {
        this.handleClose();
        this.$message({
          type: 'success',
          message: res.msg
        });
        this.listMemberTag();
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
  // .el-dialog{
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   top: 0;
  //   bottom: 0;
  //   height: 410px;
  //   margin: auto !important;
  // }
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
}
</style>
