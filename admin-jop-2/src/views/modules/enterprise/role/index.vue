<template>
  <page-wrapper>
    <template #header-extra>
      <a-button
        type="primary"
      >
        <router-link
          v-permission:add
          to="/enterprise/role/create-or-edit"
        >
          创建角色
        </router-link>
      </a-button>
    </template>
    <a-table
      :columns="data.columns"
      :data-source="data.roles"
      :pagination="data.pagination"
      row-key="id"
      @change="tableChange"
      :scroll="{ x: 'max-content' }"
    >
      <template #enabled="text">
        {{text === 'Y' ? '启用' : '未启用'}}
      </template>
      <template #operation="id, item">
        <router-link
          v-permission:update
          :to="{
            path: '/enterprise/role/create-or-edit',
            query: {
              id
            }
          }"
        >
          修改
        </router-link>
        <a-divider type="vertical" />
        <a-popconfirm
          v-permission:enable
          v-if="item.enabled === 'Y'"
          title="确定要停用吗"
          @confirm="switchStatus({
            enabled: 'N',
            id,
          })"
        >
          <a href="javascript:;">停用</a>
        </a-popconfirm>
        <a-popconfirm
          v-permission:enable
          v-else
          title="确定要启用吗"
          @confirm="switchStatus({
            enabled: 'Y',
            id,
          })"
        >
          <a href="javascript:;">启用</a>
        </a-popconfirm>
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
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, onActivated } from '@vue/composition-api';
import { queryRolePage, delRoleById, updateEnableRole } from '@/api/modules/enterprise/role';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'EnterpriseRole',
  setup() {
    // 表单数据
    const data = reactive({
      datasForm: {
        enabled: '',
        id: '',
        name: '',
        remark: '',
      },
      roles: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal(total: number) {
          return `共${total}条`
        },
        showSizeChanger: true
      },
      columns: [
        {
          title: '角色名称',
          dataIndex: 'name',
        },
        {
          title: '描述',
          dataIndex: 'remark',
        },
        {
          title: '启用',
          dataIndex: 'enabled',
          scopedSlots: { customRender: 'enabled' },
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
        },
        {
          title: '创建人',
          dataIndex: 'createName',
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
        },
        {
          title: '修改人',
          dataIndex: 'updateName',
        },
        {
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      data: [],
    });

    async function getDatas() {
      const body = {
        ...data.datasForm,
        curPage: data.pagination.current,
        pageSize: data.pagination.pageSize,
      };

      const res = await queryRolePage(body);
      data.pagination.total = res.totalRecord;
      data.roles = res.records;
    }

    async function switchStatus(options: {
      enabled: string;
      id: string;
    }) {
      const body = options;

      const res = await updateEnableRole(body);
      message.success('修改成功');
      getDatas();
    }

    // 删除数据
    async function deleteData(id: string) {
      const body = id;
      await delRoleById(body);
      message.success('删除成功');
      getDatas();
    }

    function tableChange(pagination: any, filters: any, sorter: any) {
      const { current, pageSize } = pagination;

      data.pagination.current = current;
      data.pagination.pageSize = pageSize;
      getDatas();
    }

    function init() {
      getDatas();
    }

    onMounted(() => {
      init();
    });

    onActivated(() => {
      init();
    })

    return {
      data,
      deleteData,
      tableChange,
      updateEnableRole,
      switchStatus,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
