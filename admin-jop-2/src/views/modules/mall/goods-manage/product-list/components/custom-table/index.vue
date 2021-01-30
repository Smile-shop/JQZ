<template>
  <div class="custom-class">
    <div class="custom-table">
      <a-table
        :row-selection="{ selectedRowKeys: initData.selectedRowKeys, onChange: onSelectChange }"
        :columns="initData.columns"
        :data-source="dataList"
        :pagination="false"
      >
        <span slot="name" slot-scope="text, record">
          <img style="width: 60px;height:60px;" :src="record.imgUrl"> {{record.title}}
        </span>
        <span slot="online" slot-scope="text, record">
          ￥{{record.minPrice}}-¥{{record.maxPrice}}
        </span>
        <span slot="recommandKind" slot-scope="text, record">
            <template v-if="record.spuRecommandationList.length > 0">
              <p v-for="(item, index) in record.spuRecommandationList" :key="index" class="recommand-btn">
                  <span class="recommand-box">推荐位{{(index+1)}}
                    <a-icon type="close-circle" class="recommand-icon" @click="deleteRecommand('removeRecomand', item.id)"/>
                  </span>
              </p>
            </template>
            <template v-else>
              <p>-</p>
            </template>
        </span>
        <span slot="action" slot-scope="text, record">
          <p><a class="check-detail" v-if="statusCode === 'N' || statusCode === 'Y'" @click="goEditDetail(record.id)">编辑详情</a></p>
          <p style="margin: 14px 0;">
            <a-button type="primary" size="small" v-if="statusCode === 'N'"  @click="popMethod('2', 'yes', record.id)">上架</a-button>
            <a-button type="primary" size="small" v-if="statusCode === 'Y' || statusCode === 'S'"  @click="popMethod('4', 'yes', record.id)">下架</a-button>
            <a-button type="primary" size="small" v-if="statusCode === 'R'"  @click="popMethod('5', 'yes', record.id)">恢复商品</a-button>
          </p>
          <p>
            <a class="check-detail" v-if="statusCode === 'Y'"  @click="copyShopCode(record.id)">复制商品编码</a>
            <a-button size="small" @click="popMethod('3', 'yes', record.id)" v-if="statusCode === 'N'">移至回收站</a-button>
            <a-button size="small" @click="popMethod('6', 'yes', record.id)" v-if="statusCode === 'R'">删除</a-button>
          </p>
        </span>
      </a-table>
      <div class="class-footer">
        <div class="class-div-left">
          <a-checkbox @change="onChange" :checked="initData.isChecked">
            全选
          </a-checkbox>
          <template v-if="statusCode === 'Y' || statusCode === 'S'">
              <a-button style="margin-left:10px" @click="onDownShop">批量下架商品</a-button>
          </template>
          <template v-else>
            <a-select v-model="initData.selectValue" style="width: 130px" @change="handleChange">
              <a-select-option v-for="(item, index) in initData.selectData" :key="index" :value="item.value">
                {{item.label}}
              </a-select-option>
            </a-select>
          </template>
          <a-button v-if="statusCode === 'N' || statusCode === 'Y'" type="primary" style="margin-left:10px" @click="addComModal">添加推荐位</a-button>
        </div>
        <div class="class-div-right">
          <a-pagination
            :total="totalRecord"
            :show-total="total => `共 ${total}条`"
            show-size-changer show-quick-jumper
            :default-current="1"
            :defaultPageSize="pageSize"
            @change="pageChange"
            @showSizeChange="changeSize"
            :pageSizeOptions="['10', '20', '30', '40']"
          />
        </div>
      </div>
    </div>
    <!-- 提示确认框 -->
    <a-modal @add-recommand="addRecommand" centered v-model="initData.visible" :title="initData.comfirms.title" @ok="handleOk" @cancel="handleCancel">
      <p>{{initData.comfirms.content}}</p>
    </a-modal>
    <!-- 推荐位 -->
    <a-modal @add-recommand="addRecommand" centered v-model="initData.comVisible" title="选择推荐位" @ok="goReCommand">
      <a-checkbox-group
        v-model="initData.comValue"
        name="checkboxgroup"
        :options="initData.plainOptions"
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import {
  delSpuRecommandationById,
  queryAllRecommandationList,
  addSpuRecommandation,
  updateSpuShelf,
  updateSpuDownShelf,
  updateSpuMoveRecycle,
  updateMoveSpuWaitShelf,
  delSpu
} from '@/api/modules/mall/goods-manage/product-list/index';
export default defineComponent({
  props: {
    // N待上架 Y已上架 S已售罄 R回收站
    statusCode: {
      type: String,
      value: ''
    },
    dataList: {
      type: Array,
      value: []
    },
    totalRecord: {
      type: Number,
      value: 0
    },
    pageSize: {
      type: Number,
      value: 10
    }
  },
  setup(props, context) {
    onMounted(() => {
      // 商品列表不同状态显示的批量操作项N
      if (props.statusCode === 'N') {
        initData.selectData = initData.selectData.filter(item => {
          return item.value === '1' || item.value === '2' || item.value === '3'
        })
      }
      if (props.statusCode === 'Y') {
        initData.selectData = initData.selectData.filter(item => {
          return item.value === '1' || item.value === '4'
        })
      }
      if (props.statusCode === 'R') {
        initData.selectData = initData.selectData.filter(item => {
          return item.value === '1' || item.value === '5' || item.value === '6'
        })
      }
      if (props.statusCode === 'S') {
        initData.selectData = initData.selectData.filter(item => {
          return item.value === '1' || item.value === '6'
        })
      }
    })
    const initData = reactive({
      selectedRowKeys: [],
      isChecked: false, // 全选反选
      comValue: [], // 推荐位选中的值
      comVisible: false, // 推荐位显示隐藏
      recommandId: '', // 保存推荐id的值
      goodsId: '', // 商品id
      singleType: '', // 不是批量操作
      newData: [],
      // 确认框
      visible: false,
      // 确认框标题
      comfirms: {
        title: '',
        content: '',
        type: '',
      },
      // 选择框选中的值
      selectValue: '1',
      // 推荐位
      plainOptions: [
        { label: '推荐位1', value: '1' },
        { label: '推荐位2', value: '2' }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'seq',
          key: 'seq',
        },
        {
          title: '商品名称',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '货品类型',
          key: 'goodsKindStr',
          dataIndex: 'goodsKindStr',
        },
        {
          title: '一级分类',
          key: 'cateIdLevel1Name',
          dataIndex: 'cateIdLevel1Name',
        },
        {
          title: '二级分类',
          key: 'cateIdLevel2Name',
          dataIndex: 'cateIdLevel2Name',
        },
        {
          title: '线上售价',
          key: 'online',
          scopedSlots: { customRender: 'online' }
        },
        {
          title: '推荐位',
          key: 'recommandKind',
          scopedSlots: { customRender: 'recommandKind' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 批量操作数据
      selectData: [
        {
          label: '选择批量操作',
          value: '1'
        },
        {
          label: '批量上架商品',
          value: '2'
        },
        {
          label: '批量移至回收站',
          value: '3'
        },
        {
          label: '批量下架商品',
          value: '4'
        },
        {
          label: '批量恢复商品',
          value: '5'
        },
        {
          label: '批量删除商品',
          value: '6'
        },
      ]
    });
    const copyShopCode = (productId:string) => {
      context.root.$message.success('商品编码复制成功');
    }
    // 编辑详情
    const goEditDetail = (productId:string) => {
      context.root.$router.push({
        path: 'product-list/product-info',
        query: {
          statusCode: props.statusCode,
          productId: productId
        }
      })
    }
    // 表格复选框
    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
      initData.newData = selectedRows;
      initData.selectedRowKeys = selectedRowKeys;
      if (initData.selectedRowKeys.length === (props.dataList as any[]).length) {
        initData.isChecked = true;
      } else {
        initData.isChecked = false;
      }
      initData.singleType = '';
    }

    // 添加自定义分类方法
    const goCustom = () => {
      context.emit('custom-style');
    }
    // 全选
    const onChange = (e: any) => {
      if (e.target.checked) {
        initData.singleType = '';
        initData.isChecked = true;
        (initData as any).newData = props.dataList;
        const ids:any[] = (props.dataList as any[]).map(item => { return item.key }) as any[];
        (initData as any).selectedRowKeys = ids;
      } else {
        resetChange();
      }
    }
    const resetChange = () => {
      initData.isChecked = false;
      initData.selectedRowKeys = [];
      (initData as any).newData = [];
    }

    // 选择框
    const handleChange = (value: any) => {
      popMethod(value);
    }
    // 删除方法 type: 类型 singleType:单条数据操作 data: 商品id
    const popMethod = (type: any, singleType?: any, data?: any) => {
      initData.comfirms.type = type;
      if (type !== '1') {
        initData.visible = true;
      }
      // 移除
      if (type === 'remove') {
        initData.comfirms.title = '移除商品';
        initData.comfirms.content = '是否移除已选的商品？';
      }
      // 删除
      if (type === 'delete') {
        initData.comfirms.title = '删除商品';
        initData.comfirms.content = '是否删除已选的商品？'
      }
      // 批量上架商品
      if (type === '2') {
        initData.comfirms.title = '上架商品';
        initData.comfirms.content = '是否上架已选商品？'
        if (singleType === 'yes') {
          initData.goodsId = data;
          initData.singleType = singleType;
        }
      }
      // 批量移除商品
      if (type === '3') {
        initData.comfirms.title = '移至回收站';
        initData.comfirms.content = '是否移至回收站已选商品？'
      }
      // 批量移至回收站
      if (type === '4') {
        initData.comfirms.title = '下架商品';
        initData.comfirms.content = '是否下架已选商品？'
      }
      // 批量下架商品
      if (type === '5') {
        initData.comfirms.title = '恢复商品';
        initData.comfirms.content = '是否恢复已选商品？'
      }
      // 批量删除商品
      if (type === '6') {
        initData.comfirms.title = '删除商品';
        initData.comfirms.content = '是否删除已选的商品？删除商品后，商品的所有关 联则清空'
      }
      // 不是批量的数据
      if (singleType === 'yes') {
        initData.goodsId = data;
        initData.singleType = singleType;
      }
    }
    // 确认方法
    const handleOk = () => {
      initData.visible = false;
      // 推荐位移除
      if (initData.comfirms.type === 'removeRecomand') {
        delSpuRecommandationByIdFun();
      }
      if (initData.singleType !== 'yes') {
        // 如果没选择数据
        if (initData.newData.length < 1) {
          context.root.$message.warn('请先选择商品');
          initData.selectValue = '1';
          return
        }
      }
      // 上架
      if (initData.comfirms.type === '2') {
        updateSpuShelfFun();
      }
      // 下架
      if (initData.comfirms.type === '4') {
        updateSpuDownShelfFun();
      }
      // 移至回收站
      if (initData.comfirms.type === '3') {
        updateSpuMoveRecycleFun();
      }
      // 恢复商品到待上架
      if (initData.comfirms.type === '5') {
        updateMoveSpuWaitShelfFun();
      }
      // 删除商品
      if (initData.comfirms.type === '6') {
        delSpuFun();
      }
      initData.selectValue = '1';
    }
    // 取消方法
    const handleCancel = () => {
      initData.visible = false;
      initData.selectValue = '1';
    }
    // 添加推荐位弹窗
    const addComModal = () => {
      // 如果没选择数据
      if (initData.newData.length < 1) {
        context.root.$message.warn('请先选择商品');
        return false;
      }
      initData.comVisible = true;
      queryAllRecommandationListFun();
    }
    // 选择推荐位确认
    const goReCommand = async () => {
      // 如果没选择数据
      if (initData.comValue.length < 1) {
        context.root.$message.warn('请先选择推荐位');
        return
      }
      // 获取商品ID
      const spuId = initData.newData.map((item: any) => item.id);
      let params: any[] = [];
      // 获取推荐位id
      params = initData.comValue.map(item => {
        return {
          rcdKind: item
        }
      })
      const body = {
        rcdKindList: params,
        spuIdList: spuId
      }
      resetChange();
      const respon = await addSpuRecommandation(body)
      context.root.$message.success('添加推荐位成功');
      initData.comVisible = false;
      context.emit('add-recommand');
      initData.comValue = [];
    }
    // 删除推荐位弹窗
    const deleteRecommand = (type: string, id: any) => {
      // 移除推荐位
      if (type === 'removeRecomand') {
        initData.visible = true;
        initData.comfirms.title = '删除推荐位';
        initData.comfirms.content = '是否把商品移除推荐位'
        initData.comfirms.type = type;
        initData.singleType = 'yes';
      }
      initData.recommandId = id;
    }
    // 移除推荐位方法
    async function delSpuRecommandationByIdFun() {
      const body = [initData.recommandId];
      resetChange();
      const data = await delSpuRecommandationById(body);
      if (data) {
        context.root.$message.success('移除推荐位成功');
        context.emit('add-recommand');
      }
    }
    // 推荐位查询
    const queryAllRecommandationListFun = async () => {
      const recommandList = await queryAllRecommandationList('');
      if (recommandList.length > 0) {
        initData.plainOptions = recommandList.map((item: any) => {
          return {
            label: item.title,
            value: item.kind
          }
        })
      }
    }
    // 推荐位确认抛出事件
    const addRecommand = () => {
      context.emit('add-recommand');
    }
    // 上架
    const updateSpuShelfFun = async () => {
      let body = [];
      if (initData.singleType === 'yes') {
        body.push(initData.goodsId);
      } else {
        // 批量操作
        body = initData.newData.map((item: any) => item.id);
      }
      resetChange();
      const responData = await updateSpuShelf(body);
      context.root.$message.success('上架商品成功');
      context.emit('add-recommand');
    }
    // 下架
    const updateSpuDownShelfFun = async () => {
      let body = [];
      if (initData.singleType === 'yes') {
        body.push(initData.goodsId);
      } else {
        // 批量操作
        body = initData.newData.map((item: any) => item.id);
      }
      resetChange();
      const responData = await updateSpuDownShelf(body);
      context.root.$message.success('下架商品成功');
      context.emit('add-recommand');
    }
    const onDownShop = async () => {
      // 如果没选择数据
      if (initData.newData.length < 1) {
        context.root.$message.warn('请先选择商品');
        return false;
      }
      handleChange('4');
    }
    // 移至回收站
    const updateSpuMoveRecycleFun = async () => {
      let body = [];
      if (initData.singleType === 'yes') {
        body.push(initData.goodsId);
      } else {
        // 批量操作
        body = initData.newData.map((item: any) => item.id);
      }
      resetChange();
      const responData = await updateSpuMoveRecycle(body);
      context.root.$message.success('移至回收站成功');
      context.emit('add-recommand');
    }
    // 恢复到待上架
    const updateMoveSpuWaitShelfFun = async () => {
      let body = [];
      if (initData.singleType === 'yes') {
        body.push(initData.goodsId);
      } else {
        // 批量操作
        body = initData.newData.map((item: any) => item.id);
      }
      resetChange();
      const responData = await updateMoveSpuWaitShelf(body);
      context.root.$message.success('恢复商品成功');
      context.emit('add-recommand');
    }
    // 删除商品
    const delSpuFun = async () => {
      let body = [];
      if (initData.singleType === 'yes') {
        body.push(initData.goodsId);
      } else {
        // 批量操作
        body = initData.newData.map((item: any) => item.id);
      }
      resetChange();
      const responData = await delSpu(body);
      context.root.$message.success('删除商品成功');
      context.emit('add-recommand');
    }
    const changeSize = (curPage: number, pageSize: number) => {
      context.emit('get-recommand', curPage, pageSize);
    }
    // 分页页数方法
    const pageChange = (curPage: number, pageSize: number) => {
      context.emit('get-recommand', curPage, pageSize);
    }
    return {
      initData,
      onSelectChange,
      onChange,
      handleChange,
      handleOk,
      handleCancel,
      popMethod,
      goCustom,
      goEditDetail,
      addComModal,
      goReCommand,
      deleteRecommand,
      addRecommand,
      changeSize,
      pageChange,
      copyShopCode,
      onDownShop
    }
  }
})
</script>

<style lang="scss" scoped>
.custom-class {
  ::v-deep .ant-table-wrapper {
    height: 620px;
    overflow-y: auto;
  }
  .header {
    width: 100%;
    box-sizing: border-box;
    background: #F5F7FA;
    padding-left: 12px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 24px 0;
    p {
      color: #263446;
      padding-left: 8px;
      border-left: 3px solid #0045FF;
      margin: 0;
    }
  }
  .custom-button {
    margin-bottom: 16px;
  }
  .custom-table {
    .edit-button {
      margin: 0 18px;
    }
    .check-detail {
      font-size: 14px;
      text-decoration: underline;
    }
  }
  .class-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
  }
  .custom-title-box {
    color: #80869D;
    margin-top: 14px;
  }
  .recommand-btn {
    &:not(:nth-child(1)) {
      margin-top: 8px;
    }
  }
  .recommand-box {
    position: relative;
    .recommand-icon {
      position: absolute;
      right: -12px;
      top: -5px;
      cursor: pointer;
    }
  }
}
</style>
