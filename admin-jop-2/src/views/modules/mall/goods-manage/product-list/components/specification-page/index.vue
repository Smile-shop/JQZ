<template>
  <div class="specification-page">
    <productTab @goProductInfo="goProductInfo" @goProductDetail="goProductDetail"></productTab>
    <title-header titleHeader="商品规格"></title-header>
    <a-form-model
      :label-col="initData.labelCol"
      :wrapper-col="initData.wrapperCol"
    >
      <p class="specifi-title">商品分类</p>
      <a-form-model-item>
        <span>一级分类名称：{{initData.spuObj.cateIdLevel1Name}}</span>
        <span class="sort-name">二级分类名称：{{initData.spuObj.cateIdLevel2Name}}</span>
        <span class="sort-name">首饰类型：{{initData.spuObj.goodsKindStr}}</span>
      </a-form-model-item>
      <p class="specifi-title">添加商品图片</p>
      <a-form-model-item>
        <div class="img-form-box">
          <div class="img-form-flex">
            <span class="img-form-flex-left">前置图片：</span>
            <div class="img-form-flex-right">
              <div v-if="initData.spuObj.forwardImgUrlList.length==0">
                  <a-button icon="plus" class="img-plus" @click="imgUpload(0)"></a-button>
              </div>
              <div v-else>
                  <div  class="img-form-box-div">
                      <img :src="initData.spuObj.forwardImgUrlList[0]" @click="imgUpload(0,initData.spuObj.forwardImgUrlList)"/>
                      <a-icon type="close-circle" class="img-icon" @click="deleteForwardImageList"/>
                      <a-button icon="plus" class="icon-plus" @click="imgUpload(0,initData.spuObj.forwardImgUrlList)"></a-button>
                  </div>
                  <p class="up-text">(共{{initData.spuObj.forwardImgUrlList.length}}张图片)</p>
              </div>
            </div>
          </div>
          <div class="img-form-flex">
            <span class="img-form-flex-left">后置图片：</span>
            <div class="img-form-flex-right">
              <div v-if="initData.spuObj.backImgUrlList.length==0">
                  <a-button icon="plus" class="img-plus" @click="imgUpload(1)"></a-button>
              </div>
              <div v-else>
                    <div  class="img-form-box-div">
                      <img :src="initData.spuObj.backImgUrlList[0]" @click="imgUpload(1,initData.spuObj.backImgUrlList)"/>
                      <a-icon type="close-circle" class="img-icon" @click="deleteBackImageList"/>
                      <a-button icon="plus" class="icon-plus" @click="imgUpload(1,initData.spuObj.backImgUrlList)"></a-button>
                    </div>
                  <p class="up-text">(共{{initData.spuObj.backImgUrlList.length}}张图片)</p>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-left:70px">
            <p class="sub-title">说明：</p>
            <p class="sub-text">1、商品的通用图片，在小程序商品列表、详情页中展示，建议为正方形，尺寸宽为750，至少添加一张图片；</p>
            <p class="sub-text">2、「前置图片」商品图片在规格图片前面显示，「后置图片」则在规格图片后面显示。</p>
          </div>
      </a-form-model-item>
      <p class="specifi-title">商品属性</p>
      <a-form-model-item>
        <div class="specification-flex">
          <div class="specifi-left">
            基本属性：
          </div>
          <div class="specifi-right">
            <div :value="item.value" v-for="(item, index) in initData.spuObj.spuPropertyVo.spuPropList" :key="index">
              <span class="specifi-span">{{item.name}}</span>
              <a-input style="width:120px" :placeholder="'请输入'" :value="!(item.propValue)?'':item.propValue" @change="(evt)=>{changeSpuInput(evt,index)}"/>
            </div>
          </div>
        </div>
        <div class="specification-flex spec-sku">
          <div class="specifi-left">
            规格：
          </div>
          <div class=" specifi-right2">
            <div class="specif-rg-flex" v-for="(item, index) in initData.spuObj.spuPropertyVo.skuPropList" :key="index">
              <span class="specifi-span" style="width:90px">{{item.name}}</span>
                <span class="specif-icon" v-for="(itm, idx) in item.propValueList" :key="idx">
                    <template v-if="initData.spuObj.shelf&&!(itm.isedit)">
                      <a-input class="specif-input"  :value="itm.value" onfocus="this.blur()" :maxLength="8"/>
                    </template>
                    <template v-else>
                      <a-input class="specif-input"  :value="itm.value" @change="(evt)=>{changeSkuInput(evt,index, idx)}" :maxLength="8"/>
                      <a-icon type="close-circle" class="sp-icon" @click="deleteSku(index, idx)"/>
                    </template>
                </span>
                 <span class="specifi-plus" @click="addParam(index)"><a-icon type="plus" /></span>
            </div>
            <div><a-button type="primary" :disabled="initData.isTableEdit" @click="goSaveTable">生成规格列表</a-button></div>
          </div>
        </div>
      </a-form-model-item>
        <p class="specifi-title">规格列表</p>
        <div class="speci-table">
          <a-table
          rowKey="key"
          :row-selection="{ selectedRowKeys: initData.selectedRowKeys, onChange: onSelectChange }"
          :columns="initData.tableColumns"
          :data-source="initData.tableData"
          :pagination="false"
          :scroll="{ x: 1000, y: 600 }"
          bordered
          >
            <span slot="origPrice" slot-scope="text, record">
              <p class="table-text">{{record.origPrice}}</p>
            </span>
            <!-- 倍率 -->
            <span slot="ratio" slot-scope="text, record">
                <template v-if="record.editable">
                  <p class="table-text">
                     <a-input-number  v-model="record.ratio" :min="0.1" :max="10" :step="0.1" @change="onChangeRatio"/>
                  </p>
                </template>
                <template v-else>
                  <p class="table-text">{{record.ratio}}</p>
                </template>
            </span>
            <!-- 线上售价 -->
            <span slot="price" slot-scope="text, record">
              <p class="table-text">{{record.price}}</p>
            </span>
            <!-- 数量 -->
            <span slot="bindGoodsCount" slot-scope="text, record">
              <p class="table-text">{{record.bindGoodsCount}}
                <a-tooltip placement="topLeft" title="关联的商品有异常" arrow-point-at-center>
                  <a-icon v-if="record.goodsIsChange" type="info-circle" theme="twoTone" two-tone-color="#ff0000"/>
                </a-tooltip>
              </p>
            </span>
            <!-- 默认展示规格 -->
            <span slot="isDefault" slot-scope="text, record">
              <p class="table-text">
                  <a-radio :checked="(record.isDefault=='Y')?true:false" @click="onRadioChange(record.key)"></a-radio>
              </p>
            </span>
            <!-- 图片 -->
            <span slot="skuImageUrlList" slot-scope="text, record">
              <p class="table-text" >
                <template v-if="record.bindGoodsCount==0">
                       <p class="up-text">-</p>
                </template>
                <template v-else>
                  <template v-if="record.skuImageUrlList.length>0">
                    <div class="up-img-block" @click="imgUploadItem(3,record)">
                      <img :src="record.skuImageUrlList[0]" class="up-img"/>
                      <a-icon type="form" class="up-img-btn"></a-icon>
                    </div>
                      <p class="up-text">(共{{record.skuImageUrlList.length}}张图片)</p>
                  </template>
                  <a-button class="up-button" icon="plus" @click="imgUploadItem(3,record)" v-else></a-button>
                </template>
              </p>
            </span>
            <span slot="action" slot-scope="text, record">
                  <a v-if="record.editable" class="ant-dropdown-link" @click="() => save(record.key)">保存</a>
                  <a v-else class="ant-dropdown-link" :disabled="initData.editingKey !== ''" @click="() => edit(record.key)">编辑</a>
                  <a-divider type="vertical" />
                  <a class="ant-dropdown-link" @click="addSpe(record)">添加</a>
                  <a-divider type="vertical" />
                  <a class="ant-dropdown-link" @click="goDetail(record)">详情</a>
            </span>
          </a-table>
        </div>
        <div class="class-footer">
          <div class="class-div-left">
            <a-checkbox @change="onChange" :checked="initData.isChecked">
              全选
            </a-checkbox>
            <a-button @click="popShow('ratio')">批量设置价格倍率</a-button>
          </div>
          <div class="class-div-right">
            <a-pagination
              :total="initData.totalRecord"
              :show-total="total => `共 ${total}条`"
              show-size-changer show-quick-jumper
              :default-current="1"
              :defaultPageSize="initData.pageSize"
              @change="pageChange"
              @showSizeChange="changeSize"
              :pageSizeOptions="['30']"
            />
        </div>
        </div>
      <a-form-model-item>
        <div class="speci-button">
          <a-button class="prev-btn" @click="goBack">上一步</a-button>
          <a-button type="primary" @click="goSaveSpecification">保存</a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
    <!-- 批量设置倍率 -->
    <a-modal
      centered
      :title="initData.modalData.modalTitle"
      v-model="initData.modal1Visible"
      @ok="goComfirm()"
    >
      <template v-if="initData.modalData.type==1">
          <a-input-number style="width: 300px;margin-bottom: 8px" v-model="initData.ratioValue" :min="0.1" :max="10" :step="0.1"/>
        <p class="modal-p">可输入范围：0.1-10</p>
      </template>
      <template v-else>
          <p>是否删除所有图片</p>
      </template>
    </a-modal>
    <add-specification v-if="initData.addVisible"  :visible="initData.addVisible" :skuImgUrlList="initData.imgUrlList" :skuId="initData.skuId" :spuId="spuId" @onCancelHander="onCancelSpecification" @onSaveAllSelect="onSaveAllSelect"></add-specification>
    <!-- 上传图片 -->
    <sku-product-img v-if="initData.imgVisible" :addImgType="initData.addImgType" :imgList="initData.imgUrlList"  :visible="initData.imgVisible" :imageNum="initData.imageNum" @onCancelHander="onCancelHander" @onSavelHander="onSavelHander"></sku-product-img>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from '@vue/composition-api';
import PageTable from '@/layout/page-table.vue';
import titleHeader from '../search-form/title-header.vue';
import addSpecification from '../add-specification/index.vue';
import {
  updateSkus,
  querySkuPage,
  getSpuSkuBySpuId,
  addOrUpdateSku,
  addOrUpdateImg,
  isCandelSkuByIds
} from '@/api/modules/mall/goods-manage/product-list/index';
import skuProductImg from '../sku-product-img.vue';
import productTab from '../../product-tab.vue';
export default defineComponent({
  props: {
    spuId: {
      type: String,
      value: ''
    },
    statusCode: {
      type: String,
      value: ''
    }
  },
  components: {
    PageTable,
    titleHeader,
    addSpecification,
    skuProductImg,
    productTab
  },
  setup(props, context) {
    const initData = reactive({
      imgUrlList: [] as any[],
      spuObj: { shelf: false, addSecond: false, cateIdLevel1Name: '', cateIdLevel2Name: '', goodsKindStr: '', forwardImgUrlList: [] as any[], delSkuPropList: []as any[], backImgUrlList: []as any[], spuPropertyVo: { id: '', skuPropList: [] as any[], spuPropList: [] } },
      skuList: []as any[],
      imgVisible: false,
      currItem: { skuImageUrlList: []as any[] } as any,
      addImgType: 0,
      labelCol: { span: 1 },
      wrapperCol: { span: 16 },
      selectedRowKeys: [],
      modal1Visible: false,
      addVisible: false,
      editingKey: '',
      isChecked: false, // 全选反选
      isTableEdit: false,
      ratioValue: '', // 价格倍率值
      newData: [],
      totalRecord: 0,
      curPage: 1,
      pageSize: 30,
      imageNum: 8,
      skuId: '',
      modalData: {
        modalTitle: '',
        type: 1,
      },
      baseTableColumns: [
        {
          title: '原价',
          key: 'origPrice',
          scopedSlots: { customRender: 'origPrice' },
          align: 'center'
        },
        {
          title: '倍率',
          key: 'ratio',
          scopedSlots: { customRender: 'ratio' },
          align: 'center'
        },
        {
          title: '线上售价',
          key: 'price',
          scopedSlots: { customRender: 'price' },
          align: 'center'
        },
        {
          title: '关联条码数',
          key: 'bindGoodsCount',
          scopedSlots: { customRender: 'bindGoodsCount' },
          align: 'center'
        },
        {
          title: '默认展示规格',
          key: 'isDefault',
          scopedSlots: { customRender: 'isDefault' },
          align: 'center'
        },
        {
          title: '图片',
          key: 'skuImageUrlList',
          scopedSlots: { customRender: 'skuImageUrlList' },
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 130,
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ]as any[],
      tableColumns: [] as any[],
      tableData: []as any[],
      // 批量操作数据
      selectData: [
        {
          label: '选择批量操作',
          value: '1'
        },
        {
          label: '批量展示',
          value: '2'
        },
        {
          label: '批量隐藏',
          value: '3'
        },
        {
          label: '批量删除',
          value: '4'
        }
      ],
    })
    onMounted(() => {
      if (props.spuId !== '') {
        getSkuDataById(props.spuId);
      } else {
        initData.tableColumns = initData.baseTableColumns;
      }
    })
    const getSkuDataById = async (id:any) => {
      const spuObj = await getSpuSkuBySpuId(id);
      if (spuObj) {
        initData.spuObj = spuObj;
        initData.spuObj.delSkuPropList = [];
        addTableData();
        getSkuPage();
        initData.isTableEdit = initData.spuObj.addSecond;
      } else {
        initData.tableColumns = initData.baseTableColumns;
      }
    };
    const addTableData = () => {
      const tableColumns:any[] = [];
      initData.tableColumns = [];
      initData.tableData = [];
      // 拆分表头 表格属性数据
      initData.spuObj.spuPropertyVo.skuPropList = initData.spuObj.spuPropertyVo.skuPropList.map((element:any) => {
        const propValue:any[] = element.propValueList;
        if (propValue && propValue.length > 0) {
          tableColumns.push({
            title: element.name,
            dataIndex: element.id,
            key: element.id,
            align: 'center',
            flag: true
          });
          const newProp:any[] = [];
          propValue.forEach((val) => {
            newProp.push({ value: val, isedit: false });
          });
          element.propValueList = newProp;
        }
        return element;
      });
      initData.tableColumns = tableColumns.concat(initData.baseTableColumns);
    };
    // 点击增加sku参数
    const addParam = (index: any) => {
      const skuProp:any = (initData.spuObj.spuPropertyVo.skuPropList[index]as any);
      const propValue:any[] = skuProp.propValueList;
      if (propValue && propValue.length > 0) {
        if (propValue.length >= 50) {
          context.root.$message.warn('最多添加50个规格');
          return;
        }
        propValue.push({ value: '', isedit: true });
      } else {
        skuProp.propValueList = [{ value: '', isedit: true }];
      }
      initData.isTableEdit = false;
    }
    const changeSpuInput = (evt:any, index: any) => {
      const spuProp:any = (initData.spuObj.spuPropertyVo.spuPropList[index]as any);
      spuProp.propValue = evt.target.value;
    }
    const changeSkuInput = (evt:any, index: any, idx: any) => {
      const skuProp:any = (initData.spuObj.spuPropertyVo.skuPropList[index]as any);
      skuProp.propValueList[idx].value = evt.target.value;
      initData.isTableEdit = false;
    }
    // 删除sku参数
    const deleteSku = async (index: any, idx: any) => {
      const skuProp:any = (initData.spuObj.spuPropertyVo.skuPropList[index]as any);
      if (skuProp.id && skuProp.id !== '' && skuProp.propValueList[idx].value !== '') {
        const isDelect = await isCandelSkuByIds({ spuId: props.spuId, propId: skuProp.id, propValue: skuProp.propValueList[idx].value });
        if (isDelect) {
          initData.spuObj.delSkuPropList.push({ spuId: props.spuId, propId: skuProp.id, propValue: skuProp.propValueList[idx].value });
          skuProp.propValueList.splice(idx, 1);
          const propValue:any[] = skuProp.propValueList;
          if (propValue.length === 0) {
            initData.tableColumns.splice(0, 1);
          }
          initData.isTableEdit = false;
        }
      } else {
        skuProp.propValueList.splice(idx, 1);
        const propValue:any[] = skuProp.propValueList;
        if (propValue.length === 0) {
          initData.tableColumns.splice(0, 1);
        }
        initData.isTableEdit = false;
      }
    }
    // 表格复选框
    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
      initData.newData = selectedRows;
      initData.selectedRowKeys = selectedRowKeys;
      if (initData.selectedRowKeys.length === initData.tableData.length) {
        initData.isChecked = true;
      } else {
        initData.isChecked = false;
      }
    }
    // 自定义全选
    const onChange = (e: any) => {
      if (e.target.checked) {
        initData.isChecked = true;
        (initData as any).newData = initData.tableData;
        const id = initData.tableData.map(item => { return item.key })
        const indexArr = [];
        indexArr.push(id);
        (initData as any).selectedRowKeys = indexArr[0];
      } else {
        initData.isChecked = false;
        initData.selectedRowKeys = [];
        (initData as any).newData = [];
      }
    }
    // 返回
    const goBack = () => {
      context.root.$router.go(-1);
    }
    // 弹窗方法
    const popShow = (type: any) => {
      initData.modal1Visible = true;
      initData.modalData.modalTitle = '价格倍率';
      initData.modalData.type = 1;
    }
    const onChangeRatio = (value:any) => {
      const newData = [...initData.tableData];
      const target = newData.filter(item => initData.editingKey === item.key)[0];
      if (target) {
        target.price = target.origPrice * value;
      }
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
    // 保存
    const save = async (key: any) => {
      const newData = [...initData.tableData];
      const target = newData.filter(item => key === item.key)[0];
      initData.editingKey = '';
      if (target) {
        (target as any).editable = false;
        initData.tableData = newData;
        try {
          await updateSkus([{ id: target.id, ratio: target.ratio, skuImgUrlList: target.skuImageUrlList, price: target.price, origPrice: target.origPrice, isDefault: target.isDefault }]);
        } catch (error) {

        }
        getSkuPage();
      }
    }
    // 取消
    const cancel = (key: any) => {
      const newData = [...initData.tableData];
      const target = newData.filter(item => key === item.key)[0];
      initData.editingKey = '';
      if (target) {
        delete (target as any).editable;
        initData.tableData = newData;
      }
    }
    // 添加货品弹窗
    const addSpe = (item:any) => {
      initData.skuId = item.id;
      initData.imgUrlList = item.skuImageUrlList;
      initData.addVisible = true
    }
    const imgUploadItem = (type:number, item:any) => {
      initData.imgVisible = true;
      initData.imageNum = 20;
      initData.addImgType = type;
      initData.imgUrlList = item.skuImageUrlList;
      initData.currItem = item;
    }
    // 上传图片
    const imgUpload = (type:number, imglist:any[] = []) => {
      initData.imgVisible = true;
      initData.imageNum = 8;
      initData.addImgType = type;
      initData.imgUrlList = imglist;
    }
    // 上传图片取消
    const onCancelHander = () => {
      initData.imgVisible = false;
    }
    const onCancelSpecification = () => {
      initData.addVisible = false;
    }
    const onSavelHander = (type:number, imglist:any[]) => {
      initData.imgVisible = false;
      if (type === 0) {
        initData.spuObj.forwardImgUrlList = imglist.filter(item => item.status === 'done').map((item) => { return item.url });
      } else if (type === 1) {
        initData.spuObj.backImgUrlList = imglist.filter(item => item.status === 'done').map((item) => { return item.url });
      } else {
        if (initData.currItem) {
          initData.currItem.skuImageUrlList = imglist.filter(item => item.status === 'done').map((item) => { return item.url });
          onSaveSkuImage(initData.currItem);
        }
        initData.currItem = null;
      }
    }
    const onSaveSkuImage = async (target:any) => {
      try {
        await updateSkus([{ id: target.id, ratio: target.ratio, skuImgUrlList: target.skuImageUrlList, price: target.price, origPrice: target.origPrice, isDefault: target.isDefault }]);
        context.root.$message.success('设置成功');
      } catch (error) {

      }
      getSkuPage();
    }
    // 价格倍率弹窗确定
    const goComfirm = () => {
      initData.modal1Visible = false;
      if (initData.modalData.type === 1) {
        setSkuRatio();
      } else if (initData.modalData.type === 2) {
        initData.spuObj.forwardImgUrlList = [];
      } else if (initData.modalData.type === 3) {
        initData.spuObj.backImgUrlList = [];
      }
    }
    const setSkuRatio = async () => {
      const datalist:any[] = [];
      initData.selectedRowKeys.map((key) => {
        const item = initData.tableData.find((item: any) => item.key === key);
        if (item) {
          item.ratio = initData.ratioValue;
          item.price = Number(item.origPrice) * Number(item.ratio);
          const data = { id: item.id, ratio: item.ratio, skuImgUrlList: item.skuImageUrlList, price: item.price, origPrice: item.origPrice, isDefault: item.isDefault };
          datalist.push(data);
        }
      });
      if (datalist.length > 0) {
        try {
          await updateSkus(datalist);
          context.root.$message.success('设置成功');
        } catch (error) {

        }
        getSkuPage();
      } else {
        context.root.$message.warning('请选择修改规格');
        return false;
      }
    }

    const goSaveSpecification = async () => {
      await goSave();
      context.root.$message.success('保存成功！');
    }

    const goSave = async () => {
      const skuobj = Object.assign({ spuId: props.spuId }, { forwardImgUrlList: initData.spuObj.forwardImgUrlList, backImgUrlList: initData.spuObj.backImgUrlList });
      await addOrUpdateImg(skuobj);
    };

    // 保存
    const goSaveSkuProp = async () => {
      const spuParmList:any[] = initData.spuObj.spuPropertyVo.spuPropList.map((item:any) => {
        return { propId: item.id, propValue: item.propValue };
      });
      const skuParmList:any[] = initData.spuObj.spuPropertyVo.skuPropList.map((item:any) => {
        return { propId: item.id, propValueList: item.propValueList ? item.propValueList.map((itm:any) => { return itm.value }) : item.propValueList };
      });
      const skuobj = Object.assign({ spuId: props.spuId }, { delSkuPropList: initData.spuObj.delSkuPropList, spuPropertyVo: { skuParmList: skuParmList, spuParmList: spuParmList } });
      await addOrUpdateSku(skuobj);
      initData.spuObj.delSkuPropList = [];
      initData.spuObj.addSecond = true;
      initData.isTableEdit = initData.spuObj.addSecond;
      const tableColumns:any[] = [];
      initData.spuObj.spuPropertyVo.skuPropList = initData.spuObj.spuPropertyVo.skuPropList.map((element:any) => {
        const propValue:any[] = element.propValueList;
        if (propValue && propValue.length > 0) {
          tableColumns.push({
            title: element.name,
            dataIndex: element.id,
            key: element.id,
            align: 'center',
            flag: true
          });
        }
        propValue.forEach((item) => {
          item.isedit = false;
        });
        return element;
      });
      initData.tableColumns = tableColumns.concat(initData.baseTableColumns);
      getSkuPage();
    }
    const getSkuPage = async () => {
      const skudata = await querySkuPage({ spuId: props.spuId, curPage: initData.curPage, pageSize: initData.pageSize });
      initData.curPage = skudata.curPage;
      initData.totalRecord = skudata.totalRecord;
      const records = skudata.records;
      initData.tableData = [];
      records.forEach((element:any, index:number) => {
        const basedata = { key: element.id, align: 'center', id: element.id, seq: element.seq, spuId: element.spuId, price: element.price, isDefault: element.isDefault, origPrice: element.origPrice, ratio: element.ratio, skuImageUrlList: element.skuImageUrlList, bindGoodsCount: element.bindGoodsCount, editable: false };
        const tabledata = Object.assign(basedata, JSON.parse(element.parmJson));
        initData.tableData.push(tabledata);
      });
    }
    const goProductInfo = () => {
      const path = 'product-info';
      context.root.$router.push({
        path,
        query: {
          productId: props.spuId,
          statusCode: props.statusCode
        }
      })
    }
    const goProductDetail = () => {
      if (!initData.spuObj.addSecond) {
        context.root.$message.warning('请完成商品信息填写');
        return false;
      }
      const path = 'product-detail';
      context.root.$router.push({
        path,
        query: {
          type: '1',
          id: props.spuId,
          statusCode: props.statusCode
        }
      })
    }
    // 详情
    const goDetail = (item:any) => {
      context.emit('gotoSkuDetail', item.id);
    }
    const goSaveTable = async () => {
      await goSaveSkuProp();
      context.root.$message.success('生成规格列表成功！');
    }
    const changeSize = (curPage: number, pageSize: number) => {
      initData.curPage = curPage;
      initData.pageSize = pageSize;
      getSkuPage();
    }
    // 分页页数方法
    const pageChange = (curPage: number, pageSize: number) => {
      initData.curPage = curPage;
      initData.pageSize = pageSize;
      getSkuPage();
    }
    const onSaveAllSelect = () => {
      initData.addVisible = false;
      getSkuPage();
    }
    const deleteForwardImageList = () => {
      initData.modal1Visible = true;
      initData.modalData.modalTitle = '删除图片';
      initData.modalData.type = 2;
    }
    const deleteBackImageList = () => {
      initData.modal1Visible = true;
      initData.modalData.modalTitle = '删除图片';
      initData.modalData.type = 3;
    }
    const onRadioChange = async (key:any) => {
      const newData = [...initData.tableData];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        if (target.bindGoodsCount === 0) {
          context.root.$message.warning('请添加商品再勾选');
          return false;
        }
        await updateSkus([{ id: target.id, ratio: target.ratio, skuImgUrlList: target.skuImageUrlList, price: target.price, origPrice: target.origPrice, isDefault: (target.isDefault === 'Y' ? 'N' : 'Y') }]);
        context.root.$message.success('设置成功');
        getSkuPage();
      }
    }
    return {
      initData,
      onSelectChange,
      onChange,
      popShow,
      goBack,
      edit,
      save,
      addParam,
      deleteSku,
      addSpe,
      imgUpload,
      onSavelHander,
      onCancelHander,
      goComfirm,
      goSaveSpecification,
      goDetail,
      changeSkuInput,
      changeSpuInput,
      imgUploadItem,
      onChangeRatio,
      goProductInfo,
      goProductDetail,
      onCancelSpecification,
      goSaveTable,
      changeSize,
      pageChange,
      onSaveAllSelect,
      deleteForwardImageList,
      deleteBackImageList,
      onRadioChange
    }
  }
})
</script>

<style lang="scss" scoped>
.specification-page {
  .sort-name {
    margin-left: 40px;
  }
  .up-img-block {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .up-img {
      width: 49px;
      height: 49px;
    }
    .up-img-btn {
      position: absolute;
      width: 12px;
      height: 12px;
      color: #fff;
      cursor: pointer;
    }
  }
  .up-text {
    color: #80869D;
    font-size: 12px;
  }
  .img-form-box {
    display: flex;
    .img-form-flex {
      width: 240px;
      margin-top: 10px;
      display: flex;
      .img-form-flex-right {
        margin-top: 10px;
        .img-form-box-div {
          width: 80px;
          height: 80px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 100%;
            height: 100%;
          }
          .icon-plus {
            position: absolute;
          }
          .img-icon{
           position: absolute;
           right: -2px;
           top: -2px;
           z-index: 2;
          }
        }
        .img-plus {
          width: 80px;
          height: 80px;
        }
      }
    }
  }
  .specifi-title {
    color: #263446;
    font-weight: 500;
  }
  .specification-flex {
    display: flex;
    .specifi-left {
      width: 80px;
    }
    .specifi-right {
      display: flex;
      width:985px;
      .specifi-span {
        margin-left: 20px;
      }
      .ant-input {
        width: 234px;
        margin-left: 10px;
      }
    }
  }
  .spec-sku {
    margin-top: 40px;
    .specifi-right2 {
      flex: 1;
      .specif-rg-flex {
        display: flex;
        align-items: center;
        &:not(:nth-child(1)) {
          margin-top: 10px;
        }
       .specifi-span {
         width: 60px;
       }
      .ant-input {
        width: 234px;
        margin-left: 10px;
      }
       .specif-icon {
         position: relative;
         .sp-icon {
           position: absolute;
           right: -2px;
           top: -2px;
           z-index: 2;
         }
       }
       .specifi-plus {
         padding: 0 29px;
         display: inline-block;
         height: 32px;
         line-height: 30px;
         border-radius:4px;
         border:1px dotted rgba(214,221,236,1);
         margin-left: 10px;
         cursor: pointer;
       }
       .specif-input {
          width: 76px;
          text-align: center;
        }
      .specif-button {
          width: 76px;
          text-align: center;
          margin-left: 10px;
        }
      }
    }
  }
  .speci-table {
    .table-text {
      margin: 0;
      padding: 18px 21px;
      &:not(:nth-child(1)) {
        border-top: 1px solid #e8e8e8;
      }
    }
  }
  .class-footer {
    display: flex;
    margin-top: 16px;
    justify-content: space-between;
  }
  .speci-button {
    margin-top: 20px;
    margin-left: 64px;
    .prev-btn {
      margin-right: 10px;
    }
  }
  ::v-deep .ant-table-tbody {
    .ant-table-row {
      td {
        padding: 0;
      }
    }
  }
  .modal-p {
    margin-top: 10px;
    font-size: 12px;
  }
  .sub-title{
    margin: 0px;
    line-height: 30px;
    padding:0;
    font-size: 12px;
    color: #40445C;
    font-weight: 400;
    }
  .sub-text{
      padding:0;
      margin: 0px;
      line-height: 30px;
      font-size: 12px;
      font-weight: 400;
      color: #40445C;
  }
.class-div-right {
  display:flex;
  justify-content: flex-end;
}
}
</style>
