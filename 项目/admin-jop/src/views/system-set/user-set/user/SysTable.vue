<template>
  <article class="sys-table">
    <el-button @click="setShowItemMethod" size="mini" type="primary" style="margin-bottom:12px">设置显示字段</el-button>
    <el-table
      :data="tableList"
      border
      :height="tableMaxHeight"
      @selection-change="handleSelectionChange"
      style="width: 100%;">
      <el-table-column
        fixed
        type="selection"
        align="center"
        width="45">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        label="用户组"
        v-if="checkedShowItem.includes('用户组')"
        align="center">
        <template slot-scope="scope">
          <el-select size="mini" v-if="scope.$index === editableIndex" v-model="scope.row.groupName" placeholder="请选择">
            <el-option
              v-for="item in accountGroupList"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupName">
            </el-option>
          </el-select>
          <span v-else>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        width="120"
        v-if="checkedShowItem.includes('用户名')"
        align="center">
        <template slot-scope="scope">
          <!-- <el-input v-if="scope.$index === editableIndex" size="small" v-model="scope.row.loginName"></el-input>
          <span v-else>{{ scope.row.loginName }}</span> -->
          <span>{{ scope.row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="昵称"
        v-if="checkedShowItem.includes('昵称')"
        align="center">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === editableIndex" size="small" v-model="scope.row.nickName"></el-input>
          <span v-else>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="密码"
        v-if="checkedShowItem.includes('密码')"
        align="center">
        <template slot-scope="scope">
          <el-input v-if="scope.$index === editableIndex" size="small" v-model="scope.row.password" type="password"></el-input>
          <span v-else>******</span>
        </template>
      </el-table-column>
      <el-table-column
        label="职位"
        v-if="checkedShowItem.includes('职位')"
        align="center">
        <template slot-scope="scope">
          <el-select size="mini" v-if="scope.$index === editableIndex" v-model="scope.row.positionName" placeholder="请选择">
            <el-option
              v-for="item in positionList"
              :key="item.positionId"
              :label="item.positionName"
              :value="item.positionName">
            </el-option>
          </el-select>
          <span v-else>{{ scope.row.positionName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="绑定店员"
        width="200"
        v-if="checkedShowItem.includes('绑定店员')"
        align="center">
        <template slot-scope="scope">
          <el-row :gutter="20" v-if="scope.$index === editableIndex">
            <el-col :span="12">
              <el-select size="mini" v-model="bindShopName" @change="shopSelectChange" placeholder="选择门店">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in shopList"
                  :key="item.shopId"
                  :label="item.shopName"
                  :value="item.shopName">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select size="mini" v-model="scope.row.clerkName" @change="slerSelectChange" placeholder="选择店员">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in salerList"
                  :key="item.cardNum"
                  :label="item.saler"
                  :value="item.cardNum">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <span v-else>{{ scope.row.clerkName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="到期时间"
        v-if="checkedShowItem.includes('到期时间')"
        align="center">
        <template slot-scope="scope">
          <el-date-picker
            style="max-width:130px"
            size="mini"
            v-if="scope.$index === editableIndex"
            v-model="scope.row.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
          <span v-else>{{ new Date(scope.row.endTime) | momentFilter('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效"
        width="80"
        v-if="checkedShowItem.includes('是否有效')"
        align="center">
        <template slot-scope="scope">
          <!-- <el-select size="mini" v-if="scope.$index === editableIndex" v-model="scope.row.status" placeholder="请选择">
            <el-option label="否" value="1"></el-option>
            <el-option label="是" value="0"></el-option>
          </el-select>
          <span v-else>
            <Icon v-if="scope.row.status == '0'" type="checkmark-circled" size="24" color="#6699ff"></Icon>
            <Icon v-else type="close-circled" size="24" color="#eb3941"></Icon>
          </span> -->
          <i v-if="scope.row.status == '0'" class="el-icon-success" style="font-size:24px;color:#6699ff"></i>
          <i v-else class="el-icon-error" style="font-size:24px;color:#eb3941"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="JMP用户代码"
        v-if="checkedShowItem.includes('JMP用户代码')"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jmpUserId }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="JMP密码"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jmpPassword }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        label="APP手机号"
        v-if="checkedShowItem.includes('APP手机号')"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="App注册状态"
        v-if="checkedShowItem.includes('APP手机号')"
        width="100"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone ? '已注册' : '未注册' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="APP使用时间段"
        v-if="checkedShowItem.includes('APP使用时间段')"
        width="200"
        align="center">
        <template slot-scope="scope">
            <!-- :value="[scope.row.appStartTime, scope.row.appEndTime]" -->
          <el-time-picker
            style="width:100%"
            v-model="appUseTime"
            size="mini"
            is-range
            v-if="scope.$index === editableIndex"
            @focus="appUseTimeFocus(scope.row)"
            format="HH:mm"
            value-format="HH:mm"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
          <span v-else>{{ scope.row.appStartTime }}-{{scope.row.appEndTime}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="创建人"
        v-if="checkedShowItem.includes('创建人')"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作时间"
        width="100"
        v-if="checkedShowItem.includes('操作时间')"
        align="center">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.modifyTime) | momentFilter('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="430">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            v-if="scope.$index === editableIndex"
            @click="submitEdit(scope.$index, scope.row)">保存</el-button>
          <el-button
            size="mini"
            v-else
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handlePerssion(scope.$index, scope.row)">权限管理</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            v-if="!scope.row.jmpUserId"
            @click="toJMPBingMethod(scope.$index, scope.row)">绑定JMP</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            v-else
            @click="cancelJMPBingMethod(scope.$index, scope.row)">解绑JMP</el-button>
          <el-button
            v-if="scope.row.phone"
            size="mini"
            type="danger"
            plain
            @click="cancelAPPBingMethod(scope.$index, scope.row)">解绑APP</el-button>
        </template>
      </el-table-column>
    </el-table>

    <PoupBox v-model="setShowItem" width="650" @cancel="setShowItemMethodCancel">
      <div slot="header">
        <span style="font-size:16px;font-weight:normal;padding-right:12px">设置显示字段内容</span>
        <el-checkbox :indeterminate="isIndeterminateShowItem" v-model="checkAllShowItem" @change="handleCheckAllChangeShowItem">全选</el-checkbox>
      </div>
      <div slot="body">
        <el-checkbox-group v-model="checkedShowItem" @change="handleCheckedShowItemChange">
          <el-checkbox style="width:150px;margin:12px 0" v-for="city in showItemList" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="setShowItemMethodOk">确定</el-button>
        <el-button @click="setShowItemMethodCancel">取消</el-button>
      </div>
    </PoupBox>

    <PoupBox v-model="JMPBingInfo.show" @cancel="JMPBingInfo.show = false">
      <div slot="header" style="font-size:14px;font-weight:bold">
        <span>绑定JMP用户</span> -
        <span style="color:#2d8cf0">{{JMPBingInfo.title}}</span>
      </div>
      <div slot="body">
        <div class="account-group-content">
          <div class="title">JMP用户代码:</div>
          <div class="body">
            <el-input v-model="JMPBingInfo.data.jmpUserId" placeholder="JMP用户代码" size="large"></el-input>
          </div>
        </div>
        <div class="account-group-content">
          <div class="title">JMP密码:</div>
          <div class="body">
            <el-input v-model="JMPBingInfo.data.jmpPassword" type="password" placeholder="JMP密码" size="large"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="JMPBingMethod()">确定</el-button>
        <el-button @click="bindCancel()">取消</el-button>
      </div>
    </PoupBox>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import user from '@/utils/user';
import PoupBox from '@/components/PoupBox.vue';
import { getSelectShopList, getSelectSalerList } from '@/api/super-crm/wx-data';
import { JMPBingMethod, toCancelJMPBingMethod, cancelAPPBingMethod, updateAccountInfo, updateJopAccountPwd, deleteAccountInfo } from '@/api/system-set';

@Component({
  components: {
    PoupBox
  }
})
export default class SysTable extends Vue {
  @Prop()
  tableList!: [];
  @Prop()
  positionList!: [];
  @Prop()
  accountGroupList!: [];

  private editableIndex: number = -1;
  private JMPBingInfo = {
    show: false,
    title: '',
    data: {
      accountId: '',
      loginName: '',
      jmpUserId: '',
      jmpPassword: ''
    }
  };
  private setShowItem: boolean = false;
  private showItemList = [
    '用户组',
    '用户名',
    '昵称',
    '密码',
    '职位',
    '绑定店员',
    '到期时间',
    '是否有效',
    'JMP用户代码',
    'APP手机号',
    'APP使用时间段',
    '创建人',
    '操作时间'
  ];
  private checkedShowItem: string[] = [];
  private checkAllShowItem: boolean = false;
  private isIndeterminateShowItem: boolean = false;
  private tableMaxHeight: number = 0;

  private appUseTime = ['00:00', '23:59'];

  private shopList = [];
  private bindShopName = '';
  private salerList = [];
  private saler = null;

  private handleCheckedShowItemChange(value: any) {
    const checkedCount = value.length;
    this.checkAllShowItem = checkedCount === this.showItemList.length;
    this.isIndeterminateShowItem = checkedCount > 0 && checkedCount < this.showItemList.length;
  }

  private handleCheckAllChangeShowItem(val: any) {
    this.checkedShowItem = val ? this.showItemList : [];
    this.isIndeterminateShowItem = false;
  }

  private setShowItemMethod() {
    this.computedSetShowItem();
    this.setShowItem = true;
  }

  private created() {
    this.tableMaxHeight = document.documentElement.clientHeight - 365;
    window.onresize = () => {
      this.tableMaxHeight = document.documentElement.clientHeight - 365;
    }
  }

  private mounted() {
    this.computedSetShowItem();
    getSelectShopList({showStatus: '1'}).then((res: any) => {
      this.shopList = res.data.list || [];
    })
    // 分销商数据test
    this.shopSelectChange('');
  }

  private shopSelectChange(value: string) {
    getSelectSalerList({branchShop: value, companyKey: user.serverUser.account.companyKey}).then((res: any) => {
      this.salerList = JSON.parse(res.data.sales);
    })
  }

  private slerSelectChange(value: string) {
    (this.saler as any) = this.salerList.find((p: any) => p.cardNum == value);
  }

  private computedSetShowItem() {
    const showItemStr = window.localStorage.getItem('tableShowItem');
    if (showItemStr) {
      const showItem = JSON.parse(showItemStr);
      this.checkedShowItem = showItem;
      this.checkAllShowItem = showItem.length === this.showItemList.length;
      this.isIndeterminateShowItem = showItem.length > 0 && showItem.length < this.showItemList.length;
    } else {
      this.checkedShowItem = this.showItemList;
      this.checkAllShowItem = true;
    }
  }

  private setShowItemMethodOk() {
    window.localStorage.setItem('tableShowItem', JSON.stringify(this.checkedShowItem));
    this.setShowItemMethodCancel();
  }

  private setShowItemMethodCancel() {
    this.setShowItem = false;
    this.computedSetShowItem();
  }

  // 取消绑定
  private bindCancel() {
    this.JMPBingInfo = {
      show: false,
      title: '',
      data: {
        accountId: '',
        loginName: '',
        jmpUserId: '',
        jmpPassword: ''
      }
    }
  }
  // 绑定JMP用户
  private toJMPBingMethod(index: any, data: any) {
    this.JMPBingInfo.data.accountId = data.accountId;
    this.JMPBingInfo.data.loginName = data.loginName;
    this.JMPBingInfo.title = data.loginName;
    this.JMPBingInfo.show = true;
  }
  // 绑定JMP用户 确定按钮
  private JMPBingMethod() {
    this.editableIndex = -1;
    if (this.JMPBingInfo.data.jmpUserId === '') {
      this.$message('JMP用户代码不能为空！');
      return
    }
    if (this.JMPBingInfo.data.jmpPassword === '') {
      this.$message('JMP密码不能为空！');
      return
    }
    JMPBingMethod(this.JMPBingInfo.data).then((res: any) => {
      this.$message({
        type: 'success',
        message: '绑定成功！'
      });
      this.bindCancel();
      this.$emit('updateTable');
    })
  }
  // 解绑JMP
  private cancelJMPBingMethod(index: any, data: any) {
    this.editableIndex = -1;
    this.$confirm(`是否确定解绑${data.loginName}JMP账号吗？`, '信息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.toCancelJMPBingMethod(data);
    }).catch(() => {
      console.log('cancel')
    });
  }
  private toCancelJMPBingMethod(data: any) {
    const params = {
      accountId: data.accountId,
      loginName: data.loginName
    }
    toCancelJMPBingMethod(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '解绑成功！'
      });
      this.$emit('updateTable');
    })
  }
  // 解绑APP
  private cancelAPPBingMethod(index: any, data: any) {
    this.editableIndex = -1;
    this.$confirm(`是否确定解绑${data.loginName}APP账号吗？`, '信息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.toCancelAPPBingMethod(data);
    }).catch(() => {
      console.log('cancel')
    });
  }
  private toCancelAPPBingMethod(data: any) {
    const params = {
      ticket: user.serverUser.ticket,
      id: data.id,
      operator: user.serverUser.account.loginName,
      channel: 'wx'
    }
    cancelAPPBingMethod(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '解绑成功！'
      });
      this.$emit('updateTable');
    })
  }
  // 编辑
  private handleEdit(index: any, row: any) {
    this.editableIndex = index;
    this.appUseTime = [row.appStartTime, row.appEndTime]
  }
  // 保存
  private submitEdit(index: any, row: any) {
    const positionInfo = this.positionList.find((p: any) => p.positionName == row.positionName);
    const groupInfo = this.accountGroupList.find((p: any) => p.groupName == row.groupName);
    let saler;
    if (this.saler) {
      saler = this.saler;
    } else {
      if (this.saler === '') {
        saler = null;
      } else {
        if (row.clerkId && row.clerkName) {
          saler = {
            cardNum: row.clerkId,
            saler: row.clerkName
          }
        } else {
          saler = null;
        }
      }
    }
    const params = {
      accountId: row.accountId,
      loginName: row.loginName,
      nickName: row.nickName,
      password: row.password,
      accountName: row.accountName,
      endTime: row.endTime,
      isAdmin: row.isAdmin,
      status: row.status,
      groupId: groupInfo ? (groupInfo as any).groupId : null,
      positionId: positionInfo ? (positionInfo as any).positionId : null,
      appStartTime: this.appUseTime[0],
      appEndTime: this.appUseTime[1],
      clerkId: saler ? (saler as any).cardNum : null,
      clerkName: saler ? (saler as any).saler : null
    }
    updateAccountInfo(params).then((res: any) => {
      this.editableIndex = -1;
      this.$emit('updateTable');
      this.$message({
        type: 'success',
        message: '修改成功！'
      });
      this.saler = null;
      this.bindShopName = '';
      // 修改账户密码（只要有修改）通知app
      if (row.id) {
        updateJopAccountPwd({
          id: row.id,
          channel: 'wx',
          operator: user.serverUser.account.loginName,
          jopLoginName: row.jopLoginName,
          jopPwd: row.password,
          nickName: row.nickName
        });
      }
    })
    .catch(err => {
      this.$message.error(err)
    })
  }
  // 删除
  private handleDelete(index: any, row: any) {
    if (row.jmpUserId) {
      this.$message({
        type: 'warning',
        message: '请先解绑JMP'
      })
      return
    }
    if (row.phone) {
      this.$message({
        type: 'warning',
        message: '请先解绑App'
      })
      return
    }
    this.editableIndex = -1;
    this.$confirm(`是否确定删除${row.loginName}吗？`, '信息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.toDeleteAccount(index, row);
    }).catch(() => {
      console.log('cancel')
    });
  }
  private toDeleteAccount(index: any, row: any) {
    deleteAccountInfo({accountId: row.accountId}).then((res: any) => {
      this.$message({
        type: 'success',
        message: '删除成功！'
      });
      if (row.id) {
        const params = {
          ticket: user.serverUser.ticket,
          id: row.id,
          operator: user.serverUser.account.loginName,
          channel: 'wx'
        }
        cancelAPPBingMethod(params);
      }
      this.$emit('updateTable');
    })
  }
  // 权限管理
  private handlePerssion(index: any, row: any) {
    this.editableIndex = -1;
    this.$emit('accountPerssionUpdate', row);
  }
  // table选中状态
  private handleSelectionChange(val: any) {
    this.editableIndex = -1;
    this.$emit('tableSelection', val);
  }
}
</script>

<style lang="scss" scoped>
.sys-table {
  padding: 12px 28px 12px 12px;
  .el-table {
    font-size: 12px;
  }
  .select-panel-content {
    position: relative;
    .input-div {
      border: 1px solid #dddddd;
      width: 100%;
      height: 28px;
      line-height: 25px;
      border-radius: 5px;
      text-align: left;
      padding: 0 12px;
      background-color: #ffffff;
      cursor: pointer;
    }
    .input-div:hover {
      border: 1px solid #cccccc;
    }
  }
}
.account-group-content {
  display: flex;
  align-items: center;
  .title {
    font-size: 12px;
    width: 100px;
    text-align: right;
    padding: 0 12px;
  }
  .body {
    flex-grow: 1;
  }
}
.account-group-content:first-child {
  margin-bottom: 15px;
}
</style>
