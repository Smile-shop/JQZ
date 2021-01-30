<template>
  <div class="detail">
    <form-bar>
      <el-form size="mini" v-model="form" :inline="true">
        <el-form-item label="时间段筛选：">
          <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="大类：">
          <el-select
            clearable
            v-model="form.largeCategory"
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
            clearable
            v-model="form.smallCategory"
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
        <el-form-item>
          <el-button
            type="primary"
            @click="onQuery"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </form-bar>
    <app-gutter/>
    <dl v-if="count" class="statistics">
      <dt>
        {{$route.query.saleName}}
      </dt>
      <dd>
        <span class="key">
          累计销售：
        </span>
        ¥{{count.amountSum}}
      </dd>
      <!-- <dd>
        <span class="key">
          累计提成：
        </span>
        ¥{{count.commissionSum}}
      </dd> -->
      <!-- <dd>
        <span class="key">
          分享次数：
        </span>
        {{count.shareCount}}
      </dd>
      <dd>
        <span class="key">
          分享注册人数：
        </span>
        {{count.shareRegisteredPop}}
      </dd>
      <dd>
        <span class="key">
          分享消费金额：
        </span>
        ¥{{count.shareAmount}}
      </dd> -->
    </dl>
    <app-gutter/>
    <el-table
      :data="table"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="商品名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="largeCategory"
        label="大类"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="smallCategory"
        label="小类"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="stockNum"
        label="数量"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="weight"
        label="总重"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="goldWeight"
        label="金重"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="mainStoneWeight"
        label="主石"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="viceStoneWeight"
        label="副石"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        label="实售价"
        width="100"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="commission"
        label="提成"
        width="100"
      >
      </el-table-column> -->
      <el-table-column
        prop="spentTime"
        label="消费时间"
        width="150"
      >
        <template slot-scope="scope">
          {{moment(scope.row.spentTime).format('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="消费金额"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="spentName"
        label="消费者"
      >
      </el-table-column>
    </el-table>
    <app-gutter/>
    <el-pagination
      class="pagination"
      @current-change="pageTurning"
      :current-page.sync="form.pageNum"
      :page-size="form.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="form.total"
      background
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {} from '@/api/super-crm/wx-mall';
import { getDisplay } from '@/api/super-crm/csr-classifySearch';
import FormBar from '@/components/FormBar.vue';
import AppGutter from '@/components/AppGutter.vue';
import { getDetailShareData, getStatisticsDetail } from '@/api/super-crm/wx-mall';
import moment from 'moment'

@Component({
  components: {
    FormBar,
    AppGutter
  }
})
export default class SalesmanSalesDataDetail extends Vue {
  form = {
    memberCard: '',
    saleId: '',
    startTime: '',
    endTime: '',
    time: [moment().subtract(3, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    checkedType: [],
    largeCategory: null,
    smallCategory: null,
    pageNum: 1,
    pageSize: 20,
    total: 0,
    storageType: 1,
  };

  count: any = null;

  table: any[] = [];

  pickerOptions = {
    disabledDate(time: Date) {
      return time.getTime() < moment().subtract(1, 'year').valueOf() || time.getTime() > moment().valueOf();
    }
  }

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

  moment = moment;

  mounted() {
    this.init();
    this.getTypeList();
    this.getDetailShareData();
    this.getStatisticsDetail();
  }

  init() {
    const { startTime, endTime, saleId, memberCard } = this.$route.query;
    this.form.time = [startTime as string, endTime as string];
    this.form.saleId = saleId as string;
    this.form.memberCard = memberCard as string;
  }


  onQuery() {
    this.form.pageNum = 1;
    this.getDetailShareData();
    this.getStatisticsDetail();
  }

  // 首饰类型改变
  onStorageTypeChange(value: number) {
    switch (value) {
      case 1:
        this.largeCategoryList = this.largeCategory;
        this.smallCategoryList = this.smallCategory;
        this.form.largeCategory = null;
        this.form.smallCategory = null;
        break;
      case 2:
        this.largeCategoryList = this.accessoryLargeCategory;
        this.smallCategoryList = this.accessorySmallCategory;
        this.form.largeCategory = null;
        this.form.smallCategory = null;
        break;
      default:
        this.largeCategoryList = [];
        this.smallCategoryList = [];
        this.form.largeCategory = null;
        this.form.smallCategory = null;
    }
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

    this.onStorageTypeChange(this.form.storageType);
  }

  // 翻页
  pageTurning(pageNum: number) {
    this.form.pageNum = pageNum;
    this.getDetailShareData();
    this.getStatisticsDetail();
  }

  // 获取统计数据
  async getDetailShareData() {
    const body = {
      ...this.form,
      startTime: this.form.time && this.form.time[0] || '',
      endTime: this.form.time && this.form.time[1] || '',
    }

    const { data } = await getDetailShareData(body);
    this.count = data;
  }

  // 获取详情列表
  async getStatisticsDetail() {
    const body = {
      ...this.form,
      startTime: this.form.time && this.form.time[0] || '',
      endTime: this.form.time && this.form.time[1] || '',
    }

    const { data } = await getStatisticsDetail(body);
    const { list, pageNum, pageSize, total } = data;
    this.table = list;
    this.form.pageNum = pageNum;
    this.form.pageSize = pageSize;
    this.form.total = total;
  }
}
</script>

<style lang="scss" scoped>
.detail {
  .statistics {
    display: flex;
    align-items: flex-end;

    > dt {
      font-size: 18px;
      font-weight: bold;
    }

    > dd {
      font-size: 14px;
      margin-left: 30px;
    }
  }
}
</style>
