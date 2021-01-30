<template>
  <div class="prizeDetail">
    <el-card shadow="never">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select placeholder="全部门店" clearable v-model="shopName">
            <el-option
              v-for="(item, index) of shopList"
              :key="index"
              :label="item.shopName"
              :value="item.shopName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 活动信息 -->
    <section class="active-info">
      <h3>{{ data.shelfGiftName }}</h3>
      <ul>
        <li>线下库存：{{sumData.jmpGiftNum}}</li>
        <li>待领取：{{sumData.waitGiven}}</li>
        <li>已领取：{{sumData.hasGiven}}</li>
      </ul>
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column align="center" label="微信头像" min-width="80">
          <template slot-scope="scope">
            <span class="prizeDetail-img">
              <img v-if="scope.row.headImgUrl" :src="scope.row.headImgUrl" alt />
              <div class="prizeDetail-img-empty" v-else></div>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="微信昵称" min-width="150"></el-table-column>
        <el-table-column prop="getGiftRealName" label="领取人姓名" min-width="150"></el-table-column>
        <el-table-column prop="getGiftPhone" label="领奖手机号" min-width="180"></el-table-column>
        <el-table-column prop="shopName" label="领取门店" min-width="180"></el-table-column>
        <el-table-column label="兑换时间" min-width="180">
          <template slot-scope="scope">{{scope.row.exchangeDate | ymdhm}}</template>
        </el-table-column>
        <el-table-column label="领取时间" min-width="180">
          <template slot-scope="scope">{{scope.row.getDate | ymdhm}}</template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import {
  queryShopOutList,
  queryGetAwardPage,
  queryGetAwardCount,
} from '@/api/super-mkt/activity-set/fans_plus';

@Component({})
export default class PrizeEdit extends Vue {
  @Prop({ default: {} })
  data: any;
  dataList: any[] = [];
  detailForm: any = {};
  shopList: any[] = [];
  shopName: string = '';
  sumData: any = { jmpGiftNum: 0, hasGiven: 0, waitGiven: 0 };

  @Watch('data')
  watchData(value: any) {
    this.getData();
  }
  created() {
    this.queryShopOutList();
  }
  getData() {
    this.queryGetAwardPage();
    this.queryGetAwardCount();
  }
  async queryShopOutList() {
    const res: any = await queryShopOutList({});
    const { code, data } = res;
    if (!code && data) {
      this.shopList = data;
    }
  }
  async queryGetAwardCount() {
    if (!this.data.giftCode || !this.data.id) {
      return;
    }
    const body = {
      activitiyId: this.$route.query.activitiyId,
      giftCode: this.data.giftCode,
      id: this.data.id,
      shopList: this.shopName ? [this.shopName] : [],
    };
    const res: any = await queryGetAwardCount(body);
    const { code, data } = res;
    if (!code && data) {
      this.sumData = Object.assign({}, this.sumData, data);
    }
  }
  async queryGetAwardPage() {
    if (!this.data.giftCode || !this.data.id) {
      return;
    }
    const body = {
      page: {
        pageNum: 1,
        pageSize: 100000,
      },
      params: {
        activitiyId: this.$route.query.activitiyId,
        giftCode: this.data.giftCode,
        id: this.data.id,
        shopList: this.shopName ? [this.shopName] : [],
      },
    };
    const res: any = await queryGetAwardPage(body);
    const { code, data } = res;
    if (!code && data) {
      this.dataList = data.list;
    }
  }
}
</script>

<style lang="scss" scoped>
.prizeDetail {
  &-img {
    display: inline-block;
    width: 40px;
    border-radius: 40px;
    overflow: hidden;
    background: #eee;
    img {
      height: 40px;
      width: 40px;
    }
    &-empty {
      width: 40px;
      height: 40px;
      background: #eee;
    }
  }
  & /deep/ .el-card__body {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .active-info {
    margin-top: 12px;
    margin-bottom: 12px;

    & > h3 {
      margin-bottom: 17px;
      color: #333333;
      font-size: 24px;
    }

    & > ul {
      display: flex;
      list-style: none;
      margin-bottom: 15px;
      font-size: 14px;
      color: #333333;

      & > li {
        margin-right: 36px;

        & > span {
          font-weight: bold;
          color: #337ac4;
        }
      }
    }
  }
}
</style>


