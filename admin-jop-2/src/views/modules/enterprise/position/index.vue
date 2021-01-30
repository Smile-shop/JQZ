<template>
  <page-wrapper>
    <!-- 头部右边 -->
    <template #header-extra>
      <a-button
        v-permission:add
        type="primary"
        @click="showAddOrUpdateDataDialog('add')"
      >
        创建
      </a-button>
    </template>
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
            <a-input placeholder="职位名称" v-model="data.datasForm.name" />
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
        row-key="id"
        @change="tableChange"
        :scroll="{ x: 'max-content' }"
      >
        <template #operation="id, item">
          <a
            v-permission:update
            href="javascript:;"
            @click="showAddOrUpdateDataDialog('update', item)"
          >
          修改</a>
          <a-divider type="vertical" />
          <a-popconfirm
            v-permission:delete
            title="确定要删除吗"
            @confirm="deleteData(id)"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </page-table>
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
        <a-form-model-item label="职位名称" prop="name">
          <a-input :max-length="10" v-model="data.addOrUpdataDataForm.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';
import {
  addUserTitle,
  getUserTitleById,
  queryUserTitlePage,
  updateUserTitle,
  delUserTitleById,
} from '@/api/modules/enterprise/position/index';
import { message } from 'ant-design-vue';
import PageTable from '@/layout/page-table.vue';

export default defineComponent({
  name: 'EnterprisePosition',
  components: {
    PageTable,
  },
  setup() {
    // 表单数据
    const data = reactive({
      addOrUpdata: 'add',
      addOrUpdataDataForm: {
        name: ''
      },
      addOrUpdataDataFormRules: {
        name: [
          {
            required: true,
            message: '请输入该字段',
            trigger: 'blur',
          },
        ],
      },
      isShowAddOrUpdateDataDialog: false,
      datasForm: {
        name: '',
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
          title: '职位名称',
          dataIndex: 'name',
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
          dataIndex: 'updateUName',
        },
        {
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'operation' },
        },
      ],
    });
    const formModel = ref();
    const queryFormModel = ref();

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

      const res = await queryUserTitlePage(body);
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
      }
      data.isShowAddOrUpdateDataDialog = true;
    }

    // 隐藏添加或者修改数据对话框
    function hideAddOrUpdateDataDialog() {
      formModel.value.resetFields();
      data.addOrUpdataDataForm = {
        name: ''
      };
      data.isShowAddOrUpdateDataDialog = false;
    }

    // 添加数据
    async function addData() {
      await formModel.value.validate();
      const body = {
        ...data.addOrUpdataDataForm,
      };
      await addUserTitle(body);
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
      await updateUserTitle(body);
      message.success('修改成功');
      hideAddOrUpdateDataDialog();
      getDatas();
    }

    // 删除数据
    async function deleteData(id: string) {
      const body = id;
      await delUserTitleById(body);
      message.success('删除成功');
      getDatas();
    }

    // 重置查询表单
    function resetQuery() {
      queryFormModel.value.resetFields();
    }

    function tableChange(pagination: any, filters: any, sorter: any) {
      const { current, pageSize } = pagination;

      data.pagination.current = current;
      data.pagination.pageSize = pageSize;
      getDatas();
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
      tableChange,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
