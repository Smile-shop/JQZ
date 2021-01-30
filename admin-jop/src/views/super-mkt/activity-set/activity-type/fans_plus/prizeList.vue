<template>
  <div class="PrizeList">
    <div class="PrizeList-amount">参与总人数{{ joinInCount }}人</div>
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column label="奖品编号" prop="giftCode" min-width="100">
        <!-- <template slot-scope="scope">{{scope.$index + 1}}</template> -->
      </el-table-column>
      <el-table-column align="center" label="图片" width="100">
        <template slot-scope="scope">
          <span class="PrizeList-img">
            <img
              v-if="scope.row.picList.length || scope.row.onlineImg"
              :src="scope.row.onlineImg ? scope.row.onlineImg : expImagesUrl(scope.row)"
              alt
            />
            <div class="PrizeList-img-empty" v-else></div>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="giftName" label="奖品名称" min-width="180"></el-table-column>
      <el-table-column prop="popularity" label="所需人气值" min-width="180"></el-table-column>
      <el-table-column prop="jmpGiftNum" label="jmp线下库存" min-width="160">
        <!-- <template slot-scope="scope">{{scope.row.beginTime | ymdhm}}</template> -->
      </el-table-column>
      <el-table-column prop="remainGiftNum" label="可兑换数量(线上库存)" min-width="160">
        <!-- <template slot-scope="scope">{{scope.row.endTime | ymdhm}}</template> -->
      </el-table-column>
      <el-table-column label="线上库存预警" prop="warningGiftNum" min-width="120"></el-table-column>
      <el-table-column label="当前可兑换人数" prop="canGiven" min-width="120"></el-table-column>
      <el-table-column label="待领取" prop="waitGiven" min-width="120"></el-table-column>
      <el-table-column label="已领取" prop="hasGiven" min-width="120"></el-table-column>
      <el-table-column label="领取率" prop="givenRate" min-width="120">
        <template slot-scope="scope">{{scope.row.givenRate}}%</template>
      </el-table-column>
      <el-table-column label="兑换率" prop="exchangeRate" min-width="120">
        <template slot-scope="scope">{{scope.row.exchangeRate}}%</template>
      </el-table-column>
      <el-table-column label="操作" width="170" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="toInfo(scope.row, '1')">编辑</el-button>
          <el-button size="mini" @click="toInfo(scope.row, '2')">发放明细</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { queryAwardList } from '@/api/super-mkt/activity-set/fans_plus';
import { imagesUrl } from '@/utils/imageUrl';

@Component({})
export default class PrizeList extends Vue {
  dataList: any[] = [];
  showCode: boolean = false;
  joinInCount: number = 0;
  created() {
    const { activitiyName, id } = this.$route.query;
    if (activitiyName && id) {
      this.queryAwardList(id, activitiyName);
    }
  }
  expImagesUrl(item: any) {
    return imagesUrl({
      path: '/jop-wx-web/op/showimage',
      name: item.picList[0] || '',
      alias: 'Gift',
    });
  }
  toInfo(item: any, activeName: string) {
    this.$router.push({
      path: '/super-mkt/activity-set/activity-type/fans_plus/prizeInfo',
      query: {
        id: item.id,
        activeName,
        activitiyId: this.$route.query.id,
      },
    });
  }
  async queryAwardList(
    id: string | Array<string | null>,
    activitiyName: string | Array<string | null>
  ) {
    const res: any = await queryAwardList({ id, activitiyName });
    const { code, data } = res;
    if (!code && data) {
      this.dataList = data.awardList;
      this.joinInCount = data.joinInCount;
    }
  }
}
</script>

<style lang="scss" scoped>
.PrizeList {
  &-amount {
    margin: 10px 20px 10px 0;
  }
  &-img {
    display: inline-block;
    width: 40px;
    height: 40px;
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
}
</style>