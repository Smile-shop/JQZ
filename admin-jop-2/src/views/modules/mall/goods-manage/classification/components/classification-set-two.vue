<template>
  <div class="classification-set">
    <p class="class-set-title">二级分类</p>
    <!-- 表格 -->
    <div class="class-table class-table2">
        <a-table
          :columns="initData.columns"
          :data-source="initData.tableData"
          :pagination="false"
          :scroll="{y: 265 }"
        >
          <span slot="displayTitle">
            分类筛选展示
            <a-tooltip placement="topLeft" overlayClassName="class-tool" title="开启后，小程序分类商品中展示该筛选条件。">
              <a-icon type="question-circle" />
            </a-tooltip>
          </span>
          <span slot="sortTitle">
            分类筛选
            <a-tooltip placement="topLeft" title="该分类是否有商品关联使用">
              <a-icon type="question-circle" />
            </a-tooltip>
          </span>

          <template
            v-for="col in ['display']"
            :slot="col"
            slot-scope="text, record"
          >
            <div :key="col">
              <a-switch default-checked @change="(bool) => onSwitchChange(bool,record.key)" :checked="record.filterVisible"/>
            </div>
          </template>
          <span slot="use"  slot-scope="text, record">
            {{record.use? '已使用' : '未使用'}}
          </span>
          <span slot="action"  slot-scope="text, record">
            <a-divider type="vertical" />
            <a class="ant-dropdown-link" @click="editCustom(record.id,1)">详情</a>

            <template v-if="!record.use">
              <a-divider  type="vertical" />
              <a class="ant-dropdown-link" @click="popMethod(record.key,'delete')">删除</a>
            </template>
            <template v-else><span></span></template>

            <a-divider type="vertical" />
            <a-tooltip placement="topLeft" title="复制分类">
              <a-icon type="copy" style="color: #0045FF;cursor: pointer;" @click="editCustom(record.id,2)"/>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip placement="topLeft" title="拖拽调整顺序">
              <a-icon type="menu" style="color: #0045FF;cursor: pointer;"/>
            </a-tooltip>
          </span>
        </a-table>
    </div>
    <!-- 提示确认框 -->
    <a-modal centered v-model="initData.visible" :title="initData.comfirms.title" @ok="handleOk" @cancel="handleCancel">
      <p>{{initData.comfirms.content}}</p>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import {
  queryRetailCategoryPage,
  updateRetailCategoryVisible,
  delRetailCategoryByIds,
  updateRetailCategorySort
} from '@/api/modules/mall/goods-manage/classification/index';
import Sortable from 'sortablejs';
export default defineComponent({
  components: { Sortable },
  setup(props, context) {
    onMounted(() => {
      // 表格中需要实现行拖动，所以选中tr的父级元素
      const table = document.querySelector('.class-table2 .ant-table-tbody')
      Sortable.create(table, {
        onEnd: (evt:any) => {
          // 回调处理在这里写
          const oldIndex = evt.oldIndex;
          const newIndex = evt.newIndex;
          const targetRow = initData.tableData[oldIndex];
          const newTargetRow = initData.tableData[newIndex];
          context.root.$nextTick(() => {
            const params = {
              id: targetRow.id,
              seq: newTargetRow.seq
            }
            // 排序
            updateRetailCategorySorts(params)
          });
        }
      })
    });
    // 确认框标题
    const initData = reactive({
      editingKey: '',
      selectedRowKeys: [],
      // 确认框
      visible: false,
      isChecked: false, // 全选反选
      currType: '',
      comfirms: {
        title: '',
        content: ''
      },
      newData: [],
      // 规格参数
      editShow: false,
      // 规格参数值
      radioValue: '5',
      columns: [
        {
          title: '序号',
          dataIndex: 'seq',
          key: 'seq',
          width: '15%',
        },
        {
          title: '分类名称',
          dataIndex: 'name',
          key: 'name',
          width: '20%',
        },
        {
          slots: { title: 'displayTitle' },
          key: 'display',
          scopedSlots: { customRender: 'display' },
          width: '20%',
        },
        {
          key: 'use',
          slots: { title: 'sortTitle' },
          scopedSlots: { customRender: 'use' },
          align: 'center',
          width: '20%',
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: '25%',
        },
      ],
      tableData: [] as any[]
    });
    // 排序
    async function updateRetailCategorySorts(body: any) {
      const responseData = await updateRetailCategorySort(body);
      context.root.$message.success('排序成功');
      queryCategoryList();
    }
    // 删除方法
    const popMethod = (key:string, type: any) => {
      if (type === 'delete') {
        initData.visible = true;
        initData.comfirms.content = '是否删除已选分类？';
      } else {
        initData.visible = true;
        initData.comfirms.content = '该分类已有商品关联使用，隐藏后商品无法显示，是否隐藏？';
      }
      initData.currType = type;
      initData.editingKey = key;
    }
    // 确认方法
    const handleOk = (e: any) => {
      const newData = [...initData.tableData];
      const target = newData.filter(item => initData.editingKey === item.key)[0];
      if (target && initData.currType === 'close') {
        target.filterVisible = false;
        onSaveSwitch(target);
      } else if (target && initData.currType === 'delete') {
        delCategoryByIds(target.id);
      }
      initData.visible = false;
    }
    // 取消方法
    const handleCancel = () => {
      initData.visible = false;
    }
    const onSaveSwitch = async (target:any) => {
      const body = {
        filterVisible: target.filterVisible ? 'Y' : 'N',
        idList: [target.id]
      };
      const isedit = await updateRetailCategoryVisible(body);
      if (isedit) {
        context.root.$message.success('修改成功！');
      }
    }
    const onSwitchChange = (checked:boolean, key:string) => {
      const newData = [...initData.tableData];
      const target = newData.filter(item => key === item.key)[0];
      if (!checked) {
        if (target) {
          if (target.use) {
            popMethod(key, 'close');
          } else {
            target.filterVisible = false;
            onSaveSwitch(target);
          }
        }
      } else {
        const newData = [...initData.tableData];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target.filterVisible = true;
          onSaveSwitch(target);
        }
      }
    }
    onMounted(() => {
      init();
    });
    async function delCategoryByIds(id:string) {
      const body = [id];
      const isdelete = await delRetailCategoryByIds(body);
      queryCategoryList();
      context.root.$message.success('删除成功！');
      initData.editingKey = '';
    }
    // 查询分类信息
    async function queryCategoryList() {
      const body = {
        appId: '68594CF2-E947-82FA-84D0-01D4556F9F54',
        level: 2,
        curPage: 0,
        id: '',
        name: '',
        pageSize: 100
      };
      const categoryList = await queryRetailCategoryPage(body);
      const tableData:any[] = [];
      categoryList.records.forEach((element:any, index:number) => {
        const table:any = {};
        table.key = element.id + '';
        table.seq = element.seq;
        table.filterVisible = element.filterVisible === 'Y' ? true : false;
        table.use = element.use;
        table.name = element.name;
        table.id = element.id;
        tableData.push(table);
      });
      initData.tableData = tableData;
    }
    const editCustom = (id:string, type:number) => {
      context.emit('edit-custom', id, type);
    }
    // 初始化
    function init() {
      queryCategoryList();
    }
    return {
      initData,
      popMethod,
      handleOk,
      handleCancel,
      onSwitchChange,
      editCustom
    }
  }
})
</script>

<style lang="scss" scoped>
.classification-set {
  .class-set-title {
    color: #263446;
    font-weight: 500;
    margin: 30px 0 20px 4px;
  }
  .order-button {
    margin: 10px 0 25px;
  }
  .class-table {
    .edit-button {
      margin: 0 18px;
    }
  }
  .class-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
  }
}
.class-tool {
  background-color: red;
  ::v-deep .ant-tooltip-inner {
    background-color: #fff;
  }
}
</style>
