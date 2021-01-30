<template>
  <div class="exchange-history">
    <form-bar class="form-bar">
      <el-form v-model="form" :inline="true">
        <el-form-item label="兑换单号：">
          <el-input v-model="form.orderId"></el-input>
        </el-form-item>
        <el-form-item label="领取门店：">
          <el-select 
            v-model="form.shopName"
            :style="{
              width: '202px'
            }"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) of shopList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兑换时间：">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品名称：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="会员卡号：">
          <el-input v-model="form.memberCard"></el-input>
        </el-form-item>
        <el-form-item label="领取状态：">
          <el-select
            v-model="form.canReceive"
            :style="{
              width: '202px'
            }"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未发货" value="0"></el-option>
            <el-option label="已发货" value="1"></el-option>
            <el-option label="已领取" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取方式：">
          <el-select
            v-model="form.sendType"
            :style="{
              width: '202px'
            }"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="自提" value="1"></el-option>
            <el-option label="快递" value="2"></el-option>
          </el-select>
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="getDataList"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <template
        v-slot:right
      >
        <div class="right-box">
          <el-button
            @click="exportHandle"
            type="primary"
          >
            导出
          </el-button>
        </div>
      </template>
    </form-bar>
    <el-table
      :data="dataList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="memberCard"
        label="会员卡号"
      >
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="兑换单号"
      >
      </el-table-column>
      <el-table-column
        label="兑换时间"
      >
        <template
          slot-scope="scope"
        >
          {{scope.row.createTime | momentFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="商品图片"
        width="160"
      >
        <template
          slot-scope="scope"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="imagesUrl({
              path: '/jop-wx-web/op/showimage',
              name: scope.row.pic_url,
              alias: 'Gift'
            })"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="商品"
        width="200"
      >
        <template
          slot-scope="scope"
        >
          <ul>
            <li>
              编号: {{scope.row.code}}
            </li>
            <li>
              名称: {{scope.row.name}}
            </li>
            <li
              v-for="(item, index) of scope.row.properties"
              :key="index"
            >
              {{item.name}}: {{item.value}}
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        prop="count"
        label="兑换数量"
      >
      </el-table-column>
      <el-table-column
        prop="exchangeIntegral"
        label="花费积分"
      >
      </el-table-column>
      <el-table-column
        label="领取门店"
      >
        <template
          slot-scope="scope"
        >
          <ul>
            <li>{{scope.row.shopName}}</li>
            <li>({{scope.row.sendType | sendTypeFilter}})</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        label="领取状态"
        width="120"
      >
        <template
          slot-scope="scope"
        >
          <el-button
            type="warning"
            v-if="scope.row.canReceive == 0"
          >
            未发货
          </el-button>
          <el-button
            type="success"
            v-else-if="scope.row.canReceive == 1"
          >
            已发货
          </el-button>
          <el-button
            type="primary"
            v-else-if="scope.row.canReceive == 2"
          >
            已领取
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="领取时间"
      >
        <template
          slot-scope="scope"
        >
          {{scope.row.receiveTime | momentFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="留言"
      >
        <template
          slot-scope="scope"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="scope.row.evaluate"
            placement="left"
          >
            <el-button
              v-if="scope.row.evaluate"
              type="text"
            >
              查看留言
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="pageTurning"
      :current-page.sync="pageNum"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Emit} from 'vue-property-decorator';
import FormBar from '@/components/FormBar.vue';
import {getShop, getExchangeHistory} from '@/api/super-crm/point-mall';
import {imagesUrl} from '@/utils/imageUrl';
import {momentFilter} from '@/filters/date';
import exportCsv from '@/utils/exportCsv';

@Component({
  name: 'productList',
  components: {
    FormBar
  },
  methods: {
    imagesUrl
  },
  filters: {
    sendTypeFilter(type: any) {
      switch (type) {
        case 1:
          return '自提'
        case 2:
          return '快递'
        default:
          return '未知'
      }
    }
  }
})
export default class PointMallExchangeHistory extends Vue {
  form = {
    shopName: '', // 领取门店
    orderId: '', // 兑换单号
    memberCard: '', // 会员卡号
    name: '', // 商品名称
    canReceive: '', // 领取状态（0：未发货、1：已发货、2：已领取）
    sendType: '', // 领取方式（1：自提，2：快递）
    startTime: '', // 时间范围
    endTime: '', // 时间范围
  };

  total = 0;

  pageSize = 10;

  pageNum = 1;

  dataList = [];
  shopList = [];
  dateRange = [];

  mounted() {
    this.getShop();
    this.getExchangeHistory();
  };

  // 查询
  getDataList() {
    this.pageNum = 1;
    this.getExchangeHistory();
  }

  // 翻页
  pageTurning(val: number) {
    this.getExchangeHistory();
  }

  // 获取赠品分类
  getShop() {
    const body = {}

    getShop(body).then((res: any) => {
      const {data} = res;

      this.shopList = data;
    })
  }

  // 查询积分商品列表
  async getExchangeHistory(onlyData: boolean = false) {
    try {
      const startDate = this.dateRange[0];
      const endDate = this.dateRange[1];

      const body = {
        ...this.form,
        pageSize: onlyData ? 99999 : this.pageSize,
        pageNum: this.pageNum,
        startTime: startDate ? startDate : '',
        endTime: endDate ? endDate : '',
      }

      const res = await getExchangeHistory(body);

      const {data} = res;

      if (onlyData) {
        return data;
      } else {
        const {list, total} = data;

        this.dataList = list;
        this.total = total;
      }
    } catch (err) {
      console.warn(err);
      return Promise.reject(err);
    }
  }

  // 导出处理
  async exportHandle() {
    try {
      const data = await this.getExchangeHistory(true);
      const {list} = data;

      if (list && list instanceof Array) {
        list.forEach((item) => {
          item.createTime = momentFilter(item.createTime);
          item.receiveTime = momentFilter(item.receiveTime);
          item.sendType = ((type: any) => {
            switch (type) {
              case 1:
                return '自提'
              case 2:
                return '快递'
              default:
                return '未知'
            }
          })(item.sendType);
          item.canReceive = ((type: any) => {
            switch (type) {
              case 0:
                return '未发货'
              case 1:
                return '已发货'
              case 2:
                return '已领取'
              default:
                return '未知'
            }
          })(item.canReceive);
        })

        exportCsv({
          filename: '礼品兑换记录',
          data: list,
          columns: [
            {
              title: '会员卡号',
              key: 'memberCard'
            },
            {
              title: '兑换单号',
              key: 'orderId'
            },
            {
              title: '兑换时间',
              key: 'createTime'
            },
            {
              title: '编号',
              key: 'code'
            },
            {
              title: '名称',
              key: 'name'
            },
            {
              title: '兑换数量',
              key: 'count'
            },
            {
              title: '花费积分',
              key: 'exchangeIntegral'
            },
            {
              title: '领取门店',
              key: 'shopName'
            },
            {
              title: '领取方式',
              key: 'sendType'
            },
            {
              title: '领取状态',
              key: 'canReceive'
            },
            {
              title: '领取时间',
              key: 'receiveTime'
            },
          ]
        })
      }
    } catch (err) {
      console.warn(err);
      this.$message.warning('导出失败');
    }
  }

}
</script>

<style lang="scss" scoped>
.exchange-history{
  > .form-bar {
    /deep/ .right-box {
      display: flex;
      align-items: flex-end;
    }
  }

  & > * {
    margin-bottom: 15px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  > .pagination {
    display: flex;
    justify-content: flex-end;
  }
}
</style>