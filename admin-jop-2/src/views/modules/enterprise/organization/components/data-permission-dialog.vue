<template>
  <div class="data-permission-dialog">
    <a-modal
      title="数据权限"
      :visible="value"
      :maskClosable="false"
      :width="900"
      @cancel="onCancel"
      @ok="onConfirm"
    >
      <div class="copy-permission">
        <a-button
          @click="data.isShowSelectStaffDialog = true"
        >
          复制数据权限
        </a-button>
      </div>
      <div class="permission-list">
        <div class="permission-item">
          <div class="left">
            总库
          </div>
          <div class="right">
            <div class="all-checked">
              <a-checkbox
                :checked="isAllChecked(data.permission.location)"
                @change="checkAll(data.permission.location)"
              >
                全选
              </a-checkbox>
            </div>
            <div class="checkbox-group">
              <a-checkbox
                v-for="item of data.permission.location"
                :key="item.id"
                :checked="item.selected === 'Y'"
                @change="checkboxChange(item)"
              >
                {{item.name}}
              </a-checkbox>
            </div>
          </div>
        </div>
        <div class="permission-item">
          <div class="left">
            分库
          </div>
          <div class="right">
            <div class="all-checked">
              <a-checkbox
                :checked="isAllChecked(data.permission.dist)"
                @change="checkAll(data.permission.dist)"
              >
                全选
              </a-checkbox>
            </div>
            <div class="repertory-gourp">
              <div
                v-for="item of data.permission.dist"
                :key="item.id"
                class="repertory-gourp-item"
              >
                <div class="repertory">
                  <a-checkbox
                    :checked="item.selected === 'Y'"
                    @change="checkboxChange(item)"
                  >
                    {{item.name}}
                  </a-checkbox>
                </div>
                <div
                  v-if="item.childDataPermission.length"
                  class="group"
                >
                  <a-checkbox
                    :checked="isAllChecked(item.childDataPermission)"
                    @change="checkAll(item.childDataPermission)"
                  >
                    全选
                  </a-checkbox>
                  <a-checkbox
                    v-for="item of item.childDataPermission"
                    :key="item.id"
                    :checked="item.selected === 'Y'"
                    @change="checkboxChange(item)"
                  >
                    {{item.name}}
                  </a-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
    <select-staff
      v-model="data.isShowSelectStaffDialog"
      @confirm="copyPermission"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, watch } from '@vue/composition-api';
import {
  queryDataPermission,
  saveCopyDataPermission,
  saveDataPermission,
} from '@/api/modules/enterprise/organization';
import { message } from 'ant-design-vue';
import SelectStaff from '@/components/select-data/staff.vue';

export default defineComponent({
  components: {
    SelectStaff,
  },
  props: {
    id: String,
    value: Boolean,
  },
  setup(props, context) {
    // 表单数据
    const data = reactive({
      isShowSelectStaffDialog: false,
      permission: {
        dist: [],
        location: [],
      },
    });

    async function getDataPermission(id?: string) {
      const body = id || props.id;

      const res = await queryDataPermission(body);
      data.permission = res;
    }

    function isAllChecked(list: any[]) {
      if (list instanceof Array) {
        return list.every((value) => {
          return value.selected === 'Y';
        })
      }
    }

    function checkAll(list: any[]) {
      if (list instanceof Array) {
        if (isAllChecked(list)) {
          list.forEach((value) => {
            value.selected = 'N';
          })
        } else {
          list.forEach((value) => {
            value.selected = 'Y';
          })
        }
      }
    }

    function checkboxChange(value: any) {
      value.selected = value.selected === 'Y' ? 'N' : 'Y';
    }

    async function updatePermission() {
      const body = {
        counters: [],
        dists: [],
        locIds: [],
        uid: props.id
      }

      function addPermissionID(permissions: any[], target: any[], subTarget?: any[]) {
        permissions.forEach((value) => {
          if (value.selected === 'Y') {
            target.push(value.id);
          }

          if (subTarget) {
            if (value.childDataPermission.length) {
              addPermissionID(value.childDataPermission, subTarget);
            }
          }
        })
      }

      addPermissionID(data.permission.location, body.locIds);
      addPermissionID(data.permission.dist, body.dists, body.counters);

      await message.loading('提交中');
      await saveDataPermission(body);
      message.success('数据权限设置成功');
    }

    function onCancel() {
      context.emit('cancel');
      context.emit('input', false);
    }

    async function onConfirm(value: any) {
      await updatePermission();
      context.emit('confirm', value);
      context.emit('input', false);
    }

    function copyPermission(values: string[]) {
      getDataPermission(values[0]);
    }

    watch(() => props.value, async (value) => {
      if (value) {
        getDataPermission();
      }
    });

    return {
      data,
      onCancel,
      onConfirm,
      checkboxChange,
      isAllChecked,
      checkAll,
      copyPermission,
    };
  },
});
</script>

<style lang="scss" scoped>
.copy-permission {
  display: grid;
  justify-content: end;
  margin-bottom: 20px;
}

.permission-list {
  .ant-checkbox-wrapper {
    margin: 0;
  }
  > .permission-item {
    display: grid;
    grid-template-columns: max-content auto;
    gap: 30px;

    &:not(:last-of-type) {
      margin-bottom: 20px;
    }

    > .left {
      font-weight: bold;
    }

    > .right {
      .all-checked {
        margin-bottom: 20px;
      }

      .checkbox-group {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
      }

      .repertory-gourp {
        display: grid;
        grid-auto-flow: row;
        gap: 20px;

        > .repertory-gourp-item {
          > .repertory {
            margin-bottom: 20px;
          }

          > .group {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 20px;
            padding-left: 30px;
          }
        }
      }
    }
  }
}
</style>
