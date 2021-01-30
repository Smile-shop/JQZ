<template>
  <div class="product-list">
    <form-bar>
      <el-form v-model="formData" :inline="true">
        <el-form-item label="商品名称：">
          <el-input
            v-model="formData.keyword"
            placeholder="名称支持模糊查询"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="首饰大类：">
          <el-select v-model="formData.jewelryLargeCategory" placeholder="请选择">
            <el-option
              v-for="item of jewelryLargeCategoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品编号：">
          <el-input
            v-model="formData.code"
            placeholder="编号支持模糊查询"
          >
          </el-input>
        </el-form-item>
        <el-button
          type="primary"
          @click="getTableData"
        >
          查询
        </el-button>
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
    <app-gutter/>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="code"
        label="编号"
      >
      </el-table-column>
      <el-table-column
        label="图片"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="imagesUrl({
              path: '/jop-wx-web/op/showimage',
              name: scope.row.pic_url,
              alias: 'Jewel'
            })"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="名称"
      >
      </el-table-column>
      <el-table-column
        prop="jewelryCategory"
        label="首饰分类"
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
      >
      </el-table-column>
      <el-table-column
        prop="actualPrice"
        label="原价"
      >
      </el-table-column>
      <el-table-column
        label="上架状态"
      >
        <template slot-scope="scope">
          <el-icon
            v-if="scope.row.putaway === '1' || scope.row.putaway === '0'"
            type="el-icon-success"
            size="25px"
          />
          <el-icon
            v-else
            type="el-icon-error"
            size="25px"
            color="#F56C6C"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="活动名称"
      >
        <template slot-scope="scope">
          {{scope.row.activityName}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="emitEditDetail(scope.row)"
          >
            编辑详情
          </el-button>
          <el-button
            type="text"
            @click="copyLink(scope.row)"
          >
            复制链接
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <app-gutter/>
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
import {Vue, Component, Prop, Watch, Emit} from 'vue-property-decorator';
import {selectProductListOptions, searchTypeOptions} from '@/api/super-crm/wx-mall';
import FormBar from '@/components/FormBar.vue';
import ElIcon from '@/components/ElIcon.vue';
import {Message} from 'element-ui';
import AppGutter from '@/components/AppGutter.vue';
import {imagesUrl} from '@/utils/imageUrl';
import {momentFilter} from '@/filters/date';
import exportCsv from '@/utils/exportCsv';
import user from '@/utils/user';
import {copyText} from '@/utils/copyText';

@Component({
  name: 'productList',
  components: {
    FormBar,
    AppGutter,
    ElIcon
  },
})
export default class WxCredentialCredentialParameter extends Vue {
  formData = {
    keyword: '',
    jewelryLargeCategory: '',
    code: ''
  };

  total = 0;

  pageSize = 10;

  pageNum = 1;

  // 首饰大类列表
  jewelryLargeCategoryList: any[] = [];

  // 表格信息
  tableData = [];

  imagesUrl = imagesUrl;

  mounted() {
    this.setJewelryLargeCategoryList();
    this.getProductList();
  }

  // 查询
  getTableData() {
    this.pageNum = 1;
    this.getProductList();
  }

  // 翻页
  pageTurning(val: number) {
    this.getProductList();
  }

  // 查询首饰大类
  setJewelryLargeCategoryList() {
    const body = {}

    searchTypeOptions(body).then((res: any) => {
      const {data} = res;

      this.jewelryLargeCategoryList = [
        {
          name: '全部',
          id: ''
        },
        ...data.jewelLargeType
      ];
    })
  }

  // 查询商品列表
  async getProductList(onlyData: boolean = false) {
    try {
      const body = {
        jewelryLargeCategoryList: this.formData.jewelryLargeCategory ? [this.formData.jewelryLargeCategory] : [],
        keyword: this.formData.keyword,
        code: this.formData.code,
        pageSize: onlyData ? 99999 : this.pageSize,
        pageNum: this.pageNum,
      }

      const res = await selectProductListOptions(body)
      const {data} = res;

      if (onlyData) {
        return data;
      } else {
        const {list, total} = data;

        this.tableData = list;
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
      const data = await this.getProductList(true);
      const {list} = data;

      if (list && list instanceof Array) {
        list.forEach((item) => {
          item.putaway = ((type: any) => {
            switch (type) {
              case 1:
                return '已上架'
              default:
                return '未上架'
            }
          })(item.putaway);
        })

        exportCsv({
          filename: '微商城礼品详情',
          data: list,
          columns: [
            {
              title: '编号',
              key: 'code'
            },
            {
              title: '名称',
              key: 'productName'
            },
            {
              title: '首饰分类',
              key: 'jewelryCategory'
            },
            {
              title: '价格',
              key: 'price'
            },
            {
              title: '原价',
              key: 'actualPrice'
            },
            {
              title: '上架状态',
              key: 'putaway'
            },
            {
              title: '活动名称',
              key: 'activityName'
            },
          ]
        })
      }
    } catch (err) {
      console.warn(err);
      this.$message.warning('导出失败');
    }
  }

  // 提交编辑详情时
  @Emit('editDetail')
  emitEditDetail(row: any) {
    return row;
  }

  async copyLink(row: any) {
    try {
      if (user.serverUser) {
        const origin = VUE_APP_BASE_API;
        const companyKey = user.serverUser.account.companyKey
        const url = `${origin}/wx-interface-web/wx/auth?companyKey=${companyKey}&page=wx_mall&childPage={"path":"/home/product-detail/${row.code}"}`
        copyText(encodeURI(url));
        this.$message.success('复制成功');
      } else {
        this.$message.success('无法获取企业编号');
      }
    } catch (error) {
      console.warn(error);
      this.$message.warning('复制失败');
    }
  }
}
</script>

<style lang="scss" scoped>
.product-list {
}
</style>
