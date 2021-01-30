<template>
  <page-wrapper>
    <!-- 头部右边 -->
    <template #header-extra>
      <a-button
        v-permission:addStaff
        type="primary"
        @click="showAddOrUpdateDataDialog('add')"
      >
        添加员工资料
      </a-button>
    </template>
    <div class="components">
      <organization
        type="edit"
        :organizationTree="data.organization"
        @selected="onSelectedOrganization"
        @update="getOrganization"
      />
      <!-- 表格组件 -->
      <page-table>
        <!-- 查询表单 -->
        <template #form>
          <a-form-model
            ref="queryFormModel"
            layout="inline"
            :model="data.datasForm"
          >
            <a-form-model-item prop="name">
              <a-input placeholder="员工姓名" v-model="data.datasForm.name" />
            </a-form-model-item>
            <a-form-model-item prop="phone">
              <a-input placeholder="手机号码" v-model="data.datasForm.phone" />
            </a-form-model-item>
            <a-form-model-item prop="status">
              <a-select placeholder="状态" allowClear v-model="data.datasForm.status">
                <a-select-option value="A">
                  在职
                </a-select-option>
                <a-select-option value="D">
                  离职
                </a-select-option>
                <a-select-option value="P">
                  试用期
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item>
              <a-button-group>
                <a-button
                  @click="getDatas(true)"
                  type="primary"
                >
                  查询
                </a-button>
                <a-button
                  @click="resetQuery"
                >
                  重置
                </a-button>
              </a-button-group>
            </a-form-model-item>
          </a-form-model>
        </template>
        <!-- 表格 -->
        <a-table
          :columns="data.columns"
          :data-source="data.datas"
          :pagination="data.pagination"
          :row-selection="{ selectedRowKeys: data.selectedRowKeys, onChange: onSelectChange }"
          row-key="id"
          :scroll="{ x: 'max-content' }"
          @change="tableChange"
        >
          <template #operation="id, item">
            <a
              v-permission:dataPermission
              @click="showDataPermissionDialog(id)"
              href="javascript:;"
            >
              数据权限
            </a>
            <a-divider type="vertical" />
            <a
              v-permission:updateStaff
              href="javascript:;"
              @click="showAddOrUpdateDataDialog('update', item)"
            >
              修改
            </a>
          </template>
          <template #footer>
            <a-dropdown :disabled="data.selectedRowKeys.length == 0" :trigger="['click']">
              <a-button>
                设置工作状态 <i class="iconfont icon-down"></i>
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item @click="batchUpdateStatus('A')">
                  <a href="javascript:;">在职</a>
                </a-menu-item>
                <a-menu-item @click="batchUpdateStatus('D')">
                  <a href="javascript:;">离职</a>
                </a-menu-item>
                <a-menu-item @click="batchUpdateStatus('P')">
                  <a href="javascript:;">试用期</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-dropdown
              :trigger="['click']"
              :disabled="data.selectedRowKeys.length == 0"
            >
              <a-button>
                设置角色 <i class="iconfont icon-down"></i>
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="item of data.roles"
                  :key="item.id"
                >
                  <a @click="batchUpdateRole(item.id)" href="javascript:;">{{item.name}}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-tree-select
              :disabled="data.selectedRowKeys.length == 0"
              allowClear
              treeDefaultExpandAll
              placeholder="设置部门"
              :tree-data="data.organization"
              :replaceFields="{
                label: 'name',
                value: 'deptId',
                children: 'childOrgs',
                key: 'deptId'
              }"
              style="width: 150px"
              @change="batchUpdateDepartment"
            >
              设置部门
            </a-tree-select>
            <a-button
              :disabled="data.selectedRowKeys.length == 0"
              @click="data.isShowSelectStaffDialog = true"
            >
              复制其它账号数据权限
            </a-button>
          </template>
        </a-table>
      </page-table>
    </div>
    <!-- 弹窗 -->
    <a-modal
      :title="data.addOrUpdata === 'add' ? '添加' : '修改'"
      :visible="data.isShowAddOrUpdateDataDialog"
      :maskClosable="false"
      @ok="data.addOrUpdata === 'add' ? addData() : updateData()"
      @cancel="hideAddOrUpdateDataDialog"
    >
      <a-form-model
        :model="data.addOrUpdataDataForm"
        :rules="data.addOrUpdataDataFormRules"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 20 }"
        ref="formModel"
      >
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="data.addOrUpdataDataForm.name" />
        </a-form-model-item>
        <a-form-model-item label="工号" prop="empNo">
          <a-input type="number" v-model.number="data.addOrUpdataDataForm.empNo" />
          <p>工号不可重复；可用于登录JMP软件、EMP软件</p>
        </a-form-model-item>
        <a-form-model-item label="手机号码" prop="phone">
          <a-input v-model="data.addOrUpdataDataForm.phone" />
          <p>请确认输入正确号码，手机号码不可重复</p>
        </a-form-model-item>
        <a-form-model-item label="性别" prop="sex">
          <a-radio-group v-model="data.addOrUpdataDataForm.sex">
            <a-radio value="M">
              男
            </a-radio>
            <a-radio value="F">
              女
            </a-radio>
            <a-radio value="U">
              忽略
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="部门" prop="deptId">
          <a-tree-select
            v-model="data.addOrUpdataDataForm.deptId"
            allowClear
            treeDefaultExpandAll
            :tree-data="data.organization"
            :replaceFields="{
              label: 'name',
              value: 'deptId',
              children: 'childOrgs',
              key: 'deptId'
            }"
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="职位" prop="titleId">
          <a-select allowClear v-model="data.addOrUpdataDataForm.titleId">
            <a-select-option
              v-for="item of data.titles"
              :key="item.id"
            >
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="职责" prop="dutyMask">
          <a-checkbox-group
            v-model="data.addOrUpdataDataForm.dutyMaskStr"
          >
            <a-checkbox
              v-for="item of data.dutys"
              :key="item.value"
              :value="item.value"
            >
              {{item.name}}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item label="工作状态" prop="status">
          <a-radio-group v-model="data.addOrUpdataDataForm.status">
            <a-radio value="A">
              在职
            </a-radio>
            <a-radio value="D">
              离职
            </a-radio>
            <a-radio value="P">
              试用期
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="角色" prop="rid">
          <!-- <router-link
            v-if="data.addOrUpdata === 'update'"
            :to="{
              path: '/enterprise/role/create-or-edit',
              query: {
                id: data.addOrUpdataDataForm.rid
              }
            }"
          >
            {{data.addOrUpdataDataForm.rname}}
          </router-link> -->
          <a-select
            allowClear
            v-model="data.addOrUpdataDataForm.rid"
          >
            <a-select-option
              v-for="item of data.roles"
              :key="item.id"
            >
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="密码" prop="pwd">
          <a-input :type="data.addOrUpdata === 'update' ? 'password' : 'text'" v-model="data.addOrUpdataDataForm.pwd" />
          <p>设置后即可登录JMP软件、EMP后台；清空密码后不可登录</p>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <data-permission-dialog
      :id="data.selectedID"
      v-model="data.isShowDataPermissionDialog"
    />
    <select-staff
      v-model="data.isShowSelectStaffDialog"
      @confirm="batchCopyPermission"
    />
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api';
import { message } from 'ant-design-vue';
import { confirmMessage } from '@/utils/modal';
import {
  addUser,
  batchCopyUserDataPermission,
  batchUpdateUserDept,
  batchUpdateUserRole,
  batchUpdateUserStatus,
  getUserById,
  getUserByPhone,
  queryUserList,
  queryUserPage,
  updateUser,
  queryOrg,
  saveCopyDataPermission,
  querySelectDutyMask,
} from '@/api/modules/enterprise/organization/index'
import { queryAllRoleList } from '@/api/modules/enterprise/role';
import { querySelectUserTitle } from '@/api/modules/enterprise/position';
import PageTable from '@/layout/page-table.vue';
import Organization from './components/organization.vue';
import DataPermissionDialog from './components/data-permission-dialog.vue';
import SelectStaff from '@/components/select-data/staff.vue';

export default defineComponent({
  name: 'EnterpriseOrganization',
  components: {
    PageTable,
    Organization,
    DataPermissionDialog,
    SelectStaff,
  },
  setup() {
    // 表单数据
    const data = reactive({
      dutys: [],
      isShowSelectStaffDialog: false,
      selectedID: '',
      isShowDataPermissionDialog: false,
      titles: [],
      roles: [],
      organization: [],
      addOrUpdata: 'add',
      addOrUpdataDataForm: {
        deptId: undefined,
        empNo: undefined,
        name: '',
        phone: '',
        pwd: '',
        rid: undefined,
        sex: 'U',
        status: 'A',
        titleId: undefined,
        deptName: '',
        dutyMaskStr: [],
      },
      addOrUpdataDataFormRules: {
        name: [
          {
            required: true,
            message: '请输入该字段',
            trigger: 'blur',
          },
        ],
        phone: [
          {
            required: true,
            message: '请输入该字段',
            trigger: 'blur',
          },
        ],
        sex: [
          {
            required: true,
            message: '请选择该字段',
            trigger: 'change',
          },
        ],
        deptId: [
          {
            required: true,
            message: '请选择该字段',
            trigger: 'change',
          },
        ],
        titleId: [
          {
            required: true,
            message: '请选择该字段',
            trigger: 'change',
          },
        ],
        status: [
          {
            required: true,
            message: '请选择该字段',
            trigger: 'change',
          },
        ],
      },
      isShowAddOrUpdateDataDialog: false,
      datasForm: {
        deptId: '',
        empNo: undefined,
        name: '',
        phone: '',
        status: undefined,
        titleId: undefined
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal(total: number) {
          return `共${total}条`
        },
        showSizeChanger: true
      },
      datas: [],
      selectedRowKeys: [],
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
        },
        {
          title: '工号',
          dataIndex: 'empNo',
        },
        {
          title: '性别',
          dataIndex: 'sex',
          customRender(text: string) {
            switch (text) {
              case 'M':
                return '男'
              case 'F':
                return '女'
              default:
                return '未知'
            }
          }
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
        },
        {
          title: '部门',
          dataIndex: 'deptName',
        },
        {
          title: '职位',
          dataIndex: 'titleName',
        },
        {
          title: '工作状态',
          dataIndex: 'statusStr',
        },
        {
          title: '系统密码',
          dataIndex: 'setAccountPwd',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
        },
        {
          title: '创建人',
          dataIndex: 'createdUname',
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
        },
        {
          title: '修改人',
          dataIndex: 'updateUname',
        },
        {
          title: '角色',
          dataIndex: 'rname',
        },
        {
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'operation' },
          fixed: 'right',
        },
      ],
    });
    const formModel = ref();
    const queryFormModel = ref();

    // 获取组织
    async function getOrganization() {
      const body = '';

      const res = await queryOrg(body);
      data.organization = [res] as any;
    }

    // 获取数据
    async function getDatas(isFirstPage = false) {
      if (isFirstPage) {
        data.pagination.current = 1;
      }

      const body = {
        ...data.datasForm,
        curPage: data.pagination.current,
        pageSize: data.pagination.pageSize,
      };

      const res = await queryUserPage(body);
      data.pagination.total = res.totalRecord;
      data.datas = res.records;
    }

    // 添加或者修改数据
    function showAddOrUpdateDataDialog(type: 'add' | 'update', item?: any) {
      data.addOrUpdata = type;
      if (type === 'update') {
        data.addOrUpdataDataForm = {
          ...item,
        };

        if (item.setAccountPwd === '未设置') {
          data.addOrUpdataDataForm.pwd = '';
        } else {
          data.addOrUpdataDataForm.pwd = item.id
        }
      }
      data.isShowAddOrUpdateDataDialog = true;
    }

    // 隐藏添加或者修改数据对话框
    function hideAddOrUpdateDataDialog() {
      formModel.value.resetFields();
      data.addOrUpdataDataForm = {
        deptId: undefined,
        empNo: undefined,
        name: '',
        phone: '',
        pwd: '',
        rid: undefined,
        sex: 'U',
        status: 'A',
        titleId: undefined,
        deptName: '',
        dutyMaskStr: [],
      };
      data.isShowAddOrUpdateDataDialog = false;
    }

    // 添加数据
    async function addData() {
      await formModel.value.validate();
      const body = {
        ...data.addOrUpdataDataForm,
      };
      await addUser(body);
      message.success('添加成功');
      hideAddOrUpdateDataDialog();
      getDatas();
    }

    // 修改数据
    async function updateData() {
      await formModel.value.validate();
      const body = {
        ...data.addOrUpdataDataForm,
      };
      await updateUser(body);
      message.success('修改成功');
      hideAddOrUpdateDataDialog();
      getDatas();
    }

    // 重置查询表单
    function resetQuery() {
      queryFormModel.value.resetFields();
    }

    // 员工多选
    function onSelectChange(selectedRowKeys: never[], b: any) {
      data.selectedRowKeys = selectedRowKeys;
    }

    // 部门选中
    async function onSelectedOrganization(value: any) {
      data.datasForm.deptId = value.deptId;
      getDatas(true);
    }

    // 获取职位列表
    async function getTiles() {
      const body = '';
      const res = await querySelectUserTitle(body);
      data.titles = res;
    }

    // 获取职责列表
    async function getDutys() {
      const body = '';
      const res = await querySelectDutyMask(body);
      data.dutys = res;
    }

    // 获取角色列表
    async function getRiles() {
      const body = '';
      const res = await queryAllRoleList(body);
      data.roles = res;
    }

    // 批量修改工作状态
    async function batchUpdateStatus(value: any) {
      const res = await confirmMessage({
        title: '确定要批量修改工作状态吗'
      });
      const body = {
        status: value,
        uids: data.selectedRowKeys
      }

      await batchUpdateUserStatus(body);
      message.success('批量设置工作状态成功');
      getDatas();
    }

    // 批量修改角色
    async function batchUpdateRole(value: any) {
      const res = await confirmMessage({
        title: '确定要批量修改角色吗'
      });
      const body = {
        rid: value,
        uids: data.selectedRowKeys
      }

      await batchUpdateUserRole(body);
      message.success('批量设置角色成功');
      getDatas();
    }

    // 批量修改部门
    async function batchUpdateDepartment(value: any) {
      const res = await confirmMessage({
        title: '确定要批量修改部门吗'
      });
      const body = {
        deptId: value,
        uids: data.selectedRowKeys
      }

      await batchUpdateUserDept(body);
      message.success('批量设置部门成功');
      getDatas();
    }

    // 批量复制权限
    async function batchCopyPermission(values: string) {
      const res = await confirmMessage({
        title: '确定要批量复制数据权限吗'
      });

      const body = {
        targetUids: data.selectedRowKeys,
        uid: values[0]
      };

      await saveCopyDataPermission(body);
      message.success('批量复制数据权限成功');
    }

    function tableChange(pagination: any, filters: any, sorter: any) {
      const { current, pageSize } = pagination;

      data.pagination.current = current;
      data.pagination.pageSize = pageSize;
      getDatas();
    }

    function showDataPermissionDialog(id: string) {
      data.selectedID = id;
      data.isShowDataPermissionDialog = true;
    }

    onMounted(() => {
      getRiles();
      getTiles();
      getDutys();
      getOrganization();
    });

    return {
      data,
      resetQuery,
      formModel,
      getDatas,
      addData,
      updateData,
      showAddOrUpdateDataDialog,
      hideAddOrUpdateDataDialog,
      queryFormModel,
      onSelectChange,
      onSelectedOrganization,
      batchUpdateStatus,
      batchUpdateRole,
      batchUpdateDepartment,
      tableChange,
      showDataPermissionDialog,
      batchCopyPermission,
      getOrganization,
    };
  },
});
</script>

<style lang="scss" scoped>
.components {
  display: grid;
  grid-template-columns: max-content auto;
  gap: 20px;
}
</style>
