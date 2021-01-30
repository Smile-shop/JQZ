<template>
  <a-modal
    title="选择员工"
    :visible="value"
    :maskClosable="false"
    :width="900"
    @cancel="onCancel"
    @ok="onConfirm"
  >
    <page-table size="small">
      <template #form>
        <a-form-model
          ref="queryFormModel"
          layout="inline"
          :model="data.datasForm"
          @submit="getDatas"
          @submit.native.prevent
        >
          <a-form-model-item prop="deptId">
            <a-tree-select
              v-model="data.datasForm.deptId"
              allowClear
              treeDefaultExpandAll
              placeholder="选择部门"
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
      <a-table
        :columns="data.columns"
        :data-source="data.datas"
        :pagination="data.pagination"
        :row-selection="rowSelection"
        row-key="id"
        @change="tableChange"
        :scroll="{ x: 'max-content' }"
      >
        <!-- <template
          #operation="id, item"
        >
          <a v-if="type === 'single'" @click="onConfirm(item)" href="javascript:;">选择</a>
        </template> -->
      </a-table>
    </page-table>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, watch, computed } from '@vue/composition-api';
import PageTable from '@/layout/page-table.vue';
import {
  queryOrg,
  queryUserPage,
} from '@/api/modules/enterprise/organization/index';

export default defineComponent({
  components: {
    PageTable,
  },
  props: {
    type: {
      type: String,
      default: 'radio',
    },
    value: Boolean,
  },
  setup(props, context) {
    // 表单数据
    const data = reactive({
      selectedRowKeys: [],
      organization: [],
      datasForm: {
        deptId: undefined,
        empNo: '',
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
          title: '手机号码',
          dataIndex: 'phone',
        },
        {
          title: '状态',
          dataIndex: 'statusStr',
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
          title: '角色',
          dataIndex: 'rname',
        },
      ],
    });
    const queryFormModel = ref();

    // 表格选中
    function onSelectChange(selectedRowKeys: never[]) {
      data.selectedRowKeys = selectedRowKeys;
    }

    // 获取组织
    async function getOrganization(isFirstPage = false) {
      const body = '';

      const res = await queryOrg(body);
      data.datasForm.deptId = res.deptId;
      data.organization = [res] as any;
    }

    // 重置查询表单
    function resetQuery() {
      data.selectedRowKeys = [];
      queryFormModel.value.resetFields();
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

    function onCancel() {
      context.emit('input', false);
      context.emit('cancel');
    }

    function onConfirm() {
      context.emit('input', false);
      if (data.selectedRowKeys.length) {
        context.emit('confirm', data.selectedRowKeys);
      }
    }

    function tableChange(pagination: any, filters: any, sorter: any) {
      const { current, pageSize } = pagination;

      data.pagination.current = current;
      data.pagination.pageSize = pageSize;
      getDatas();
    }

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: data.selectedRowKeys,
        onChange: onSelectChange,
        type: props.type
      }
    })

    watch(() => props.value, async (value) => {
      if (value) {
        resetQuery()
        await getOrganization();
        getDatas(true);
      }
    });

    return {
      data,
      resetQuery,
      getDatas,
      onCancel,
      onConfirm,
      queryFormModel,
      onSelectChange,
      tableChange,
      rowSelection,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
