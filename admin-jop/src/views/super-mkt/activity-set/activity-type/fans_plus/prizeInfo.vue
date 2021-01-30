<template>
  <div class="prize-info-edit">
    <el-tabs v-model="activeName">
      <el-tab-pane label="奖品编辑" name="1">
        <prize-edit :data="prizeData" />
      </el-tab-pane>
      <el-tab-pane label="奖品发放明细" name="2">
        <prize-detail :data="prizeData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getAwardById } from '@/api/super-mkt/activity-set/fans_plus';
import prizeEdit from './prize-child/prize-edit.vue';
import prizeDetail from './prize-child/prize-detail.vue';

@Component({
  components: { prizeEdit, prizeDetail },
})
export default class PrizeSetPrizeManagePrizeInfoEdit extends Vue {
  activeName: string | Array<string | null> = '1';
  prizeData: any = {};
  created() {
    const { activeName, id } = this.$route.query;
    this.activeName = activeName || '1'
    if (id) {
      this.getInfoDetail(id);
    }
  }
  async getInfoDetail(id: any) {
    const formData = new FormData();
    formData.append('id', id);
    const res: any = await getAwardById(formData);
    const { code, data } = res;
    if (!code && data) {
      this.prizeData = data;
    }
  }
}
</script>

<style lang="scss" scoped>
.prize-info-edit {
  .award-img {
    border: 1px solid #dddddd;
    border-radius: 5px;
    width: 192px;
    height: 192px;
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

    & > .pagination-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>


