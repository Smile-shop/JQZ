<template>
  <article class="member-register">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="门店：">
        <el-select v-model="formInline.shopName" placeholder="门店">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册来源：">
        <el-select v-model="formInline.lineType" placeholder="注册来源">
          <el-option label="全部" value=""></el-option>
          <el-option label="线下系统" value="JMP"></el-option>
          <el-option label="微信关注" value="WEC"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="营业员：">
        <el-input  placeholder="请输入营业员" v-model="formInline.issuer"></el-input>
      </el-form-item>
      <el-form-item label="注册时间：">
        <el-date-picker
          v-model="formInline.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getMemberGroupShop">查询</el-button>
      </el-form-item>
      <el-button :loading="downloadLoading" @click="handleDownload" type="primary" class="export-btn" plain>导出查询结果</el-button>
    </el-form>
    <div class="info">会员注册数：<span>{{tableTotal}}</span></div>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top:18px">
      <el-table-column
        prop="code"
        label="会员编号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="cardCode"
        label="会员卡号"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册为线上会员时间"
        align="center">
        <template slot-scope="scope">
          <span>{{computedTime(scope.row.onlineCreateTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="source"
        label="注册来源"
        align="center">
        <template slot-scope="scope">
          <span>{{computedSource(scope.row.source)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="门店"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发卡时间"
        align="center">
        <template slot-scope="scope">
          <span>{{computedTime(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="issuer"
        label="发卡人"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.issuer">{{scope.row.issuer}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="address"
        label="OPENID"
        align="center">
      </el-table-column>
      马总  没意义-->
    </el-table>
    <el-pagination
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="getMemberGroupShop"
      @current-change="getMemberGroupShop"
      :current-page.sync="currentPage"
      :total="tableTotal"
    ></el-pagination>
  </article>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getSelectShopList, getMemberGroupShop1, getMembersRegisterWithOffLine } from '@/api/super-crm/wx-data';
import PoupBox from '@/components/PoupBox.vue';
import moment from 'moment';
import exportCsv from '@/utils/exportCsv';

@Component({})
export default class MemberRegisterDetail extends Vue {
  private shopList = [];
  private formInline = {
    shopName: '',
    time: '',
    issuer: '',
    lineType: ''
  };
  private tableData = [];

  private pageSize: number = 10;
  private currentPage: number = 1;
  private tableTotal: number = 0;

  private downloadLoading: boolean = false;

  private mounted() {
    getSelectShopList({showStatus: '1'}).then((res: any) => {
      this.shopList = res.data.list || [];
      this.formInline.shopName = (this.$route.query.shop as any) || '';
      (this.formInline.time as any) = this.$route.query.startTime ? [this.$route.query.startTime, this.$route.query.endTime] : '';
      this.getMemberGroupShop();
    })
  }

  private computedSource(item: any) {
    switch (item) {
      case 'JMP':
        return '系统';
        break;
      case 'WEB':
        return '官网';
        break;
      case 'WEC':
        return '微信';
        break;
      case 'APP':
        return 'APP';
        break;
      default:
        return '';
    }
  }

  private computedTime(item: any) {
    return moment(new Date(item)).format('YYYY-MM-DD HH:mm:ss');
  }

  private getMemberGroupShop() {
    const params = {
      page: {
        pageSize: this.pageSize,
        pageNum: this.currentPage
      },
      params: {
        shopName: this.formInline.shopName,
        startTime: this.formInline.time[0] || '',
        endTime: this.formInline.time[1] || '',
        issuer: this.formInline.issuer,
        lineType: this.formInline.lineType,
      }
    }
    getMembersRegisterWithOffLine(params).then((res: any) => {
      this.tableData = res.data.list || [];
      this.tableTotal = res.data.total || 0;
    })
  }

  private handleDownload() {
    this.downloadLoading = true;
    const params = {
      page: {
        pageSize: 100000,
        pageNum: 1
      },
      params: {
        shopName: this.formInline.shopName,
        startTime: this.formInline.time ? this.formInline.time[0] : '',
        endTime: this.formInline.time ? this.formInline.time[1] : '',
        issuer: this.formInline.issuer,
        lineType: this.formInline.lineType,
      }
    }
    getMembersRegisterWithOffLine(params).then((res: any) => {
      const data = res.data.list || [];
      if (data.length > 0) {
        data.forEach((item: any) => {
          item.createTime = this.computedTime(item.createTime);
          item.onlineCreateTime = this.computedTime(item.onlineCreateTime);
          item.source = this.computedSource(item.source);
        });
        exportCsv({
          quoted: true,
          separator: ',',
          filename: '会员关注统计',
          columns: [
            {
              title: '会员编号',
              key: 'code'
            },
            {
              title: '会员卡号',
              key: 'cardCode'
            },
            {
              title: '姓名',
              key: 'name'
            },
            {
              title: '手机',
              key: 'mobile'
            },
            {
              title: '注册为线上会员时间',
              key: 'onlineCreateTime'
            },
            {
              title: '注册来源',
              key: 'source'
            },
            {
              title: '门店',
              key: 'shopName'
            },
            {
              title: '发卡时间',
              key: 'createTime'
            },
            {
              title: '发卡人',
              key: 'issuer'
            },
          ],
          data
        });
      }
      this.downloadLoading = false;
    })
  }
}
</script>

<style lang="scss" scoped>
.member-register {
  .table-page {
    // position: fixed;
    // bottom: 15px;
    // right: 20px;
    text-align: right;
    margin-top: 15px;
  }
  .info {
    font-size: 14px;
    padding-top: 14px;
    > span {
      color: #409EFF;
      font-weight: bold;
    }
  }
  .demo-form-inline {
    border-radius: 5px;
    background-color: #f5f5f5;
    padding: 20px;
    padding-bottom: 0;
    position: relative;
    .export-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
}
</style>


