<template>
  <div class="activity-type-recommend">
    <header
      ref="header"
    >
      <section class="top">
        <div class="left">
          <img :src="userInfo.wicon" alt="头像">
        </div>
        <div class="right">
          <div class="name">
            {{userInfo.wname}}
            <span>
              （推荐{{userInfo.recommendNum}}人）
            </span>
          </div>
          <div class="info">
            <div>
              <div class="key">
                编号
              </div>
              <div class="value">
                {{userInfo.wmcode}}
              </div>
            </div>
            <div>
              <div class="key">
                openid
              </div>
              <div class="value">
                {{userInfo.openid}}
              </div>
            </div>
            <div>
              <div class="key">
                参加时间
              </div>
              <div class="value">
                {{userInfo.participationTime | momentFilter}}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bottom">
        <div class="left">
          <el-button
            @click="back"
          >
            返回
          </el-button>
        </div>
        <div class="right">
          <span>无效助力：</span>
          是因为下级用户在活动中途取消关注或取消关注后又重新关注
        </div>
      </section>
    </header>

    <el-table
      class="table"
      :data="dataList"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="wmcode"
        label="编号"
      >
      </el-table-column>
      <el-table-column
        label="微信头像/昵称/openid"
      >
        <template
          slot-scope="scope"
        >
          <div class="user">
            <div class="left">
              <img
                :src="scope.row.wicon"
                alt="头像"
              >
            </div>
            <div class="right">
              <p>
                {{scope.row.wname}}
              </p>
              <p>
                {{scope.row.openid}}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="是否关注"
      >
        <template
          slot-scope="scope"
        >
          <el-icon
            v-if="scope.row.follow === '1'"
            type="el-icon-success"
            size="30"
            color="#2d8cf0"
          >
          </el-icon>
          <el-icon
            v-else
            type="el-icon-error"
            size="30"
            color="#bbbec4"
          >
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column
        label="关注时间"
      >
        <template
          slot-scope="scope"
        >
          {{scope.row.time | momentFilter('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        label="助力状态"
      >
        <template
          slot-scope="scope"
        >
          <el-icon
            v-if="scope.row.valid === '1'"
            type="el-icon-success"
            size="30"
            color="#2d8cf0"
          >
          </el-icon>
          <el-icon
            v-else
            type="el-icon-error"
            size="30"
            color="#bbbec4"
          >
          </el-icon>
        </template>
      </el-table-column>
    </el-table>

    <!-- 导航栏 -->
    <section class="pagination-container">
      <el-pagination
        @current-change="pageChange"
        background
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </section>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {
  getActivityUserfans,
} from '@/api/super-mkt/activity-set/fans';
import {
  queryRecommendStatistics
} from '@/api/super-mkt/activity-set/fans_plus';
import ElIcon from '@/components/ElIcon.vue';

@Component({
  components: {
    ElIcon
  }
})
export default class PrizeSetActivityTypeAdd extends Vue {
  userInfo: any = {}
  dataList: any[] = []
  pageNum = 1
  pageSize = 10
  total = 0

  mounted() {
    this.setUserInfo();
    this.getActivityUserfans();
  }

  // 设置用户信息
  setUserInfo() {
    this.userInfo = this.$route.query;
  }

  // 页面变化
  pageChange(pageNum: number) {
    this.pageNum = pageNum;
    this.getActivityUserfans();
  }

  // 返回
  back() {
    this.$router.back();
  }
  // 用户推荐人列表
  async getActivityUserfans() {
    const body = {
      // openid: 'oP6kNs6eR_t1TOOZbuQCdeX8eWiI',
      openid: this.userInfo.openid,
      pageNum: this.pageNum
    }
    const header = {
      activityId: this.userInfo.activityId
    }
    const res: any = await queryRecommendStatistics(body, header);
    const {data} = res;

    const {list, pageNum, total} = data;
    this.dataList = list;
    this.pageNum = pageNum;
    this.total = total;
  }
}
</script>

<style lang="scss" scoped>
.activity-type-recommend {
  & > header {
    & > .top {
      display: flex;
      margin-bottom: 10px;

      & > .left {
        margin-right: 15px;

        & > img {
          border-radius: 5px;
          height: 140px;
          width: 140px;
        }
      }

      & > .right {
        & > .name {
          margin-bottom: 5px;
          font-size: 24px;
          color: #333333;

          & > span {
            font-size: 18px;
          }
        }

        & > .info {
          & > div {
            display: flex;
            margin-bottom: 5px;
            height: 24px;
            line-height: 24px;
            align-items: center;
            & > .key {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-basis: 60px;
              margin-right: 13px;
              border-radius: 3px;
              font-size: 12px;
              width: 60px;
              color: #ffffff;
              background-color: #999999;
            }

            & > .value {
              flex-grow: 1;
              font-size: 12px;
              color: #333333;
            }
          }
        }
      }
    }

    > .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      > .right {
        font-size: 12px;
        color: #333333;
        padding-right: 10px;

        > span {
          color: #eb3941;
        }
      }
    }
  }

  & > .table {
    .user {
      display: flex;

      > .left {
        overflow: hidden;
        margin-right: 10px;
        border-radius: 5px;
        width: 48px;
        height: 48px;

        & > img {
          height: 100%;
          width: 100%;
        }
      }

      > .right {
        > p {
          &:first-of-type {
            font-size: 14px;
            color: #333333;
          }

          &:last-of-type {
            font-size: 12px;
            color: #333333;
          }
        }
      }
    }
  }

  & > .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>


