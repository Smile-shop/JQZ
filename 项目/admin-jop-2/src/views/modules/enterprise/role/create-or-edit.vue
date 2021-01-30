<template>
  <page-wrapper>
    <template #header-extra>
      <a-button
        type="primary"
        @click="submit"
      >
        提交
      </a-button>
    </template>
    <a-card
      title="基本信息设置"
    >
      <a-form-model
        :model="data.form"
        :rules="data.rules"
        ref="formModel"
        :labelCol="{ span: 3 }"
        :wrapperCol="{ span: 7 }"
      >
        <a-form-model-item label="角色名称" prop="name">
          <a-input :max-length="10" v-model="data.form.name" />
        </a-form-model-item>
        <a-form-model-item label="角色描述" prop="remark">
          <a-input :max-length="100" v-model="data.form.remark" />
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card
      title="权限设置"
      :style="{
        marginTop: '15px'
      }"
    >
      <template #extra>
        <a-select
          @change="getRoleProjects"
          :allowClear="true"
          placeholder="选择复用角色"
          style="width: 200px"
        >
          <a-select-option
            v-for="item of data.roles"
            :key="item.id"
            :value="item.id"
          >
            {{item.name}}
          </a-select-option>
        </a-select>
      </template>
      <a-tabs :default-active-key="0" tab-position="left">
        <a-tab-pane
          v-for="(item, index) of data.projects"
          :key="index"
          :tab="item.name"
        >
          <menus
            :menus="[data.projects[index]]"
          >
          </menus>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';
import router from '@/router';
import {
  queryRolePrivilegeMenuList,
} from '@/api/modules/enterprise/role/menu';
import {
  addRole as addRoleReq,
  updateRole as updateRoleReq,
  queryAllRoleList,
  getRoleById,
} from '@/api/modules/enterprise/role/index';
import { message } from 'ant-design-vue';
import Menus from './components/menus.vue';

export default defineComponent({
  components: {
    Menus,
  },
  setup() {
    const formModel = ref();
    // 表单数据
    const data = reactive({
      type: 'add',
      roleID: '',
      roles: [],
      form: {
        name: '',
        remark: '',
        privilegeFeatureList: [],
        privilegeMenuList: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
        ],
      },
      projects: [],
    });

    // 获取角色信息
    async function getRole() {
      const body = data.roleID;
      const { name, remark } = await getRoleById(body);
      data.form.name = name;
      data.form.remark = remark;
    }

    // 查询所有角色列表
    async function getAllRoles() {
      const body = '';

      const res = await queryAllRoleList(body);
      data.roles = res;
    }

    // 页面显示选择框改变时
    function visibleChange(item: any) {
      const { visible } = item;
      item.visible = visible === 'Y' ? 'N' : 'Y';
    }

    // 查询角色权限
    async function getRoleProjects(id?: string) {
      const body = {
        rid: id || '',
      };

      const res = await queryRolePrivilegeMenuList(body);
      data.projects = res;
    }

    // 提取出权限信息
    function getPermissions() {
      const { privilegeFeatureList, privilegeMenuList } = data.form;
      privilegeFeatureList.length = 0;
      privilegeMenuList.length = 0;
      function forMenus(menus: any[]) {
        menus.forEach((value, index) => {
          const { visible, id, featureList, subMenuList } = value;

          if (visible === 'Y') {
            (privilegeMenuList as any[]).push({
              menuId: id,
              visible,
            });
          }

          (featureList as any[]).forEach((value, index) => {
            const { id, enabled } = value;

            if (enabled === 'Y') {
              (privilegeFeatureList as any[]).push({
                featureId: id,
                enabled,
              });
            }
          });

          if (subMenuList.length) {
            forMenus(subMenuList);
          }
        });
      }

      forMenus(data.projects);
    }

    // 设置页面权限
    function privilegeMenuList() {
      //
    }

    // 添加系统角色表
    async function addRole() {
      await formModel.value.validate();
      getPermissions();
      const body = {
        ...data.form,
      };

      const res = await addRoleReq(body);
      message.success('创建成功');
      router.back();
    }

    // 修改系统角色表
    async function updateRole() {
      await formModel.value.validate();
      getPermissions();
      const body = {
        ...data.form,
        id: data.roleID,
      };

      await updateRoleReq(body);
      message.success('修改成功');
      router.back();
    }

    // 提交
    function submit() {
      if (data.type === 'add') {
        addRole();
      } else {
        updateRole();
      }
    }

    // 初始化
    function init() {
      const { id } = router.currentRoute.query;
      if (id && typeof id === 'string') {
        data.roleID = id;
        data.type = 'update';
        getRoleProjects(id);
        getRole();
      } else {
        getRoleProjects();
      }

      getAllRoles();
    }

    onMounted(() => {
      init();
    });

    return {
      data,
      visibleChange,
      submit,
      formModel,
      getRoleProjects,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
