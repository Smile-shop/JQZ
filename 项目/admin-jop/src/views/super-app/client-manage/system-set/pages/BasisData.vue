<template>
  <div class="basis-data">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="item.name" :name="item.type" v-for="item in tabList" :key="item.name">
        <ClueFrom :baseData="baseData(item.type)" @updateTable="updateTable"></ClueFrom>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      class="table-page"
      background
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 50, 100, 200, 500]"
      :page-size.sync="pageSize"
      @size-change="getBasisData"
      @current-change="getBasisData"
      :current-page.sync="currentPage"
      :total="tableTotal"
    ></el-pagination>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import ClueFrom from './ClueFrom.vue';
import { BaseData, getClueBasisDataString } from '@/utils/nameExchange';
import { getBasisData, getJMPAccount } from '@/api/common';

@Component({
  components: {
    ClueFrom
  }
})
export default class BasisData extends Vue {
  private activeName: string = '1';
  private tabList: any[] = [];
  private tableData: any[] = [];
  private JMPAccountList: any[] = [];

  private pageSize: number = 20;
  private currentPage: number = 1;
  private tableTotal: number = 0;

  @Watch('activeName')
  onActiveNameChanged(val: any, oldVal: any) {
    this.pageSize = 20;
    this.currentPage = 1;
    this.tableTotal = 0;
    this.getBasisData();
    if (val === '8') {
      this.getJMPAccount();
    }
  }

  private baseData(type: string): BaseData {
    return {
      list: this.tableData,
      JMPAccountList: this.JMPAccountList,
      ...getClueBasisDataString(type)
    }
  }

  private mounted() {
    this.tabList = Object.values(getClueBasisDataString());
    this.getBasisData();
  }

  private getJMPAccount() {
    getJMPAccount().then((res: any) => {
      this.JMPAccountList = res.data || [];
    })
  }

  private getBasisData() {
    const params = {
      btype: this.activeName,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    }
    getBasisData(params).then((res: any) => {
      this.tableData = res.data.list || [];
      this.tableTotal = res.data.total || 0;
    })
  }

  private updateTable(info: any) {
    this.getBasisData();
  }
}
</script>

<style lang="scss" scoped>
.basis-data {
  .table-page {
    text-align: right;
    margin-top: 15px;
  }
}
</style>


