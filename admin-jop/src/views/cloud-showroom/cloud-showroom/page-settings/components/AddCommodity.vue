<template>
  <div class="add-commodity">
    <el-form size="mini" :inline="true" ref="form" :model="form.data" class="form">
      <el-form-item label="价格区间：">
        <el-input
          :min="0"
          v-model.number="form.data.startPrice"
          placeholder="最低金额"
          type="number"
          style="width: 100px"
        >
        </el-input>
        -
        <el-input
          :min="form.data.startPrice"
          v-model.number="form.data.endPrice"
          placeholder="最高金额"
          type="number"
          style="width: 100px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="库存区间：">
        <el-input
          :min="0"
          v-model.number="form.data.startStock"
          placeholder="最低库存"
          type="number"
          style="width: 100px"
        >
        </el-input>
        -
        <el-input
          :min="form.data.startStock"
          v-model.number="form.data.endStock"
          placeholder="最高库存"
          type="number"
          style="width: 100px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="类型：">
        <el-select
          v-model="form.data.storageType"
          @change="onStorageTypeChange"
        >
          <el-option
            label="首饰"
            :value="1"
          >
          </el-option>
          <el-option
            label="饰品"
            :value="2"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="大类：">
        <el-select
          v-model="form.data.largeCategory"
        >
          <el-option
            v-for="item in largeCategoryList"
            :key="item.value"
            :label="item.originalSubclass"
            :value="item.originalSubclass"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小类：">
        <el-select
          v-model="form.data.smallCategory"
        >
          <el-option
            v-for="item in smallCategoryList"
            :key="item.value"
            :label="item.originalSubclass"
            :value="item.originalSubclass"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索类型：">
        <el-select v-model="form.data.textType">
          <el-option
            v-for="item in textType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.data.text"
          style="width: 180px"
          placeholder="可输入名称、款号等搜索"
          @keydown.enter.native="query"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        label="图片"
        width="200"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.photo"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        width="160"
        prop="name"
      >
      </el-table-column>
      <el-table-column
        label="条码 / 款号"
        width="160"
        prop="code"
      >
      </el-table-column>
      <el-table-column
        label="大类"
        width="100"
        prop="largeCategory"
      >
      </el-table-column>
      <el-table-column
        label="小类"
        width="100"
        prop="smallCategory"
      >
      </el-table-column>
      <el-table-column
        label="订购标价"
        width="120"
        prop="smallCategory"
      >
        <template slot-scope="scope">
          最低：{{scope.row.smallOfflinePrice}}
          <br />
          最高：{{scope.row.largeOrderedPrice}}
        </template>
      </el-table-column>
      <el-table-column
        label="库存数量"
        width="100"
        prop="jMPStockCount"
      >
      </el-table-column>
      <el-table-column
        label="已添加推荐位"
        prop="presenter"
      >
      </el-table-column>
    </el-table>
    <footer>
      <div class="left">
        <el-button
          type="primary"
          @click="onAdd"
        >
          确认添加
        </el-button>
      </div>
      <div class="right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="form.page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.page.total">
        </el-pagination>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { getFindProduct } from '@/api/super-crm/cloud-showroom-shelves';
import { getDisplay } from '@/api/super-crm/csr-classifySearch';
import { addRecommendProduct } from '@/api/super-crm/cloud-showroom-recommend';
import { imagesUrl } from '@/utils/imageUrl';


@Component({
})
export default class AddCommodity extends Vue {
  @Prop({
    type: Number,
    required: true
  })
  id!: number;

  @Prop({
    type: Boolean,
    required: true
  })
  isShow!: boolean;

  form = {
    data: {
      storageType: 1, // 1首饰, 2饰品
      status: 1,
      text: '', // 关键字
      textType: 3,
      largeCategory: null, // 大类
      smallCategory: null, // 小类
      presenter: null, // 推荐位
      startPrice: null, // 最小价格
      endPrice: null, // 最大价格
      startStock: null, // 最小库存
      endStock: null, // 最大库存
    },
    page: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    }
  }
  multipleSelection = [];

  tableData = [];

  imagesUrl = imagesUrl;

  // 搜索类型
  textType = [
    {
        value: 3,
        label: '名称'
    },
    {
        value: 1,
        label: '条码号'
    },
      {
        value: 2,
        label: '上架编号'
    },
  ]

  // 大类
  largeCategoryList: any[] = [];

  // 小类
  smallCategoryList: any[] = [];

  // 首饰大类
  largeCategory: any[] = [];

  // 首饰小类
  smallCategory: any[] = [];

  // 饰品大类
  accessoryLargeCategory: any[] = [];

  // 饰品小类
  accessorySmallCategory: any[] = [];

  @Watch('isShow')
  watchIsShow(value: boolean) {
    if (value) {
      this.init();
    }
  }

  mounted() {
    this.getTypeList();
    this.getTableData();
  }

  init() {
    this.reset();
    this.getTableData();
  }

  // 首饰类型改变
  onStorageTypeChange(value: number) {
    switch (value) {
      case 1:
        this.largeCategoryList = this.largeCategory;
        this.smallCategoryList = this.smallCategory;
        this.form.data.largeCategory = null;
        this.form.data.smallCategory = null;
        break;
      case 2:
        this.largeCategoryList = this.accessoryLargeCategory;
        this.smallCategoryList = this.accessorySmallCategory;
        this.form.data.largeCategory = null;
        this.form.data.smallCategory = null;
        break;
      default:
        this.largeCategoryList = [];
        this.smallCategoryList = [];
        this.form.data.largeCategory = null;
        this.form.data.smallCategory = null;
    }
  }

  // 监听添加按钮
  async onAdd() {
    await this.addRecommendProduct();
    await this.getTableData();
    this.multipleSelection = [];
  }

  // 添加商品
  async addRecommendProduct() {
    const body = this.multipleSelection.map((value: any) => {
      return {
        productId: value.id,
        presenterId: this.id
      }
    })

    const res = await addRecommendProduct(body);
    this.$emit('added')
    this.$message.success('添加成功');
  }

  // 查询
  query() {
    this.form.page.pageNum = 1;
    this.getTableData();
  }

  // 列表数量改变
  handleSizeChange(value: number) {
    this.form.page.pageSize = value;
    this.getTableData();
  }

  // 翻页
  handleCurrentChange(value: number) {
    this.form.page.pageNum = value;
    this.getTableData();
  }

  // 多选
  handleSelectionChange(value: any) {
    this.multipleSelection = value;
  }

  // 重置
  reset() {
    this.form.data = {
      storageType: 1,
      status: 1,
      text: '', // 关键字
      textType: 3,
      largeCategory: null, // 大类
      smallCategory: null, // 小类
      presenter: null, // 推荐位
      startPrice: null, // 最小价格
      endPrice: null, // 最大价格
      startStock: null, // 最小库存
      endStock: null, // 最大库存
    }

    this.form.page.pageNum = 1;
    this.getTableData();
  }

  // 获取分类
  async getTypeList() {
    const body = {}

    const {data} = await getDisplay(body);

    data.forEach((value: any) => {
      switch (value.identification) {
        case '002':
          this.largeCategory = value.subclassList;
          break;
        case 'CTYPE':
          this.smallCategory = value.subclassList;
          break;
        case 'JRTYPE':
          this.accessoryLargeCategory = value.subclassList;
          break;
        case 'PFT':
          this.accessorySmallCategory = value.subclassList;
          break;
        default:
          break;
      }
    });

    this.onStorageTypeChange(this.form.data.storageType);
  }

  // 获取列表数据
  async getTableData() {
    const data = this.form.data;
    const {
      replyData,
    } = await getFindProduct(this.form);
    const {
      list,
      pageNum,
      pageSize,
      pages,
      size,
      total
    } = replyData;

    this.tableData = list;
    this.form.page.total = total;
    this.form.page.pageSize = pageSize;
    this.form.page.pageNum = pageNum;
  }
}
</script>

<style lang="scss" scoped>
  .add-commodity {
    > footer {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
