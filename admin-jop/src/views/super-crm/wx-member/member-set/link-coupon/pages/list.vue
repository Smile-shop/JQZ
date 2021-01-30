<template>
  <article class="link-coupon-list">
    <el-button type="primary" @click="goDetail()">新增活动</el-button>
    <el-table class="table-content" :data="list" border style="width: 100%">
      <el-table-column prop="activityName" label="活动名称" min-width="160"></el-table-column>
      <el-table-column label="活动门店" min-width="160">
        <template slot-scope="scope">
          <div>{{ filterName(scope.row.activityStores) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="开始时间" min-width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.startTime | momentFilter('YYYY-MM-DD') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" min-width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.endTime | momentFilter('YYYY-MM-DD') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="活动状态" min-width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.status }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="活动上架状态" min-width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.shelvesStatus === 'Y' ? '上架' : '未上架' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" @click="getActData(scope.row.id)">活动数据</el-button>
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">活动设置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { qryLianIndex, getWxShopList } from '@/api/super-crm/wx-member';

@Component({})
export default class LinkCoupon extends Vue {
  private list = [];
  private isSelectStore = [];

  private created() {
    this.getStore().then((res: any) => {
      this.getList(res);
    });
  }
  private getStore() {
    return new Promise((resolve, reject) => {
      getWxShopList()
        .then((res: any) => {
          const isSelectStore = res.data
            .filter((item: any) => item.showStatus === '1')
            .map((item: any) => item.shopName);
          resolve(isSelectStore);
        })
        .catch((err: any) => {
          console.error(err);
        });
    });
  }
  private filterName(val: string) {
    return val.split(',').length > 3
      ? val.split(',').slice(0, 3).join('，') + '...'
      : val.split(',').join('，');
  }
  private async getList(name: any) {
    const res: any = await qryLianIndex({ name });
    const { code, data } = res;
    if (!code) {
      this.list = data;
    }
  }
  private getActData(activityId: string) {
    this.$router.push({
      path: '/super-crm/wx-member/member-set/link-coupon/data',
      query: { activityId },
    });
  }
  private handleEdit(item: any) {
    this.goDetail(item.id);
  }
  private goDetail(id?: string) {
    this.$router.push({
      path: '/super-crm/wx-member/member-set/link-coupon/addOrEdit',
      query: { id },
    });
  }
}
</script>

<style lang="scss" scoped>
.link-coupon-list {
  .table-content {
    margin-top: 20px;
  }
}
</style>
