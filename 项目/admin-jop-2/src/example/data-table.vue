<template>
  <page-wrapper>
    <!-- 头部右边 -->
    <template #header-extra>
      <a-button
        type="primary"
        @click="showAddOrUpdateDataDialog('add')"
      >
        创建
      </a-button>
    </template>
    <!-- 表格组件 -->
    <page-table>
      <template #buttons>
        <a-button>
          添加
        </a-button>
        <a-button>
          删除
        </a-button>
      </template>
      <!-- 查询表单 -->
      <template #form>
        <a-form-model
          ref="queryFormModel"
          layout="inline"
          :model="data.datasForm"
        >
          <a-form-model-item prop="topic">
            <a-input placeholder="消息主题" v-model="data.datasForm.topic" />
          </a-form-model-item>
          <a-form-model-item prop="kind">
            <a-select placeholder="消息主题" allowClear v-model="data.datasForm.kind">
              <a-select-option value="AMQP">
                AMQP
              </a-select-option>
              <a-select-option value="MQTT">
                MQTT
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="启用" prop="enabled">
            <a-radio-group v-model="data.addOrUpdataDataForm.enabled">
              <a-radio value="Y">
                是
              </a-radio>
              <a-radio value="N">
                否
              </a-radio>
            </a-radio-group>
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
      <!-- 表格 -->
      <a-table
        :columns="data.columns"
        :data-source="data.datas"
        :pagination="data.pagination"
        row-key="id"
        @change="tableChange"
      >
        <template #enabled="text">
          {{text === 'Y' ? '启用' : '未启用'}}
        </template>
        <template #operation="id, item">
          <a href="javascript:;" @click="showAddOrUpdateDataDialog('update', item)">修改</a>
          <a-divider type="vertical" />
          <router-link
            append
            :to="{
              path: 'detail',
              query: {
                id,
              }
            }"
          >
            详情
          </router-link>
          <a-divider type="vertical" />
          <a-popconfirm
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
        <a-form-model-item label="处理URL" prop="handleUrl">
          <a-input v-model="data.addOrUpdataDataForm.handleUrl" />
        </a-form-model-item>
        <a-form-model-item label="应用类型" prop="kindId">
          <a-select allowClear v-model="data.addOrUpdataDataForm.kindId">
            <a-select-option>
              1
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="产品" prop="prodCodeList">
          <a-checkbox-group v-model="data.addOrUpdataDataForm.prodCodeList">
            <a-checkbox>
              2
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item label="启用" prop="enabled">
          <a-radio-group v-model="data.addOrUpdataDataForm.enabled">
            <a-radio value="Y">
              是
            </a-radio>
            <a-radio value="N">
              否
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="data.addOrUpdataDataForm.remark" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';
import {
  addRole,
  getRoleById,
  queryRolePage,
  updateRole,
  delRoleById,
} from '@/api/modules/enterprise/role/index';
import { message } from 'ant-design-vue';
import PageTable from '@/layout/page-table.vue';

export default defineComponent({
  components: {
    PageTable,
  },
  setup() {
    // 表单数据
    const data = reactive({
      addOrUpdata: 'add',
      addOrUpdataDataForm: {
        enabled: 'Y',
        handleUrl: '',
        kind: 'AMQP',
        logEnabled: 'Y',
        remark: '',
        topic: '',
      },
      addOrUpdataDataFormRules: {
        handleUrl: [
          {
            required: true,
            message: '请输入该字段',
            trigger: 'blur',
          },
        ],
        topic: [
          {
            required: true,
            message: '请输入该字段',
            trigger: 'blur',
          },
        ],
        logEnabled: [
          {
            required: true,
            message: '请选择该字段',
            trigger: 'change',
          },
        ],
        kind: [
          {
            required: true,
            message: '请选择该字段',
            trigger: 'change',
          },
        ],
        enabled: [
          {
            required: true,
            message: '请选择该字段',
            trigger: 'change',
          },
        ],
      },
      isShowAddOrUpdateDataDialog: false,
      datasForm: {
        enabled: undefined,
        handleUrl: '',
        kind: '',
        logEnabled: '',
        remark: '',
        topic: '',
        id: '',
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
          title: '处理URL',
          dataIndex: 'handleUrl',
        },
        {
          title: '消息类型',
          dataIndex: 'kind',
        },
        {
          title: '开启记录日志',
          dataIndex: 'logEnabled',
        },
        {
          title: '消息主题',
          dataIndex: 'topic',
        },
        {
          title: '启用',
          dataIndex: 'enabled',
          scopedSlots: { customRender: 'enabled' },
        },
        {
          title: '备注',
          dataIndex: 'remark',
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

      const res = await queryRolePage(body);
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
        enabled: 'Y',
        handleUrl: '',
        kind: 'AMQP',
        logEnabled: 'Y',
        remark: '',
        topic: '',
      };
      data.isShowAddOrUpdateDataDialog = false;
    }

    // 添加数据
    async function addData() {
      await formModel.value.validate();
      const body = {
        ...data.addOrUpdataDataForm,
      };
      await addRole(body);
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
      await updateRole(body);
      message.success('修改成功');
      hideAddOrUpdateDataDialog();
      getDatas();
    }

    // 删除数据
    async function deleteData(id: string) {
      const body = id;
      await delRoleById(body);
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

<style lang="scss" scope>
</style>
