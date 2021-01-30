<template>
  <article class="infomation-manage">
    <el-form :inline="true" :model="appointRecordForm" class="demo-form-inline">
      <el-form-item label="会员姓名：">
        <el-input v-model="appointRecordForm.memberName" placeholder="会员姓名"></el-input>
      </el-form-item>
      <el-form-item label="会员手机号：">
        <el-input v-model="appointRecordForm.memberMobile" placeholder="会员手机号"></el-input>
      </el-form-item>
      <el-form-item label="门店：">
        <el-select v-model="appointRecordForm.shop" placeholder="门店">
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in shopList"
            :key="item.shopId"
            :label="item.shopName"
            :value="item.shopName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约到店时间：">
        <el-date-picker
          v-model="appointRecordForm.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAppointRecordList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="appointRecordTableData"
      border
      class="table-content"
      style="width: 100%;margin-top:18px;">
      <el-table-column
        prop="memberName"
        label="会员姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="memberMobile"
        label="会员手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title"
        label="预约项目"
        align="center">
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="预约门店"
        align="center">
      </el-table-column>
      <el-table-column
        prop="reservation_time"
        label="预约到店时间"
        sortable
        align="center">
        <template slot-scope="scope">
          <div>{{scope.row.reservation_time | momentFilter('YYYY-MM-DD HH:mm')}}</div>
        </template>
      </el-table-column>
      <el-table-column 
        prop="address"
        align="center"
        label="查看">
        <template slot-scope="scope">
          <el-button size="small" @click="getAppointDetail(scope.row)">预约内容</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="getAppointRecordList"
      @current-change="getAppointRecordList"
      :current-page.sync="currentPage"
      :total="tableTotal"
    ></el-pagination>

    <el-dialog
      :visible.sync="dialogVisible"
      width="950px"
      center>
      <h5 class="dialog-title" slot="title">{{dialogDetail.title}}</h5>
      <section class="dialog-body">
        <el-row>
          <el-col :span="6"><div class="item">会员姓名：{{dialogDetail.memberName}}</div></el-col>
          <el-col :span="6"><div class="item">会员手机号：{{dialogDetail.memberMobile}}</div></el-col>
          <el-col :span="6"><div class="item">预约门店：{{dialogDetail.shopName}}</div></el-col>
          <el-col :span="6"><div class="item">微信号：{{dialogDetail.wxNo}}</div></el-col>
        </el-row>
        <el-row style="margin-top:15px">
          <el-col :span="6"><div class="item">到店人：{{dialogDetail.username}}</div></el-col>
          <el-col :span="6"><div class="item">联系方式：{{dialogDetail.mobile}}</div></el-col>
          <el-col :span="6"><div class="item">预约到店时间：{{dialogDetail.reservation_time | momentFilter('YYYY-MM-DD HH:mm')}}</div></el-col>
          <el-col :span="6"><div class="item"></div></el-col>
        </el-row>
        <div class="item" style="margin-top:15px">
          预约内容：<span v-html="computeContent(dialogDetail.content)"></span>
        </div>
      </section>
    </el-dialog>

  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getSelectedShopList, getAppointRecordList, getAppointDetail } from '@/api/super-crm/wx-member-functions';
import { htmlDecodeByRegExp } from '@/utils/storeageCompile';

@Component({
})
export default class InfomationManage extends Vue {
  private shopList = [];
  private appointRecordForm = {
    memberName: '',
    memberMobile: '',
    shop: '',
    time: ''
  }
  private pageSize: number = 20;
  private currentPage: number = 1;
  private tableTotal: number = 0;
  private appointRecordTableData = [];

  private dialogVisible: boolean = false;
  private dialogDetail = {
    title: '',
    memberName: '',
    memberMobile: '',
    shopName: '',
    wxNo: '',
    username: '',
    mobile: '',
    reservation_time: '',
    content: ''
  }

  private mounted() {
    this.getShopList();
    if (this.$route.query.id) {
      this.getAppointRecordList();
    }
  }

  private computeContent(item: string) {
    return htmlDecodeByRegExp(item);
  }

  private getShopList() {
    const params = {
      evaluationStatus: null,
      showStatus: 1
    }
    getSelectedShopList(params).then((res: any) => {
      this.shopList = res.data.list || [];
    })
  }

  private getAppointRecordList() {
    const shopList = new Array();
    if (this.appointRecordForm.shop) {
      shopList.push(this.appointRecordForm.shop);
    }
    const params = {
      params: {
        memberMobile: this.appointRecordForm.memberMobile,
        memberName: this.appointRecordForm.memberName,
        shopList,
        startTime: this.appointRecordForm.time ? this.appointRecordForm.time[0] : '',
        endTime: this.appointRecordForm.time ? this.appointRecordForm.time[1] : '',
        projectId: this.$route.query.id
      },
      page: {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
    }
    getAppointRecordList(params).then((res: any) => {
      this.appointRecordTableData = res.data.list || [];
      this.tableTotal = res.data.total || 0;
    })
  }

  private getAppointDetail(item: any) {
    getAppointDetail({id: item.id}).then((res: any) => {
      this.dialogDetail = res.data;
      this.dialogVisible = true;
    })
  }
}
</script>

<style lang="scss" scoped>
.infomation-manage {
  .demo-form-inline {
    padding: 20px 20px 0 20px;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  .isSuccess-icon {
    font-size: 28px;
    color: #6699ff;
  }
  .isFail-icon {
    font-size: 28px;
    color: #F56C6C;
  }
  .table-page {
    text-align: right;
    margin: 15px;
  }
  .dialog-title {
    font-weight: bold;
  }
  .dialog-body {
    height: 500px;
    overflow: auto;
  }
}
</style>

