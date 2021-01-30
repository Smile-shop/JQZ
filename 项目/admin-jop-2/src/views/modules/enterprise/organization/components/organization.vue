<template>
  <a-card>
    <organization-tree
      :organization="data.data"
      @add="showAddOrUpdateDataDialog('add', $event)"
      @remove="deleteData"
      @update="showAddOrUpdateDataDialog('update', $event)"
      @selected="$emit('selected', $event)"
      :type="type"
    />
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
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 10 }"
        ref="formModel"
      >
        <a-form-model-item label="部门名称" prop="name">
          <a-input v-model="data.addOrUpdataDataForm.name" />
        </a-form-model-item>
        <a-form-model-item label="所属部门" prop="parentId">
          <a-tree-select
            v-model="data.addOrUpdataDataForm.parentId"
            disabled
            allowClear
            treeDefaultExpandAll
            :tree-data="organizationTree"
            :replaceFields="{
              label: 'name',
              value: 'deptId',
              children: 'childOrgs',
              key: 'deptId'
            }"
          >
          </a-tree-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';
import {
  addDepartment,
  delDepartment,
  queryDepartmentPage,
  updateDepartment,
  queryOrg,
} from '@/api/modules/enterprise/organization/index'
import { message } from 'ant-design-vue';
import OrganizationTree from './organization-tree.vue';
import { confirmMessage } from '@/utils/modal';

export default defineComponent({
  components: {
    OrganizationTree,
  },
  props: {
    type: {
      type: String,
      default: 'select',
    },
    organizationTree: {
      type: Array,
      default: [],
    }
  },
  setup(props, { emit }) {
    // 表单数据
    const data = reactive({
      // 组织框架
      organization: [],
      // 选中的数据
      selectedData: {
        builtin: undefined,
        childOrgs: [],
        deptEmpNum: 0,
        deptId: undefined,
        name: '',
        parentId: '',
        seq: 0
      },
      addOrUpdata: 'add',
      addOrUpdataDataForm: {
        id: undefined,
        name: '',
        parentId: ''
      },
      addOrUpdataDataFormRules: {
        name: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur',
          },
        ],
      },
      isShowAddOrUpdateDataDialog: false,
      datasForm: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal(total: number) {
          return `共${total}条`
        },
        showSizeChanger: true
      },
      data: {
        builtin: undefined,
        childOrgs: [],
        deptEmpNum: 0,
        deptId: undefined,
        name: '',
        parentId: '',
        seq: 0
      },
    });
    const formModel = ref();
    const queryFormModel = ref();

    // 获取数据
    async function getDatas(isFirstPage = false) {
      const body = '';

      const res = await queryOrg(body);
      data.data = res;
      emit('organization', res);
    }

    // 添加或者修改数据
    function showAddOrUpdateDataDialog(type: 'add' | 'update', item?: any) {
      data.addOrUpdata = type;
      data.selectedData = item;
      data.addOrUpdataDataForm.parentId = item.parentId;
      if (type === 'update') {
        data.addOrUpdataDataForm.id = item.deptId;
        data.addOrUpdataDataForm.name = item.name;
      }
      data.isShowAddOrUpdateDataDialog = true;
    }

    // 隐藏添加或者修改数据对话框
    function hideAddOrUpdateDataDialog() {
      formModel.value.resetFields();
      data.addOrUpdataDataForm.name = '';
      data.addOrUpdataDataForm.parentId = '';
      data.addOrUpdataDataForm.id = undefined;
      data.isShowAddOrUpdateDataDialog = false;
    }

    // 添加数据
    async function addData() {
      await formModel.value.validate();
      const body = {
        ...data.addOrUpdataDataForm,
      };
      await addDepartment(body);
      message.success('添加成功');
      hideAddOrUpdateDataDialog();
      getDatas();
      emit('update');
    }

    // 修改数据
    async function updateData() {
      await formModel.value.validate();
      const body = {
        ...data.addOrUpdataDataForm,
      };
      await updateDepartment(body);
      message.success('修改成功');
      hideAddOrUpdateDataDialog();
      getDatas();
      emit('update');
    }

    // 删除数据
    async function deleteData(value: any) {
      await confirmMessage({
        title: '确定要删除该部门吗?',
      })
      const body = value.deptId;
      await delDepartment(body);
      message.success('删除成功');
      getDatas();
      emit('update');
    }

    // 重置查询表单
    function resetQuery() {
      queryFormModel.value.resetFields();
    }

    onMounted(() => {
      getDatas();
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
      deleteData,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
