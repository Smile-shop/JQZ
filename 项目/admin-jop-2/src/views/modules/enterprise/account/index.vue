<template>
  <page-wrapper>
    <!-- 头部右边 -->
    <template #header-extra>
      <a-button
        v-permission:addAppUser
        type="primary"
        @click="showAddOrUpdateDataDialog('add')"
      >
        添加APP用户
      </a-button>
      <a-button
        v-permission:showAppInvitationCode
        @click="data.isShowQRCodeDialog = true"
      >
        展示APP邀请码
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
          <a-form-model-item prop="phone">
            <a-input placeholder="手机号" v-model="data.datasForm.phone" />
          </a-form-model-item>
          <a-form-model-item prop="status">
            <a-select placeholder="状态" allowClear v-model="data.datasForm.status">
              <a-select-option value="Y">
                已接受
              </a-select-option>
              <a-select-option value="W">
                等待接收
              </a-select-option>
              <a-select-option value="R">
                已拒绝
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
        row-key="id"
        @change="tableChange"
        :row-selection="{ selectedRowKeys: data.selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 'max-content' }"
      >
        <template #enabled="text">
          {{text === 'Y' ? '启用' : '未启用'}}
        </template>
        <template #operation="id">
          <a-popconfirm
            v-permission:deleteAppUser
            title="移除后，该账号将从此列表删除；并失去App中企业授权的功能、数据权限。"
            @confirm="deleteData(id)"
          >
            <a href="javascript:;">移除</a>
          </a-popconfirm>
        </template>
        <template #footer>
          <a-popconfirm
            title="移除后，该账号将从此列表删除；并失去App中企业授权的功能、数据权限。"
            @confirm="deleteData(data.selectedRowKeys)"
            :disabled="data.selectedRowKeys.length == 0"
          >
            <a-button
              :disabled="data.selectedRowKeys.length == 0"
            >
              批量删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </page-table>
    <select-staff
      type="checkbox"
      v-model="data.isShowAddOrUpdateDataDialog"
      @confirm="addData"
    />
    <a-modal
      v-model="data.isShowQRCodeDialog"
      title="邀请码"
      :footer="null"
      :width="600"
    >
      <ul class="invite-dialog">
        <li class="invite-1">
          <div class="title">
            邀请方式一：扫描二维码
          </div>
          <div class="content">
            <p>使用“金千枝平台App”注册后扫描此二维码确认加入企业；或使用微信等扫码工具扫描，验证手机后，下载App即可使用。</p>
            <img :src="data.qrCodeUrl" alt="二维码">
          </div>
        </li>
        <li class="invite-2">
          <div class="title">
            邀请方式二：邀请链接
          </div>
          <div class="content">
            <p>复制链接发给成员，打开链接验证手机后，下载App即可使用。</p>
            <div class="link-box">
              <div class="link">
                邀请链接：<a :href="data.inviteLink" target="_blank">{{data.inviteLink}}</a>
              </div>
              <a-button
                type="primary"
                @click="copyLink"
              >
                复制链接
              </a-button>
            </div>
          </div>
        </li>
      </ul>
    </a-modal>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';
import {
  queryRequestUserPage,
  saveBatchRequestUsers,
  delBatchRequestUserByIds,
  getInviteQrcode,
  getInviteUrl,
} from '@/api/modules/enterprise/account/index';
import { message } from 'ant-design-vue';
import PageTable from '@/layout/page-table.vue';
import SelectStaff from '@/components/select-data/staff.vue';

export default defineComponent({
  name: 'EnterpriseAccount',
  components: {
    PageTable,
    SelectStaff,
  },
  setup() {
    // 表单数据
    const data = reactive({
      isShowQRCodeDialog: false,
      qrCodeUrl: '',
      inviteLink: '',
      addOrUpdata: 'add',
      addOrUpdataDataForm: {
      },
      addOrUpdataDataFormRules: {
      },
      isShowAddOrUpdateDataDialog: false,
      datasForm: {
        phone: undefined,
        status: undefined,
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
          title: '员工姓名',
          dataIndex: 'empName',
        },
        {
          title: '工号',
          dataIndex: 'empNo',
        },
        {
          title: '部门',
          dataIndex: 'deptName',
        },
        {
          title: '手机号(登录账号)',
          dataIndex: 'phone',
        },
        {
          title: '邀请时间',
          dataIndex: 'createTime',
        },
        {
          title: '账号状态',
          dataIndex: 'statusStr',
        },
        {
          title: '工作状态',
          dataIndex: 'empStatusStr',
        },
        {
          title: '邀请人',
          dataIndex: 'epUnameReq',
        },
        {
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'operation' },
        },
      ],
    });
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

      const res = await queryRequestUserPage(body);
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

    // 添加数据
    async function addData(value: any) {
      const body = value;
      await saveBatchRequestUsers(body);
      message.success('添加成功');
      getDatas();
    }

    // 多选
    function onSelectChange(selectedRowKeys: never[], b: any) {
      data.selectedRowKeys = selectedRowKeys;
    }

    // 删除数据
    async function deleteData(id: string | string[]) {
      const body = typeof id === 'string' ? [id] : id;
      await delBatchRequestUserByIds(body);
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

    // 获取数据
    async function getInviteQRCode(isFirstPage = false) {
      const body = {};

      const res: Response = await getInviteQrcode(body);
      const blob = await res.blob();
      const file = new File([blob], '二维码', {
        type: 'image/png'
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          data.qrCodeUrl = fileReader.result;
        }
      }
    }

    // 获取邀请链接
    async function getInviteLink(isFirstPage = false) {
      const body = {};

      const res: Response = await getInviteUrl(body);
      const text = await res.text();
      data.inviteLink = text;
    }

    // 复制链接
    async function copyLink() {
      if (data.inviteLink) {
        try {
          await navigator.clipboard.writeText(data.inviteLink);
          message.success('复制成功');
        } catch (error) {
          message.warning('您的浏览器不支持复制, 请下载edge或者chrome浏览器');
        }
      } else {
        message.warning('没有链接');
      }
    }

    onMounted(() => {
      getDatas();
      getInviteQRCode();
      getInviteLink();
    });

    return {
      data,
      resetQuery,
      getDatas,
      addData,
      showAddOrUpdateDataDialog,
      queryFormModel,
      deleteData,
      tableChange,
      copyLink,
      onSelectChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.invite-dialog {
  > li {
    &:not(:last-of-type) {
      margin-bottom: 20px;
    }

    > .title {
      padding: 15px;
      background-color: #EBEEF5;
      font-weight: bold;
      color: #263446;
    }

    > .content {
      display: grid;
      grid-auto-flow: row;
      gap: 40px;
      padding: 15px;

      > p {
        color: #80869D;
        line-height: 2;
      }

      > img {
        justify-self: center;
        width: 220px;
        height: 220px;
        border: 10px solid #EBEEF5;
      }

      > .link-box {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: center;
        gap: 10px;

        > .link {
          padding: 5px 15px;
          background:rgba(247,248,250,1);
          border:1px solid rgba(214,221,236,1);
        }
      }
    }
  }
}
</style>
