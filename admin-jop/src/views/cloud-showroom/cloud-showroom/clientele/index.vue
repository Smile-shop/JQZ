<template>
  <article class="client-index-box">
    <!-- 搜索栏 -->
    <div class="client-search">
      <el-button type="primary" @click="addOpenDialog(1)">新增</el-button>
      <el-button type="primary" @click="settingAuth">设置</el-button>
      <div class="searchAddTime">
        <div class="searchAddTime-item">加入时间查询:</div>
        <div class="searchAddTime-item">
          <el-date-picker
            v-model="searchData.timer"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </div>
      <div class="searchAdd-entry">
        <el-select v-model="searchData.registSource" placeholder="选择账户来源">
          <el-option label="全部" value=" "></el-option>
          <el-option label="小程序" value="小程序"></el-option>
          <el-option label="后台录入" value="后台录入"></el-option>
        </el-select>
      </div>
      <div class="searchAdd-status">
        <el-select v-model="searchData.accessStatus" placeholder="选择访问状态">
          <el-option label="全部" value=" "></el-option>
          <el-option label="可访问" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </div>
      <div class="client-search-box">
        <!-- 地区：<el-select v-model="searchData.district" placeholder="地区">
                <el-option
                  v-for="item in areaOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
        </el-select>-->
        <!-- 地区： -->
        <!-- <el-cascader v-model="cityValue" :options="areaOptions" class="client-cascader"></el-cascader> -->
        <!-- 是否审核：<el-select v-model="value" placeholder="选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
        </el-select>-->
        <!-- 分配状态： -->
        <!-- <el-select v-model="searchData.status" placeholder="选择">
          <el-option label="已分配" value="1"></el-option>
          <el-option label="未分配" value="0"></el-option>
        </el-select>-->
        <el-input class="search-input" v-model="searchData.keyword" placeholder="输入名称，负责人，手机号进行搜索"></el-input>
        <el-button class="search-ok" @click="getCustomerQuery" type="primary">查询</el-button>
        <el-button @click="resetMethod" type="info" class="button-style">重置</el-button>
      </div>
    </div>
    <!-- 表格数据 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      class="table-wrapper"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" label="选择" width="55"></el-table-column>
      <el-table-column type="index" label="序号" :index="indexMethod" width="120"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="principal" label="负责人"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <!-- <el-table-column prop="province" label="地区">
        <template slot-scope="scope">
          <span>{{scope.row.province + scope.row.city + scope.row.district}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="ratio" label="价格倍率"></el-table-column>
      <!-- <el-table-column
        prop="isCheck"
        label="是否审核"
        width="120">
      </el-table-column>-->
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="registSource" label="账户来源"></el-table-column>
      <el-table-column prop="createTime" label="加入时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | momentFilter()}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="最后更改时间">
        <template slot-scope="scope">
          <span>{{scope.row.modifyTime | momentFilter()}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="remark" label="访问状态"></el-table-column> -->
      <!-- <el-table-column
        prop="sonCount"
        label="子账号数量"
        width="120">
      </el-table-column>-->
      <el-table-column prop="accessStatus" label="访问状态" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.accessStatus == 0">可访问</span>
          <span v-if="scope.row.accessStatus == 1">禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作" width="120">
        <template slot-scope="scope">
          <!-- <span
            v-if="scope.row.status === 0"
            class="opertion-text"
            @click="addOpenDialog(3, scope.row)"
          >分配账号</span> -->
          <!-- <span v-else-if="scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 0"> -->
            <span>
            <span class="opertion-text" @click="addOpenDialog(2, scope.row)">编辑</span>
            <!-- <span  class="opertion-text" @click="editDialog">
              禁用
            </span>-->
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="client-footer" style="margin-top: 20px">
      <el-button @click="toggleSelection(tableData)" type="primary" class="button-style">全选</el-button>
      <el-button @click="settingPrice">批量设置价格倍率</el-button>
      <el-button @click="settingStatus">批量设置访问状态</el-button>
    </div>
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
        :total="tableTotal"
      ></el-pagination>
    </div>
    <!-- 添加客户主账号 -->
    <el-dialog
      class="dialog-wrapper"
      :title="isEdit === 1 ? '添加客户主账号' : '编辑主账号'"
      width="30%"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form :model="formTag" ref="formTag" :rules="rules">
        <el-form-item label="客户名称：" :label-width="formLabelWidth" prop="customerName">
          <el-input
            v-model.trim="formTag.customerName"
            placeholder="请输入客户名称"
            auto-complete="off"
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人：" :label-width="formLabelWidth" prop="principal">
          <el-input v-model="formTag.principal" placeholder="请输入负责人" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="formTag.phone" placeholder="请输入手机号码" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item class="price-box" label="价格倍率：" :label-width="formLabelWidth" prop="ratio">
          <el-input v-model="formTag.ratio" placeholder="请输入价格倍率"></el-input>
          <span class="price-text">可填范围0.1-10，0.1即一折</span>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="formTag.remark" placeholder="请输入备注" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="账号状态：" :label-width="formLabelWidth" prop="remark">
          <template>
            <el-radio-group v-model="formTag.accessStatus">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <!-- <el-form-item label="创建子账号：" :label-width="formLabelWidth" prop="tagStaus">
          <template>
            <el-radio-group v-model="formTag.tagStaus">
              <el-radio :label="1">需要审核</el-radio>
              <el-radio :label="0">不需要</el-radio>
          </el-radio-group>
          </template>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateBasisData">确 定</el-button>
      </div>
    </el-dialog>
    <JqzConfirm :setting.sync = "status" :title="title" :show="showConfirm" @close="closeConfirm" @sure="sureConfirm" />
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Model } from 'vue-property-decorator'
import {
  getCustomerAdd,
  getCustomerEdit,
  getCustomerList,
  getCustomerQuery,
  getQueryAddress,
  setUserAuth,
  batchSetPriceOrStatus,
  findDefault,
} from '@/api/super-crm/cloud-showroom-clientele'
import JqzConfirm from './component/confirm.vue'
import { set } from 'vue/types/umd'
@Component({
  components: {
    JqzConfirm,
  },
})
export default class ClientIndex extends Vue {
  // 当前页
  private title: string = ''
  private showConfirm: boolean = false
  private status: number = 1 // 1设置 2倍率 3状态
  private timer: any = ''
  private currentPage: number = 1
  private pageSize: number = 10
  private tableTotal: number = 0
  // 添加客户主账号
  private dialogFormVisible: boolean = false
  private formLabelWidth: string = '150px'
  private cityValue = []
  private isEdit = 1 // 1 主账号 | 0 分配账号 编辑
  private formTag = {
    customerName: '',
    principal: '',
    phone: '',
    ratio: '',
    remark: '',
    status: 1,
    createTime: '',
    modifyTime: '',
    accessStatus: 0,
    registSource: '',
    // tagStaus: 1,
  }
  private rules = {
    customerName: [{ required: true, message: '请输入客户名称' }],
    principal: [{ required: false, message: '请输入负责人' }],
    phone: [{ required: true, message: '请输入手机号码' }],
    ratio: [{ required: true, message: '请输入价格倍率' }],
    // tagStaus: [{required: true}],
  }
  // 地区
  private areaOptions = [
    {
      value: 'zhinan',
      label: '指南',
      children: [
        {
          value: 'shejiyuanze',
          label: '设计原则',
          children: [
            {
              value: 'yizhi',
              label: '一致',
            },
            {
              value: 'fankui',
              label: '反馈',
            },
            {
              value: 'xiaolv',
              label: '效率',
            },
            {
              value: 'kekong',
              label: '可控',
            },
          ],
        },
      ],
    },
  ]
  private value: string = ''
  // 表格数据
  private tableData = []
  // 搜索数据
  private searchData = {
    timer: '',
    keyword: '',
    city: '',
    district: '',
    province: '',
    registSource: '',
    status: '',
    accessStatus: '',
  }
  private multipleSelection: any = []
  private allSelect: boolean = false
  private magnification: number = 0

  mounted() {
    this.getCustomerList()
    this.getQueryAddress()
  }
  // 关闭弹框
  private closeConfirm() {
    this.showConfirm = false
  }
  // 更新页面的数据
  private updatePage(val: any, type: number) {
    const arr = this.multipleSelection
    const list = this.tableData
    list.map((item: any) => {
      arr.forEach((ite: any) => {
        if (item.customerId === ite.customerId) {
          if (type === 1) {
            item.ratio = val
          } else {
            item.status = val
          }
        }
      });
    })

    this.tableData = list
  }
  // 批量设置倍率或访问状态
  private async batchChangeStatusOrRatio(val: any, type: number) {
    console.log('状态', val)
    console.log(this.multipleSelection)
    const params: any = {}
    params.customerIds = this.multipleSelection.map((item: any) => item.customerId)
    params.setType = type
    params.setValue = Number(val)
    const res: any = await batchSetPriceOrStatus(params)
    const { code } = res
    if (code === 0) {
      this.$message.success('设置成功')
      this.updatePage(val, type)
    }
  }
  // 保存设置
  private async saveSetting(data: any) {
    const params: any = {}
    params.autoEnter = data.auto
    params.accessPermition = data.allUser
    params.defaultRate = data.allUser === 1 ? Number(data.backInput) : 1
    const res: any  = await setUserAuth(params)
    const { code } = res
    if (code === 0) {
      this.$message.success('设置成功')
      this.getCustomerList()
    }
  }
  // 获取值弹出层填写值
  private sureConfirm(val: any) {
    console.log('获得填价格倍率值', val)
    const { setting, ratio, status } = val
    if (setting) {
      console.log('设置')
      this.saveSetting(setting)
    } else if (ratio) {
      console.log('倍率')
      const type: number = 1
      this.batchChangeStatusOrRatio(ratio, type)
    } else {
      console.log('状态')
      const type: number = 2
      this.batchChangeStatusOrRatio(status, type)
    }
    this.closeConfirm()
  }
  // private isFocus() {
  //   alert('事件触发')
  // }
  // private check(val: string) {
  //   alert(val)
  // }
  // 开启弹窗
  private openConfirm(text: string, status: number) {
    this.title = text
    this.status = status
    this.showConfirm = true
  }
  // 索引
  private indexMethod(index: any) {
    return index + this.pageSize * (this.currentPage - 1) + 1
  }
  // 检测可以设置批量
  private checkBatch() {
    let result = false
    const num = this.multipleSelection
    if (num.length > 0) {
      result = true
    }
    return result
  }
  // 设置批量价格
  private settingPrice() {
    const togo = this.checkBatch()
    if (togo) {
      console.log('设置价格')
      const text: string = '价格倍率'
      const status: number = 2
      this.openConfirm(text, status)
    } else {
      this.tipSelected()
    }
  }
  // 设置批量状态
  private settingStatus() {
    const togo = this.checkBatch()
    if (togo) {
      console.log('设置状态')
      const text: string = '访问状态'
      const status: number = 3
      this.openConfirm(text, status)
    } else {
      this.tipSelected()
    }
  }
  // 提示需要选中
  private tipSelected() {
     this.$message({
          message: '请至少选中一条',
          type: 'warning'
      });
  }
  // 查询客户列表数据
  private getCustomerList() {
    const params = {
      page: {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      },
    }
    getCustomerList(params).then((res: any) => {
      if (res.code === 0) {
        this.tableData = res.replyData.list ? res.replyData.list : []
        this.tableTotal = res.replyData.total
      }
    })
  }
  // 查询地区信息
  private getQueryAddress() {
    getQueryAddress().then((res: any) => {
      if (res.code === 0) {
        this.areaOptions = res.data.map((item: any, index: any) => {
          return {
            label: item.name,
            value: item.name,
            children:
              item.city instanceof Array
                ? item.city.map((item: any) => {
                    return {
                      value: item.name,
                      label: item.name,
                    }
                  })
                : [],
          }
        })
      }
    })
  }
  // 搜索
  private getCustomerQuery() {
    const transSearch = JSON.parse(JSON.stringify(this.searchData))
    transSearch.province = this.cityValue ? this.cityValue[0] : ''
    transSearch.city = this.cityValue ? this.cityValue[1] : ''
    transSearch.startTime = this.searchData.timer ? this.searchData.timer[0] : ''
    transSearch.endTime = this.searchData.timer ? this.searchData.timer[1] : ''
    transSearch.registSource = this.searchData.registSource === ' ' ? '' : this.searchData.registSource === '' ? '' : this.searchData.registSource
    transSearch.accessStatus = this.searchData.accessStatus === ' ' ? '' : this.searchData.accessStatus === '' ? '' : Number(this.searchData.accessStatus)
    const params = {
      data: transSearch,
      page: {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      },
    }
    getCustomerList(params).then((res: any) => {
      if (res.code === 0) {
        this.tableData = res.replyData.list ? res.replyData.list : []
        this.tableTotal = res.replyData.total
      }
    })
  }
  // 新增
  private addOpenDialog(val: any, item: any) {
    this.dialogFormVisible = true
    this.isEdit = val
    if (val === 2 || val === 3) {
      // 浅拷贝
      this.formTag = Object.assign({}, item)
    }
  }
  // 设置
  private settingAuth() {
    console.log('设置')
    const text: string = '设置'
    const status: number = 1
    this.openConfirm(text, status)
  }
  // 分配/编辑主账号
  private getCustomerEdit() {
    const transForm = JSON.parse(JSON.stringify(this.formTag))
    transForm.status = Number(transForm.accessStatus) + 1
    getCustomerEdit(transForm).then((res: any) => {
      if (res.code === 0) {
        this.$message({
          message: '分配/编辑主账号成功',
          type: 'success',
        })
        // 关闭弹窗
        this.dialogFormVisible = false
        // 刷新列表
        this.getCustomerList()
        // 清空表单内容
        this.formTag.remark = ''
        this.formTag.ratio = ''
        this.formTag.phone = ''
        this.formTag.principal = ''
        this.formTag.customerName = ''
      } else {
        this.$message({
          message: '分配/编辑主账号失败',
          type: 'error',
        })
      }
    })
  }
  // 检测负责人
  @Watch('formTag.principal')
  private onchange() {
    if (this.formTag.status === 0) {
      if (this.formTag.principal) {
        this.formTag.status = 1
      }
    }
  }
  // 添加客户主账号的方法
  private getCustomerAdd() {
    const transForm = JSON.parse(JSON.stringify(this.formTag))
    transForm.status = Number(transForm.accessStatus) + 1
    getCustomerAdd(transForm).then((res: any) => {
      if (res.code === 0) {
        this.$message({
          message: '添加客户主账号成功',
          type: 'success',
        })
        // 关闭弹窗
        this.dialogFormVisible = false
        // 刷新列表
        this.getCustomerList()
        // 清空表单内容
        this.formTag.remark = ''
        this.formTag.ratio = ''
        this.formTag.phone = ''
        this.formTag.principal = ''
        this.formTag.customerName = ''
      } else {
        this.$message({
          message: '添加客户主账号失败',
          type: 'error',
        })
      }
    })
  }
  // 重置
  private resetMethod() {
    this.searchData.keyword = ''
    this.searchData.city = ''
    this.searchData.district = ''
    this.searchData.province = ''
    this.searchData.status = ''
    this.searchData.timer = ''
    this.searchData.registSource = ''
    this.searchData.accessStatus = ''
    this.cityValue = []
    this.getCustomerList()
  }
  // 全选方法
  private toggleSelection(rows: any) {
    if (rows) {
      rows.forEach((row: any) => {
        const elem: any = this.$refs.multipleTable
        elem.toggleRowSelection(row)
      })
    }
  }
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  // 关闭弹窗
  private handleClose() {
    this.dialogFormVisible = false
    this.removeRule()
    this.formTag.remark = ''
    this.formTag.ratio = ''
    this.formTag.phone = ''
    this.formTag.principal = ''
    this.formTag.customerName = ''
    this.getCustomerList()
  }
  // 去除验证结果
  private removeRule() {
    const ele: any = this.$refs.formTag
    ele.resetFields()
  }
  // 验证手机号
  private phoneRule(val: string) {
    const r = /^[1][0-9]{10}$/g // 匹配11位纯数字，1开
    if (!r.test(val)) {
      this.formTag.phone = ''
      this.$message({
        message: '手机号输入有误',
        type: 'error',
      })
      return
    }
  }

  // 添加客户主账号 确定按钮
  private updateBasisData() {
    const ele: any = this.$refs.formTag
    ele.validate((valid: any, obj: any) => {
      if (!valid) {
        return false
      } else {
        // 验证价格倍率正则
        const regex = /^(0\.([1-9]{1,4})|\d\.[0-9]{1,4}|[1-9]|10)$/
        const result = regex.test(this.formTag.ratio)
        if (!result) {
          this.$message({
            message: '价格倍率可填范围0.1-10',
            type: 'error',
          })
          return
        }
        if (this.isEdit === 1 || this.isEdit === 3) {
          this.getCustomerAdd()
        } else {
          this.getCustomerEdit()
        }
      }
    })
    if (this.formTag.phone) {
      this.phoneRule(this.formTag.phone)
    }
  }
  // 每页
  private handleSizeChange(val: any) {
    this.getCustomerQuery()
  }
  // 当前页
  private handleCurrentChange(val: any) {
    this.getCustomerQuery()
  }
}
</script>

<style lang="scss">
.client-index-box {
  min-width: 1550px;
  overflow: auto;
  .client-search {
    display: flex;
    align-items: center;
    .searchAddTime {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin: 0 10px;
      .searchAddTime-item {
        display: flex;
        align-items: center;
        .selecte-item {
          display: inline-block;
        }
      }
    }
    .searchAdd-entry {
      margin: 0 20px;
    }
    .searchAdd-status {
      margin: 0 20px;
    }
    .client-search-box {
      float: right;
      .search-input {
        width: 256px;
        .el-input__inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
      .search-ok {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        height: 40px;
        line-height: 0.6;
      }
      .el-select {
        margin-right: 10px;
      }
      .el-input--suffix .el-input__inner {
        width: 120px;
      }
      .client-cascader .el-input__inner {
        width: 170px;
      }
    }
  }
  .table-wrapper {
    margin-top: 20px;
    .has-gutter {
      tr {
        th {
          background: #f2f5f8;
        }
      }
    }
    .opertion-text {
      color: #3e3ef4;
      cursor: pointer;
    }
  }
  .client-footer {
    display: inline-block;
    .el-button {
      margin-right: 20px;
    }
    .el-select {
      margin-right: 16px;
    }
  }
  .pagination-box {
    float: right;
    position: relative;
    padding: 50px 0 10px;
    .el-pagination {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  .dialog-wrapper {
    .el-input__inner {
      width: 218px;
    }
    .price-box {
      .el-input {
        width: 140px;
      }
      .el-input__inner {
        width: 140px;
      }
      .price-text {
        margin-left: 20px;
      }
    }
    .el-dialog__header::after {
      position: absolute;
      top: 52px;
      right: 20px;
      left: 20px;
      content: '';
      height: 1px;
      -webkit-transform: scaleY(0.7);
      transform: scaleY(0.7);
      background-color: #e9e9e9;
    }
  }
  .el-dialog__footer {
    text-align: center;
    .dialog-footer {
      .el-button {
        padding: 12px 150px;
      }
    }
  }
  .button-style {
    background: #f7f7f7;
    border: 1px solid #e9e9e9;
    span {
      color: #666;
    }
  }
}
</style>