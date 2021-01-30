<template>
  <div class="activity-type-home">
    <header>
      <el-button icon="el-icon-plus" type="primary" @click="toAddPage">添加活动</el-button>
    </header>
    <app-gutter />
        <div style="width: 100%;margin-left:20px">
          <span>
              活动名称：
              <el-input style="width: 200px" v-model="title" placeholder="请输入活动名称" ></el-input>
          </span>
          <span style="margin-left:20px">
              活动状态：
              <el-select v-model="status" placeholder="全部状态">
                  <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>   
          </span>
          <span style="margin-left:20px"><el-button type="primary" @click="getActiveList">搜索</el-button></span>
    </div>
    <app-gutter />
    <el-table empty-text="暂无数据" :data="dataList" border height="680" style="width:100%">
      <el-table-column label="编号" prop="distributionNo" width="100">
      </el-table-column>
      <el-table-column prop="title" label="活动名称" min-width="180">
        <template slot-scope="scope">
          <div class="banner-title">{{scope.row.title}}</div>
        </template>  
      </el-table-column>
      <el-table-column prop="beginTime" label="开始时间" min-width="140">
        <template slot-scope="scope">{{scope.row.beginTime | ymdhm}}</template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" min-width="140">
        <template slot-scope="scope">{{scope.row.endTime | ymdhm}}</template>
      </el-table-column>
    <el-table-column prop="goodsPrice" label="商品售价" min-width="120"></el-table-column>
    <el-table-column prop="oneProfit" label="一级返现" min-width="120"></el-table-column>
    <el-table-column prop="twoProfit" label="二级返现" min-width="120"></el-table-column>
    <el-table-column prop="sellNum" label="累计销量" min-width="120">
       <template slot-scope="scope">
          <div >{{scope.row.sellNum?scope.row.sellNum:0}}</div>
        </template>  
    </el-table-column>
      <el-table-column label="活动状态" min-width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1" style="color:#E7A746">未开始</div>
          <div v-else-if="scope.row.status == 2" style="color:#5EE99A">进行中</div>
          <div v-else style="color:#313F50">已结束</div>
        </template>
      </el-table-column>
      <el-table-column prop="isCanBuy" min-width="90">
        <template slot="header">
           <span>购买开关</span>
           <el-tooltip placement="top">
            <div slot="content">关闭后，活动将无法购买</div>
            <i class="el-icon-warning-outline"></i>
           </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isBuy" @change="(bool)=>{onClickChange(bool,scope.row)}"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="420">
        <template slot-scope="scope">
          <el-button
            class="btn"
            icon="el-icon-setting"
            size="small"
            @click="toPage('set', scope.row)"
          >编辑</el-button>
          <el-button
            class="btn"
            icon="el-icon-tickets"
            size="small"
            @click="$router.push({path: '/fission/order-manage/orderList', query: { distributionId: scope.row.id, activityName: scope.row.title }})"
          >订单</el-button>
          <el-button
            class="btn"
            icon="el-icon-tickets"
            size="small"
            @click="$router.push({path: '/fission/distri-manage/activity-user-list', query: { distributionId: scope.row.id, activityName: scope.row.title }})"
          >用户</el-button>
          <el-button
            class="btn"
            icon="el-icon-tickets"
            size="small"
            @click="$router.push({path: '/fission/distri-manage/activity-list/channelPopularize', query: {distributionId: scope.row.id}})"
          >推广</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
          class="table-page"
          v-show="total > 0"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          :page-size.sync="pageSize"
          @size-change="getActiveList"
          @current-change="getActiveList"
          :current-page.sync="pageNum"
          :total="total"
      ></el-pagination>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  queryDistributionPage,
  updateIsCanBuy
} from '@/api/super-mkt/activity-set/fission_retail';
import AppGutter from '@/components/AppGutter.vue';
import FormBar from '@/components/FormBar.vue';
import Editor from '@/components/WangEditor.vue';
import ElIcon from '@/components/ElIcon.vue';
import user from '@/utils/user';
import { addActivity } from '@/utils/buttonPermission'

@Component({
  components: {
    AppGutter,
    FormBar,
    Editor,
    ElIcon,
  },
})
export default class PrizeSetActivityTypeHome extends Vue {
  dataList: any[] = [];
  id: string = '';
  title: string = '';
  status: string = '0';
  pageNum: number = 1;
  pageSize: number  =  10;
  total: number = 0;
  statusOptions: any[]  = [
        {
          value: '0',
          label: '全部状态'
        }, {
          value: '1',
          label: '未开始'
        }, {
          value: '2',
          label: '进行中'
        }, {
          value: '3',
          label: '已结束'
        }
        ];
  mounted() {
    this.getActiveList();
  }

  // 查询活动名称列表
  async getActiveList() {
    let body: any;
    const paramsObj: any = {};
    if (this.title != '') {
      paramsObj.title = this.title;
    }
    if (this.status != '') {
      paramsObj.status = parseInt(this.status, 0);
    }
    body =  {
      page: {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      },
      params: paramsObj
    };
    const res: any = await queryDistributionPage(body);
    const { code, data } = res;
    if (!code && data) {
      this.total = data.total || 0;
      this.dataList = data.list.map((item: any) => {
         item.isBuy = item.isCanBuy == 1 ? true : false;
         return item;
      });
    }
  }

  async onClickChange(bool: boolean, row: any) {
     const body: any = {
      distributionId: row.id,
      isCanBuy: (bool ? 1 : 0)
    };
     const res: any = await updateIsCanBuy(body);
     const { code, data } = res;
     if (data === 1) {
        this.$message({
        type: 'success',
        message: '修改成功！'
        });
     } else {
        row.isBuy = !bool;
     }
  }

  // 页面跳转
  toPage(page: string, row: any) {
    switch (page) {
      case 'set':
        this.$router.push({
          path: '/fission/distri-manage/activity-list/add',
          query: {
            id: row.id,
            status: row.status,
          },
        });
        break;
      default:
        break;
    }
  }

  // 前往添加页面
  async toAddPage() {
    if (! await addActivity()) {
      return;
    }
    this.$router.push({
      path: '/fission/distri-manage/activity-list/add',
    });
  }
}
</script>

<style lang="scss" scoped>
.btn {
  margin: 2.5px;
}
.dialog-footer {
  text-align: center;
}
.banner-title{
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
    font-size:14px;
    line-height:25px;
    width: 100%;
    font-size: 14px;
}
 .table-page{
        margin-top: 20px;
        text-align: right;
    }
</style>