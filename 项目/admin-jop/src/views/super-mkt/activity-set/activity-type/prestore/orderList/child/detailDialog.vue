<template>
  <div class="detailDialog">
    <el-dialog title="订单详情" :visible.sync="showDetail" width="800px" :before-close="close">
      <div class="detail">
        <div class="detail-top">
          <div class="detail-top-l">
            <div class="detail-top-l-imgBox">
              <el-image :src="detailData.headimgUrl" style="width: 100%; height: 100%">
                <div
                  slot="error"
                  class="image-slot"
                  style="display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        background: #f5f7fa;
                        color: #909399;"
                >
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="detail-top-l-name">
              <div>{{detailData.nickname || '--'}}</div>
              <div>{{detailData.openId || '--'}}</div>
            </div>
          </div>
          <div class="detail-top-m">
            <div>{{detailData.payAmount?detailData.payAmount.toFixed(2):'--'}}元</div>
            <div>支付金额</div>
          </div>
          <div class="detail-top-r">
            <div>{{detailData.payStatus | payStatus}}</div>
            <div>{{detailData.payTime || detailData.createTime}}</div>
          </div>
        </div>
        <div class="detail-m">
          <div class="detail-m-l">
            <div>会员名称：张晓红</div>
            <div>会员手机号：13858548525</div>
          </div>
          <div class="detail-m-r">
            <div>会员卡号：13858548525</div>
            <div>JMP充值单号：{{detailData.indirectSuperiorName || '--'}}</div>
          </div>
        </div>
        <div class="detail-b">
          <div class="detail-b-l">
            <div class="detail-b-l-c">
              <div class="detail-b-l-c-l">订单编号：</div>
              <div class="detail-b-l-c-r">{{detailData.orderNo || '--'}}</div>
            </div>
            <div class="detail-b-l-c" v-if="detailData.payStatus === '1'">
              <div class="detail-b-l-c-l">核销方式：</div>
              <div class="detail-b-l-c-r">{{detailData.verifyType || '--' | verType}}</div>
            </div>
            <div class="detail-b-l-c" v-if="detailData.payStatus === '1'">
              <div class="detail-b-l-c-l">核销时间：</div>
              <div class="detail-b-l-c-r">{{detailData.verifyTime || '--'}}</div>
            </div>
            <div
              class="detail-b-l-c"
              v-for="(item, index) in detailData.productInfoArr"
              :key="index"
            >
              <div class="detail-b-l-c-l detail-b-l-c-name">{{item.name}}：</div>
              <div class="detail-b-l-c-r detail-b-l-c-val">{{item.value || '--'}}</div>
            </div>
          </div>
          <div class="detail-b-r">
            <div class="detail-b-r-c">
              <div class="detail-b-r-c-l">核销状态：</div>
              <div class="detail-b-r-c-r">
                <template v-if="detailData.payStatus == 2">
                  --
                </template>
                <template v-else-if="detailData.payStatus == 1 && detailData.verifyStatus == 2">
                  已核销
                </template>
                <template v-else>
                  未核销
                </template>
                <el-button
                  size="mini"
                  v-if="detailData.verifyStatus==='1' && detailData.payStatus === '1' && detailData.productInfoArr.length > 0"
                  type="primary"
                  @click="writeOff"
                >核销订单</el-button>
              </div>
            </div>
            <div class="detail-b-r-c" v-if="detailData.payStatus === '1'">
              <div class="detail-b-r-c-l">核销人员：</div>
              <div class="detail-b-r-c-r">{{detailData.verifierName || detailData.verifyJopAccount || '--'}}</div>
            </div>
            <div class="detail-b-r-c">
              <div class="detail-b-r-c-l">过期时间：</div>
              <div class="detail-b-r-c-r">{{detailData.verifierName || detailData.verifyJopAccount || '--'}}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { verifyOrderJop } from '@/api/super-mkt/activity-set/fission_retail';
import { writeOrder } from '@/utils/buttonPermission';
import user from '@/utils/user';
import moment from 'moment';
@Component({
  filters: {
    payStatus(val: string | number) {
      switch (val) {
        case '2':
          return '未支付';
          break;
        case '1':
          return '已支付';
          break;
        default:
          return '--';
          break;
      }
    },
    verStatus(val: string | number) {
      switch (val) {
        case '2':
          return '已核销';
          break;
        case '1':
          return '未核销';
          break;
        default:
          return '--';
          break;
      }
    },
    verType(val: string | number) {
      switch (val) {
        case '1':
          return '后台核销';
          break;
        case '2':
          return '手机核销';
          break;
        default:
          return '--';
          break;
      }
    },
  },
})
export default class DetailDialog extends Vue {
  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  showDetail!: boolean;
  @Prop({
    default: () => {
      return {};
    },
  })
  detailData!: any;
  close() {
    this.$emit('update:showDetail', false);
  }
  async confirm() {
    const res: any = await verifyOrderJop({
      orderNo: this.detailData.orderNo,
      verifyJopAccount: user.serverUser.account.accountName,
    });
    const { code } = res;
    if (!code) {
      this.$message({
        type: 'success',
        message: '核销成功!',
      });
      this.$set(this.detailData, 'verifyStatus', '2');
      this.$set(
        this.detailData,
        'verifierName',
        user.serverUser.account.accountName
      );
      this.$set(
        this.detailData,
        'verifyTime',
        moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      );
      this.$set(this.detailData, 'verifyType', '1');
      this.$emit('update:detailData', this.detailData);
    }
  }
  async writeOff() {
    if (!(await writeOrder())) {
      return;
    }
    const h = this.$createElement;
    this.$confirm(`提示`, {
      message: h('div', undefined, [
        h(
          'div',
          undefined,
          `确定核销用户“${this.detailData.nickname || ''}”的订单吗？`
        ),
        h(
          'div',
          { style: 'color: red; font-size: 12px;margin-top: 5px' },
          '*核销完成后，务必到JMP操作出库！（商品无入库则忽略）'
        ),
      ]),
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        this.confirm();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
}
</script>

<style lang="scss" scoped>
.detailDialog {
  .detail {
    &-top {
      display: flex;
      padding: 15px;
      border: 1px solid #ffa39e;
      background: #fff2f1;
      border-radius: 5px;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 14px;
      line-height: 28px;
      &-l {
        width: 40%;
        display: flex;
        align-items: center;
        justify-content: center;
        &-imgBox {
          min-width: 40px;
          max-width: 40px;
          height: 40px;
          border: 1px solid #eee;
          border-radius: 40px;
          overflow: hidden;
          img {
            width: 40px;
            height: 40px;
          }
        }
        &-name {
          margin-left: 8px;
          color: #999;
          font-size: 14px;
          div {
            font-size: 14px;
            &:nth-child(1) {
              color: #666;
              font-size: 16px;
              font-weight: bold;
            }
          }
        }
      }
      &-m {
        width: 30%;
        div {
          text-align: center;
          &:nth-child(1) {
            color: red;
          }
        }
      }
      &-r {
        flex: 1;
        div {
          text-align: center;
          &:nth-child(2) {
            color: #999;
          }
        }
      }
    }
    &-m {
      margin-top: 20px;
      padding: 20px;
      display: flex;
      line-height: 30px;
      background: #fff;
      border-radius: 5px;
      border: 1px solid #ddd;
      &-l {
        width: 50%;
        box-sizing: border-box;
        border-right: 1px solid #ccc;
      }
      &-r {
        padding-left: 40px;
        flex: 1;
      }
    }
    &-b {
      margin-top: 20px;
      background: #fff;
      border-radius: 5px;
      border: 1px solid #ddd;
      padding: 20px;
      display: flex;
      line-height: 40px;
      &-l {
        width: 50%;
        &-c {
          display: flex;
          &-l {
            width: 70px;
            text-align: right;
          }
          &-name,
          &-val {
            color: #999;
          }
          &-r {
            flex: 1;
            text-align: left;
          }
        }
      }
      &-r {
        flex: 1;
        &-c {
          display: flex;
          &-l {
            width: 70px;
            text-align: right;
          }
          &-r {
            flex: 1;
            text-align: left;
          }
        }
      }
    }
  }
}
</style>
