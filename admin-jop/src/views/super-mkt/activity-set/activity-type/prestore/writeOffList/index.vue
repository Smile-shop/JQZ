<template>
  <div class="writeOffList">
    <el-button type="primary" size="small" icon="el-icon-plus" @click="addOrEdit()">添加核销员</el-button>
    <sear-form @getFormData="getFormData" :shop-list="shopList" />
    <table-data :dataList="dataList" @sortData="sortData">
      <template slot-scope="scope" slot="action">
        <el-button type="text" @click="addOrEdit(scope.row)">编辑</el-button>
        <el-popover placement="top" width="160" v-model="scope.row.visible">
          <p>
            <i style="color:#e6a23c" class="el-icon-warning"></i> 确定删除吗？
          </p>
          <div style="text-align: center; margin: 5px">
            <el-button class="popover-btn-btn" size="mini" @click="scope.row.visible = false">取消</el-button>
            <el-button class="popover-btn-btn" type="danger" size="mini" @click="del(scope.row)">确定</el-button>
          </div>
          <el-button slot="reference" style="margin-left: 10px" type="text">删除</el-button>
        </el-popover>
      </template>
    </table-data>
    <div style="text-align: right; margin-top: 20px">
      <el-pagination
        v-show="total > 0"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="page.pageSize"
        @size-change="getList"
        @current-change="getList"
        :current-page.sync="page.pageNum"
        :total="total"
      ></el-pagination>
    </div>
    <add-or-edit-dialog :show.sync="showAdd" :title="title" :data="formData" :shop-list="shopList" @update="getList" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import addOrEditDialog from './child/addOrEditDialog.vue';
import searForm from './child/searForm.vue';
import tableData from './child/tableData.vue';
import {
  pageQueryVerifier,
  deleteVerifier,
} from '@/api/super-mkt/activity-set/fission_retail';
import { addWriter } from '@/utils/buttonPermission'
import { getCustomerShopSetting } from '@/api/system-set';
import user from '@/utils/user';
interface Page {
  pageNum: number;
  pageSize: number;
}
interface Sort {
  orderType?: string | boolean;
  sortType?: string | number;
}
@Component({ components: { addOrEditDialog, searForm, tableData } })
export default class WriteOffList extends Vue {
  title: string = '添加核销员';
  showAdd: boolean = false;
  visible: boolean = false;
  form: object = {
    // companyKey: user.serverUser.account.companyKey
  };
  formData: any = {
    nickName: '',
    openId: '',
    shopName: '',
    name: '',
    phone: '',
    position: '',
  };
  dataList: object[] = [];
  total: number = 0;
  page: Page = { pageNum: 1, pageSize: 10 };
  sort: Sort = {};
  shopList: any[] = [];

  created() {
    this.getList();
    this.getCustomerShopSetting();
  }
  async getCustomerShopSetting() {
    const res: any = await getCustomerShopSetting({});
    const { code, data } = res;
    if (!code) {
      this.shopList = data.shopPermissionList.filter(
        (item: any) => item.isSelect
      );
    }
  }
  async addOrEdit(item?: any) {
    if (! await addWriter()) {
      return
    }
    this.formData = item;
    this.showAdd = true;
    if (item) {
      this.title = '编辑核销员';
    } else {
      this.title = '添加核销员';
    }
  }
  save() {
    this.showAdd = false;
  }
  getFormData(val: any) {
    this.page.pageNum = 1;
    this.form = Object.assign({}, this.form, val);
    this.getList();
  }
  async del(item: any) {
    await deleteVerifier({ id: item.id || 1 });
    this.visible = false;
    this.getList();
  }
  sortData(column: any) {
    const { order, prop } = column;
    const change = (prop: string) => {
      if (order === 'descending') {
        this.sort = {
          orderType: false,
          sortType: prop === 'verifyNum' ? 1 : '',
        };
      } else if (order === 'ascending') {
        this.sort = {
          orderType: true,
          sortType: prop === 'verifyNum' ? 1 : '',
        };
      } else {
        this.sort = {};
      }
    };
    change(prop);
    this.getList();
  }
  async getList() {
    const data = { ...this.page, ...this.form, ...this.sort };
    const res = await pageQueryVerifier(data);
    this.total = res.data.total || 0;
    this.dataList = res.data.list;
  }
}
</script>
