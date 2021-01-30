<template>
  <div class="prize-info-edit">
    <el-tabs v-model="activeName" @tab-click="switchMenu">
      <el-tab-pane label="奖品编辑" name="edit">
        <el-form
          ref="form" 
          label-width="120px" 
        >
          <el-form-item label="奖品类型：">
            {{awardInfo.productType}}
          </el-form-item>
          <el-form-item label="奖品名称：">
            {{awardInfo.shelfName}}
          </el-form-item>
          <el-form-item label="奖品图片：">
            <el-image
              v-if="awardInfo.picList"
              style="
                border: 1px solid #dddddd;
                border-radius: 5px;
                width: 192px;
                height: 192px;
              "
              :src="imagesUrl({
                path: '/jop-wx-web/op/showimage',
                name: awardInfo.picList[0],
                alias: awardInfo.photoType
              })"
            >
            </el-image>
          </el-form-item>
          <el-form-item label="奖品详情：">
            <editor :type="'seeting'" ref="ue"></editor>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              @click="back"
            >
              返回
            </el-button>
            <el-button
              type="primary"
              @click="updateGiftDetail"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="奖品发放明细" name="detail">
        <el-card shadow="never">
          <el-form v-model="detailForm" :inline="true" class="demo-form-inline">
            <el-form-item label="关联的活动">
              <el-select v-model="detailForm.connectedActivitie">
                <el-option
                  v-for="(item, index) of connectedActivitieList"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getActiveByGiftCode">查询</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 活动信息 -->
        <section class="active-info">
          <h3>
            {{awardInfo.shelfName}}
          </h3>
          <ul>
            <li>
              编号：
              <span>
                {{awardInfo.giftCode}}
              </span>
            </li>
            <li>
              库存数量：
              <span>
                {{awardSendDetails.total}}
              </span>
            </li>
            <li>
              关联活动总数：
              <span>
                {{awardSendDetails.inferActiveTotal}}
              </span>
            </li>
            <li>
              累计发放：
              <span>
                {{awardSendDetails.totalHasGiven}}
              </span>
            </li>
            <li>
              活动剩余总数：
              <span>
                {{awardSendDetails.surplus}}
              </span>
            </li>
          </ul>

          <el-table
            :data="awardSendDetails.activeList.list"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="parentActive"
              label="关联活动"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="activityName"
              label="活动名称"
              width="300"
            >
            </el-table-column>
            <el-table-column
              label="活动时间"
              width="350"
            >
              <template
                slot-scope="scope"
              >
                {{scope.row.beginTime | ymdhm}}至{{scope.row.endTime | ymdhm}}
              </template>
            </el-table-column>
            <el-table-column
              label="活动状态"
              width="150"
            >
              <template
                slot-scope="scope"
              >
                <el-button
                  v-if="scope.row.activeStatus == 1"
                  type="danger"
                >
                  未开始
                </el-button>
                <el-button
                  v-if="scope.row.activeStatus == 2"
                  type="success"
                >
                  进行中
                </el-button>
                <el-button
                  v-if="scope.row.activeStatus == 3"
                  type="warning"
                >
                  已暂停
                </el-button>
                <el-button
                  v-if="scope.row.activeStatus == 4"
                  type="info"
                >
                  已结束
                </el-button>
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.errorState"
                  placement="left"
                >
                  <el-button
                    v-if="scope.row.activeStatus == 5"
                    type="warning"
                    size="small"
                    icon="el-icon-question"
                  >
                    异常状态
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="giftNum"
              label="奖品数量"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="hasGiven"
              label="已发放"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="margin"
              label="剩余"
            >
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
        </section>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {
  getQiftManaList,
  getGiftDetail,
  updateGiftDetail,
  getActiveClzByGiftCode,
  getActiveByGiftCode,
} from '@/api/super-mkt/prize-set/prize-info';
import AppGutter from '@/components/AppGutter.vue';
import FormBar from '@/components/FormBar.vue';
import Editor from '@/components/WangEditor.vue';
import {Message} from 'element-ui';
import {imagesUrl} from '@/utils/imageUrl';

@Component({
  components: {
    AppGutter,
    FormBar,
    Editor
  }
})
export default class PrizeSetPrizeManagePrizeInfoEdit extends Vue {
  activeName: string | Array <string | null> = 'detail'
  detailForm = {
    connectedActivitie: ''
  }
  // 奖品信息
  awardInfo = {}
  // 奖品发放明细
  awardSendDetails = {
    total: 0,
    surplus: 0,
    activeList: {
      list: [],
    },
    inferActiveTotal: 0,
    hasGiven: 0
  }
  query: any = null
  connectedActivitieList: any[] = []
  pageNum = 1
  pageSize = 20
  total = 0

  imagesUrl = imagesUrl;

  mounted() {
    const query = this.$route.query;
    this.query = query;
    this.activeName = query.type;

    this.getGiftDetail();
    this.getActiveClzByGiftCode().then((res: any) => {
    this.getActiveByGiftCode();
    });
  }

  // 页面变化
  pageChange(pageNum: number) {
    this.pageNum = pageNum;
    this.getActiveByGiftCode();
  }

  // 切换菜单
  switchMenu(tab: any) {
    console.log(tab);
  }

  // 查询奖品详情
  getGiftDetail() {
    return new Promise((resolve, reject) => {
      const body = {
        activeName: this.query.activeName,
        giftCode: this.query.giftCode,
      }

      getGiftDetail(body).then((res: any) => {
        const {data} = res;

        (<any> this.$refs.ue).setContent(data.productDetail);
        this.awardInfo = data;

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 查询关联的活动列表
  getActiveClzByGiftCode() {
    return new Promise((resolve, reject) => {
      const body = {
        giftCode: this.query.giftCode,
      }

      getActiveClzByGiftCode(body).then((res: any) => {
        const {data} = res;

        this.connectedActivitieList = data;
        this.$set(this.detailForm, 'connectedActivitie', data[0]);

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 查询关联的活动列表
  getActiveByGiftCode() {
    return new Promise((resolve, reject) => {
      const body = {
        giftCode: this.query.giftCode,
        activeClz: this.detailForm.connectedActivitie,
        jmpId: this.query.jmpId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }

      getActiveByGiftCode(body).then((res: any) => {
        const {data} = res;

        this.awardSendDetails = data;
        const {pageNum, total} = data.activeList;
        this.pageNum = pageNum;
        this.total = total;

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 设置奖品详情
  updateGiftDetail() {
    return new Promise((resolve, reject) => {
      const body = {
        activityName: this.query.activeName,
        giftCode: this.query.giftCode,
        productDetail: (<any> this.$refs.ue).getContent(),
      }

      updateGiftDetail(body).then((res: any) => {
        const {data} = res;

        Message.success('修改成功');

        resolve(res);
      }).catch((reason: any) => {
        reject(reason)
      })
    })
  }

  // 返回
  back() {
    this.$router.back();
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


