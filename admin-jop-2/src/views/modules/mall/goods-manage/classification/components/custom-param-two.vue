<template>
  <div class="classification-set">
    <div class="class-set-box">
      <p class="class-set-title">规格：</p>
      <p>说明：为商品的规格，以作小程序购物车中可多选规格，例如：钻石的圈口数值、颜色值、净度值、主石重等；最多添加5个。</p>
      <a-button type="primary" class="class-set-button" @click="addModal">添加规格</a-button>
    </div>
    <!-- 表格 -->
    <div class="class-table class-table3">
        <a-table
          :columns="initData.columns"
          :data-source="initData.tableData"
          :pagination="false"
        >
        <!-- 自定义参数 -->
        <template
            slot="name"
            slot-scope="text, record"
          >
            <div>
              <template v-if="record.editable&&((edtype==1&&!(data&&data.use))||edtype!=1)">
                <a-input style="width: 120px" v-model="record.name"/>
              </template>
              <template v-else>
                <p>{{record.name}}</p>
              </template>
            </div>
          </template>
          <!-- 数据类型 -->
          <template
            slot="datatype"
            slot-scope="text, record"
          >
            <div>
              <template v-if="record.editable&&((edtype==1&&!(data&&data.use))||edtype!=1)">
                <a-select  v-model="record.datatype" style="width: 130px">
                  <a-select-option v-for="(item,index) in initData.datatypeObj" :key="index" :value="index" >
                    {{item}}
                  </a-select-option>
                </a-select>
              </template>
              <template v-else>
                <p>{{initData.datatypeObj[record.datatype]}}</p>
              </template>
            </div>
          </template>
          <!-- 货品属性 -->
          <template
            slot="goodsColumn"
            slot-scope="text, record"
          >
            <div>
              <!-- 编辑 -->
              <p v-if="record.editable&&((edtype==1&&!(data&&data.use))||edtype!=1)">
                <span class="goods-p" v-if="record.goodsColumnStr&&record.goodsColumnStr!=''">
                  {{record.goodsColumnStr}}
                  <a-icon type="close-circle" class="goods-icon" @click="removeGoods(record)"/>
                </span>
                <span v-else class="add-param" @click="goodsModal(record)">添加货品属性</span>
              </p>
              <!-- 保存 -->
              <p v-else>
                <span class="goods-p" v-if="record.goodsColumnStr&&record.goodsColumnStr!=''">
                  {{record.goodsColumnStr}}
                </span>
                <span v-else>-</span>
              </p>
            </div>
          </template>
          <span slot="action"  slot-scope="text, record">
            <template v-if="!(data && data.use && edtype === 1)">
              <a v-if="record.editable" class="ant-dropdown-link" @click="() => save(record.key)">保存</a>
              <a v-else :disabled="initData.editingKey!==''" class="ant-dropdown-link" @click="() => edit(record.key)">编辑</a>
            </template>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link" @click="popDelectMethod(record.key)">删除</a>
            <a-divider type="vertical" />
            <template v-if="!(data&&data.use&&edtype==1)">
              <a-tooltip placement="topLeft" title="拖拽调整顺序">
                <a-icon type="menu" class="class-menu"/>
              </a-tooltip>
            </template>
          </span>
        </a-table>
    </div>
    <!-- 提示确认框 -->
    <a-modal centered v-model="initData.visible" :title="initData.comfirms.title" @ok="handleOk" @cancel="handleCancel">
      <p>{{initData.comfirms.content}}</p>
    </a-modal>
    <!-- 添加规格弹窗 -->
    <add-param-modal :parentData="initData.parentData" @modal-button="getModalEmit" @modal-add="getModalAdd"></add-param-modal>
    <!-- 货品属性 -->
    <goods-param-modal v-if="initData.modalData.modalVisible" :parentData="initData.modalData" @modal-cancel="getModalEmit" @modal-ok="modalOk"></goods-param-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import Sortable from 'sortablejs';
import addParamModal from './add-param-modal.vue'
import goodsParamModal from './goods-param-modal.vue'
export default defineComponent({
  props: {
    data: {
      type: Object,
      value: null
    },
    edtype: {
      type: Number,
      value: 0
    }
  },
  components: {
    Sortable,
    addParamModal,
    goodsParamModal
  },
  setup(props, context) {
    onMounted(() => {
      if (props.data) {
        initData.tableData = Object.assign([], props.data.skuPropertyList);
        initData.tableData = initData.tableData.map((item) => {
          item.key = item.id;
          if (props.edtype === 2) {
            delete item.id;
            delete item.cateId;
          }
          return item;
        });
        if (!(props.data.use && props.edtype === 1)) {
          initTalbeDrag();
        }
      } else {
        initTalbeDrag();
      }
    });
    const initTalbeDrag = () => {
      // 表格中需要实现行拖动，所以选中tr的父级元素
      const table = document.querySelector('.class-table3 .ant-table-tbody')
      const item = Sortable.create(table, {
        handle: '.class-menu',
        onEnd: (evt:any) => {
          const oldIndex = evt.oldIndex;
          const newIndex = evt.newIndex;
          const targetRow = initData.tableData.splice(oldIndex, 1)[0];
          initData.tableData.splice(newIndex, 0, targetRow);
          const tableData = initData.tableData.map((item:any, index:number) => {
            item.seq = (index + 1);
            return item;
          });
          initData.tableData = tableData;
        }
      });
    };
    // 确认框标题
    const initData = reactive({
      editingKey: '',
      delectKey: '',
      selectedRowKeys: [],
      // 确认框
      visible: false,
      isChecked: false, // 全选反选
      parentData: {
        title: '',
        modalVisible: false,
        modalType: '2', // 模态框类型 1添加属性 2添加规格
        itemTitle: '',
        mes: ''
      },
      // 货品属性模态框
      modalData: {
        title: '货品属性',
        modalVisible: false,
        data: ''
      },
      comfirms: {
        title: '',
        content: ''
      },
      newData: [],
      // 规格参数值
      radioValue: '5',
      columns: [
        {
          title: '序号',
          dataIndex: 'seq',
          key: 'seq',
          width: '15%'
        },
        {
          title: '自定义参数',
          key: 'name',
          scopedSlots: { customRender: 'name' },
          width: '20%',
        },
        {
          title: '数据类型',
          key: 'datatype',
          scopedSlots: { customRender: 'datatype' },
          width: '20%',
        },
        {
          title: '货品属性',
          key: 'goodsColumn',
          scopedSlots: { customRender: 'goodsColumn' },
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
      tableData: [] as any[],
      cacheTableData: [] as any[],
      datatypeObj: { NUM: '数字', STR: '文本' }
    });
    const onSwitchChange = (checked:boolean) => {
      const newData = [...initData.tableData];
      const target = newData.filter(item => initData.editingKey === item.key)[0];
      target.visible = checked ? 'Y' : 'N';
    }
    const getModalAdd = (data:any) => {
      initData.parentData.modalVisible = false;
      const timestamp = new Date().getTime();
      const tableobj:any = Object.assign({ key: timestamp, seq: initData.tableData.length + 1, goodsColumn: '', goodsColumnStr: '' }, data);
      initData.tableData.push(tableobj);
    }
    // 删除方法
    const popDelectMethod = (key: any) => {
      if (props.data && props.data.use && props.edtype === 1) {
        context.root.$message.warning('该规格已与商品关联，不能删除');
        return false;
      }
      initData.delectKey = key;
      initData.editingKey = '';
      initData.visible = true;
      initData.comfirms.title = '删除参数';
      initData.comfirms.content = '是否删除已选规格？'
    }
    // 编辑
    const edit = (key: any) => {
      const newData = [...initData.tableData];
      const target = newData.filter(item => key === item.key)[0];
      initData.editingKey = key;
      if (target) {
        (target as any).editable = true;
        initData.tableData = newData;
      }
    }
    // 删除货品属性方法
    const removeGoods = (record: any) => {
      record.goodsColumn = '';
      record.goodsColumnStr = '';
    }
    // 保存
    const save = (key: any) => {
      const newData = [...initData.tableData];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        const name:string = target.name;
        const reg = new RegExp('^[\u4e00-\u9fa5-a-zA-Z0-9]+$');
        if ((name.length < 2 || name.length > 8) || !(reg.test(name))) {
          context.root.$message.warning('仅支持汉字、英文、数字，字限制2-8个');
          return false;
        }
        delete (target as any).editable;
        initData.tableData = newData;
      }
      initData.editingKey = '';
    }
    // 确认方法
    const handleOk = (e: any) => {
      initData.visible = false;
      const index:number = initData.tableData.findIndex((item: any) => item.key === initData.delectKey);
      if (index !== -1) {
        initData.tableData.splice(index, 1);
        const tableData = initData.tableData.map((item:any, index) => {
          return { key: item.key, seq: index + 1, name: item.name, visible: item.visible, datatype: item.datatype, goodsColumn: item.goodsColumn };
        });
        initData.tableData = tableData;
      }
      initData.delectKey = '';
    }
    // 取消方法
    const handleCancel = () => {
      initData.visible = false;
      initData.delectKey = '';
    }
    // 子组件模态框取消按钮
    const getModalEmit = () => {
      initData.parentData.modalVisible = false;
      initData.modalData.modalVisible = false;
    }
    // 子组件模态框确定按钮 获取radio value和label值以及当前行的数据data
    const modalOk = (item: string, data: any) => {
      initData.modalData.modalVisible = false;
      const arr = item.split('-');
      data.goodsColumnStr = arr[0];
      data.goodsColumn = arr[1];
    }
    // 添加属性
    const addModal = () => {
      if (props.data && props.data.use && props.edtype === 1) {
        context.root.$message.warning('该规格已与商品关联，不能新增');
        return false;
      }
      if (initData.tableData.length >= 5) {
        context.root.$message.warning('商品规格最多添加5个');
        return false;
      }
      initData.parentData.modalVisible = true;
      initData.parentData.title = '添加规格';
      initData.parentData.modalType = '2';
      initData.parentData.itemTitle = '规格名称:';
      initData.parentData.mes = '规格';
    }
    // 货品属性
    const goodsModal = async (record: string) => {
      initData.modalData.modalVisible = true;
      initData.modalData.data = record;
    }
    return {
      initData,
      popDelectMethod,
      edit,
      save,
      handleOk,
      handleCancel,
      getModalEmit,
      goodsModal,
      getModalAdd,
      addModal,
      onSwitchChange,
      removeGoods,
      modalOk
    }
  }
})
</script>

<style lang="scss" scoped>
.classification-set {
  .class-set-box {
    padding-left: 18px;
    .class-set-button {
      margin: 27px 0 19px;
    }
  }
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
  .goods-p {
    position: relative;
    .goods-icon {
      position: absolute;
      top: -4px;
      right: -17px;
      cursor: pointer;
    }
  }
  .add-param {
    color: #0045FF;
    cursor: pointer;
  }
}
.class-tool {
  background-color: red;
  ::v-deep .ant-tooltip-inner {
    background-color: #fff;
  }
}
.class-menu{
  color: #0045FF;
  cursor: pointer;
}
</style>
