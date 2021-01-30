<template>
  <div class="client-wrapper">
    <!-- 搜索栏 -->
    <div class="client-search">
      <!-- <el-button v-if="tabIndex == 0" type="primary" @click="dialogAddShelves = true" class="shelves-add-btn">新增</el-button> -->
      <div class="client-search-box">
        <el-button
          v-if="tabIndex == 0"
          type="primary"
          @click="dialogAddFn"
          class="shelves-add-btn"
        >新增</el-button>
        <el-select
          v-model="searchValue.shelvesRule"
          placeholder="上架规则"
          popper-class="select-popper"
        >
          <el-option
            v-for="item in shelvesRuleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-select
          @change="getShopChange"
          class="el-select-box goShop"
          v-model="searchValue.shopName"
          placeholder="分销商"
          popper-class="select-popper"
        >
          <el-option
            v-for="(item, index) in shopNameList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          @focus="listCabinetGroup"
          class="el-select-box"
          v-model="searchValue.inCabinetGroup"
          placeholder="柜组"
          popper-class="select-popper"
        >
          <el-option
            v-for="(item, index) in inCabinetGroupList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <span class="search-title">价格区间：</span>
        <el-input
          @keyup.native="handleClick('startPrice')"
          class="shelves-input shelves-input01"
          v-model.number="searchValue.startPrice"
          placeholder="￥最低金额"
        ></el-input>
        <span>-</span>
        <el-input
          @keyup.native="handleClick('endPrice')"
          class="shelves-input shelves-input01"
          v-model.number="searchValue.endPrice"
          placeholder="￥最高金额"
        ></el-input>
        <span class="search-title">库存区间：</span>
        <el-input
          @keyup.native="handleClick('startStock')"
          class="shelves-input"
          v-model.number="searchValue.startStock"
          placeholder="最低库存"
        ></el-input>
        <span>-</span>
        <el-input
          @keyup.native="handleClick('endStock')"
          class="shelves-input"
          v-model.number="searchValue.endStock"
          placeholder="最高库存"
        ></el-input>
        <el-select
          v-model="searchValue.storageType"
          placeholder="类型"
          @focus="getDisplay(2)"
          @change="removeVal"
          popper-class="select-popper"
        >
          <el-option
            v-for="item in styleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-select
          @focus="getWxShopList"
          @change="getShopChange"
          class="el-select-box goShop"
          v-model="searchValue.shopName"
          placeholder="分销商"
          popper-class="select-popper"
        >
          <el-option
            v-for="(item, index) in shopNameList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          @focus="listCabinetGroup"
          class="el-select-box"
          v-model="searchValue.inCabinetGroup"
          placeholder="柜组"
          popper-class="select-popper"
        >
          <el-option
            v-for="(item, index) in inCabinetGroupList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select> -->
        <el-select
          class="el-select-box"
          @focus="getDisplay(1)"
          v-model="searchValue.largeCategory"
          placeholder="大类"
          popper-class="select-popper"
        >
          <el-option
            v-for="(item, index) in largeClassList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          class="el-select-box"
          @focus="getDisplay(1)"
          v-model="searchValue.smallCategory"
          placeholder="小类"
          popper-class="select-popper"
        >
          <el-option
            v-for="(item, index) in subClassList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="searchValue.presenter" placeholder="推荐位" popper-class="select-popper">
          <el-option
            v-for="item in recommendedBitList"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
        <!-- <el-select v-model="searchValue.textType" placeholder="名称" popper-class="select-popper">
          <el-option
            v-for="item in textType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select> -->
        <!-- <el-input
          class="search-input"
          v-model.trim="searchValue.text"
          :placeholder="searchValue.textType === 1 ? '输入条码号搜索' : searchValue.textType === 2 ? '输入上架编号搜索': '输入名称搜索'"
        ></el-input> -->
      <el-input
          class="search-input"
          v-model.trim="searchValue.text"
          :placeholder="searchValue.textType === 1 ? '请输入关键字' : searchValue.textType === 2 ? '请输入关键字': '请输入关键字'"
        ></el-input>
        <el-button class="shelves-btn" @click="goCheck" type="primary">查询</el-button>
        <el-button type="info" @click="resetFun" class="button-style shelves-btn">重置</el-button>
      </div>
    </div>
    <!-- 表格数据 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      class="table-wrapper"
      :height="clientHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column type="index" label="序号" width="50" :index="indexMethod"></el-table-column>
      <el-table-column prop="proPhotos" label="图片" key="proPhotos" width="50">
        <template slot-scope="scope">
          <!-- <img v-if="scope.row.proPhotos.length > 0" :src="scope.row.proPhotos[0].url" style="width: 60px;height:60px;object-fit: contain;"> -->
          <!-- <img v-if="scope.row.proPhotos.length > 0" :src="getD(scope.row.proPhotos)" style="width: 60px;height:60px;object-fit: contain;"> -->
          <img
            v-if="scope.row.photo"
            :src="scope.row.photo"
            style="width: 30px;height:30px;object-fit: contain;"
          />
          <img
            v-else
            src="@/assets/images/super-crm/cloud-showroom/default.png"
            style="width:30px;height: 30px;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" key="name" align="center">
        <template slot-scope="scope">
          <el-input
            v-if="scope.$index === editableIndex"
            size="small"
            v-model="scope.row.name"
            maxlength="20"
          ></el-input>
          <el-input
            v-else-if="tabIndex == 0"
            size="small"
            v-model.trim="scope.row.name"
            @blur="handleSave(scope.$index, scope.row)"
            maxlength="20"
          ></el-input>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="jMPName" label="JMP原名" key="JMPName" v-if="tabIndex !== 0"></el-table-column>
      <el-table-column prop="code" label="上架编号" key="code" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.shelvesRule === 1">
            条码号
            <br />
            {{scope.row.code}}
          </span>
          <span v-if="scope.row.shelvesRule === 2">
            外部款号
            <br />
            {{scope.row.code}}
          </span>
          <span v-if="scope.row.shelvesRule === 3">
            内部款号
            <br />
            {{scope.row.code}}
          </span>
          <span v-if="scope.row.shelvesRule === 4">
            原编号
            <br />
            {{scope.row.code}}
          </span>
          <span v-if="scope.row.shelvesRule === 5">
            线上编号
            <br />
            {{scope.row.code}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="storageType" label="类型" width="50" key="storageType">
        <template slot-scope="scope">
          <span v-if="scope.row.storageType == 1">首饰</span>
          <span v-if="scope.row.storageType == 2">饰品</span>
        </template>
      </el-table-column>
      <el-table-column prop="largeCategory" label="大类" width="70" key="largeCategory"></el-table-column>
      <el-table-column prop="smallCategory" label="小类" width="70" key="smallCategory"></el-table-column>
      <el-table-column prop="onlineType" label="热门分类" key="onlineType" align="center"></el-table-column>
      <el-table-column prop="largeOfflinePrice" label="线下价格" key="largeOfflinePrice">
        <template slot-scope="scope">
          <span v-if="scope.row.shelvesRule == 1">￥{{scope.row.smallOfflinePrice}}</span>
          <span v-else>
            ￥{{scope.row.smallOfflinePrice}} ~
            <br />
            ￥{{scope.row.largeOfflinePrice}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="priceRate" label="价格倍率" key="priceRate" width="80" align="center">
        <template slot-scope="scope">
          <el-input
            v-if="scope.$index === editableIndex"
            size="small"
            v-model.trim="scope.row.priceRate"
          ></el-input>
          <el-input
            v-else-if="tabIndex == 0"
            size="small"
            v-model.trim="scope.row.priceRate"
            @blur="handleSave(scope.$index, scope.row)"
          ></el-input>
          <span v-else>{{ scope.row.priceRate}}</span>
        </template>
      </el-table-column>
      <template v-if="tabIndex !== 0">
        <el-table-column prop="jMPStockCount" label="订购价格" key="jMPStockCount2">
          <template slot-scope="scope">
            <span v-if="scope.row.shelvesRule == 1">￥{{scope.row.smallOrderedPrice}}</span>
            <span v-else>
              ￥{{scope.row.smallOrderedPrice}}
              <span style="text-align:center">~</span>
              <br />
              ￥{{scope.row.largeOrderedPrice}}
            </span>
          </template>
        </el-table-column>
      </template>
      <!-- <template v-if="tabIndex !== 0"> -->
      <!-- <el-table-column
                prop="jMPStockCount"
                key="jMPStockCount"
                label="线上库存"
                width="80"
                align="right"
                >
      </el-table-column>-->
      <!-- <el-table-column
                prop="code"
                label="待发货"
                width="120">
                :render-header="rendHead"
      </el-table-column>-->
      <!-- </template> -->
      <el-table-column prop="jMPStockCount" label="库存" width="80" align="right" key="jmp"></el-table-column>
      <el-table-column
        prop="isNullStock"
        label="0库存下架"
        key="isNullStock"
        width="100"
        align="center"
      >
        <!-- <template slot-scope="scope" > -->
        <template slot-scope="scope">
          <el-switch
            v-if="scope.$index === editableIndex && tabIndex == 1"
            v-model="scope.row.isNullStock"
            active-text
            inactive-text
            active-color="#13ce66"
            inactive-color="#ccc"
            :active-value="1"
            :inactive-value="0"
            @change="switchChange($event, scope.row)"
          ></el-switch>
          <span
            v-else-if="scope.$index !== editableIndex && tabIndex == 1"
          >{{scope.row.isNullStock == 1 ? '开' : '关'}}</span>
          <el-switch
            v-else-if="tabIndex != 1"
            v-model="scope.row.isNullStock"
            active-text
            inactive-text
            active-color="#13ce66"
            inactive-color="#ccc"
            :active-value="1"
            :inactive-value="0"
            @change="switchChange($event, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="isAotoShelve"
        label="同款号商品"
        key="isAotoShelve"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-if="scope.$index === editableIndex && tabIndex == 1 && scope.row.shelvesRule != 1"
            v-model="scope.row.isAotoShelve"
            active-text
            inactive-text
            active-color="#13ce66"
            inactive-color="#ccc"
            :active-value="1"
            :inactive-value="0"
            @change="switchAuto($event, scope.row)"
          ></el-switch>
          <span
            v-else-if="scope.$index !== editableIndex && tabIndex == 1 && scope.row.shelvesRule != 1"
          >{{scope.row.isAotoShelve == 1 ? '自动上架开' : '自动上架关'}}</span>
          <span
            v-else-if="scope.$index !== editableIndex && tabIndex == 1 && scope.row.shelvesRule == 1"
          >--</span>
          <template v-else-if="tabIndex != 1 && scope.row.shelvesRule != 1">
            <el-switch
              v-model="scope.row.isAotoShelve"
              active-text
              inactive-text
              active-color="#13ce66"
              inactive-color="#ccc"
              :active-value="1"
              :inactive-value="0"
              @change="switchAuto($event, scope.row)"
            ></el-switch>
          </template>
          <template v-else-if="tabIndex != 1 && scope.row.shelvesRule == 1">
            <span>--</span>
          </template>
        </template>
        <!-- <template slot-scope="scope" v-if="searchValue.shelvesRule == 1 && tabIndex == 1"><span>--</span></template> -->
      </el-table-column>
      <el-table-column prop="presenter" label="推荐位" key="presenter" align="center"></el-table-column>
      <el-table-column prop="name" label="操作" key="oper" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <template v-if="tabIndex !== 0">
            <span
              class="opertion-text"
              v-if="scope.$index === editableIndex"
              @click="handleSave(scope.$index, scope.row)"
            >保存</span>
            <span class="opertion-text" v-else @click="handleEdit(scope.$index, scope.row)">编辑</span> |
          </template>
          <span
            class="opertion-text"
            @click="goGoodsDetail(scope.row.code,scope.row.id, scope.row.status, scope.row.shelvesRule, scope.row.storageType)"
          >详情</span>
          <br />
          <template v-if="tabIndex == 1">
            <span class="opertion-text" @click="copyId(scope.row)">复制商品编码</span> |
            <span class="opertion-text" @click="goShelves(scope.row, 2)">下架</span>
          </template>
          <template v-if="tabIndex == 0">
            <span class="opertion-text" @click="goShelves(scope.row, 1)">上架</span> |
            <span class="opertion-text" @click="batchDel(scope.row)">移除</span>
          </template>
          <template v-if="tabIndex == 2">
            <span class="opertion-text" @click="goShelves(scope.row, 1)">上架</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 全选 -->
    <div class="client-footer" style="margin-top: 20px">
      <el-button class="button-style" @click="toggleSelection(tableData)">全选</el-button>
      <el-select
        class="select-operation"
        v-model="operationValue"
        @change="selectFun"
        placeholder="批量操作"
        popper-class="select-popper"
      >
        <el-option
          v-for="item in opertions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button class="button-style" type="info" @click="getSelectOnLineCategorys">批量热门分类</el-button>
      <el-button class="button-style" type="info" @click="queryRecommendPosition">批量选择推荐位</el-button>
      <el-button class="button-style" type="info" @click="dialogPrice = true">批量设置价格倍率</el-button>
      <span
        class="stock-sum"
        style="float:right;margin-right: 15px;"
        v-if="tableData && tabIndex == 1 && tableData.length > 0"
      >线上库存共{{tableData[0].sumJMPStock}}件</span>
      <span
        class="stock-sum"
        style="float:right;margin-right: 15px;"
        v-else-if="tabIndex == 1"
      >线上库存共{{0}}件</span>
    </div>
    <!-- 支出类型 -->
    <!-- <template v-if="tabIndex === '0'">
        <div class="stay-type">
            支出类型：<el-radio v-model="radioType" label="1">全部</el-radio>
                      <el-radio v-model="radioType" label="2">收入</el-radio>
        </div>
        时间范围：  <el-date-picker
                        v-model="timeValue"
                        type="daterange"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
    </template>-->
    <!-- 分页 -->
    <div class="pagination-box">
      <el-pagination
        v-if="tableTotal != 0"
        layout="total,prev, pager, next,sizes, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        :page-size.sync="pageSize"
        :total="tableTotal"
      ></el-pagination>
    </div>
    <!-- 批量热门分类 -->
    <el-dialog
      title="选择热门分类"
      :visible.sync="dialogOnline"
      width="790"
      class="select-dialog"
      :before-close="classClose"
    >
      <el-checkbox-group v-model="onlineCheckList" class="dialog-checkbox">
        <el-checkbox
          v-for="(item, index) in selectCheckData"
          :label="item.categoryId"
          :key="index"
        >{{item.classifiedName}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer dialog-button">
        <el-button type="primary" @click="saveDialogOnline">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量选择推荐位 -->
    <el-dialog
      title="选择推荐位"
      :visible.sync="dialogSelect"
      width="25%"
      class="select-dialog"
      :before-close="presenterClose"
    >
      <el-checkbox-group v-model="selectCheckList" class="dialog-checkbox dialog-recom">
        <el-checkbox
          v-for="item in selectCommentData"
          :label="item.presenterSequence + ','+ item.id"
          :key="item.id"
        >{{item.presenterName}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer dialog-button">
        <el-button type="primary" @click="saveDialogSelect">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量设置价格倍率 -->
    <el-dialog
      title="设置价格倍率"
      :visible.sync="dialogPrice"
      width="25%"
      :before-close="handleClose"
      class="select-dialog select-price-radio"
    >
      <div class="dialog">
        <el-form :model="formTag" ref="formTag" :rules="priceRateRule">
          <el-form-item label="价格倍率：" :label-width="formLabelWidth" prop="priceRate">
            <el-input
              class="rate-input"
              v-model.trim="formTag.priceRate"
              placeholder="请设置"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <p class="rate-tip">说明：可填范围0.1-10，0.1即一折</p>
      </div>
      <span slot="footer" class="dialog-footer dialog-button">
        <el-button type="primary" @click="saveDialogPrice">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增上架 -->
    <el-dialog title="新增商品筛选" :visible.sync="dialogAddShelves" width="96%" class="select-dialog">
      <add-shelves
        ref="addElemt"
        @getSelectShelvesStatusNum="getData"
        :largeClassList="largeClassList"
        :subClassList="subClassList"
      ></add-shelves>
      <!-- <span slot="footer" class="dialog-footer dialog-button">
                <el-button type="primary" @click="dialogAddShelves=false">确 定</el-button>
      </span>-->
    </el-dialog>
    <!-- 批量操作提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="opertionDialog"
      width="20%"
      :center="true"
      :before-close="cancelOperation"
    >
      <span style="display:block;text-align:center;">{{opertionTitle}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOperation">取 消</el-button>
        <el-button type="primary" @click="okOpertion(opertionId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addShelves from './add-shelves'
import {
  getFindProduct,
  updateProNameAndPrice,
  queryRecommendPosition,
  getProductSubDetail,
  getProductDetail,
  getBatchDel,
  getBatchUpdateEqual,
  getBatchUpdateOnlineType,
  getBatchUpdatePresenter,
  getBatchUpdatePriceRatio,
  getBatchUpdateUp,
  getBatchUpdateZero,
  getSelectOnLineCategorys,
  getSelectPresenters,
  listCabinetGroup,
} from '@/api/super-crm/cloud-showroom-shelves'
import { getDisplay } from '@/api/super-crm/csr-classifySearch'
import { getWxShopList } from '@/api/super-crm/wx-member'
import { copyText } from '@/utils/copyText'
export default {
  components: {
    addShelves,
  },
  props: {
    tabIndex: {
      type: Number,
      default: () => 0,
    },
    curPage: {
      type: String,
    },
    searchValues: {
      type: Object,
    },
  },
  data() {
    return {
      searchItem: null,
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
      ],
      clientHeight: null,
      opertionDialog: false, // 批量操作弹窗
      opertionTitle: '', // 批量操作弹窗标题
      opertionId: '0', // 批量操作标识
      value: '',
      switchValue: true,
      operationValue: '', // 批量操作值
      dialogFormVisible: false,
      radioType: '1', // 支出类型值
      currentPage: 1, // 当前页
      pageSize: 10,
      tableTotal: 0,
      timeValue: '', // 日期值
      dialogAddShelves: false, // 新增上架
      dialogOnline: false, // 批量热门分类弹窗
      dialogSelect: false, // 批量选择推荐位弹窗
      dialogPrice: false, // 批量设置价格倍率
      onlineCheckList: [], // 批量热门分类弹窗选中值
      selectCheckList: [], // 批量选择推荐位选中值
      formLabelWidth: '110px', // 设置价格赔率输入框
      editableIndex: -1, // 编辑||保存标识
      multipleSelection: [], // 全选的值
      selectCheckData: [{ classifiedName: '', categoryIdId: '' }], // 批量热门分类
      selectCommentData: [{}],
      goodsDetailValue: [],
      arrList: [], // 列表数据
      searchValue: {
        shelvesRule: null, // 规则
        storageType: null, // 饰品类型
        startPrice: '', // 最低金额
        endPrice: '', // 最高金额
        startStock: '', // 最低库存
        endStock: '', // 最高库存
        largeCategory: '', // 大类
        smallCategory: '', // 小类
        presenter: '', // 推荐位
        text: '', // 搜索框
        status: null, // 上架状态
        textType: null, // 搜索类型
        shopName: null, // 分销商
        inCabinetGroup: null, // 柜组
      },
      searchItem: {
        shelvesRule: null, // 规则
        storageType: null, // 饰品类型
        startPrice: '', // 最低金额
        endPrice: '', // 最高金额
        startStock: '', // 最低库存
        endStock: '', // 最高库存
        largeCategory: '', // 大类
        smallCategory: '', // 小类
        presenter: '', // 推荐位
        text: '', // 搜索框
        status: null, // 上架状态
        textType: null, // 搜索类型
      },
      formTag: {
        // 批量设置价格倍率
        priceRate: '1',
      },
      priceRateRule: {
        priceRate: [{ required: true, message: '请设置价格倍率' }],
      },
      shelvesRuleList: [
        // 上架规则
        {
          value: 1,
          label: '条码号',
        },
        {
          value: 2,
          label: '外部款号',
        },
        {
          value: 3,
          label: '内部款号',
        },
        {
          value: 4,
          label: '原编号',
        },
        {
          value: 5,
          label: '线上编号',
        },
      ],
      styleList: [
        // 类型
        {
          value: 1,
          label: '首饰',
        },
        {
          value: 2,
          label: '饰品',
        },
      ],
      largeClassList: [
        // 大类
        {
          value: 0,
          label: '全部',
        },
        {
          value: '1',
          label: '大类',
        },
      ],
      subClassList: [
        // 小类
        {
          value: 0,
          label: '全部',
        },
        {
          value: '1',
          label: '小类',
        },
      ],
      shopNameList: [], // 分销商
      inCabinetGroupList: [], // 柜组
      recommendedBitList: [
        // 推荐位
        {
          value: '1',
          label: '全部推荐',
        },
        {
          value: '2',
          label: '爆款',
        },
        {
          value: '3',
          label: '推荐款',
        },
      ],
      textType: [
        // 推荐位
        {
          value: 3,
          label: '名称',
        },
        {
          value: 1,
          label: '条码号',
        },
        {
          value: 2,
          label: '上架编号',
        },
      ],
      tableData: [
        //     {
        //     photo: '', // 图片
        //     name: '', // 名称
        //     // phone: '13515258748',
        //     code: '', // 上架编码
        //     storageType: '', // 类型
        //     largeCategory: '', // 大类
        //     smallCategory: '', // 小类
        //     onlineType: '', // 热门分类
        //     largeOfflinePrice: '', // 线下价格最大值
        //     priceRate: '', // 订购价格倍率
        //     jMPStockCount: '', // JMP库存
        //     isNullStock: '', // 无库存下架 0：禁用，1：启用
        //     isAotoShelve: '', // 自动上架同款 0：禁用，1：启用
        //     presenter: '' // 推荐位
        // }
      ],
      opertions: [
        {
          value: '1',
          label: '批量操作',
        },
        {
          value: '2',
          label: '批量上架',
        },
        {
          value: '3',
          label: '批量移除',
        },
        {
          value: '4',
          label: '0库存下架开',
        },
        {
          value: '5',
          label: '0库存下架关',
        },
        {
          value: '6',
          label: '自动上架同款号商品-开',
        },
        {
          value: '7',
          label: '自动上架同款号商品-关',
        },
      ],
    }
  },
  mounted() {
    // 点击返回时的数据处理
    if (this.curPage !== '0') {
      this.currentPage = parseInt(this.curPage, 10)
      this.searchItem = this.searchValues
      this.searchValue = this.searchValues
    }
    // 推荐位调转过来的时候
    if (this.$route.query.index) {
      setTimeout(() => {
        this.getFindProduct(this.tabIndex)
      }, 10)
    } else {
      this.getFindProduct(this.tabIndex)
    }
    this.recommendPosition()
    this.largeClassList.length = 0
    this.subClassList.length = 0
    this.getHeight()
    window.onresize = () => {
      this.$nextTick(() => {
        this.getHeight()
      })
    }
    this.autoGetShop()
  },
  methods: {
    // 查询分销商
    getWxShopList() {
      if (!this.searchValue.storageType) {
        this.shopNameList = []
        this.$message({
          message: '请选择类型',
          type: 'error',
        })
        return
      }
      getWxShopList().then((res) => {
        if (res.code === 0) {
          this.shopNameList = res.data
            ? res.data.map((item) => {
                return {
                  value: item.shopName,
                  label: item.shopName,
                }
              })
            : []
        }
      })
    },
    // 分销商值改变后清空柜组选中的值
    getShopChange() {
      this.searchValue.inCabinetGroup = ''
    },
    // 查询柜组
    listCabinetGroup() {
      if (!this.searchValue.shopName) {
        this.inCabinetGroupList = []
        this.$message({
          message: '请选择分销商',
          type: 'error',
        })
        return
      }
      const params = {
        shopName: this.searchValue.shopName,
      }
      listCabinetGroup(params).then((res) => {
        if (res.code === 0) {
          this.inCabinetGroupList = res.data
            ? res.data.map((item) => {
                return {
                  value: item,
                  label: item,
                }
              })
            : []

          this.inCabinetGroupList.unshift({ value: '0', label: '全部' })
        }
      })
    },
    // 新增
    dialogAddFn() {
      this.dialogAddShelves = true
      this.$nextTick(() => {
        this.$refs.addElemt.getFindStockProduts()
      })
    },
    // 索引
    indexMethod(index) {
      return index + this.pageSize * (this.currentPage - 1) + 1
    },
    rendHead(h, { column, $index }) {
      let sumJpmStock
      if (this.tableData.length > 0) {
        sumJpmStock = this.tableData[0].sumJMPStock
      } else {
        sumJpmStock = 0
      }
      return h('div', {
        attrs: {
          class: 'cell', // ele原来样式
        },
        domProps: {
          // innerHTML: `<span>线上库存 \n(共${sumJpmStock}件)</span>`
          innerHTML: `<span>线上库存</span>`,
        },
      })
    },
    // 设置高度
    getHeight() {
      // this.clientHeight = document.body.clientHeight - 400;
      this.clientHeight = window.innerHeight - 380
    },
    // 复制商品id和类型
    async copyId(row) {
      try {
        if (row.id) {
          const params = [row.id, row.storageType]
          await copyText(params)
          this.$message.success('复制成功')
        } else {
          this.$message.error('获取不到商品id')
        }
      } catch (error) {
        this.$message.warning('复制失败')
      }
    },
    // 已上架设置
    changeVal(index) {
      if (index == 1) {
        const i = this.opertions.findIndex((p) => p.value === '2')
        this.$set(this.opertions, i, { value: '22', label: '批量下架' })
        this.opertions = this.opertions.filter((item) => item.value !== '3')
      }
    },
    // 全选
    toggleSelection(rows) {
      if (rows) {
        this.$refs.multipleTable.toggleAllSelection()
      }
    },
    // 0库存开启关闭
    switchChange(value, data) {
      const proIds = [data.id]
      const params = {
        proIds,
        status: value,
      }
      getBatchUpdateZero(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: value == 1 ? '0库存下架已开启成功' : '0库存下架已关闭成功',
          })
        }
      })
    },
    // 自动上架同款号商品开启或关闭
    switchAuto(value, data) {
      const proIds = [data.id]
      const params = {
        proIds,
        status: value,
      }
      getBatchUpdateEqual(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message:
              value == 1
                ? '自动上架同款商品已开启成功'
                : '自动上架同款商品已关闭成功',
          })
        }
      })
    },
    // 关闭批量分类
    classClose() {
      this.dialogOnline = false
      this.onlineCheckList = []
    },
    // 关闭批量选择推荐位
    presenterClose() {
      this.dialogSelect = false
      this.selectCheckList = []
    },
    // 移除类型值
    removeVal() {
      this.searchValue.largeCategory = ''
      this.searchValue.smallCategory = ''
    },
    // 查询分类 1位上架管理 2 新增
    getDisplay(isCode) {
      console.log('先来看看', this.searchValue.storageType, isCode)
      if (!this.searchValue.storageType) {
        if (isCode === 1) {
          this.$message({
            message: '请选择类型',
            type: 'error',
          })
        }
        return
      }
      getDisplay().then((res) => {
        if (res.code === 0) {
          if (this.searchValue.storageType == 1) {
            this.displayFun(res, '002', 'CTYPE')
          } else {
            this.displayFun(res, 'JRTYPE', 'PFT')
          }
        }
      })
    },
    // 修改自动查询分销商
    // 此次修改会出大问题， 因为有些门店确实没有这种类型，
    // 自然应该搜不到，但是又搜出来了
    autoGetShop() {
      console.log('自动获取门店')
      getWxShopList().then((res) => {
        console.log('门店', res.data)
        if (res.code === 0) {
          this.shopNameList = res.data
            ? res.data.map((item) => {
                return {
                  value: item.shopName,
                  label: item.shopName,
                }
              })
            : []
        }
      })
    },
    // 查询分类
    displayFun(res, bigC, smallC) {
      this.largeClassList = res.data
        ? res.data
            .reduce((acc, cur) => {
              const list = acc.concat(cur.subclassList)
              return list
            }, [])
            .filter((p) => p.identification == bigC)
            .map((p) => {
              return {
                value: p.originalSubclass,
                label: p.originalSubclass,
              }
            })
        : []

      this.largeClassList.unshift({ value: 0, label: '全部' })

      this.subClassList = res.data
        ? res.data
            .reduce((acc, cur) => {
              const list = acc.concat(cur.subclassList)
              return list
            }, [])
            .filter((p) => p.identification == smallC)
            .map((p) => {
              return {
                value: p.originalSubclass,
                label: p.originalSubclass,
              }
            })
        : []

      this.subClassList.unshift({ value: 0, label: '全部' })
    },
    // 选中的值
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击查询
    goCheck() {
      this.currentPage = 1
      this.searchItem = JSON.parse(JSON.stringify(this.searchValue))
      if (this.searchValue.text && this.searchValue.textType === null) {
        // 根据产品需要去掉
        // this.$message.error('请选择查询类型')
        // return
      }
      const transInCabinetGroup = this.searchItem.inCabinetGroup == '0' ? '' : this.searchItem.inCabinetGroup // 转换全部
      const translargeCategory = this.searchItem.largeCategory == '0' ? '' : this.searchItem.largeCategory // 转换全部
      const transsmallCategory = this.searchItem.smallCategory == '0' ? '' : this.searchItem.smallCategory // 转换全部
      const transpresenter = this.searchItem.presenter == '全部' ? '' : this.searchItem.presenter // 转换全部
      this.searchItem.inCabinetGroup = transInCabinetGroup
      this.searchItem.smallCategory = transsmallCategory
      this.searchItem.largeCategory = translargeCategory
      this.searchItem.presenter = transpresenter
      this.getFindProduct(this.tabIndex)
    },
    // 上架列表查询
    getFindProduct(tabIndex, type) {
      // type 仅只是点击查询时候的标识
      this.searchItem.status = tabIndex
      let params = {}
      // if (type === 2) {
      //     // 点击查询的标识
      //     this.currentPage = 1;
      // }
      params = {
        data: this.searchItem,
        page: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        },
      }
      getFindProduct(params).then((res) => {
        if (res.code === 0) {
          this.tableData = []
          this.tableData = res.replyData.list ? res.replyData.list : []
          this.tableTotal = res.replyData.total
        }
      })
    },
    // 批量操作弹窗
    okOpertion(val) {
      // 批量上架
      if (val === '2') {
        this.getBatchUpdateUp(this.multipleSelection, 1)
      }
      // 批量下架
      if (val === '22') {
        this.getBatchUpdateUp(this.multipleSelection, 2)
      }
      // 批量移除
      if (val === '3') {
        this.getBatchDel()
      }
      // 0库存开启
      if (val === '4') {
        this.getBatchUpdateZero('1')
      }
      // 0库存关闭
      if (val === '5') {
        this.getBatchUpdateZero('0')
      }
      // 自动上架同款商品开启
      if (val === '6') {
        this.getBatchUpdateEqual('1')
      }
      // 自动上架同款商品关闭
      if (val === '7') {
        this.getBatchUpdateEqual('0')
      }
    },
    // 批量操作 取消
    cancelOperation() {
      this.opertionDialog = false
      this.operationValue = '1'
    },
    // 批量操作
    selectFun(val) {
      if (val !== '1') {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择要操作的数据',
          })
          this.operationValue = '1'
          return
        }
        this.opertionDialog = true
      }
      // 批量上架
      if (val === '2') {
        this.opertionId = val
        this.opertionTitle = '确定批量上架吗?'
      }
      // 批量下架
      if (val === '22') {
        this.opertionId = val
        this.opertionTitle = '确定批量下架吗?'
      }
      // 批量移除
      if (val === '3') {
        this.opertionId = val
        this.opertionTitle = '确定批量移除吗?'
      }
      // 0库存开启或关闭
      if (val === '4') {
        this.opertionId = val
        this.opertionTitle = '确定开启批量0库存下架吗?'
      }
      // 0库存关闭
      if (val === '5') {
        this.opertionId = val
        this.opertionTitle = '确定关闭批量0库存下架吗?'
      }
      // 自动上架同款商品开启
      if (val === '6') {
        this.opertionId = val
        this.opertionTitle = '确定开启批量自动上架同款商品吗?'
      }
      // 自动上架同款商品关闭
      if (val === '7') {
        this.opertionId = val
        this.opertionTitle = '确定关闭批量自动上架同款商品吗?'
      }
    },
    // 批量上架
    getBatchUpdateUp(data, status) {
      const id = data.map((item) => {
        return item.id
      })
      const params = {
        status, // 1为已上架 0为待上架 2为已下架
        proIds: id,
      }
      getBatchUpdateUp(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: status === 1 ? '上架成功' : '下架成功',
          })
          this.getFindProduct(this.tabIndex)
          // 刷新上架接口
          this.$emit('getSelectShelvesStatusNum')
          this.opertionDialog = false
          this.operationValue = '1'
        }
      })
    },
    // 单个上架
    goShelves(data, status) {
      const list = []
      list.push(data)
      const proIds = list.map((item) => {
        return item.id
      })
      const params = {
        status,
        proIds,
      }

      getBatchUpdateUp(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: status !== 2 ? '上架成功' : '下架成功',
          })
          this.getFindProduct(this.tabIndex)
          // 刷新上架接口
          this.$emit('getSelectShelvesStatusNum')
          this.opertionDialog = false
        }
      })
    },
    // 批量移除
    getBatchDel() {
      const params = this.multipleSelection.map((item) => {
        return item.id
      })
      getBatchDel(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '移除成功',
          })
          this.getFindProduct(this.tabIndex)
          // 刷新上架接口
          this.$emit('getSelectShelvesStatusNum')
          this.opertionDialog = false
          this.operationValue = '1'
        }
      })
    },
    // 单个移除
    batchDel(data) {
      const params = [data.id]
      getBatchDel(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '移除成功',
          })
          this.getFindProduct(this.tabIndex)
          // 刷新上架接口
          this.$emit('getSelectShelvesStatusNum')
        }
      })
    },
    // 批量0库存开启或关闭
    getBatchUpdateZero(status) {
      const proIds = this.multipleSelection.map((item) => {
        return item.id
      })
      const data = {
        proIds,
        status,
      }
      getBatchUpdateZero(data).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message:
              status === '1' ? '0库存下架已开启成功' : '0库存下架已关闭成功',
          })
          this.getFindProduct(this.tabIndex)
          // 刷新上架接口
          this.$emit('getSelectShelvesStatusNum')
          this.opertionDialog = false
          this.operationValue = '1'
        }
      })
    },
    // 批量自动上架同款商品关闭或者开启
    getBatchUpdateEqual(status) {
      const proIds = this.multipleSelection.map((item) => {
        return item.id
      })
      const data = {
        proIds,
        status,
      }
      getBatchUpdateEqual(data).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message:
              status === '1'
                ? '批量自动上架同款商品已开启成功'
                : '批量自动上架同款商品已关闭成功',
          })
          this.getFindProduct(this.tabIndex)
          // 刷新上架接口
          this.$emit('getSelectShelvesStatusNum')
          this.opertionDialog = false
          this.operationValue = '1'
        }
      })
    },
    // 调用父组件查询上架接口
    getData() {
      this.$emit('getSelectShelvesStatusNum')
      this.getFindProduct(this.tabIndex)
    },
    // 热门分类结果集查询
    getSelectOnLineCategorys() {
      this.dialogOnline = true
      const params = {
        pageNum: 1,
        pageSize: 12,
      }
      getSelectOnLineCategorys(params).then((res) => {
        if (res.code === 0) {
          this.onlineCheckList = []
          this.selectCheckData = res.data.list ? res.data.list : []
          this.selectCheckData = this.selectCheckData.filter(
            (item) => item.status === 1
          )
          // const checkArr = this.selectCheckData.filter(p => p.status === 1)
          // checkArr.forEach((v) => {
          //     this.onlineCheckList.push(v.categoryId)
          // })
        }
      })
    },
    // 推荐位名称结果集查询
    queryRecommendPosition() {
      this.dialogSelect = true
      queryRecommendPosition().then((res) => {
        if (res.code === 0) {
          this.selectCommentData = res.data ? res.data : []
          this.selectCommentData.forEach((v, i) => {
            this.selectCommentData[i].checked = true
          })
        }
      })
    },
    // 推荐位名称结果查询
    recommendPosition() {
      console.log('查询推荐位')
      queryRecommendPosition().then((res) => {
        if (res.code === 0) {
          const recommend = res.data ? res.data : []
          console.log('推荐位数据', recommend)
          this.recommendedBitList = recommend.map((item) => {
            return {
              value: item.presenterSequence,
              label: item.presenterName,
            }
          })

          this.recommendedBitList.unshift({value: '0', label: '全部'})
        }
      })
    },
    // 批量设置价格倍率
    getBatchUpdatePriceRatio() {
      const proIds = this.multipleSelection.map((item) => {
        return item.id
      })
      const params = {
        proIds,
        priceRatio: parseFloat(this.formTag.priceRate),
      }
      getBatchUpdatePriceRatio(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: '批量设置价格倍率成功',
            type: 'success',
          })
          this.getFindProduct(this.tabIndex)
        }
      })
    },

    // 分页
    handleSizeChange(val) {
      this.getFindProduct(this.tabIndex)
    },
    handleCurrentChange(val) {
      this.getFindProduct(this.tabIndex)
    },
    // 输入数字
    handleClick(type) {
      switch (type) {
        case 'startPrice':
          this.searchValue.startPrice = this.searchValue.startPrice
            .toString()
            .replace(/[^\d.]/g, '')
        case 'endPrice':
          this.searchValue.endPrice = this.searchValue.endPrice
            .toString()
            .replace(/[^\d.]/g, '')
        case 'startStock':
          this.searchValue.startStock = this.searchValue.startStock
            .toString()
            .replace(/[^\d]/g, '')
        case 'endStock':
          this.searchValue.endStock = this.searchValue.endStock
            .toString()
            .replace(/[^\d]/g, '')
      }
    },
    // 编辑
    handleEdit(index, item) {
      this.editableIndex = index
    },
    // 切换tab的时候重置编辑状态
    resetM() {
      this.editableIndex = -1
    },
    // 保存
    handleSave(index, item) {
      if (item.name === '') {
        this.$message.error('名称不能为空')
        return
      }
      const regex = /^(0\.([1-9]{1,4})|\d\.[0-9]{1,4}|[1-9]|10)$/
      const result = regex.test(item.priceRate)
      if (!result) {
        this.$message({
          message: '可填范围0.1-10',
          type: 'error',
        })
        return
      }
      this.editableIndex = -1
      const params = {
        name: item.name,
        proId: item.id,
        priceRate: parseFloat(item.priceRate, 10),
      }
      updateProNameAndPrice(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success',
          })
          this.getFindProduct(this.tabIndex)
        }
      })
    },
    // 重置
    resetFun() {
      this.searchValue.shelvesRule = ''
      this.searchValue.storageType = ''
      this.searchValue.startPrice = ''
      this.searchValue.endPrice = ''
      this.searchValue.startStock = ''
      this.searchValue.endStock = ''
      this.searchValue.largeCategory = ''
      this.searchValue.smallCategory = ''
      this.searchValue.presenter = ''
      this.searchValue.text = ''
      this.searchValue.textType = null
      this.searchValue.shopName = ''
      this.searchValue.inCabinetGroup = ''
      this.searchItem = this.searchValue

      this.largeClassList.length = 0
      this.subClassList.length = 0
    },
    // 关闭弹窗
    handleClose() {
      this.dialogPrice = false
      this.removeRule()
    },
    // 去除批量设置倍率必填结果
    removeRule() {
      const ele = this.$refs.formTag
      ele.resetFields()
    },
    // 批量热门分类-确定
    saveDialogOnline() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要操作的数据',
        })
        return
      }
      this.dialogOnline = false
      const proIds = this.multipleSelection.map((item) => {
        return item.id
      })
      const params = {
        onlineTypeIds: this.onlineCheckList,
        proIds,
      }
      getBatchUpdateOnlineType(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: '批量热门分类成功',
            type: 'success',
          })
          this.getFindProduct(this.tabIndex)
          this.onlineCheckList = []
        }
      })
    },
    // 批量选择推荐位 - 确定
    saveDialogSelect() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要操作的数据',
        })
        return
      }
      this.dialogSelect = false
      const proIds = this.multipleSelection.map((item) => {
        return item.id
      })
      const recommendProductVo = this.selectCheckList.map((item) => {
        return {
          presenterSequence: item.split(',')[0],
          id: item.split(',')[1],
        }
      })
      const params = {
        recommendProductVo,
        proIds,
      }
      getBatchUpdatePresenter(params).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: res.msg,
          })
          this.getFindProduct(this.tabIndex)
          this.selectCheckList = []
        }
      })
    },
    // 批量设置价格倍率 - 确定
    saveDialogPrice() {
      const regex = /^(0\.([1-9]{1,4})|\d\.[0-9]{1,4}|[1-9]|10)$/
      const result = regex.test(this.formTag.priceRate)
      if (!result) {
        this.$message({
          message: '可填范围0.1-10',
          type: 'error',
        })
      } else {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择要操作的数据',
          })
          return
        }
        this.dialogPrice = false
        this.getBatchUpdatePriceRatio()
      }
    },
    // 商品详情传值
    goGoodsDetail(code, id, status, rule, stockStyle) {
      this.$emit('go-detail', '1')
      this.$emit('get-data', id, code)
      this.$emit('get-status', status)
      this.$emit('get-shelve-rule', rule)
      this.$emit('get-stock-style', stockStyle, this.searchItem)
      localStorage.setItem('currentPage', this.currentPage)
    },
  },
}
</script>

<style lang="scss">
.client-wrapper {
  .el-dialog {
    width: 790px;
  }
  .client-search {
    &:after {
      display: block;
      overflow: hidden;
      content: '';
      clear: both;
    }
    .client-search-box {
      // float: right;
      .search-title {
        font-size: 12px;
        color: #666;
        font-weight: 600;
        margin-left: 4px;
      }
      .shelves-add-btn {
        margin-right: 30px;
        width: 68px;
        font-size: 12px;
        padding: 7px;
      }
      .el-select {
        margin: 6px 6px;
      }
      .search-input {
        width: 120px;
        font-size: 12px;
        .el-input__inner {
          height: 28px;
          line-height: 28px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
      .shelves-input {
        width: 80px;
        margin: 0 2px;
        font-size: 12px;
        height: 28px;
        .el-input__inner {
          height: 28px;
          line-height: 28px;
        }
      }
      .shelves-input01 {
        width: 94px;
      }
      .el-select {
        width: 95px;
        .el-input {
          height: 28px;
          font-size: 12px;
          .el-input__inner {
            height: 28px;
            line-height: 28px;
          }
        }
        .el-input__icon {
          line-height: 28px;
        }
      }
      .el-select-box {
        width: 84px;
      }
      .goShop {
        width: 127px;
      }
    }
  }
  .table-wrapper {
    margin-top: 8px;
    .has-gutter {
      tr {
        th.is-leaf {
          background: #f2f5f8;
          .cell {
            font-size: 12px;
            font-weight: 600;
            color: #666;
          }
        }
      }
    }
    th {
      background: #f2f5f8;
      .cell {
        font-size: 12px;
        font-weight: 600;
        color: #666;
      }
    }
    .el-table__body-wrapper {
      .el-table__row {
        .cell {
          font-size: 12px;
          color: #666;
          font-weight: 400;
          .el-input {
            font-size: 12px;
          }
        }
      }
    }
    .el-table__body {
      .el-table__row {
        .cell {
          font-size: 12px;
          .opertion-text {
            color: #3e3ef4;
            cursor: pointer;
            font-weight: 400;
          }
        }
      }
    }
  }
  .client-footer {
    button {
      margin-right: 10px;
    }
    .el-select {
      margin-right: 10px;
    }
  }
  .stay-type {
    margin: 20px 0;
  }
  .pagination-box {
    position: relative;
    padding: 50px 0 10px;
    .el-pagination {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  .shelves-btn {
    width: 68px;
    padding: 7px;
    font-size: 12px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    position: relative;
    bottom: 0.5px;
  }
  .button-style {
    background: #f7f7f7;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    span {
      color: #666;
      font-size: 12px;
    }
  }
  .select-operation {
    width: 150px;
    .el-input--suffix {
      font-size: 12px;
    }
  }
  .dialog-checkbox {
    .el-checkbox {
      margin-top: 15px;
    }
    .el-checkbox__label {
      width: 80px;
      font-size: 12px;
      text-align: left;
    }
  }
  .dialog-recom {
    text-align: center;
  }
  .select-dialog {
    .el-dialog__header {
      position: relative;
      &::after {
        position: absolute;
        bottom: 0;
        left: 20px;
        right: 20px;
        height: 1px;
        content: '';
        background-color: #e9e9e9;
      }
      .el-dialog__title {
        padding-bottom: 8px;
        // border-bottom: 2px solid #409EFF;
        font-size: 14px;
        color: #666;
      }
    }
    .el-dialog__body {
      .el-checkbox {
        font-size: 12px;
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
    .dialog-button {
      button {
        width: 60%;
        cursor: pointer;
        padding: 8px;
      }
    }
    .rate-input {
      width: 90px;
      .el-input__inner {
        text-align: center;
        font-size: 12px;
        height: 34px;
        line-height: 34px;
      }
    }
    .rate-tip {
      padding-left: 32px;
      font-size: 12px;
      color: #424754;
    }
  }
  .select-price-radio {
    .el-dialog__body {
      .el-form-item__label {
        font-size: 12px;
        color: #7e869f;
      }
    }
  }
  .el-select-dropdown__item {
    font-size: 12px;
  }
  .el-radio__label {
    font-size: 12px;
    font-weight: 600;
  }
}
.select-popper {
  .el-select-dropdown__item,
  .el-select-dropdown__empty {
    font-size: 12px;
  }
}
</style>
