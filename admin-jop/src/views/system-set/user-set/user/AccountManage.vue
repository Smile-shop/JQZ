<template>
  <article class="account-manage">
    <div class="page-header">
      <div class="title">
        <i class="iconfont icon-zhanghu1"></i>
        账号管理
      </div>
      <div class="name">
        <span class="name">{{user.serverUser.account.companyName}}</span>
        子账号维护
        <span class="id">(企业ID：{{user.serverUser.account.companyKey}})</span>
      </div>
      <div class="number" v-show="user.serverUser.account.jopUserLimit">最大用户数：<span>{{user.serverUser.account.jopUserLimit}}</span></div>
    </div>

    <div class="search-panel">
      <el-select v-model="searchItem.accountGroup" placeholder="请选择用户组" style="width:200px;margin-right:15px">
        <el-option value="" label="全部"></el-option>
        <el-option v-for="item in accountGroupList" :value="item.groupId" :label="item.groupName" :key="item.groupId"></el-option>
      </el-select>
      <el-input v-model="searchItem.accountName" placeholder="请输入用户名" style="width: 200px;margin-right:15px"></el-input>
      <el-select v-model="searchItem.accountPosition" placeholder="请选择职位" style="width:200px;margin-right:15px">
        <el-option value="" label="全部"></el-option>
        <el-option v-for="item in positionList" :value="item.positionId" :label="item.positionName" :key="item.positionId"></el-option>
      </el-select>
      <el-button type="primary" @click="searchAccountList">搜索</el-button>
    </div>

    <div class="content-body">
      <div class="body-left">
        <div class="group-tree">
          <GroupTree :tree="treeData" @handleNode="handleNode" @nodeClick="nodeClick"></GroupTree>
        </div>
        <div class="add-groups">
          <el-input size="small" v-model="createAccountGroupName" placeholder="请输入用户组名称" style="width: 120px;margin-right:10px"></el-input>
          <el-button size="small" type="primary" @click="createAccountGroup">新增组</el-button>
        </div>
      </div>
      <div class="body-right">
        <div class="table-info table-list" v-if="accountPerssionUpdateModal.show">
          <SysTable
            :tableList="accountTableInfo.list"
            :positionList="positionList"
            :accountGroupList="accountGroupList"
            @updateTable="updateTable"
            @accountPerssionUpdate="accountPerssionUpdate"
            @tableSelection="tableSelection"></SysTable>
          <div class="table-page">
            <div class="table-btn">
              <el-dropdown trigger="click">
                <el-button size="small" type="primary">
                  批量操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="tableAllSelectMethods('2')">批量删除</el-dropdown-item>
                  <el-dropdown-item @click.native="tableAllSelectMethods('0')">设为有效</el-dropdown-item>
                  <el-dropdown-item @click.native="tableAllSelectMethods('1')">设为无效</el-dropdown-item>
                  <el-dropdown-item @click.native="tableAllSelectMethods('3')">修改到期时间</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown trigger="click">
                <el-button style="margin-left:10px" size="small" icon="el-icon-plus" type="primary">新增用户<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="newAccountModal.show = true">新增用户</el-dropdown-item>
                  <el-dropdown-item @click.native="showExpPop = true;showType='noupload'">批量导入用户</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
              <el-pagination
                :pager-count="5"
                v-show="accountTableInfo.total > 0"
                background
                layout="total, prev, pager, next, sizes, jumper"
                :page-sizes="[10, 20, 50, 100]"
                :page-size.sync="pageOptions.pageSize"
                @size-change="searchAccountList"
                @current-change="searchAccountList"
                :current-page.sync="pageOptions.current"
                :total="accountTableInfo.total">
              </el-pagination>
          </div>
        </div>

        <div class="table-info" v-else>
          <PerssionEdit :data="accountPerssionUpdateModal.data"></PerssionEdit>
        </div>
      </div>
    </div>

    <PoupBox
      v-model="newAccountModal.show"
      @cancel="newAccountCancel('newAccountModal')"
      title="新增-子账号">
      <el-form slot="body" ref="newAccountModal" :model="newAccountModal" :rules="ruleValidate" label-width="100px">
        <el-form-item label="用户组：" prop="accountGroup">
          <el-select v-model="newAccountModal.accountGroup" style="width:100%" clearable>
            <el-option v-for="item in accountGroupList" :label="item.groupName" :value="item.groupId" :key="item.groupId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限模板：" prop="permissionsTemplatesId">
          <el-select v-model="newAccountModal.permissionsTemplatesId" clearable style="width:100%">
            <el-option v-for="item in temList" :label="item.templateName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名：" prop="loginName">
          <el-input v-model="newAccountModal.loginName" placeholder="用户名" clearable size="large"></el-input>
        </el-form-item>
        <el-form-item label="昵称：" prop="nickName">
          <el-input v-model="newAccountModal.nickName" placeholder="昵称" clearable size="large"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="newAccountModal.password" type="password" placeholder="密码" clearable size="large"></el-input>
        </el-form-item>
        <el-form-item label="职位：" prop="accountPosition">
          <el-select v-model="newAccountModal.accountPosition" clearable style="width:100%">
            <el-option v-for="item in positionList" :label="item.positionName" :value="item.positionId" :key="item.positionId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间：" prop="endTime">
          <el-date-picker type="date" clearable placeholder="到期时间" v-model="newAccountModal.endTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否有效：" prop="status">
          <el-radio-group v-model="newAccountModal.status">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" size="large" @click="newAccountOk('newAccountModal')">确定</el-button>
        <el-button type="ghost" size="large" @click="newAccountCancel('newAccountModal')">取消</el-button>
      </div>
    </PoupBox>
    <PoupBox
      title="修改到期时间"
      @cancel="showEditTime=false;editEndTime=null"
      v-model="showEditTime">
      <el-form slot="body" label-width="100px">
        <el-form-item label="到期时间：">
          <el-date-picker type="date" placeholder="到期时间" v-model="editEndTime"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editBatchAccountTime">确 定</el-button>
        <el-button @click="showEditTime=false;editEndTime=null">取 消</el-button>
      </span>
    </PoupBox>
    <PoupBox
      title="批量导入"
      @cancel="showExpPop=false;showType='noupload'"
      v-model="showExpPop">
      <div slot="body" class="exp-body" v-if="showType==='noupload'">
        <div>一、 下载导入模板，如不符合规则将不予导入。</div>
        <el-button @click="download" type="text">下载导入模板></el-button>
        <div>二、上传数据文件，仅支持*.xlsx。</div>
        <div>三、单次最多可导入100个子账号，批量导入子账号处理时间较长，请耐心等待。</div>
        <div class="exp-body-btn">
          <el-upload
            class="upload-demo"
            ref="upload"
            accept=".xlsx"
            :headers="uploadOpt"
            :action="uploadUrl()"
            show-file-list
            :auto-upload="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :limit="1"
            :on-change="onChange"
            :on-exceed="exceed"
            name="file">
            <el-button size="small" plain icon="el-icon-plus" type="primary">添加文件</el-button>
          </el-upload>
        </div>
      </div>
      <div slot="body" class="total" style="padding: 0 0 30px 30px; font-size: 14px" v-if="showType==='success'">导入成功!</div>
      <div slot="body" style="padding: 0 0 30px 30px" v-if="showType==='err'">
        <div class="total">{{msg}}</div>
        <div class="tips">以下数据格式不匹配或已重复，请检查后重新导入：</div>
        <div class="err">{{errMsg}}</div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="showType==='noupload'">
        <el-button @click="showExpPop=false">取 消</el-button>
        <el-button type="primary" @click="submitUpload" :loading="loading">{{ text }}</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if="showType!=='noupload'">
        <el-button type="primary" @click="showExpPop=false">确 定</el-button>
      </span>
    </PoupBox>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import user from '@/utils/user';
import {
  toUpdateAccountGroup,
  getAccountGroups,
  getAccountPositionList,
  searchAccountList,
  searchAPPlist,
  getAccountWithGroup,
  createAccountGroup,
  createAccountInfo,
  toRemoveAccountGroup,
  delAccountByBatch,
  updateAccountByBatch,
  listPermissionsTemplates } from '@/api/system-set';
import SysTable from './SysTable.vue';
import PerssionEdit from './PerssionEdit.vue';
import GroupTree from './GroupTree.vue';
import PoupBox from '@/components/PoupBox.vue';
import moment from 'moment';

@Component({
  components: {
    GroupTree,
    SysTable,
    PerssionEdit,
    PoupBox
  }
})
export default class AccountManage extends Vue {
  get user() {
    return user;
  }
  get pageWidth() {
    return document.body.clientWidth
  }
  private text = '导 入'
  private showExpPop = false
  private showEditTime = false
  private editEndTime = null
  private searchItem: any = {
    accountGroup: '',
    accountPosition: '',
    accountName: ''
  };
  private accountGroupList = [];
  private positionList = [];
  private createAccountGroupName = '';
  private accountPerssionUpdateModal = {
    show: true,
    data: null
  };
  private pageOptions = {
    current: 1,
    pageSize: 10
  }
  private accountTableInfo = {
    list: [],
    total: 1
  };
  private newAccountModal = {
    permissionsTemplatesId: '',
    show: false,
    accountGroup: '',
    accountPosition: '',
    loginName: '',
    nickName: '',
    password: '',
    status: '0',
    endTime: ''
  };
  private ruleValidate = {
    accountGroup: [
      { required: true, message: '用户组不能为空！', trigger: 'blur' }
    ],
    permissionsTemplatesId: [
      { required: false, message: '权限模板不能为空！', trigger: 'blur' }
    ],
    accountPosition: [
      { required: true, message: '职位不能为空！', trigger: 'blur' }
    ],
    loginName: [
      { required: true, message: '用户名不能为空！', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '密码不能为空！', trigger: 'blur' }
    ],
    endTime: [
      { required: true, type: 'date', message: '到期时间不能为空！', trigger: 'blur' }
    ]
  };
  private treeData = [];
  private multipleSelection = [];
  private temList = []
  private loading = false
  private showType = 'noupload'
  private errMsg = ''
  private msg = ''
  private fileList = []

  private mounted() {
    this.getAccountGroups();
    this.getTemList();
    this.getAccountPositionList();
    this.searchAccountList();
    this.getAccountWithGroup();
  }
  private exceed() {
    this.$message.error('最多只能导入一个文件，请删除后再添加')
  }
  private download() {
    window.open(`${VUE_APP_BASE_API}/jop-admin-web/permissionTemplate/downloadPermissionsTemplates`)
  }
  // 上传模板header设置
  get uploadOpt() {
    return {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey,
      accountId: user.serverUser.account.accountId
    }
  }
  private async getTemList() {
    const res = await listPermissionsTemplates({ page: { pageNum: 1, pageSize: 100 } })
    this.temList = res.data.list
  }
  private onChange(file: any, fileList: any) {
    this.fileList = fileList
  }
  private submitUpload() {
    if (!this.fileList.length) {
      return this.$message.error('请添加文件')
    }
    (this.$refs.upload as any).submit()
    this.loading = true
    this.text = '系统处理中，请耐心等待...'
  }
  private uploadError() {
    this.loading = false
    this.text = '导 入'
    this.$message.error('上传失败，请稍后再试')
  }
  private uploadSuccess(res: any, file: any, fileList: any) {
    if (res.code) {
      this.errMsg = res.msg
      this.msg = res.data
      this.showType = 'err'
    } else if (!res.code) {
      this.showType = 'success'
    }
    this.loading = false
    this.text = '导 入'
    this.searchAccountList()
    this.getAccountWithGroup();
  }
  // 上传模板路径
  private uploadUrl(): string {
    return `${VUE_APP_BASE_API}/jop-admin-web/permissionTemplate/importBatchAccount`;
  }
  private nodeClick(data: any) {
    this.searchItem = {
      accountGroup: data.accountId ? '' : data.groupId,
      accountPosition: '',
      accountName: data.accountId ? data.accountName : ''
    }
    this.searchAccountList();
  }

  // 获取用户组列表
  private getAccountGroups() {
    getAccountGroups({accountId: user.serverUser.account.accountId}).then((res: any) => {
      this.accountGroupList = res.data ? res.data : [];
    })
  }

  // 获取用户职位列表
  private getAccountPositionList() {
    getAccountPositionList({accountId: user.serverUser.account.accountId}).then((res: any) => {
      this.positionList = res.data ? res.data : [];
    })
  }

  // table编辑、删除刷新
  private updateTable() {
    this.searchAccountList();
    this.getAccountWithGroup();
  }

  // table权限管理
  private accountPerssionUpdate(data: any) {
    this.accountPerssionUpdateModal.show = false,
    this.accountPerssionUpdateModal.data = data;
  }

  // table表单选中
  private tableSelection(list: any) {
    this.multipleSelection = list;
  }

  // 批量操作
  private tableAllSelectMethods(data: any) {
    if (this.multipleSelection.length > 0) {
      if (data === '2') {
        this.delAccountByBatch(this.multipleSelection);
      } else if (data === '3') {
        this.showEditTime = true
      } else {
        this.updateAccountByBatch(this.multipleSelection, data);
      }
    } else {
      this.$message({
        type: 'info',
        message: '请选择！'
      });
    }
  }
  // 批量修改到期时间
  private async editBatchAccountTime() {
    const listAccount = this.multipleSelection.map((item: any) => {
      return {
        accountId: item.accountId,
        endTime: moment(this.editEndTime).format('YYYY-MM-DD')
      }
    })
    let res: any
    res = await updateAccountByBatch({ listAccount })
    if (!res.code) {
      this.multipleSelection.forEach((item: any) => item.endTime = moment(this.editEndTime).format('YYYY-MM-DD'))
      this.showEditTime = false
      this.$message.success('修改成功')
    }
  }
  // 新增用户组
  private createAccountGroup() {
    if (this.createAccountGroupName) {
    const params = {
      accountId: user.serverUser.account.accountId,
      groupName: this.createAccountGroupName,
      sort: this.accountGroupList.length
    }
    createAccountGroup(params).then((res: any) => {
      this.createAccountGroupName = '';
      this.getAccountWithGroup();
      this.getAccountGroups();
    })
    } else {
      this.$message('用户组名称不能为空！')
    }
  }

  private searchAccountList() {
    const accountListParams = {
      page: {
        pageNum: this.pageOptions.current,
        pageSize: this.pageOptions.pageSize
      },
      params: {
        positionId: this.searchItem.accountPosition,
        groupId: this.searchItem.accountGroup,
        accountName: this.searchItem.accountName
      }
    };
    const getAPPParams = {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey,
      channel: 'wx'
    }
    Promise.all([searchAccountList(accountListParams), searchAPPlist(getAPPParams)]).then(([userData, appUser]: any) => {
      if (userData.code === 0 && appUser.code === 0) {
        const list = userData.data ? userData.data.list : [];
        const appUserData = appUser.data || [];
        this.accountTableInfo.list = list.map((p: any) => {
          // 匹配条件由loginName换为accountId
          const findAppUserData = appUserData.find((item: any) => item.accountId.trim() === p.accountId.trim());
          if (findAppUserData) {
            Object.defineProperties(p, {
              id: {
                value: findAppUserData.id,
                writable: true,
                enumerable: true
              },
              jopLoginName: {
                value: findAppUserData.jopLoginName,
                writable: true,
                enumerable: true
              },
              phone: {
                value: findAppUserData.phone,
                writable: true,
                enumerable: true
              }
            })
          }
          return p;
        })
        this.accountTableInfo.total = userData.data && userData.data.total;
        this.accountPerssionUpdateModal.show = true;
      }
    }).catch(err => {
      console.log(err);
    })
  }
  // 新增用户
  private newAccountOk(name: any) {
    (this.$refs[name] as any).validate((valid: any) => {
      if (valid) {
        this.newAccountMethods(name);
      }
    })
  }
  private newAccountCancel(name: any) {
    (this.$refs[name] as any).resetFields();
    this.newAccountModal.show = false;
  }
  private newAccountMethods(name: any) {
    const params = {
      accountId: user.serverUser.account.accountId,
      loginName: this.newAccountModal.loginName,
      nickName: this.newAccountModal.nickName,
      password: this.newAccountModal.password,
      accountName: this.newAccountModal.loginName,
      isAdmin: '0',
      status: this.newAccountModal.status,
      endTime: moment(this.newAccountModal.endTime).format('YYYY-MM-DD'),
      groupId: this.newAccountModal.accountGroup,
      positionId: this.newAccountModal.accountPosition,
      companyName: user.serverUser.account.companyName,
      permissionsTemplatesId: this.newAccountModal.permissionsTemplatesId
    }
    createAccountInfo(params).then((res: any) => {
      this.getAccountWithGroup();
      this.newAccountModal.show = false;
      this.newAccountCancel(name);
      this.searchAccountList();
    })
  }

  // 获取用户分组详细列表
  private getAccountWithGroup() {
    getAccountWithGroup({accountId: user.serverUser.account.accountId}).then((res: any) => {
      const list = res.data ? res.data : [];
      this.treeData = list.sort((a: any, b: any) => {
        return a.sort > b.sort;
      })
    })
  }
  // 树形图节点操作（改/删）
  private handleNode(data: any) {
    if (data.type == 'remove') {
      if (data.node.listAPG.length > 0) {
        // 有子账号的情况下不能删除
        this.$message('该用户组下存在子账号，不能删除！');
      } else {
        this.$confirm(`确定要删除${data.node.groupName}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.toRemoveAccountGroup(data.node);
        }).catch(() => {
          console.log('cancel')
        });
      }
    }
    if (data.type == 'edit') {
      this.toUpdateAccountGroup(data);
    }
  }
  // 节点删除
  private toRemoveAccountGroup(node: any) {
    const params = {
      accountId: user.serverUser.account.accountId,
      groupId: node.groupId
    }
    toRemoveAccountGroup(params).then((res: any) => {
      this.getAccountGroups();
      this.getAccountWithGroup();
      this.$message({
        type: 'success',
        message: '删除成功！'
      });
    })
  }
  // 节点编辑
  private toUpdateAccountGroup(node: any) {
    console.log(node)
    const params = {
      accountId: user.serverUser.account.accountId,
      groupId: node.node.groupId,
      groupName: node.name
    }
    toUpdateAccountGroup(params).then((res: any) => {
      this.getAccountGroups();
      this.getAccountWithGroup();
      this.$message({
        type: 'success',
        message: '修改成功！'
      });
    })
  }

  // 批量删除
  private delAccountByBatch(list: any) {
    const listAccount = list.map((p: any) => {
      return {accountId: p.accountId}
    })
    delAccountByBatch({listAccount}).then((res: any) => {
      this.updateTable();
      this.$message({
        type: 'success',
        message: '删除成功！'
      });
    })
  }
    // 批量修改用户状态
  private updateAccountByBatch(list: any, status: any) {
    const listAccount = list.map((p: any) => {
      return {
        accountId: p.accountId,
        status
      }
    })
    updateAccountByBatch({listAccount}).then((res: any) => {
      this.updateTable();
      this.$message({
        type: 'success',
        message: '修改成功！'
      });
    })
  }
}
</script>

<style lang="scss" scoped>
.account-manage {
  .page-header {
    display: flex;
    height: 45px;
    border-bottom: 1px solid #dddddd;
    .title {
      font-size: 22px;
      padding: 2px 15px;
      color: #333333;
      > i {
        font-size: 22px;
      }
    }
    .name {
      flex-grow: 1;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      .name {
        color: #6699ff;
      }
      .id {
        color: #6699ff;
        font-weight: 100;
      }
    }
    .number {
      font-size: 14px;
      padding-top: 12px;
      > span {
        color: #6699ff;
        font-weight: bold;
      }
    }
  }
  .search-panel {
    padding: 16px;
    border-bottom: 1px solid #dddddd;
  }
  .content-body {
    width: 100%;
    display: flex;
    .body-left {
      width: 220px;
      border-right: 1px solid #dddddd;
      height: calc(100vh - 230px);
      position: relative;
      .add-groups {
        padding: 8px;
        text-align: center;
        position: absolute;
        bottom: 0;
      }
      .group-tree {
        height: calc(100% - 50px);
        overflow: auto;
      }
    }
    .body-right {
      width: calc(100% - 220px);
      height: calc(100vh - 280px);
      overflow: auto;
      .table-info {
        .table-page {
          margin-left: 12px;
          display: flex;
          justify-content: space-between;
        }
      }
      .table-list {
        .table-page {
          position: fixed;
          bottom: 25px;
          width: calc(100% - 500px);
          padding: 8px 30px;
          z-index: 1000;
        }
      }
    }
  }
  .exp-body{
    font-size: 14px;
    padding: 0 30px;
    line-height: 40px;
    &-btn{
      text-align: center;
    }
  }
  .total,.tips,.err{
    font-size: 14px;
    line-height: 40px;
  }
  .total{
    font-weight: bold;
  }
}
</style>
